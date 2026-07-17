import { AnimatePresence, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { ChevronDown, ExternalLink, Music2, Volume2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Locale } from '../content'
import { useLanyardPresence, useSpotifyProgress } from '../hooks/useLanyardPresence'
import { useDockPosition } from '../hooks/useDockPosition'
import { SpotifyEmbed } from './SpotifyEmbed'
import './NowPlayingDock.css'

export function NowPlayingDock({ locale, placement = 'bottom-right' }: { locale: Locale; placement?: 'bottom-right' | 'top-left' }) {
  const reduceMotion = useReducedMotion()
  const { phase, socketLive, track } = useLanyardPresence()
  const progress = useSpotifyProgress(track)
  const [expanded, setExpanded] = useState(false)
  const [visible, setVisible] = useState(true)
  const { bindDock, corner, dragHandlers, isDragging, refreshPosition, style } = useDockPosition('pablo-portfolio-spotify-dock-position', placement, 'spotify', Boolean(track))

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => refreshPosition(true))
    const animationTimer = window.setTimeout(() => refreshPosition(true), 360)
    const embedTimer = window.setTimeout(() => refreshPosition(true), 900)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(animationTimer)
      window.clearTimeout(embedTimer)
    }
  }, [expanded, refreshPosition, track?.track_id])

  const labels = locale === 'es' ? {
    connecting: 'Conectando Spotify',
    unmonitored: 'Esperando a Lanyard',
    unavailable: 'Conexión temporalmente no disponible',
    idle: 'Nada público sonando',
    live: 'Escuchando ahora',
    open: 'Abrir reproductor',
    close: 'Cerrar tarjeta de música',
    collapse: 'Minimizar reproductor',
    details: 'Ver página de música',
    visitors: 'Lanyard: sin registro para visitantes',
    volume: 'Volumen desde tu dispositivo',
    player: 'Reproductor oficial de Spotify',
  } : {
    connecting: 'Connecting Spotify',
    unmonitored: 'Waiting for Lanyard',
    unavailable: 'Connection temporarily unavailable',
    idle: 'Nothing public is playing',
    live: 'Listening now',
    open: 'Open player',
    close: 'Close music card',
    collapse: 'Collapse player',
    details: 'View music page',
    visitors: 'Lanyard: no visitor registration',
    volume: 'Volume through your device',
    player: 'Official Spotify player',
  }

  if (!visible || !track) return null

  const status = phase === 'connecting'
    ? labels.connecting
    : phase === 'unmonitored'
      ? labels.unmonitored
      : phase === 'error'
        ? labels.unavailable
        : track
          ? labels.live
          : labels.idle

  return (
    <m.aside
      ref={bindDock}
      className={`now-dock${track ? ' now-dock--active' : ''}${isDragging ? ' is-dragging' : ''}`}
      data-corner={corner}
      style={style}
      data-placement={placement}
      aria-live="polite"
      {...dragHandlers}
      initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: reduceMotion ? 0 : 0.7, duration: reduceMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="now-dock__bar" title={locale === 'es' ? 'Arrastra desde el centro para mover' : 'Drag from the center to move'}>
        <span className={`now-dock__signal${track ? ' now-dock__signal--live' : ''}`} aria-hidden="true" />
        <span>{status}</span>
        {track && <span className="now-dock__transport">{socketLive ? 'LIVE' : '15S'}</span>}
        <button type="button" onClick={() => setVisible(false)} aria-label={labels.close}>
          <X size={14} aria-hidden="true" />
        </button>
      </div>

      <div className="now-dock__summary">
        <div className="now-dock__art" aria-hidden="true">
          <img src={track.album_art_url} alt="" width="96" height="96" />
        </div>
        <div className="now-dock__copy">
          <strong>{track?.song ?? 'Spotify × Discord'}</strong>
          <span>{track?.artist ?? labels.visitors}</span>
        </div>
        <button
            className="now-dock__play"
            type="button"
            aria-expanded={expanded}
            aria-label={expanded ? labels.collapse : labels.open}
            onClick={() => setExpanded((open) => !open)}
          >
            {expanded ? <ChevronDown size={18} aria-hidden="true" /> : <Music2 size={17} aria-hidden="true" />}
          </button>
      </div>

      <span className="now-dock__progress" aria-hidden="true"><i style={{ width: `${progress.percent}%` }} /></span>

      <AnimatePresence initial={false}>
        {expanded && track && (
          <m.div
            className="now-dock__player"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <SpotifyEmbed trackId={track.track_id} title={`${labels.player}: ${track.song}`} compact />
            <div className="now-dock__player-footer">
              <span><Volume2 size={13} aria-hidden="true" />{labels.volume}</span>
              <Link to="/musica">{labels.details}<ExternalLink size={12} aria-hidden="true" /></Link>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.aside>
  )
}
