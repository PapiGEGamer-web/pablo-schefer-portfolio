import type { MouseEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, Radio } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Locale, SiteCopy } from '../content'
import type { Community } from '../data/communities'

type CommunityCardProps = {
  community: Community
  content: SiteCopy
  locale: Locale
  index?: number
  compact?: boolean
}

export function CommunityCard({ community, content, locale, index = 0, compact = false }: CommunityCardProps) {
  const reduceMotion = useReducedMotion()
  const copy = content.communities.cards[community.id]
  const detailLabel = community.id === 'nate'
    ? (locale === 'es' ? 'Ver sitio oficial' : 'View official site')
    : community.internal
      ? content.communities.viewLivePage
      : content.communities.viewCommunity

  const onMove = (event: MouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--card-x', `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty('--card-y', `${event.clientY - bounds.top}px`)
  }

  const cardContent = (
    <>
      <div className="community-card__top">
        <span className={`community-card__status community-card__status--${community.current ? 'current' : 'previous'}`}>
          {community.current && <span className="status-dot" aria-hidden="true" />}
          {community.current ? content.common.current : content.common.previous}
        </span>
        {community.id === 'edgar' ? <Radio size={17} aria-hidden="true" /> : <ArrowUpRight size={17} aria-hidden="true" />}
      </div>
      <figure className="community-card__visual">
        <img
          className="community-card__cover"
          src={community.visual.cover}
          alt=""
          width="1280"
          height="720"
          loading="lazy"
          decoding="async"
          style={{ objectPosition: community.visual.focus ?? 'center' }}
        />
        <span className="community-card__visual-shade" aria-hidden="true" />
        <span className="community-card__logo">
          <img
            src={community.visual.logo}
            alt={community.visual.alt[locale]}
            width="200"
            height="200"
            loading="lazy"
            decoding="async"
          />
        </span>
      </figure>
      <strong>{community.metric}</strong>
      <h3>{community.shortName}</h3>
      <p>{copy.text}</p>
      {(community.membersApprox || community.onlineApprox) && (
        <div className="community-card__numbers">
          {community.membersApprox && <span>{new Intl.NumberFormat(locale).format(community.membersApprox)} <small>{content.common.members}</small></span>}
          {community.onlineApprox && <span>{new Intl.NumberFormat(locale).format(community.onlineApprox)} <small>{content.common.online}</small></span>}
        </div>
      )}
      <div className="community-card__footer">
        <span>{content.communities.roleLabel}</span>
        <strong>{copy.role}</strong>
        <span className="community-card__action">{detailLabel}<ArrowUpRight size={13} aria-hidden="true" /></span>
      </div>
    </>
  )

  return (
    <motion.article
      className={`community-card community-card--${community.accent} ${compact ? 'community-card--compact' : ''}`}
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5% 0px' }}
      transition={{ delay: reduceMotion ? 0 : index * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={onMove}
      onMouseLeave={(event) => {
        event.currentTarget.style.setProperty('--card-x', '50%')
        event.currentTarget.style.setProperty('--card-y', '50%')
      }}
    >
      {community.internal ? (
        <Link className="community-card__link" to={community.href}>{cardContent}</Link>
      ) : (
        <a className="community-card__link" href={community.href} target="_blank" rel="noreferrer">{cardContent}</a>
      )}
    </motion.article>
  )
}
