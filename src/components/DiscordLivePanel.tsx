import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, ChevronDown, Clock3, Eye, Headphones, Radio, RefreshCw, Users } from 'lucide-react'
import type { Locale, SiteCopy } from '../content'

type VoiceMember = {
  username: string
  status: 'online' | 'idle' | 'dnd' | 'offline'
}

type VoiceChannel = {
  id: string
  name: string
  members: VoiceMember[]
}

type EdgarCommunityData = {
  server: {
    id: string
    name: string
    membersApprox: number | null
    onlineApprox: number | null
    inviteUrl: string | null
  }
  voice: {
    available: boolean
    visibleMemberCount: number
    channels: VoiceChannel[]
  }
  source?: {
    mode: 'discord_widget' | 'gateway'
    upstreamCacheSeconds: number
    effectiveRefreshSeconds?: number
  }
  updatedAt: string
}

const pollSeconds = 15

function createSnapshotSignature(data: EdgarCommunityData) {
  return JSON.stringify({
    members: data.server.membersApprox,
    online: data.server.onlineApprox,
    channels: data.voice.channels.map((channel) => ({
      id: channel.id,
      members: channel.members.map((member) => `${member.username}:${member.status}`),
    })),
  })
}

export function DiscordLivePanel({ content, locale }: { content: SiteCopy; locale: Locale }) {
  const [data, setData] = useState<EdgarCommunityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(false)
  const [activeOnly, setActiveOnly] = useState(false)
  const [expandedChannels, setExpandedChannels] = useState<Set<string>>(new Set())
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(pollSeconds)
  const [lastChangeAt, setLastChangeAt] = useState<string | null>(null)
  const [requestVersion, setRequestVersion] = useState(0)
  const signatureRef = useRef<string | null>(null)
  const hasDataRef = useRef(false)
  const expansionInitialisedRef = useRef(false)
  const labels = content.edgar

  const ui = locale === 'es' ? {
    monitor: 'Monitor activo',
    refresh: 'Actualizar ahora',
    activeOnly: 'Solo canales activos',
    allChannels: 'Todos los canales',
    nextCheck: 'Próxima comprobación',
    checked: 'Comprobado',
    lastChange: 'Último cambio detectado',
    justNow: 'ahora',
    source: 'Widget oficial · snapshots en vivo',
    sourceDelay: 'La URL estable de Discord conserva 300 s de caché. Esta integración comparte un snapshot público versionado cada 15 s, por lo que los cambios visibles suelen aparecer en la siguiente comprobación sin usar tokens ni canales privados.',
    expand: 'Mostrar participantes',
    collapse: 'Ocultar participantes',
  } : {
    monitor: 'Monitor active',
    refresh: 'Refresh now',
    activeOnly: 'Active channels only',
    allChannels: 'All channels',
    nextCheck: 'Next check',
    checked: 'Checked',
    lastChange: 'Last change detected',
    justNow: 'now',
    source: 'Official widget · live snapshots',
    sourceDelay: 'Discord keeps the stable URL cached for 300 s. This integration shares a versioned public snapshot every 15 s, so visible changes normally appear on the next check without tokens or private-channel access.',
    expand: 'Show participants',
    collapse: 'Hide participants',
  }

  useEffect(() => {
    let active = true
    let controller: AbortController | null = null

    const load = async () => {
      controller?.abort()
      controller = new AbortController()
      if (hasDataRef.current) setRefreshing(true)

      try {
        const response = await fetch('/api/edgar-community', {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('discord_unavailable')
        const nextData = await response.json() as EdgarCommunityData
        if (!active) return

        const signature = createSnapshotSignature(nextData)
        if (signatureRef.current === null || signatureRef.current !== signature) {
          signatureRef.current = signature
          setLastChangeAt(nextData.updatedAt)
        }

        if (!expansionInitialisedRef.current) {
          const firstActiveChannel = nextData.voice.channels.find((channel) => channel.members.length > 0)
          if (firstActiveChannel) setExpandedChannels(new Set([firstActiveChannel.id]))
          expansionInitialisedRef.current = true
        }

        hasDataRef.current = true
        setData(nextData)
        setError(false)
        setLoading(false)
        setRefreshing(false)
        setSecondsUntilRefresh(pollSeconds)
      } catch (fetchError) {
        if (active && !(fetchError instanceof DOMException && fetchError.name === 'AbortError')) {
          setError(true)
          setLoading(false)
          setRefreshing(false)
        }
      }
    }

    void load()
    const poll = window.setInterval(() => {
      if (!document.hidden) void load()
    }, pollSeconds * 1_000)
    const countdown = window.setInterval(() => {
      if (!document.hidden) setSecondsUntilRefresh((seconds) => seconds <= 1 ? pollSeconds : seconds - 1)
    }, 1_000)
    const onVisibilityChange = () => {
      if (!document.hidden) void load()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      active = false
      controller?.abort()
      window.clearInterval(poll)
      window.clearInterval(countdown)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [requestVersion])

  const number = (value: number | null) => value === null ? '—' : new Intl.NumberFormat(locale).format(value)
  const checked = data
    ? new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(data.updatedAt))
    : '—'
  const lastChange = lastChangeAt
    ? new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(lastChangeAt))
    : ui.justNow

  const visibleChannels = useMemo(
    () => activeOnly ? data?.voice.channels.filter((channel) => channel.members.length > 0) ?? [] : data?.voice.channels ?? [],
    [activeOnly, data?.voice.channels],
  )

  const toggleChannel = (channelId: string) => {
    setExpandedChannels((current) => {
      const next = new Set(current)
      if (next.has(channelId)) next.delete(channelId)
      else next.add(channelId)
      return next
    })
  }

  return (
    <section className="discord-live">
      <div className="discord-live__header">
        <div>
          <span className="discord-live__signal"><span className="status-dot" aria-hidden="true" />{ui.monitor}</span>
          <h2>{data?.server.name ?? 'Edgar Pons'}</h2>
        </div>
        <span className="discord-live__privacy">{labels.publicData}</span>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {error ? labels.error : data ? `${ui.checked} ${checked}` : labels.loading}
      </p>

      {loading && !data && (
        <div className="discord-live__loading">
          <span className="discord-loader" aria-hidden="true" />
          <p>{labels.loading}</p>
        </div>
      )}

      {error && !data && (
        <div className="discord-live__error">
          <Radio size={24} aria-hidden="true" />
          <p>{labels.error}</p>
          <button type="button" onClick={() => {
            setError(false)
            setLoading(true)
            setRequestVersion((version) => version + 1)
          }}>
            <RefreshCw size={15} aria-hidden="true" />{labels.retry}
          </button>
        </div>
      )}

      {data && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
          <div className="discord-live__controls">
            <button type="button" onClick={() => setRequestVersion((version) => version + 1)} disabled={refreshing}>
              <RefreshCw className={refreshing ? 'is-spinning' : ''} size={15} aria-hidden="true" />{ui.refresh}
            </button>
            <button type="button" className={activeOnly ? 'is-active' : ''} onClick={() => setActiveOnly((activeState) => !activeState)} aria-pressed={activeOnly}>
              <Eye size={15} aria-hidden="true" />{activeOnly ? ui.allChannels : ui.activeOnly}
            </button>
            <span><Clock3 size={14} aria-hidden="true" />{ui.nextCheck} · {secondsUntilRefresh}s</span>
          </div>

          <div className="discord-live__poll-progress" aria-hidden="true"><i style={{ transform: `scaleX(${1 - secondsUntilRefresh / pollSeconds})` }} /></div>

          <div className="discord-live__stats">
            <article>
              <Users size={18} aria-hidden="true" />
              <strong>{number(data.server.membersApprox)}</strong>
              <span>{labels.membersLabel}</span>
            </article>
            <article>
              <span className="status-dot" aria-hidden="true" />
              <strong>{number(data.server.onlineApprox)}</strong>
              <span>{labels.onlineLabel}</span>
            </article>
            <article>
              <Headphones size={18} aria-hidden="true" />
              <strong>{data.voice.available ? number(data.voice.visibleMemberCount) : '—'}</strong>
              <span>{labels.voiceLabel} · {labels.visibleVoiceLabel}</span>
            </article>
          </div>

          <div className="discord-live__voice">
            <div className="discord-live__voice-heading">
              <div>
                <span className="eyebrow">{locale === 'es' ? 'Canales de voz' : 'Voice channels'}</span>
                <h3>{data.voice.available ? labels.voiceAvailable : labels.voiceUnavailable}</h3>
              </div>
              <span>{ui.checked} · {checked}<small>{ui.lastChange} · {lastChange}</small></span>
            </div>

            {data.voice.available && visibleChannels.length > 0 ? (
              <div className="voice-channel-grid">
                {visibleChannels.map((channel, channelIndex) => {
                  const expanded = expandedChannels.has(channel.id)
                  return (
                    <motion.article
                      className={channel.members.length ? 'voice-channel voice-channel--active' : 'voice-channel'}
                      key={channel.id}
                      layout
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: channelIndex * 0.035, duration: 0.3 }}
                    >
                      <button className="voice-channel__toggle" type="button" onClick={() => toggleChannel(channel.id)} aria-expanded={expanded} aria-label={`${expanded ? ui.collapse : ui.expand}: ${channel.name}`}>
                        <span><Headphones size={15} aria-hidden="true" />{channel.name}</span>
                        <strong>{channel.members.length.toString().padStart(2, '0')}</strong>
                        <ChevronDown size={15} aria-hidden="true" />
                      </button>
                      <AnimatePresence initial={false}>
                        {expanded && channel.members.length > 0 && (
                          <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                            {channel.members.map((member, memberIndex) => (
                              <li key={`${channel.id}-${member.username}-${memberIndex}`}>
                                <span className={`voice-member__status voice-member__status--${member.status}`} aria-hidden="true" />
                                <span className="voice-member__avatar" aria-hidden="true">{member.username.trim().charAt(0).toUpperCase() || '?'}</span>
                                <span>{member.username}</span>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                      {channel.members.length === 0 && <p>{labels.emptyVoice}</p>}
                    </motion.article>
                  )
                })}
              </div>
            ) : data.voice.available ? (
              <p className="discord-live__empty">{labels.emptyVoice}</p>
            ) : null}
          </div>

          <div className="discord-live__source">
            <span><Radio size={15} aria-hidden="true" />{ui.source}</span>
            <p>{ui.sourceDelay}</p>
          </div>

          <div className="discord-live__footer">
            <p>{labels.sourceNote}</p>
            {data.server.inviteUrl && (
              <a href={data.server.inviteUrl} target="_blank" rel="noreferrer">
                {labels.join}<ArrowUpRight size={15} aria-hidden="true" />
              </a>
            )}
          </div>
          {error && <p className="discord-live__stale">{labels.error}</p>}
        </motion.div>
      )}
    </section>
  )
}
