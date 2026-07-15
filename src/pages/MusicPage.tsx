import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Activity, ArrowDown, ArrowUpRight, Disc3, Music2, Radio, ShieldCheck, Wifi } from 'lucide-react'
import type { Locale, SiteCopy } from '../content'
import { ContactSection } from '../components/ContactSection'
import './MusicPage.css'

const discordUserId = '633600812970541056'
const lanyardRestUrl = `https://api.lanyard.rest/v1/users/${discordUserId}`
const lanyardSocketUrl = 'wss://api.lanyard.rest/socket'

type SpotifyPresence = {
  album: string
  album_art_url: string
  artist: string
  song: string
  track_id: string
  timestamps: {
    start: number
    end: number
  }
}

type LanyardPresence = {
  discord_status: 'online' | 'idle' | 'dnd' | 'offline'
  listening_to_spotify: boolean
  spotify: SpotifyPresence | null
}

type ConnectionPhase = 'connecting' | 'ready' | 'unmonitored' | 'error'

type LanyardEnvelope = {
  op: number
  t?: 'INIT_STATE' | 'PRESENCE_UPDATE'
  d?: LanyardPresence | { heartbeat_interval?: number }
}

function formatTime(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function MusicPage({ content, locale }: { content: SiteCopy; locale: Locale }) {
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState<ConnectionPhase>('connecting')
  const [presence, setPresence] = useState<LanyardPresence | null>(null)
  const [clock, setClock] = useState(0)
  const [socketLive, setSocketLive] = useState(false)

  const labels = locale === 'es' ? {
    eyebrow: 'Spotify · Presencia · En vivo',
    eyebrowReady: 'Spotify · Presencia · Preparada',
    title: 'Lo que suena\nahora mismo.',
    intro: 'Una página preparada para reflejar mi reproducción pública de Spotify en tiempo real a través de mi presencia de Discord.',
    jump: 'Abrir reproductor',
    now: 'Ahora escuchando',
    live: 'Sincronización WebSocket',
    polling: 'Sincronización cada 15 s',
    ready: 'Integración preparada',
    readySignal: 'READY SIGNAL',
    connecting: 'Conectando con la presencia pública…',
    waitingTitle: 'La conexión está preparada.',
    waitingBody: 'Mi usuario todavía no está monitorizado por Lanyard. Al unirme voluntariamente a su servidor y mantener visible Spotify en Discord, esta tarjeta empezará a actualizarse sola, sin volver a desplegar la web.',
    activate: 'Activar mediante Lanyard',
    privacy: 'La activación hace pública mi presencia de Discord y la canción que escucho. No concede acceso a mensajes ni a la cuenta de Spotify.',
    idleTitle: 'Nada público sonando ahora.',
    idleBody: 'La conexión está activa. Cuando Spotify aparezca en mi perfil de Discord, la canción se mostrará aquí automáticamente.',
    errorTitle: 'No se ha podido abrir la conexión.',
    errorBody: 'La página seguirá reintentando en segundo plano. La integración no bloquea el resto del portfolio.',
    album: 'Álbum',
    openSpotify: 'Abrir en Spotify',
    sourceEyebrow: 'Cómo funciona',
    sourceTitle: 'En vivo, privado por diseño.',
    sourceBody: 'La interfaz se suscribe únicamente a la presencia pública asociada a PapiGEGamer. No almacena historial, no controla la reproducción y no expone credenciales. Si Spotify deja de estar visible en Discord, la tarjeta vuelve al estado de reposo.',
    signals: ['WebSocket en vivo', 'Sin historial', 'Solo actividad pública'],
  } : {
    eyebrow: 'Spotify · Presence · Live',
    eyebrowReady: 'Spotify · Presence · Ready',
    title: 'What is playing\nright now.',
    intro: 'A page ready to mirror my public Spotify playback in real time through my Discord presence.',
    jump: 'Open player',
    now: 'Now listening',
    live: 'WebSocket sync',
    polling: '15 s sync',
    ready: 'Integration ready',
    readySignal: 'READY SIGNAL',
    connecting: 'Connecting to public presence…',
    waitingTitle: 'The connection is ready.',
    waitingBody: 'My user is not monitored by Lanyard yet. Once I voluntarily join its server and keep Spotify visible on Discord, this card will start updating automatically without another deployment.',
    activate: 'Activate through Lanyard',
    privacy: 'Activation makes my Discord presence and current song public. It does not grant access to messages or my Spotify account.',
    idleTitle: 'Nothing public is playing now.',
    idleBody: 'The connection is active. When Spotify appears on my Discord profile, the track will show here automatically.',
    errorTitle: 'The live connection could not be opened.',
    errorBody: 'The page will keep retrying in the background. The integration never blocks the rest of the portfolio.',
    album: 'Album',
    openSpotify: 'Open in Spotify',
    sourceEyebrow: 'How it works',
    sourceTitle: 'Live, private by design.',
    sourceBody: 'The interface subscribes only to the public presence associated with PapiGEGamer. It stores no listening history, cannot control playback and exposes no credentials. If Spotify is no longer visible on Discord, the card returns to its idle state.',
    signals: ['Live WebSocket', 'No history', 'Public activity only'],
  }

  useEffect(() => {
    let stopped = false
    let socket: WebSocket | null = null
    let heartbeat: number | null = null

    const clearHeartbeat = () => {
      if (heartbeat !== null) window.clearInterval(heartbeat)
      heartbeat = null
    }

    const connectSocket = () => {
      if (stopped || socket) return
      socket = new WebSocket(lanyardSocketUrl)

      socket.addEventListener('message', (event) => {
        try {
          const payload = JSON.parse(String(event.data)) as LanyardEnvelope
          if (payload.op === 1) {
            const hello = payload.d as { heartbeat_interval?: number }
            const interval = Math.max(1_000, hello?.heartbeat_interval ?? 30_000)
            socket?.send(JSON.stringify({ op: 2, d: { subscribe_to_id: discordUserId } }))
            clearHeartbeat()
            heartbeat = window.setInterval(() => socket?.send(JSON.stringify({ op: 3 })), interval)
          }

          if (payload.op === 0 && (payload.t === 'INIT_STATE' || payload.t === 'PRESENCE_UPDATE')) {
            setPresence(payload.d as LanyardPresence)
            setClock(Date.now())
            setPhase('ready')
            setSocketLive(true)
          }
        } catch {
          // A malformed third-party event is ignored; the REST fallback keeps running.
        }
      })

      socket.addEventListener('close', () => {
        clearHeartbeat()
        setSocketLive(false)
        socket = null
      })
    }

    const refresh = async () => {
      try {
        const response = await fetch(lanyardRestUrl, { headers: { Accept: 'application/json' } })
        if (response.status === 404) {
          if (!stopped) setPhase('unmonitored')
          return
        }
        if (!response.ok) throw new Error('lanyard_unavailable')
        const payload = await response.json() as { success: boolean; data?: LanyardPresence }
        if (!stopped && payload.success && payload.data) {
          setPresence(payload.data)
          setClock(Date.now())
          setPhase('ready')
          connectSocket()
        }
      } catch {
        if (!stopped) setPhase((current) => current === 'ready' ? current : 'error')
      }
    }

    void refresh()
    const restFallback = window.setInterval(() => void refresh(), 15_000)

    return () => {
      stopped = true
      window.clearInterval(restFallback)
      clearHeartbeat()
      socket?.close()
    }
  }, [])

  useEffect(() => {
    if (!presence?.spotify) return undefined
    const timer = window.setInterval(() => setClock(Date.now()), 1_000)
    return () => window.clearInterval(timer)
  }, [presence?.spotify])

  const progress = useMemo(() => {
    const track = presence?.spotify
    if (!track) return { elapsed: 0, duration: 0, percent: 0 }
    const duration = Math.max(1, track.timestamps.end - track.timestamps.start)
    const elapsed = Math.min(duration, Math.max(0, clock - track.timestamps.start))
    return { elapsed, duration, percent: (elapsed / duration) * 100 }
  }, [clock, presence?.spotify])

  const reveal = {
    initial: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-8% 0px' },
    transition: { duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }

  const track = presence?.spotify ?? null
  const isLive = phase === 'ready'
  const connectionLabel = isLive ? (socketLive ? labels.live : labels.polling) : phase === 'unmonitored' ? labels.ready : labels.connecting

  return (
    <div className="music-page">
      <section className="page-hero music-hero">
        <motion.div className="page-hero__copy" initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.75, ease: [0.16, 1, 0.3, 1] }}>
          <p className="eyebrow">{isLive ? labels.eyebrow : labels.eyebrowReady}</p>
          <h1>{labels.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h1>
          <p>{labels.intro}</p>
        </motion.div>

        <motion.div className="music-hero__visual" initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: reduceMotion ? 0 : 0.14, duration: reduceMotion ? 0 : 0.82, ease: [0.16, 1, 0.3, 1] }} aria-hidden="true">
          <div className="music-orbit music-orbit--outer" />
          <div className="music-orbit music-orbit--inner" />
          <div className="music-hero__disc"><Disc3 size={88} /></div>
          <span><Activity size={15} />{isLive ? 'LIVE SIGNAL' : labels.readySignal}</span>
        </motion.div>

        <a className="page-hero__scroll" href="#reproductor"><ArrowDown size={15} aria-hidden="true" />{labels.jump}</a>
      </section>

      <section className="section music-live-section" id="reproductor">
        <motion.div className="section-heading section-heading--split" {...reveal}>
          <div>
            <p className="eyebrow">Spotify · PapiGEGamer</p>
            <h2>{labels.now}</h2>
          </div>
          <p className="section-heading__intro">{labels.sourceBody}</p>
        </motion.div>

        <motion.div className={`now-playing now-playing--${phase} ${track ? 'now-playing--active' : ''}`} {...reveal}>
          <header className="now-playing__header">
            <span><span className="status-dot" aria-hidden="true" />{connectionLabel}</span>
            <span><Wifi size={14} aria-hidden="true" />LANYARD / DISCORD</span>
          </header>

          {phase === 'connecting' && (
            <div className="now-playing__state">
              <span className="music-loader" aria-hidden="true"><Music2 size={30} /></span>
              <h3>{labels.connecting}</h3>
            </div>
          )}

          {phase === 'unmonitored' && (
            <div className="now-playing__state now-playing__state--setup">
              <span className="music-loader" aria-hidden="true"><Radio size={30} /></span>
              <div>
                <h3>{labels.waitingTitle}</h3>
                <p>{labels.waitingBody}</p>
                <a href="https://discord.gg/lanyard" target="_blank" rel="noreferrer">{labels.activate}<ArrowUpRight size={16} aria-hidden="true" /></a>
                <small><ShieldCheck size={14} aria-hidden="true" />{labels.privacy}</small>
              </div>
            </div>
          )}

          {phase === 'error' && (
            <div className="now-playing__state">
              <span className="music-loader" aria-hidden="true"><Radio size={30} /></span>
              <div><h3>{labels.errorTitle}</h3><p>{labels.errorBody}</p></div>
            </div>
          )}

          {phase === 'ready' && !track && (
            <div className="now-playing__state">
              <span className="music-loader" aria-hidden="true"><Disc3 size={34} /></span>
              <div><h3>{labels.idleTitle}</h3><p>{labels.idleBody}</p></div>
            </div>
          )}

          {phase === 'ready' && track && (
            <div className="now-playing__track">
              <div className="now-playing__art">
                <img src={track.album_art_url} alt={`${labels.album}: ${track.album}`} width="640" height="640" />
                <span aria-hidden="true"><Disc3 size={64} /></span>
              </div>
              <div className="now-playing__copy">
                <span className="eyebrow">{labels.now}</span>
                <h3>{track.song}</h3>
                <p>{track.artist}</p>
                <small>{labels.album} · {track.album}</small>
                <div className="now-playing__progress" aria-label={`${formatTime(progress.elapsed)} / ${formatTime(progress.duration)}`}>
                  <span><i style={{ width: `${progress.percent}%` }} /></span>
                  <small>{formatTime(progress.elapsed)}</small>
                  <small>{formatTime(progress.duration)}</small>
                </div>
                <a href={`https://open.spotify.com/track/${track.track_id}`} target="_blank" rel="noreferrer">{labels.openSpotify}<ArrowUpRight size={16} aria-hidden="true" /></a>
              </div>
            </div>
          )}
        </motion.div>
      </section>

      <section className="music-source">
        <motion.div className="music-source__copy" {...reveal}>
          <p className="eyebrow">{labels.sourceEyebrow}</p>
          <h2>{labels.sourceTitle}</h2>
          <p>{labels.sourceBody}</p>
        </motion.div>
        <motion.div className="music-source__signals" {...reveal}>
          {labels.signals.map((signal, index) => (
            <article key={signal}><span>{String(index + 1).padStart(2, '0')}</span><strong>{signal}</strong><i /></article>
          ))}
        </motion.div>
      </section>

      <ContactSection content={content} />
    </div>
  )
}
