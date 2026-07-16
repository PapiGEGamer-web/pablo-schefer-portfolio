import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { AnimatePresence, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import {
  Activity,
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  History,
  Info,
  Play,
  Radio,
  Sparkles,
  Tv,
  X,
} from 'lucide-react'
import type { Locale, SiteCopy } from '../content'
import { ContactSection } from '../components/ContactSection'
import { type LanyardActivity, useLanyardPresence } from '../hooks/useLanyardPresence'
import { useAuth } from '../contexts/AuthContext'
import './AnimePage.css'

type AnimeEntry = {
  id: string
  title: string
  subtitle: string
  source: string
  firstSeen: number
  lastSeen: number
  image?: string
  live?: boolean
}

type AnimeMetadata = {
  id: number
  title: string
  titleRomaji: string
  titleNative: string
  synopsis: string | null
  coverImage: string | null
  bannerImage: string | null
  accent: string | null
  score: number | null
  genres: string[]
  episodes: number | null
  duration: number | null
  year: number | null
  format: string | null
  status: string | null
  anilistUrl: string | null
  crunchyrollUrl: string | null
  crunchyrollIcon: string | null
}

const historyKey = 'pablo-portfolio-anime-history-v1'
const metadataKey = 'pablo-portfolio-anime-metadata-v1'
const ownerEmail = 'pablopme41@gmail.com'
const crunchyrollIcon = 'https://s4.anilist.co/file/anilistcdn/link/icon/5-AWN2pVlluCOO.png'
const animeSignals = ['anime', 'crunchyroll', 'anilist', 'myanimelist', 'mal-sync', 'animeflv', 'aniyomi', 'taiga', 'hidive', 'plex', 'jellyfin', 'viendo', 'watching', 'episode', 'episodio', 'capitulo', 'capítulo']
const ignoreSignals = ['spotify', 'visual studio', 'code', 'github', 'valorant', 'roblox', 'fortnite', 'steam', 'chrome']

const seededHistory: AnimeEntry[] = [
  {
    id: 're-zero-starting-life-in-another-world',
    title: 'Re:ZERO -Starting Life in Another World-',
    subtitle: 'Reunion with the Witch · Starting Life from Zero in Another World',
    source: 'Crunchyroll',
    firstSeen: new Date('2026-07-16T04:58:00+02:00').getTime(),
    lastSeen: new Date('2026-07-16T04:58:00+02:00').getTime(),
  },
  {
    id: 'dan-da-dan',
    title: 'DAN DA DAN',
    subtitle: "S1 E4 · Kicking Turbo Granny's Ass",
    source: 'Crunchyroll',
    firstSeen: new Date('2026-07-16T04:08:00+02:00').getTime(),
    lastSeen: new Date('2026-07-16T04:08:00+02:00').getTime(),
  },
]

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
    .replace(/\s+\((castilian|latin american|english|japanese)\s+dub\)$/i, '')
    .trim()
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80)
}

