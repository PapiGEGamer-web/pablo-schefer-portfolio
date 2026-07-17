import { useState } from 'react'
import './SpotifyEmbed.css'

type SpotifyEmbedProps = {
  trackId: string
  title: string
  compact?: boolean
}

export function SpotifyEmbed({ trackId, title, compact = false }: SpotifyEmbedProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={`spotify-embed-frame${compact ? ' spotify-embed-frame--compact' : ''}${loaded ? ' is-ready' : ''}`}>
      <span className="spotify-embed-frame__skeleton" aria-hidden="true"><i /><i /><i /></span>
      <iframe
        className={`spotify-embed${compact ? ' spotify-embed--compact' : ''}`}
        title={title}
        src={`https://open.spotify.com/embed/track/${encodeURIComponent(trackId)}?utm_source=generator&theme=0`}
        width="100%"
        height={compact ? 152 : 352}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}
