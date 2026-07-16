/// <reference types="node" />

type JsonObject = Record<string, unknown>

type RateLimitOptions = {
  scope: string
  limit: number
  windowMs: number
}

type RateBucket = {
  count: number
  resetAt: number
}

const rateBuckets = new Map<string, RateBucket>()
const configuredOrigins = [
  'https://pablo-schefer.vercel.app',
  'https://pabloschefer.vercel.app',
  'https://pablo-schefer-portfolio.vercel.app',
  'https://pabloschefer.es',
  'https://www.pabloschefer.es',
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
  process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '',
  ...(process.env.SITE_ORIGIN ?? '').split(',').map((origin) => origin.trim()).filter(Boolean),
]

const trustedOrigins = new Set(configuredOrigins.flatMap((origin) => {
  if (!origin) return []
  try {
    const parsed = new URL(origin)
    const isLocalDevelopment = parsed.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(parsed.hostname)
    return parsed.protocol === 'https:' || isLocalDevelopment ? [parsed.origin] : []
  } catch {
    return []
  }
}))

export const apiSecurityHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Content-Security-Policy': "default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'; sandbox",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '0',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Origin-Agent-Cluster': '?1',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
} as const

function clientIdentifier(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const realIp = request.headers.get('x-real-ip')?.trim()
  return (forwarded || realIp || 'unknown').slice(0, 64)
}

function pruneExpiredBuckets(now: number) {
  if (rateBuckets.size < 2_000) return

  for (const [key, bucket] of rateBuckets) {
    if (bucket.resetAt <= now) rateBuckets.delete(key)
  }

  if (rateBuckets.size > 10_000) rateBuckets.clear()
}

export function jsonResponse(payload: JsonObject, status = 200, headers: HeadersInit = {}) {
  return Response.json(payload, {
    status,
    headers: {
      ...apiSecurityHeaders,
      'Cache-Control': 'no-store, max-age=0',
      ...headers,
    },
  })
}

export function enforceRateLimit(request: Request, options: RateLimitOptions) {
  const now = Date.now()
  pruneExpiredBuckets(now)

  const key = `${options.scope}:${clientIdentifier(request)}`
  const previous = rateBuckets.get(key)
  const bucket = !previous || previous.resetAt <= now
    ? { count: 1, resetAt: now + options.windowMs }
    : { count: previous.count + 1, resetAt: previous.resetAt }

  rateBuckets.set(key, bucket)
  if (bucket.count <= options.limit) return null

  const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1_000))
  return jsonResponse(
    { error: 'rate_limited' },
    429,
    {
      'Retry-After': String(retryAfter),
      'RateLimit-Limit': String(options.limit),
      'RateLimit-Remaining': '0',
      'RateLimit-Reset': String(Math.ceil(bucket.resetAt / 1_000)),
    },
  )
}

export function hasTrustedOrigin(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin || !trustedOrigins.has(origin)) return false

  const fetchSite = request.headers.get('sec-fetch-site')
  if (fetchSite && fetchSite !== 'same-origin') return false

  const fetchMode = request.headers.get('sec-fetch-mode')
  return !fetchMode || fetchMode === 'cors' || fetchMode === 'same-origin'
}

export async function readJsonBody(request: Request, maxBytes: number) {
  const contentLength = Number(request.headers.get('content-length') ?? '0')
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return { error: 'payload_too_large' as const }
  }

  if (!request.body) return { error: 'invalid_json' as const }

  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let totalBytes = 0

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      totalBytes += value.byteLength
      if (totalBytes > maxBytes) {
        await reader.cancel()
        return { error: 'payload_too_large' as const }
      }
      chunks.push(value)
    }

    const body = new Uint8Array(totalBytes)
    let offset = 0
    for (const chunk of chunks) {
      body.set(chunk, offset)
      offset += chunk.byteLength
    }

    return { value: JSON.parse(new TextDecoder().decode(body)) as unknown }
  } catch {
    return { error: 'invalid_json' as const }
  }
}
