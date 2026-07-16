/// <reference types="node" />

import { enforceRateLimit, hasTrustedOrigin, jsonResponse, readJsonBody } from '../server/security.js'

const resendEndpoint = 'https://api.resend.com/emails'
const maxEmailLength = 254
const maxNameLength = 80
const maxMessageLength = 4_000

type JsonRecord = Record<string, unknown>

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function stringValue(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return null
  const normalized = value.normalize('NFKC').replace(/\r/g, '').trim()
  return normalized ? normalized.slice(0, maxLength) : null
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value) && value.length <= maxEmailLength
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }

    return entities[character] ?? character
  })
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL ?? 'pablopme41@gmail.com'
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? 'Pablo Schefer <no-reply@pabloschefer.com>'

  const limited = enforceRateLimit(request, { scope: 'contact', limit: 5, windowMs: 10 * 60_000 })
  if (limited) return limited
  if (!hasTrustedOrigin(request)) return jsonResponse({ error: 'forbidden_origin' }, 403)
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return jsonResponse({ error: 'unsupported_media_type' }, 415)
  }
  if (!apiKey) return jsonResponse({ error: 'email_not_configured' }, 503)

  const parsed = await readJsonBody(request, 8_192)
  if ('error' in parsed) return jsonResponse({ error: parsed.error }, parsed.error === 'payload_too_large' ? 413 : 400)
  const payload = parsed.value

  if (!isRecord(payload)) return jsonResponse({ error: 'invalid_payload' }, 400)
  if (stringValue(payload.company, 120)) return jsonResponse({ ok: true })

  const email = stringValue(payload.email, maxEmailLength)
  const name = stringValue(payload.name, maxNameLength)
  const message = stringValue(payload.message, maxMessageLength)
  const startedAt = typeof payload.startedAt === 'number' && Number.isFinite(payload.startedAt) ? payload.startedAt : null

  if (!email || !isValidEmail(email)) return jsonResponse({ error: 'invalid_email' }, 400)
  if (!message || message.length < 12) return jsonResponse({ error: 'invalid_message' }, 400)
  if (!startedAt || Date.now() - startedAt < 1_000 || Date.now() - startedAt > 2 * 60 * 60_000) {
    return jsonResponse({ error: 'invalid_form_timing' }, 400)
  }

  const displayName = (name ?? 'Contacto desde la web').replace(/[\r\n\t]+/g, ' ')
  const safeName = escapeHtml(displayName)
  const safeEmail = escapeHtml(email)
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />')
  const subject = `Nuevo mensaje desde pablo-schefer.vercel.app - ${displayName}`.slice(0, 150)

  let resendResponse: Response
  try {
    resendResponse = await fetch(resendEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject,
        text: `Nombre: ${displayName}\nEmail: ${email}\n\n${message}`,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
            <h2>Nuevo mensaje desde la web</h2>
            <p><strong>Nombre:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${safeMessage}</p>
          </div>
        `,
      }),
      signal: AbortSignal.timeout(8_000),
    })
  } catch {
    return jsonResponse({ error: 'email_send_failed' }, 502)
  }

  if (!resendResponse.ok) return jsonResponse({ error: 'email_send_failed' }, 502)

  return jsonResponse({ ok: true })
}
