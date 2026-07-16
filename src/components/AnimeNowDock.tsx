import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { ArrowUpRight, Tv, X } from 'lucide-react'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { Locale } from '../content'
import { type LanyardActivity, useLanyardPresence } from '../hooks/useLanyardPresence'
import { useDockPosition } from '../hooks/useDockPosition'
import './AnimeNowDock.css'

const animeSignals = ['anime', 'crunchyroll', 'anilist', 'myanimelist', 'mal-sync', 'animeflv', 'aniyomi', 'taiga', 'hidive', 'plex', 'jellyfin', 'viendo', 'watching', 'episode', 'episodio', 'capitulo', 'capítulo']
const ignoredSignals = ['spotify', 'visual studio', 'github', 'valorant', 'roblox', 'fortnite', 'steam', 'chrome']

function activityText(activity: LanyardActivity) {
  return [activity.name, activity.details, activity.state, activity.assets?.large_text, activity.assets?.small_text].filter(Boolean).join(' · ')
}

function isAnimeActivity(activity: LanyardActivity) {
  const text = activityText(activity).toLowerCase()
  return Boolean(text.trim()) && !ignoredSignals.some((signal) => text.includes(signal)) && animeSignals.some((signal) => text.includes(signal))
}

function cleanTitle(value?: string) {
  return (value ?? '')
    .replace(/^(watching|viendo|reproduciendo)\s+/i, '')
    .replace(/\s*[-–—|·]\s*(crunchyroll|anilist|myanimelist|animeflv|hidive|plex|jellyfin).*$/i, '')
    .trim()
}

function resolveImage(activity: LanyardActivity) {
  const image = activity.assets?.large_image
  if (!image) return undefined
  if (/^https?:\/\//i.test(image)) return image
  if (image.startsWith('mp:')) return `https://media.discordapp.net/${image.slice(3)}`
  if (activity.application_id) return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${image}.png`
  return undefined
}

type AnimeMetadata = { coverImage?: string; title?: string; score?: number | null }
type ResolvedAnimeMetadata = { queryTitle: string; anime: AnimeMetadata }

export function AnimeNowDock({ locale }: { locale: Locale }) {
  const reduceMotion = useReducedMotion()
  const { activities } = useLanyardPresence()
  const [metadata, setMetadata] = useState<ResolvedAnimeMetadata | null>(null)
  const [visible, setVisible] = useState(true)
  const activity = useMemo(() => activities.find(isAnimeActivity) ?? null, [activities])
  const dock = useDockPosition('pablo-portfolio-anime-dock-position', 'bottom-left', 'anime', Boolean(activity))
  const title = useMemo(() => activity ? cleanTitle(activity.details) || cleanTitle(activity.assets?.large_text) || cleanTitle(activity.state) || activity.name : '', [activity])
  const image = activity ? resolveImage(activity) : undefined

  useEffect(() => {
    if (!title) return undefined
    const controller = new AbortController()
    void fetch(`/api/anime?title=${encodeURIComponent(title)}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() as Promise<{ anime?: AnimeMetadata }> : null)
      .then((payload) => { if (payload?.anime) setMetadata({ queryTitle: title, anime: payload.anime }) })
      .catch(() => undefined)
    return () => controller.abort()
  }, [title])

  if (!activity || !visible) return null

  const labels = locale === 'es'
    ? { live: 'Anime en directo', source: 'Crunchyroll · Discord', details: 'Ver anime', close: 'Cerrar tarjeta de anime', score: 'Valoración' }
    : { live: 'Anime live', source: 'Crunchyroll · Discord', details: 'View anime', close: 'Close anime card', score: 'Rating' }
  const resolvedMetadata = metadata?.queryTitle === title ? metadata.anime : null

  return (
    <m.aside
      className={`anime-dock${dock.isDragging ? ' is-dragging' : ''}`}
      data-corner={dock.corner}
      style={{ ...dock.style, '--dock-stack-index': dock.stackIndex } as CSSProperties}
      aria-live="polite"
      {...dock.dragHandlers}
      initial={reduceMotion ? false : { opacity: 0, x: -18, y: 18 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className="anime-dock__bar" title={locale === 'es' ? 'Arrastra desde el centro para mover' : 'Drag from the center to move'}>
        <span><i aria-hidden="true" />{labels.live}</span>
        <button type="button" onClick={() => setVisible(false)} aria-label={labels.close}><X size={14} aria-hidden="true" /></button>
      </header>
      <div className="anime-dock__body">
        <div className="anime-dock__art">
          {resolvedMetadata && (resolvedMetadata.coverImage || image) ? <img src={resolvedMetadata.coverImage ?? image} alt="" width="76" height="106" /> : image ? <img src={image} alt="" width="76" height="106" /> : <Tv size={25} aria-hidden="true" />}
        </div>
        <div className="anime-dock__copy">
          <strong>{resolvedMetadata?.title ?? title}</strong>
          <span>{[activity.state, labels.source].filter(Boolean).join(' · ')}</span>
          {resolvedMetadata?.score !== null && resolvedMetadata?.score !== undefined ? <small>{labels.score} · {resolvedMetadata.score.toFixed(0)}%</small> : null}
        </div>
        <Link to="/anime" className="anime-dock__link" aria-label={labels.details}><ArrowUpRight size={17} aria-hidden="true" /></Link>
      </div>
    </m.aside>
  )
}
