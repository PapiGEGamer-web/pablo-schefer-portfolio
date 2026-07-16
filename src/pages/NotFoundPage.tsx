import * as m from 'motion/react-m'
import type { SiteCopy } from '../content'
import { MagneticLink } from '../components/MagneticLink'

export function NotFoundPage({ content }: { content: SiteCopy }) {
  return (
    <section className="not-found">
      <m.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
        <p className="eyebrow">{content.notFound.eyebrow}</p>
        <h1>{content.notFound.title}</h1>
        <p>{content.notFound.body}</p>
        <MagneticLink href="/">{content.notFound.cta}</MagneticLink>
      </m.div>
      <span aria-hidden="true">404</span>
    </section>
  )
}
