import { motion, useReducedMotion } from 'motion/react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Locale, SiteCopy } from '../content'
import { communities } from '../data/communities'
import { CommunityCard } from '../components/CommunityCard'
import { ContactSection } from '../components/ContactSection'
import { MagneticLink } from '../components/MagneticLink'
import { Monogram } from '../components/Monogram'

const signalItems = [
  'DSC / 01',
  'VIBE / 02',
  'FNLB / 03',
  'KOS / 04',
  'EDGAR / LIVE',
  'GW2 / 100K',
  'GAMES / 20',
  'DREAM / 5090',
  'RYZEN / X3D',
  'SPOTIFY / PUBLIC',
]

export function HomePage({ content, locale }: { content: SiteCopy; locale: Locale }) {
  const reduceMotion = useReducedMotion()
  const home = content.home
  const featuredCommunities = communities.filter((community) => ['fnlb', 'nate', 'edgar', 'gw2'].includes(community.id))
  const reveal = {
    initial: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-8% 0px' },
    transition: { duration: reduceMotion ? 0 : 0.75, ease: [0.16, 1, 0.3, 1] as const },
  }

  return (
    <>
      <section className="hero" id="top">
        <div className="hero__status">
          <span className="status-dot" aria-hidden="true" />
          {home.availability}
        </div>

        <div className="hero__layout">
          <div className="hero__copy">
            <motion.p className="eyebrow hero__eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, duration: 0.8 }}>
              {home.eyebrow}
            </motion.p>
            <h1 className="hero__title" aria-label={home.heroTitle.join(' ')}>
              {home.heroTitle.map((line, index) => (
                <span className={index === 1 || index === 3 ? 'accent-word' : ''} key={line}>
                  <motion.span
                    initial={reduceMotion ? { opacity: 1 } : { y: '110%', rotate: 2 }}
                    animate={{ y: 0, rotate: 0 }}
                    transition={{ delay: 0.08 + index * 0.08, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.div className="hero__intro-wrap" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.75 }}>
              <p className="hero__intro">{home.heroIntro}</p>
              <div className="hero__actions">
                <MagneticLink href="/comunidades">{home.primaryCta}</MagneticLink>
                <MagneticLink href="/perfil" variant="ghost">{home.secondaryCta}</MagneticLink>
              </div>
            </motion.div>
          </div>

          <motion.div className="hero__visual" initial={{ opacity: 0, scale: 0.9, rotate: -4 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: 0.25, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
            <Monogram />
            <div className="orbit-copy">{home.orbitLabel}</div>
            <div className="visual-coordinates">SPAIN / UTC+02</div>
          </motion.div>
        </div>

        <Link className="scroll-cue" to="/#capacidades">
          <ArrowDown size={15} aria-hidden="true" />
          <span>{home.scroll}</span>
        </Link>
      </section>

      <div className="signal-strip" aria-hidden="true">
        <div className="signal-strip__track">
          {[0, 1].map((copyIndex) => (
            <div className="signal-strip__group" key={copyIndex}>
              {signalItems.map((item) => (
                <span className="signal-strip__item" key={item}><span>{item}</span><i /></span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="section capabilities" id="capacidades">
        <motion.div className="section-heading" {...reveal}>
          <p className="eyebrow">{home.expertiseEyebrow}</p>
          <h2>{home.expertiseTitle}</h2>
          <p className="section-heading__intro">{home.expertiseIntro}</p>
        </motion.div>

        <div className="capability-grid">
          {home.capabilities.map((capability, index) => (
            <motion.article
              className="capability-card"
              key={capability.title}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5% 0px' }}
              transition={{ delay: reduceMotion ? 0 : index * 0.09, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="capability-card__top">
                <span>{capability.index}</span>
                <span className="card-node" />
              </div>
              <h3>{capability.title}</h3>
              <p>{capability.text}</p>
              <ul>
                {capability.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
              <div className="capability-card__scan" aria-hidden="true" />
            </motion.article>
          ))}
        </div>
      </section>

      <section className="section community-preview" id="comunidades">
        <motion.div className="section-heading section-heading--split" {...reveal}>
          <div>
            <p className="eyebrow">{home.communityEyebrow}</p>
            <h2>{home.communityTitle}</h2>
          </div>
          <div>
            <p className="section-heading__intro">{home.communityIntro}</p>
            <MagneticLink href="/comunidades" variant="ghost">{home.communityCta}</MagneticLink>
          </div>
        </motion.div>
        <div className="community-grid community-grid--preview">
          {featuredCommunities.map((community, index) => (
            <CommunityCard key={community.id} community={community} content={content} locale={locale} index={index} compact />
          ))}
        </div>
        <p className="proof__note">{content.common.dataNote}</p>
      </section>

      <section className="section proof" id="evidencia">
        <motion.div className="section-heading section-heading--split" {...reveal}>
          <div>
            <p className="eyebrow">{home.proofEyebrow}</p>
            <h2>{home.proofTitle}</h2>
          </div>
          <p className="section-heading__intro">{home.proofIntro}</p>
        </motion.div>
        <div className="proof-grid">
          {home.proof.map((item, index) => {
            const card = (
              <>
                {item.image && <img className="proof-card__media" src={item.image} alt={item.imageAlt ?? ''} width="1200" height="675" loading="lazy" decoding="async" />}
                <span className="proof-card__media-overlay" aria-hidden="true" />
                <div className="proof-card__meta">
                  <span>{item.type}</span>
                  <ArrowUpRight size={17} strokeWidth={1.6} aria-hidden="true" />
                </div>
                <strong>{item.metric}</strong>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span className="proof-card__link">{item.linkLabel}</span>
              </>
            )
            const id = item.title === 'FNLB' ? 'fnlb' : item.title === 'KernelOS' ? 'kernelos' : undefined
            return (
              <motion.article
                className="proof-card-shell"
                id={id}
                key={item.title}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-5% 0px' }}
                transition={{ delay: reduceMotion ? 0 : index * 0.09, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              >
                {item.internal ? (
                  <Link className="proof-card" to={item.link}>{card}</Link>
                ) : (
                  <a className="proof-card" href={item.link} target="_blank" rel="noreferrer">{card}</a>
                )}
              </motion.article>
            )
          })}
        </div>
      </section>

      <section className="bridge-statement" aria-label={home.bridgeLead}>
        <motion.p {...reveal}>
          <span>{home.bridgeLead}</span>
          {home.bridgeText}
        </motion.p>
        <div className="bridge-line" aria-hidden="true"><i /><i /><i /></div>
      </section>

      <section className="section method" id="metodo">
        <motion.div className="section-heading section-heading--split" {...reveal}>
          <div>
            <p className="eyebrow">{home.methodEyebrow}</p>
            <h2>{home.methodTitle}</h2>
          </div>
          <p className="section-heading__intro">{home.methodIntro}</p>
        </motion.div>
        <div className="method-list">
          {home.method.map((item, index) => (
            <motion.article
              key={item.title}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: reduceMotion ? 0 : index * 0.08, duration: 0.55 }}
            >
              <span className="method-list__index">{item.index}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span className="method-list__signal" aria-hidden="true" />
            </motion.article>
          ))}
        </div>
      </section>

      <ContactSection content={content} />
    </>
  )
}
