import { motion, useReducedMotion } from 'motion/react'
import { ArrowDown, Radio } from 'lucide-react'
import type { Locale, SiteCopy } from '../content'
import { communities } from '../data/communities'
import { CommunityCard } from '../components/CommunityCard'
import { ContactSection } from '../components/ContactSection'

export function CommunitiesPage({ content, locale }: { content: SiteCopy; locale: Locale }) {
  const reduceMotion = useReducedMotion()
  const page = content.communities
  const reveal = {
    initial: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-8% 0px' },
    transition: { duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }

  return (
    <>
      <section className="page-hero page-hero--communities">
        <motion.div className="page-hero__copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}>
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
        </motion.div>
        <motion.div className="community-page__counter" initial={{ opacity: 0, scale: 0.88, rotate: -5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: 0.18, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} aria-hidden="true">
          <Radio size={24} />
          <strong>05+</strong>
          <span>{locale === 'es' ? 'Experiencias destacadas' : 'Featured experiences'}</span>
        </motion.div>
        <a className="page-hero__scroll" href="#recorrido"><ArrowDown size={15} aria-hidden="true" />{locale === 'es' ? 'Mapa de comunidades' : 'Community map'}</a>
      </section>

      <section className="section community-directory" id="recorrido">
        <div className="community-grid community-grid--directory">
          {communities.map((community, index) => (
            <CommunityCard key={community.id} community={community} content={content} locale={locale} index={index} />
          ))}
        </div>
        <p className="community-directory__note">{page.note}</p>
      </section>

      <section className="community-philosophy">
        <motion.div className="community-philosophy__intro" {...reveal}>
          <p className="eyebrow">{page.philosophyEyebrow}</p>
          <h2>{page.philosophyTitle}</h2>
          <p>{page.philosophyBody}</p>
        </motion.div>
        <div className="community-philosophy__principles">
          {page.principles.map((principle, index) => (
            <motion.article
              key={principle.title}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: reduceMotion ? 0 : index * 0.09, duration: 0.55 }}
            >
              <span>{principle.index}</span>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <ContactSection content={content} />
    </>
  )
}