function resolveActivityImage(activity: LanyardActivity) {
  const image = activity.assets?.large_image
  if (!image) return undefined
  if (/^https?:\/\//i.test(image)) return image
  if (image.startsWith('mp:')) return `https://media.discordapp.net/${image.slice(3)}`
  if (activity.application_id) return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${image}.png`
  return undefined
}

function toAnimeEntry(activity: LanyardActivity): AnimeEntry {
  const title = cleanTitle(activity.details) || cleanTitle(activity.assets?.large_text) || cleanTitle(activity.state) || activity.name
  const subtitle = [activity.state, activity.assets?.small_text].filter(Boolean).join(' · ') || activity.name
  return {
    id: slugify(title) || String(Date.now()),
    title,
    subtitle,
    source: activity.name,
    firstSeen: Date.now(),
    lastSeen: Date.now(),
    image: resolveActivityImage(activity),
    live: true,
  }
}

function mergeHistory(entries: AnimeEntry[]) {
  const merged = new Map<string, AnimeEntry>()
  entries.forEach((entry) => {
    if (!entry?.title) return
    const id = slugify(entry.title)
    if (!id) return
    const current = merged.get(id)
    if (!current) {
      merged.set(id, { ...entry, id, live: false })
      return
    }
    const latest = entry.lastSeen >= current.lastSeen ? entry : current
    merged.set(id, {
      ...current,
      ...latest,
      id,
      firstSeen: Math.min(current.firstSeen, entry.firstSeen),
      lastSeen: Math.max(current.lastSeen, entry.lastSeen),
      image: latest.image ?? current.image,
      live: false,
    })
  })
  return Array.from(merged.values()).sort((left, right) => right.lastSeen - left.lastSeen).slice(0, 30)
}

function readHistory() {
  try {
    const value = window.localStorage.getItem(historyKey)
    const parsed = value ? JSON.parse(value) as AnimeEntry[] : []
    return mergeHistory([...seededHistory, ...(Array.isArray(parsed) ? parsed : [])])
  } catch {
    return seededHistory
  }
}

function readMetadata() {
  try {
    const value = window.localStorage.getItem(metadataKey)
    if (!value) return {}
    const parsed = JSON.parse(value) as Record<string, AnimeMetadata>
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function formatDate(value: number, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(value)
}

function AnimePoster({ src, title, eager = false }: { src?: string; title: string; eager?: boolean }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const showImage = Boolean(src && failedSrc !== src)

  return (
    <span className={`anime-poster${showImage ? ' anime-poster--image' : ''}`}>
      {src && showImage ? (
        <img src={src} alt={`Portada de ${title}`} loading={eager ? 'eager' : 'lazy'} width="500" height="750" onError={() => setFailedSrc(src)} />
      ) : (
        <span className="anime-poster__fallback"><Tv size={42} aria-hidden="true" /><small>{title.slice(0, 2)}</small></span>
      )}
      <span className="anime-poster__shine" aria-hidden="true" />
    </span>
  )
}

function AnimeRating({ score, locale, compact = false }: { score: number | null | undefined; locale: Locale; compact?: boolean }) {
  if (!score) return <span className="anime-rating anime-rating--empty">{locale === 'es' ? 'Sin valoración' : 'Not rated'}</span>
  const outOfFive = score / 20
  const label = locale === 'es'
    ? `${outOfFive.toLocaleString('es-ES', { maximumFractionDigits: 1 })} de 5 en AniList`
    : `${outOfFive.toFixed(1)} out of 5 on AniList`

  return (
    <span className={`anime-rating${compact ? ' anime-rating--compact' : ''}`} aria-label={label}>
      <span className="anime-rating__stars" style={{ '--anime-rating': `${score}%` } as CSSProperties} aria-hidden="true">
        <span>★★★★★</span>
        <span>★★★★★</span>
      </span>
      <strong>{outOfFive.toLocaleString(locale === 'es' ? 'es-ES' : 'en-US', { maximumFractionDigits: 1 })}</strong>
      {!compact && <small>ANILIST</small>}
    </span>
  )
}

export function AnimePage({ content, locale }: { content: SiteCopy; locale: Locale }) {
  const auth = useAuth()
  const reduceMotion = useReducedMotion()
  const { activities, phase, socketLive } = useLanyardPresence()
  const [history, setHistory] = useState<AnimeEntry[]>(() => readHistory())
  const [metadata, setMetadata] = useState<Record<string, AnimeMetadata>>(() => readMetadata())
  const [selectedEntry, setSelectedEntry] = useState<AnimeEntry | null>(null)
  const dialogRef = useRef<HTMLElement | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const labels = locale === 'es' ? {
    eyebrow: 'Anime · Crunchyroll · En directo',
    title: 'Mi anime.\nEn tiempo real.',
    intro: 'Lo que estoy viendo ahora, sincronizado desde mi actividad pública de Discord, y un historial visual con portadas, sinopsis y fichas interactivas.',
    jump: 'Ver qué estoy viendo',
    live: 'Sincronización WebSocket',
    polling: 'Sincronización cada 15 s',
    connecting: 'Conectando en directo…',
    idleTitle: 'Ahora mismo no estoy viendo ningún anime.',
    idleBody: 'En cuanto empiece una reproducción compartida desde Crunchyroll en Discord, la portada y la ficha aparecerán aquí automáticamente.',
    activeTitle: 'Viendo ahora',
    liveIntro: 'La actividad en directo ocupa el primer plano: episodio actual, sinopsis, valoración, duración y acceso a la serie.',
    historyTitle: 'Historial de anime',
    historyIntro: 'Cada serie queda reunida en una ficha visual. Pulsa una portada para abrir su sinopsis completa, puntuación y enlaces.',
    emptyHistory: 'El historial empezará a crecer cuando vea anime con la actividad de Discord visible.',
    source: 'Fuente',
    lastSeen: 'Última vez',
    firstSeen: 'Primera vez',
    liveBadge: 'EN DIRECTO',
    clear: 'Limpiar historial',
    detected: 'Biblioteca personal',
    details: 'Abrir ficha',
    close: 'Cerrar ficha',
    watch: 'Ver en Crunchyroll',
    anilist: 'Ficha en AniList',
    synopsisFallback: 'La sinopsis se está preparando. La actividad y el episodio siguen sincronizados en directo.',
    metadataLoading: 'Buscando portada y ficha…',
    episodes: 'episodios',
    minutes: 'min por episodio',
    integrationEyebrow: 'Crunchyroll × Discord',
    integrationTitle: 'Gracias a la integración de Crunchyroll y Discord.',
    integrationBody: 'La actividad que comparto desde Crunchyroll llega a Discord, Lanyard la sincroniza en directo y AniList completa la ficha visual.',
    integrationFlow: 'CRUNCHYROLL → DISCORD → LANYARD',
  } : {
    eyebrow: 'Anime · Crunchyroll · Live',
    title: 'My anime.\nIn real time.',
    intro: 'What I am watching now, synced from my public Discord activity, plus a visual history with covers, synopses and interactive profiles.',
    jump: 'See what I am watching',
    live: 'WebSocket sync',
    polling: '15 s sync',
    connecting: 'Connecting live…',
    idleTitle: 'I am not watching anime right now.',
    idleBody: 'As soon as I start a title shared from Crunchyroll on Discord, its cover and full profile will appear here automatically.',
    activeTitle: 'Now watching',
    liveIntro: 'The live activity takes centre stage: current episode, synopsis, rating, duration and direct series access.',
    historyTitle: 'Anime history',
    historyIntro: 'Each series becomes a visual profile. Select a cover to open its full synopsis, score and links.',
    emptyHistory: 'The history will start growing when I watch anime with Discord activity visible.',
    source: 'Source',
    lastSeen: 'Last seen',
    firstSeen: 'First seen',
    liveBadge: 'LIVE',
    clear: 'Clear history',
    detected: 'Personal library',
    details: 'Open profile',
    close: 'Close profile',
    watch: 'Watch on Crunchyroll',
    anilist: 'View on AniList',
    synopsisFallback: 'The synopsis is being prepared. Activity and episode information remain live.',
    metadataLoading: 'Finding cover and details…',
    episodes: 'episodes',
    minutes: 'min per episode',
    integrationEyebrow: 'Crunchyroll × Discord',
    integrationTitle: 'Powered by the Crunchyroll and Discord integration.',
    integrationBody: 'The activity I share from Crunchyroll reaches Discord, Lanyard syncs it live and AniList completes the visual profile.',
    integrationFlow: 'CRUNCHYROLL → DISCORD → LANYARD',
  }

  const liveAnime = useMemo(() => activities.find(looksLikeAnime) ?? null, [activities])
  const liveEntry = useMemo(() => liveAnime ? toAnimeEntry(liveAnime) : null, [liveAnime])
  const connectionLabel = phase === 'ready' ? (socketLive ? labels.live : labels.polling) : labels.connecting
  const metadataTitles = useMemo(
    () => Array.from(new Set([liveEntry?.title, ...history.map((entry) => entry.title)].filter((title): title is string => Boolean(title)))).slice(0, 24),
    [history, liveEntry?.title],
  )
  const missingMetadataTitles = useMemo(
    () => metadataTitles.filter((title) => {
      const id = slugify(title)
      return id && !metadata[id]
    }),
    [metadata, metadataTitles],
  )

  const metadataFor = (entry: AnimeEntry | null) => entry ? metadata[slugify(entry.title)] : undefined
  const liveMetadata = metadataFor(liveEntry)
  const heroMetadata = liveMetadata ?? metadataFor(history[0] ?? null)
  const selectedMetadata = metadataFor(selectedEntry)
  const isOwner = auth.user?.email?.toLowerCase() === ownerEmail

  const clearHistory = () => {
    if (!isOwner) return
    window.localStorage.removeItem(historyKey)
    setHistory(seededHistory)
  }

  useEffect(() => {
    if (!liveEntry) return
    const updateTimer = window.setTimeout(() => {
      setHistory((current) => {
        const existing = current.find((entry) => entry.id === liveEntry.id)
        const next = mergeHistory([{
          ...liveEntry,
          firstSeen: existing?.firstSeen ?? liveEntry.firstSeen,
          lastSeen: Date.now(),
        }, ...current])
        window.localStorage.setItem(historyKey, JSON.stringify(next))
        return next
      })
    }, 0)
    return () => window.clearTimeout(updateTimer)
  }, [liveEntry])

  useEffect(() => {
    const controller = new AbortController()

    const enrich = async () => {
      for (const title of missingMetadataTitles) {
        const id = slugify(title)
        try {
          const response = await fetch(`/api/anime?title=${encodeURIComponent(title)}`, {
            signal: controller.signal,
            headers: { Accept: 'application/json' },
          })
          if (!response.ok) throw new Error('anime_metadata_unavailable')
          const payload = await response.json() as { anime?: AnimeMetadata }
          if (!payload.anime || controller.signal.aborted) continue
          setMetadata((current) => {
            const next = { ...current, [id]: payload.anime as AnimeMetadata }
            window.localStorage.setItem(metadataKey, JSON.stringify(next))
            return next
          })
        } catch {
          // A later presence update can retry transient metadata failures.
        }
      }
    }

    void enrich()
    return () => controller.abort()
  }, [missingMetadataTitles])

  useEffect(() => {
    if (!selectedEntry) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const page = document.querySelector('.anime-page')
    const backgroundTargets = [
      document.querySelector<HTMLElement>('.site-header'),
      ...Array.from(page?.children ?? []).filter((element): element is HTMLElement => element instanceof HTMLElement && !element.classList.contains('anime-dialog')),
    ].filter((element): element is HTMLElement => element instanceof HTMLElement)
    const inertState = backgroundTargets.map((element) => [element, element.hasAttribute('inert')] as const)
    backgroundTargets.forEach((element) => element.setAttribute('inert', ''))
    const focusTimer = window.setTimeout(() => dialogRef.current?.querySelector<HTMLElement>('button, a[href]')?.focus(), 0)

    const handleKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedEntry(null)
    }
    document.addEventListener('keydown', handleKeys)
    return () => {
      window.clearTimeout(focusTimer)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeys)
      inertState.forEach(([element, wasInert]) => { if (!wasInert) element.removeAttribute('inert') })
      previousFocusRef.current?.focus()
    }
  }, [selectedEntry])

  const openEntry = (entry: AnimeEntry) => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setSelectedEntry(entry)
  }

  const reveal = {
    initial: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-8% 0px' },
    transition: { duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }

  const liveStyle = {
    '--anime-accent': liveMetadata?.accent || '#f47521',
    '--anime-banner': liveMetadata?.bannerImage ? `url("${liveMetadata.bannerImage}")` : 'none',
  } as CSSProperties

  return (
    <div className="anime-page">
      <section className="page-hero anime-hero">
        <m.div className="page-hero__copy" initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.75, ease: [0.16, 1, 0.3, 1] }}>
          <p className="eyebrow">{labels.eyebrow}</p>
          <h1>{labels.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h1>
          <p>{labels.intro}</p>
        </m.div>

        <m.div className="anime-hero__visual" initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: reduceMotion ? 0 : 0.14, duration: reduceMotion ? 0 : 0.82, ease: [0.16, 1, 0.3, 1] }} aria-hidden="true">
          <div className="anime-hero__rings" />
          <div className="anime-hero__screen">
            {heroMetadata?.coverImage ? <img src={heroMetadata.coverImage} alt="" /> : <Tv size={72} />}
          </div>
          <span><Activity size={15} />{phase === 'ready' ? 'LANYARD LIVE' : 'LANYARD READY'}</span>
        </m.div>

        <a className="page-hero__scroll" href="#anime-directo"><ArrowDown size={15} aria-hidden="true" />{labels.jump}</a>
      </section>

      <section className="anime-integration" aria-label={labels.integrationEyebrow}>
        <m.div {...reveal}>
          <span className="anime-integration__logo"><img src={crunchyrollIcon} alt="Logo de Crunchyroll" /><strong>crunchyroll</strong></span>
          <div>
            <p className="eyebrow">{labels.integrationEyebrow}</p>
            <h2>{labels.integrationTitle}</h2>
            <p>{labels.integrationBody}</p>
          </div>
          <span className="anime-integration__flow">{labels.integrationFlow}</span>
        </m.div>
      </section>

      <section className="section anime-live" id="anime-directo">
        <m.div className="section-heading section-heading--split" {...reveal}>
          <div>
            <p className="eyebrow">Discord · Rich Presence</p>
            <h2>{labels.activeTitle}</h2>
          </div>
          <p className="section-heading__intro">{labels.liveIntro}</p>
        </m.div>

        <m.article className={`anime-now anime-now--${liveEntry ? 'active' : phase}`} style={liveStyle} {...reveal}>
          <header>
            <span><span className="status-dot" aria-hidden="true" />{connectionLabel}</span>
            <span><Radio size={14} aria-hidden="true" />LANYARD / DISCORD</span>
          </header>

          {liveEntry ? (
            <div className="anime-now__content">
              <AnimePoster src={liveMetadata?.coverImage ?? liveEntry.image} title={liveMetadata?.title ?? liveEntry.title} eager />
              <div className="anime-now__copy">
                <span className="eyebrow"><Sparkles size={14} aria-hidden="true" />{labels.liveBadge}</span>
                <h3>{liveMetadata?.title ?? liveEntry.title}</h3>
                <p className="anime-now__episode">{liveEntry.subtitle}</p>
                <p className="anime-now__synopsis">{liveMetadata?.synopsis ?? labels.metadataLoading}</p>
                {liveMetadata && <div className="anime-tags">{liveMetadata.genres.slice(0, 5).map((genre) => <span key={genre}>{genre}</span>)}</div>}
                <div className="anime-now__actions">
                  <button type="button" onClick={() => openEntry(liveEntry)}><Info size={16} aria-hidden="true" />{labels.details}</button>
                  {liveMetadata?.crunchyrollUrl && <a href={liveMetadata.crunchyrollUrl} target="_blank" rel="noreferrer"><Play size={16} fill="currentColor" aria-hidden="true" />{labels.watch}</a>}
                </div>
              </div>
              <aside className="anime-now__facts">
                <AnimeRating score={liveMetadata?.score} locale={locale} />
                {liveMetadata?.episodes && <span><strong>{liveMetadata.episodes}</strong>{labels.episodes}</span>}
                {liveMetadata?.duration && <span><strong>{liveMetadata.duration}</strong>{labels.minutes}</span>}
                {liveMetadata?.year && <span><strong>{liveMetadata.year}</strong>{liveMetadata.format ?? 'ANIME'}</span>}
              </aside>
            </div>
          ) : (
            <div className="anime-now__content anime-now__content--idle">
              <span className="anime-now__icon"><Tv size={38} /></span>
              <div>
                <h3>{labels.idleTitle}</h3>
                <p>{labels.idleBody}</p>
                <small><Clock3 size={14} aria-hidden="true" />{connectionLabel}</small>
              </div>
            </div>
          )}
        </m.article>
      </section>

      <section className="anime-history" id="anime-historial">
        <m.div className="anime-history__heading" {...reveal}>
          <div>
            <p className="eyebrow">{labels.detected}</p>
            <h2>{labels.historyTitle}</h2>
          </div>
          <p>{labels.historyIntro}</p>
          {isOwner && history.length > seededHistory.length && (
            <button type="button" onClick={clearHistory}>
              {labels.clear}
            </button>
          )}
        </m.div>

        <div className="anime-history__grid">
          {history.length === 0 ? (
            <m.article className="anime-history__empty" {...reveal}>
              <History size={28} aria-hidden="true" />
              <p>{labels.emptyHistory}</p>
            </m.article>
          ) : history.map((entry, index) => {
            const entryMetadata = metadataFor(entry)
            return (
              <m.button
                className="anime-card"
                type="button"
                key={entry.id}
                onClick={() => openEntry(entry)}
                aria-label={`${labels.details}: ${entryMetadata?.title ?? entry.title}`}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: reduceMotion ? 0 : index * 0.055, duration: reduceMotion ? 0 : 0.55 }}
                style={{ '--anime-accent': entryMetadata?.accent || '#f47521' } as CSSProperties}
              >
                <AnimePoster src={entryMetadata?.coverImage ?? entry.image} title={entryMetadata?.title ?? entry.title} />
                <span className="anime-card__copy">
                  <span className="anime-card__topline"><span>{String(index + 1).padStart(2, '0')}</span><AnimeRating score={entryMetadata?.score} locale={locale} compact /></span>
                  <strong>{entryMetadata?.title ?? entry.title}</strong>
                  <small>{entry.subtitle}</small>
                  <span className="anime-card__synopsis">{entryMetadata?.synopsis ?? labels.metadataLoading}</span>
                  <span className="anime-tags">{entryMetadata?.genres.slice(0, 3).map((genre) => <i key={genre}>{genre}</i>)}</span>
                  <span className="anime-card__footer"><span><CalendarDays size={14} aria-hidden="true" />{formatDate(entry.lastSeen, locale)}</span><span>{labels.details}<ArrowUpRight size={14} aria-hidden="true" /></span></span>
                </span>
              </m.button>
            )
          })}
        </div>
      </section>

      <ContactSection content={content} />

      <AnimatePresence>
        {selectedEntry && (
          <m.div className="anime-dialog" initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }} animate={{ opacity: 1 }} exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }} onClick={() => setSelectedEntry(null)}>
            <m.article
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="anime-dialog-title"
              tabIndex={-1}
              initial={reduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 18, scale: 0.97 }}
              transition={{ duration: reduceMotion ? 0 : 0.36, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
              style={{
                '--anime-accent': selectedMetadata?.accent || '#f47521',
                '--anime-banner': selectedMetadata?.bannerImage ? `url("${selectedMetadata.bannerImage}")` : 'none',
              } as CSSProperties}
            >
              <button className="anime-dialog__close" type="button" onClick={() => setSelectedEntry(null)} aria-label={labels.close}><X size={20} /></button>
              <div className="anime-dialog__banner" aria-hidden="true" />
              <div className="anime-dialog__body">
                <AnimePoster src={selectedMetadata?.coverImage ?? selectedEntry.image} title={selectedMetadata?.title ?? selectedEntry.title} eager />
                <div className="anime-dialog__copy">
                  <span className="eyebrow"><img src={selectedMetadata?.crunchyrollIcon ?? crunchyrollIcon} alt="" />{selectedEntry.source}</span>
                  <h2 id="anime-dialog-title">{selectedMetadata?.title ?? selectedEntry.title}</h2>
                  {selectedMetadata?.titleNative && <p className="anime-dialog__native">{selectedMetadata.titleNative} · {selectedMetadata.titleRomaji}</p>}
                  <AnimeRating score={selectedMetadata?.score} locale={locale} />
                  <p>{selectedMetadata?.synopsis ?? labels.synopsisFallback}</p>
                  <div className="anime-tags">{selectedMetadata?.genres.map((genre) => <span key={genre}>{genre}</span>)}</div>
                  <dl>
                    <div><dt>{labels.source}</dt><dd>{selectedEntry.source}</dd></div>
                    <div><dt>{labels.firstSeen}</dt><dd>{formatDate(selectedEntry.firstSeen, locale)}</dd></div>
                    <div><dt>{labels.lastSeen}</dt><dd>{formatDate(selectedEntry.lastSeen, locale)}</dd></div>
                  </dl>
                  <div className="anime-dialog__actions">
                    {selectedMetadata?.crunchyrollUrl && <a href={selectedMetadata.crunchyrollUrl} target="_blank" rel="noreferrer"><Play size={16} fill="currentColor" aria-hidden="true" />{labels.watch}</a>}
                    {selectedMetadata?.anilistUrl && <a href={selectedMetadata.anilistUrl} target="_blank" rel="noreferrer">{labels.anilist}<ArrowUpRight size={16} aria-hidden="true" /></a>}
                  </div>
                </div>
              </div>
            </m.article>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
