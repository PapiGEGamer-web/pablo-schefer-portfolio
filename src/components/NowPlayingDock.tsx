import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronDown, Disc3, ExternalLink, Music2, Volume2, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Locale } from '../content'
import { useLanyardPresence } from '../hooks/useLanyardPresence'
import { SpotifyEmbed } from './SpotifyEmbed'
import './NowPlayingDock.css'

export function NowPlayingDock({ locale, placement = 'bottom-right' }: { locale: Locale; placement?: 'bottom-right' | 'top-left' }) {
  const reduceMotion = useReducedMotion()
  const { phase, progress, socketLive, track } = useLanyardPresence()
  const [expanded, setExpanded] = useState(true)
  const [visible, setVisible] = useState(true)

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

  if (!visible) return null

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
    <motion.aside
      className={`now-dock${track ? ' now-dock--active' : ''}`}
      data-placement={placement}
      aria-live="polite"
      initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: reduceMotion ? 0 : 0.7, duration: reduceMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="now-dock__bar">
        <span className={`now-dock__signal${track ? ' now-dock__signal--live' : ''}`} aria-hidden="true" />
        <span>{status}</span>
        {track && <span className="now-dock__transport">{socketLive ? 'LIVE' : '15S'}</span>}
        <button type="button" onClick={() => setVisible(false)} aria-label={labels.close}>
          <X size={14} aria-hidden="true" />
        </button>
      </div>

      <div className="now-dock__summary">
        <div className="now-dock__art" aria-hidden="true">
          {track ? <img src={track.album_art_url} alt="" width="96" height="96" /> : <Disc3 size={24} />}
        </div>
        <div className="now-dock__copy">
          <strong>{track?.song ?? 'Spotify × Discord'}</strong>
          <span>{track?.artist ?? labels.visitors}</span>
        </div>
        {track ? (
          <button
            className="now-dock__play"
            type="button"
            aria-expanded={expanded}
            aria-label={expanded ? labels.collapse : labels.open}
            onClick={() => setExpanded((open) => !open)}
          >
            {expanded ? <ChevronDown size={18} aria-hidden="true" /> : <Music2 size={17} aria-hidden="true" />}
          </button>
        ) : (
          <Link className="now-dock__play" to="/musica" aria-label={labels.details}>
            <Music2 size={17} aria-hidden="true" />
          </Link>
        )}
      </div>

      {track && (
        <span className="now-dock__progress" aria-hidden="true">
          <i style={{ width: `${progress.percent}%` }} />
        </span>
      )}

      <AnimatePresence initial={false}>
        {expanded && track && (
          <motion.div
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  )
}
