import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Activity, ArrowDown, Clock3, History, Radio, ShieldCheck, Sparkles, Tv } from 'lucide-react'
import type { Locale, SiteCopy } from '../content'
import { ContactSection } from '../components/ContactSection'
import { type LanyardActivity, useLanyardPresence } from '../hooks/useLanyardPresence'
import './AnimePage.css'

type AnimeEntry = {
  id: string
  title: string
  subtitle: string
  source: string
  firstSeen: number
  lastSeen: number
  live?: boolean
}

const historyKey = 'pablo-portfolio-anime-history-v1'
const animeSignals = ['anime', 'crunchyroll', 'anilist', 'myanimelist', 'mal-sync', 'animeflv', 'aniyomi', 'taiga', 'hidive', 'plex', 'jellyfin', 'viendo', 'watching', 'episode', 'episodio', 'capitulo', 'capítulo']
const ignoreSignals = ['spotify', 'visual studio', 'code', 'github', 'discord', 'valorant', 'roblox', 'fortnite', 'steam', 'chrome']

function activityText(activity: LanyardActivity) {
  return [activity.name, activity.details, activity.state, activity.assets?.large_text, activity.assets?.small_text].filter(Boolean).join(' · ')
}

function looksLikeAnime(activity: LanyardActivity) {
  const text = activityText(activity).toLowerCase()
  if (!text.trim()) return false
  if (ignoreSignals.some((signal) => text.includes(signal))) return false
  return animeSignals.some((signal) => text.includes(signal))
}

function cleanTitle(value?: string) {
  if (!value) return ''
  return value
    .replace(/^(watching|viendo|reproduciendo)\s+/i, '')
    .replace(/\s*[-–—|·]\s*(crunchyroll|anilist|myanimelist|animeflv|hidive|plex|jellyfin).*$/i, '')
    .trim()
}

function toAnimeEntry(activity: LanyardActivity): AnimeEntry {
  const title = cleanTitle(activity.details) || cleanTitle(activity.assets?.large_text) || cleanTitle(activity.state) || activity.name
  const subtitle = [activity.state, activity.assets?.small_text].filter(Boolean).join(' · ') || activity.name
  const stable = `${title}|${subtitle}|${activity.name}`.toLowerCase()
  return {
    id: stable.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80) || String(Date.now()),
    title,
    subtitle,
    source: activity.name,
    firstSeen: Date.now(),
    lastSeen: Date.now(),
    live: true,
  }
}

function readHistory() {
  try {
    const value = window.localStorage.getItem(historyKey)
    if (!value) return []
    const parsed = JSON.parse(value) as AnimeEntry[]
    return Array.isArray(parsed) ? parsed.filter((entry) => entry?.id && entry?.title) : []
  } catch {
    return []
  }
}

function formatDate(value: number, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-US', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value)
}

