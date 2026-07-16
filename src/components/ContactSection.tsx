import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { ArrowUpRight, Send } from 'lucide-react'
import { type FormEvent, useEffect, useRef, useState } from 'react'
import type { SiteCopy } from '../content'
import { MagneticLink } from './MagneticLink'

const discordProfileUrl = 'https://discord.com/users/1179009666110476328'
const socialLinks = [
  { label: 'Discord', href: discordProfileUrl },
  { label: 'GitHub', href: 'https://github.com/PapiGEGamer-web' },
  { label: 'X', href: 'https://x.com/PapiGEGamer' },
  { label: 'Instagram', href: 'https://www.instagram.com/papigegamer/' },
  { label: 'YouTube', href: 'https://www.youtube.com/@lastPapiGEGamer' },
]

export function ContactSection({ content }: { content: SiteCopy }) {
  const reduceMotion = useReducedMotion()
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')
  const startedAt = useRef(0)

  useEffect(() => {
    startedAt.current = Date.now()
  }, [])
  const reveal = {
    initial: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-8% 0px' },
    transition: { duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    setStatus('sending')
    setError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message'),
          company: formData.get('company'),
          startedAt: startedAt.current,
        }),
      })

      if (!response.ok) throw new Error('send_failed')
      form.reset()
      startedAt.current = Date.now()
      setStatus('sent')
    } catch {
      setStatus('error')
      setError(content.contact.error)
    }
  }

  return (
    <section className="contact" id="contacto">
      <m.div className="contact__inner" {...reveal}>
        <p className="eyebrow">{content.contact.eyebrow}</p>
        <h2>{content.contact.title}</h2>
        <p>{content.contact.body}</p>
        <form className="contact__form" onSubmit={handleSubmit}>
          <label>
            <span>{content.contact.nameLabel}</span>
            <input name="name" type="text" autoComplete="name" maxLength={80} placeholder={content.contact.namePlaceholder} />
          </label>
          <label>
            <span>{content.contact.emailLabel}</span>
            <input name="email" type="email" autoComplete="email" maxLength={254} placeholder={content.contact.emailPlaceholder} required />
          </label>
          <label className="contact__message">
            <span>{content.contact.messageLabel}</span>
            <textarea name="message" minLength={12} maxLength={4000} placeholder={content.contact.messagePlaceholder} required />
          </label>
          <label className="contact__trap" aria-hidden="true">
            <span>Company</span>
            <input name="company" type="text" tabIndex={-1} autoComplete="off" />
          </label>
          <div className="contact__actions">
            <button className="contact__submit" type="submit" disabled={status === 'sending'}>
              <span>{status === 'sending' ? content.contact.sending : content.contact.submit}</span>
              <Send size={15} aria-hidden="true" />
            </button>
            <MagneticLink href={discordProfileUrl} external className="contact__button">
              {content.contact.cta}
            </MagneticLink>
          </div>
          <p className={`contact__status contact__status--${status}`} role={status === 'error' ? 'alert' : 'status'}>
            {status === 'sent' ? content.contact.success : error}
          </p>
        </form>
        <div className="contact__socials" aria-label={content.common.socialLabel}>
          {socialLinks.map((link) => (
            <a href={link.href} target="_blank" rel="noreferrer" key={link.label}>
              {link.label}<ArrowUpRight size={13} aria-hidden="true" />
            </a>
          ))}
        </div>
      </m.div>
      <div className="contact__orb" aria-hidden="true"><span>PS/O</span></div>
    </section>
  )
}
