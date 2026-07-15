import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import type { SiteCopy } from '../content'
import { MagneticLink } from './MagneticLink'

const discordProfileUrl = 'https://discord.com/users/633600812970541056'
const socialLinks = [
  { label: 'Discord', href: discordProfileUrl },
  { label: 'GitHub', href: 'https://github.com/PapiGEGamer-web' },
  { label: 'X', href: 'https://x.com/PapiGEGamer' },
  { label: 'Instagram', href: 'https://www.instagram.com/papigegamer/' },
  { label: 'YouTube', href: 'https://www.youtube.com/@lastPapiGEGamer' },
]

export function ContactSection({ content }: { content: SiteCopy }) {
  const reduceMotion = useReducedMotion()
  const reveal = {
    initial: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-8% 0px' },
    transition: { duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }

  return (
    <section className="contact" id="contacto">
      <motion.div className="contact__inner" {...reveal}>
        <p className="eyebrow">{content.contact.eyebrow}</p>
        <h2>{content.contact.title}</h2>
        <p>{content.contact.body}</p>
        <MagneticLink href={discordProfileUrl} external className="contact__button">
          {content.contact.cta}
        </MagneticLink>
        <div className="contact__socials" aria-label={content.common.socialLabel}>
          {socialLinks.map((link) => (
            <a href={link.href} target="_blank" rel="noreferrer" key={link.label}>
              {link.label}<ArrowUpRight size={13} aria-hidden="true" />
            </a>
          ))}
        </div>
      </motion.div>
      <div className="contact__orb" aria-hidden="true"><span>PS/O</span></div>
    </section>
  )
}
