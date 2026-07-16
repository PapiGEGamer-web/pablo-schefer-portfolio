import { motion, useReducedMotion } from 'motion/react'
import { ArrowDown, ArrowUpRight, AtSign } from 'lucide-react'
import type { Locale, SiteCopy } from '../content'
import { communities } from '../data/communities'
import { CommunityCard } from '../components/CommunityCard'
import { ContactSection } from '../components/ContactSection'

const discordProfileUrl = 'https://discord.com/users/633600812970541056'

export function ProfilePage({ content, locale }: { content: SiteCopy; locale: Locale }) {
  const reduceMotion = useReducedMotion()
  const profile = content.profile
  const reveal = {
    initial: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-8% 0px' },
    transition: { duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }

  return (
    <>
      <section className="page-hero page-hero--profile">
        <motion.div className="page-hero__copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}>
          <p className="eyebrow">{profile.eyebrow}</p>
          <h1>{profile.title}</h1>
          <p>{profile.lede}</p>
        </motion.div>
        <motion.div className="profile-stats" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.65 }}>
          {profile.stats.map((stat) => (
            <article key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </article>
          ))}
        </motion.div>
        <a className="page-hero__scroll" href="#identidad"><ArrowDown size={15} aria-hidden="true" />{locale === 'es' ? 'Identidad en Discord' : 'Discord identity'}</a>
      </section>

      <section className="section profile profile--page" id="identidad">
        <motion.div className="profile__visual" {...reveal}>
          <div className="profile__portrait">
            <img
              src="/media/profile/pablo-schefer-bw.webp"
              alt={locale === 'es' ? 'Retrato en blanco y negro de Pablo Schefer Orduña' : 'Black-and-white portrait of Pablo Schefer Orduña'}
              width="1024"
              height="1024"
            />
            <div className="profile__crosshair" aria-hidden="true" />
          </div>
          <div className="profile__caption">
            <span>{profile.portraitLabel}</span>
            <span className="profile__presence" aria-label={profile.presence}><span className="status-dot" aria-hidden="true" />{profile.presence}</span>
            <span className="profile__caption-loop">{profile.profileLoopLabel}</span>
          </div>
        </motion.div>

        <motion.div className="profile__copy" {...reveal}>
          <p className="eyebrow">Discord · Product · Code</p>
          <h2>Pablo Schefer<br /><span className="accent-text">PapiGEGamer</span></h2>
          {profile.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <a className="profile__discord" href={discordProfileUrl} target="_blank" rel="noreferrer" aria-label={`${profile.discordIdentity.action}: ${profile.discordIdentity.name}`}>
            <span className="profile__discord-icon" aria-hidden="true"><AtSign size={20} /></span>
            <span className="profile__discord-copy">
              <span>{profile.discordIdentity.label}</span>
              <strong>{profile.discordIdentity.name}</strong>
              <small>{profile.discordIdentity.handle} · {profile.discordIdentity.meta}</small>
            </span>
            <span className="profile__discord-action">{profile.discordIdentity.action}<ArrowUpRight size={14} aria-hidden="true" /></span>
          </a>
          <div className="profile__location"><span className="status-dot" aria-hidden="true" />{profile.location}</div>
        </motion.div>
      </section>

      <section className="section profile-roles">
        <motion.div className="section-heading section-heading--split" {...reveal}>
          <div>
            <p className="eyebrow">{profile.rolesEyebrow}</p>
            <h2>{profile.rolesTitle}</h2>
          </div>
          <p className="section-heading__intro">{profile.rolesIntro}</p>
        </motion.div>
        <div className="community-grid">
          {communities.map((community, index) => (
            <CommunityCard key={community.id} community={community} content={content} locale={locale} index={index} compact />
          ))}
        </div>
      </section>

      <ContactSection content={content} />
    </>
  )
}