export function AnimePage({ content, locale }: { content: SiteCopy; locale: Locale }) {
  const reduceMotion = useReducedMotion()
  const { activities, phase, socketLive } = useLanyardPresence()
  const [history, setHistory] = useState<AnimeEntry[]>(() => readHistory())

  const labels = locale === 'es' ? {
    eyebrow: 'Anime · Lanyard · Discord',
    title: 'Anime visto\nen directo.',
    intro: 'Un panel para reflejar actividades públicas de anime desde mi presencia de Discord mediante Lanyard, y construir un historial mientras la web las detecta.',
    jump: 'Ver historial',
    live: 'Sincronización WebSocket',
    polling: 'Sincronización cada 15 s',
    connecting: 'Conectando con Lanyard…',
    idleTitle: 'No hay anime público ahora mismo.',
    idleBody: 'Cuando Discord muestre una actividad compatible, aparecerá aquí automáticamente. Para que funcione, la app o Rich Presence de anime tiene que estar visible en tu perfil.',
    activeTitle: 'Ahora viendo',
    historyTitle: 'Historial detectado',
    historyIntro: 'Este historial se genera desde las actividades públicas que Lanyard emite mientras la web puede observarlas. No lee cuentas privadas ni servicios externos.',
    emptyHistory: 'Aún no hay animes detectados. Déjalo abierto cuando estés viendo anime con presencia de Discord activa y empezará a llenarse.',
    source: 'Fuente',
    lastSeen: 'Última vez',
    firstSeen: 'Primera vez',
    liveBadge: 'EN DIRECTO',
    privacy: 'Solo presencia pública de Discord. Sin login de visitantes.',
    clear: 'Limpiar historial local',
    detected: 'Detectado por Lanyard',
    limitationTitle: 'Importante',
    limitationBody: 'Lanyard no ofrece un historial antiguo. Para un historial 24/7 habría que añadir un backend que guarde los cambios de presencia mientras ocurren.',
  } : {
    eyebrow: 'Anime · Lanyard · Discord',
    title: 'Anime watched\nlive.',
    intro: 'A panel that mirrors public anime activities from my Discord presence through Lanyard, and builds a timeline while the site detects them.',
    jump: 'View history',
    live: 'WebSocket sync',
    polling: '15 s sync',
    connecting: 'Connecting to Lanyard…',
    idleTitle: 'No public anime activity right now.',
    idleBody: 'When Discord shows a compatible activity, it will appear here automatically. The anime app or Rich Presence must be visible on your profile.',
    activeTitle: 'Now watching',
    historyTitle: 'Detected history',
    historyIntro: 'This history is generated from public activities emitted by Lanyard while the site can observe them. It does not read private accounts or external services.',
    emptyHistory: 'No anime has been detected yet. Leave it open while watching anime with Discord presence enabled and it will start filling in.',
    source: 'Source',
    lastSeen: 'Last seen',
    firstSeen: 'First seen',
    liveBadge: 'LIVE',
    privacy: 'Public Discord presence only. No visitor login.',
    clear: 'Clear local history',
    detected: 'Detected by Lanyard',
    limitationTitle: 'Important',
    limitationBody: 'Lanyard does not provide old history. For a 24/7 history, the site would need a backend that stores presence changes as they happen.',
  }

  const liveAnime = useMemo(() => activities.find(looksLikeAnime) ?? null, [activities])
  const liveEntry = useMemo(() => liveAnime ? toAnimeEntry(liveAnime) : null, [liveAnime])
  const connectionLabel = phase === 'ready' ? (socketLive ? labels.live : labels.polling) : labels.connecting

  useEffect(() => {
    if (!liveEntry) return
    setHistory((current) => {
      const without = current.filter((entry) => entry.id !== liveEntry.id)
      const existing = current.find((entry) => entry.id === liveEntry.id)
      const next = [{
        ...liveEntry,
        firstSeen: existing?.firstSeen ?? liveEntry.firstSeen,
        lastSeen: Date.now(),
      }, ...without].slice(0, 30)
      window.localStorage.setItem(historyKey, JSON.stringify(next))
      return next
    })
  }, [liveEntry?.id])

  const reveal = {
    initial: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-8% 0px' },
    transition: { duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }

  return (
    <div className="anime-page">
      <section className="page-hero anime-hero">
        <motion.div className="page-hero__copy" initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.75, ease: [0.16, 1, 0.3, 1] }}>
          <p className="eyebrow">{labels.eyebrow}</p>
          <h1>{labels.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h1>
          <p>{labels.intro}</p>
        </motion.div>

        <motion.div className="anime-hero__visual" initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: reduceMotion ? 0 : 0.14, duration: reduceMotion ? 0 : 0.82, ease: [0.16, 1, 0.3, 1] }} aria-hidden="true">
          <div className="anime-hero__rings" />
          <div className="anime-hero__screen"><Tv size={88} /></div>
          <span><Activity size={15} />{phase === 'ready' ? 'LANYARD LIVE' : 'LANYARD READY'}</span>
        </motion.div>

        <a className="page-hero__scroll" href="#anime-historial"><ArrowDown size={15} aria-hidden="true" />{labels.jump}</a>
      </section>

      <section className="section anime-live">
        <motion.div className="section-heading section-heading--split" {...reveal}>
          <div>
            <p className="eyebrow">Discord · Rich Presence</p>
            <h2>{labels.activeTitle}</h2>
          </div>
          <p className="section-heading__intro">{labels.historyIntro}</p>
        </motion.div>

        <motion.article className={`anime-now anime-now--${liveEntry ? 'active' : phase}`} {...reveal}>
          <header>
            <span><span className="status-dot" aria-hidden="true" />{connectionLabel}</span>
            <span><Radio size={14} aria-hidden="true" />LANYARD / DISCORD</span>
          </header>

          {liveEntry ? (
            <div className="anime-now__content">
              <span className="anime-now__icon"><Sparkles size={34} /></span>
              <div>
                <span className="eyebrow">{labels.liveBadge}</span>
                <h3>{liveEntry.title}</h3>
                <p>{liveEntry.subtitle}</p>
                <small>{labels.source}: {liveEntry.source}</small>
              </div>
            </div>
          ) : (
            <div className="anime-now__content">
              <span className="anime-now__icon"><Tv size={34} /></span>
              <div>
                <h3>{labels.idleTitle}</h3>
                <p>{labels.idleBody}</p>
                <small><ShieldCheck size={14} aria-hidden="true" />{labels.privacy}</small>
              </div>
            </div>
          )}
        </motion.article>
      </section>

      <section className="anime-history" id="anime-historial">
        <motion.div className="anime-history__heading" {...reveal}>
          <p className="eyebrow">{labels.detected}</p>
          <h2>{labels.historyTitle}</h2>
          <p>{labels.historyIntro}</p>
          {history.length > 0 && (
            <button type="button" onClick={() => { window.localStorage.removeItem(historyKey); setHistory([]) }}>
              {labels.clear}
            </button>
          )}
        </motion.div>

        <div className="anime-history__list">
          {history.length === 0 ? (
            <motion.article className="anime-history__empty" {...reveal}>
              <History size={28} aria-hidden="true" />
              <p>{labels.emptyHistory}</p>
            </motion.article>
          ) : history.map((entry, index) => (
            <motion.article className="anime-history__item" key={entry.id} initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: reduceMotion ? 0 : index * 0.04, duration: 0.5 }}>
              <span className="anime-history__index">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{entry.title}</h3>
                <p>{entry.subtitle}</p>
              </div>
              <dl>
                <div><dt>{labels.source}</dt><dd>{entry.source}</dd></div>
                <div><dt>{labels.firstSeen}</dt><dd>{formatDate(entry.firstSeen, locale)}</dd></div>
                <div><dt>{labels.lastSeen}</dt><dd>{formatDate(entry.lastSeen, locale)}</dd></div>
              </dl>
              <Clock3 size={18} aria-hidden="true" />
            </motion.article>
          ))}
        </div>
      </section>

      <section className="anime-limitation">
        <motion.div {...reveal}>
          <p className="eyebrow"><ShieldCheck size={14} aria-hidden="true" />{labels.limitationTitle}</p>
          <h2>{labels.limitationBody}</h2>
        </motion.div>
      </section>

      <ContactSection content={content} />
    </div>
  )
}
