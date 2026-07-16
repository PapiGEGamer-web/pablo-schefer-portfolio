import { motion, useReducedMotion } from 'motion/react'
import { Activity, ArrowDown, ArrowUpRight, Disc3, Music2, Radio, ShieldCheck, Wifi } from 'lucide-react'
import type { Locale, SiteCopy } from '../content'
import { ContactSection } from '../components/ContactSection'
import { SpotifyEmbed } from '../components/SpotifyEmbed'
import { formatLanyardTime, useLanyardPresence } from '../hooks/useLanyardPresence'
import './MusicPage.css'

export function MusicPage({ content, locale }: { content: SiteCopy; locale: Locale }) {
  const reduceMotion = useReducedMotion()
  const { phase, progress, socketLive, track } = useLanyardPresence()

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
    waitingTitle: 'Esperando la confirmación de Lanyard.',
    waitingBody: 'Ya me he unido a la comunidad, pero Lanyard todavía no reconoce este ID público. La web comprueba el estado cada 15 segundos y se activará sola en cuanto la cuenta quede monitorizada.',
    activate: 'Ver comunidad de Lanyard',
    privacy: 'Los visitantes no tienen que registrarse. La integración solo lee mi presencia pública y nunca accede a mensajes ni credenciales.',
    idleTitle: 'Nada público sonando ahora.',
    idleBody: 'La conexión está activa. Cuando Spotify aparezca en mi perfil de Discord, la canción se mostrará aquí automáticamente.',
    errorTitle: 'No se ha podido abrir la conexión.',
    errorBody: 'La página seguirá reintentando en segundo plano. La integración no bloquea el resto del portfolio.',
    album: 'Álbum',
    openSpotify: 'Abrir en Spotify',
    playerTitle: 'Reproductor oficial de Spotify',
    playerNote: 'Pulsa play en el reproductor oficial. Spotify gestiona el audio; el volumen se ajusta desde el dispositivo o el navegador.',
    sourceEyebrow: 'Cómo funciona',
    sourceTitle: 'En vivo, privado por diseño.',
    sourceBody: 'La interfaz se suscribe únicamente a mi presencia pública. No almacena historial ni controla mi cuenta; el audio se ofrece mediante el reproductor oficial de Spotify. Si la actividad deja de ser visible en Discord, la tarjeta vuelve al reposo.',
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
    waitingTitle: 'Waiting for Lanyard confirmation.',
    waitingBody: 'I have joined the community, but Lanyard does not recognise this public ID yet. The site checks every 15 seconds and will activate automatically once the account is monitored.',
    activate: 'View the Lanyard community',
    privacy: 'Visitors never need to register. The integration only reads my public presence and never accesses messages or credentials.',
    idleTitle: 'Nothing public is playing now.',
    idleBody: 'The connection is active. When Spotify appears on my Discord profile, the track will show here automatically.',
    errorTitle: 'The live connection could not be opened.',
    errorBody: 'The page will keep retrying in the background. The integration never blocks the rest of the portfolio.',
    album: 'Album',
    openSpotify: 'Open in Spotify',
    playerTitle: 'Official Spotify player',
    playerNote: 'Press play in the official player. Spotify manages playback; volume is adjusted through the device or browser.',
    sourceEyebrow: 'How it works',
    sourceTitle: 'Live, private by design.',
    sourceBody: 'The interface subscribes only to my public presence. It stores no history and cannot control my account; audio is provided through Spotify’s official player. If activity is no longer visible on Discord, the card returns to idle.',
    signals: ['Live WebSocket', 'No history', 'Public activity only'],
  }

  const reveal = {
    initial: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-8% 0px' },
    transition: { duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }

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
                <div className="now-playing__progress" aria-label={`${formatLanyardTime(progress.elapsed)} / ${formatLanyardTime(progress.duration)}`}>
                  <span><i style={{ width: `${progress.percent}%` }} /></span>
                  <small>{formatLanyardTime(progress.elapsed)}</small>
                  <small>{formatLanyardTime(progress.duration)}</small>
                </div>
                <a href={`https://open.spotify.com/track/${track.track_id}`} target="_blank" rel="noreferrer">{labels.openSpotify}<ArrowUpRight size={16} aria-hidden="true" /></a>
                <div className="now-playing__embed">
                  <SpotifyEmbed trackId={track.track_id} title={`${labels.playerTitle}: ${track.song}`} compact />
                  <small>{labels.playerNote}</small>
                </div>
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
