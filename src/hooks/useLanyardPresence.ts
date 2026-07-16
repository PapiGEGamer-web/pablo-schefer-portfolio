import { createContext, createElement, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export const discordUserId = '1179009666110476328'

const lanyardRestUrl = `https://api.lanyard.rest/v1/users/${discordUserId}`
const lanyardSocketUrl = 'wss://api.lanyard.rest/socket'

export type SpotifyPresence = {
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

export type LanyardActivity = {
  id?: string
  name: string
  type: number
  details?: string
  state?: string
  application_id?: string
  timestamps?: {
    start?: number
    end?: number
  }
  assets?: {
    large_image?: string
    large_text?: string
    small_image?: string
    small_text?: string
  }
}

export type LanyardPresence = {
  activities?: LanyardActivity[]
  discord_status: 'online' | 'idle' | 'dnd' | 'offline'
  listening_to_spotify: boolean
  spotify: SpotifyPresence | null
}

export type LanyardConnectionPhase = 'connecting' | 'ready' | 'unmonitored' | 'error'

type LanyardEnvelope = {
  op: number
  t?: 'INIT_STATE' | 'PRESENCE_UPDATE'
  d?: LanyardPresence | { heartbeat_interval?: number }
}

export function formatLanyardTime(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function useLanyardPresenceSource() {
  const [phase, setPhase] = useState<LanyardConnectionPhase>('connecting')
  const [presence, setPresence] = useState<LanyardPresence | null>(null)
  const [clock, setClock] = useState(0)
  const [socketLive, setSocketLive] = useState(false)

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
          const raw = String(event.data)
          if (raw.length > 256_000) return
          const payload = JSON.parse(raw) as LanyardEnvelope

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
          // Malformed third-party events are ignored; REST remains the fallback.
        }
      })

      socket.addEventListener('close', () => {
        clearHeartbeat()
        setSocketLive(false)
        socket = null
      })

      socket.addEventListener('error', () => {
        setSocketLive(false)
      })
    }

    const refresh = async () => {
      try {
        const response = await fetch(lanyardRestUrl, {
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        })

        if (response.status === 404) {
          if (!stopped) {
            setPresence(null)
            setPhase('unmonitored')
            setSocketLive(false)
          }
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
    const restFallback = window.setInterval(() => {
      if (!document.hidden) void refresh()
    }, 30_000)
    const refreshWhenVisible = () => {
      if (!document.hidden) void refresh()
    }
    document.addEventListener('visibilitychange', refreshWhenVisible)

    return () => {
      stopped = true
      window.clearInterval(restFallback)
      document.removeEventListener('visibilitychange', refreshWhenVisible)
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

  return {
    phase,
    presence,
    activities: presence?.activities ?? [],
    progress,
    socketLive,
    track: presence?.spotify ?? null,
  }
}

type LanyardContextValue = ReturnType<typeof useLanyardPresenceSource>

const LanyardContext = createContext<LanyardContextValue | null>(null)

export function LanyardProvider({ children }: { children: ReactNode }) {
  const value = useLanyardPresenceSource()
  return createElement(LanyardContext.Provider, { value }, children)
}

export function useLanyardPresence() {
  const value = useContext(LanyardContext)
  if (!value) throw new Error('useLanyardPresence must be used inside LanyardProvider')
  return value
}
