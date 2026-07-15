import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, Headphones, Radio, RefreshCw, Users } from 'lucide-react'
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
  updatedAt: string
}

export function DiscordLivePanel({ content, locale }: { content: SiteCopy; locale: Locale }) {
  const [data, setData] = useState<EdgarCommunityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [requestVersion, setRequestVersion] = useState(0)
  const labels = content.edgar

  useEffect(() => {
    let active = true
    let controller: AbortController | null = null

    const load = async () => {
      controller?.abort()
      controller = new AbortController()
      try {
        const response = await fetch('/api/edgar-community', {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('discord_unavailable')
        const nextData = await response.json() as EdgarCommunityData
        if (active) {
          setData(nextData)
          setError(false)
          setLoading(false)
        }
      } catch (fetchError) {
        if (active && !(fetchError instanceof DOMException && fetchError.name === 'AbortError')) {
          setError(true)
          setLoading(false)
        }
      }
    }

    void load()
    const poll = window.setInterval(() => {
      if (!document.hidden) void load()
    }, 60_000)
    const onVisibilityChange = () => {
      if (!document.hidden) void load()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      active = false
      controller?.abort()
      window.clearInterval(poll)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [requestVersion])

  const number = (value: number | null) => value === null ? '—' : new Intl.NumberFormat(locale).format(value)
  const updated = data
    ? new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(data.updatedAt))
    : '—'

  return (
    <section className="discord-live" aria-live="polite">
      <div className="discord-live__header">
        <div>
          <span className="discord-live__signal"><span className="status-dot" aria-hidden="true" />{content.common.live}</span>
          <h2>{data?.server.name ?? 'Edgar Pons'}</h2>
        </div>
        <span className="discord-live__privacy">{labels.publicData}</span>
      </div>

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
          <button
            type="button"
            onClick={() => {
              setError(false)
              setLoading(true)
              setRequestVersion((version) => version + 1)
            }}
          >
            <RefreshCw size={15} aria-hidden="true" />{labels.retry}
          </button>
        </div>
      )}

      {data && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
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
              <span>{labels.updated} · {updated}</span>
            </div>

            {data.voice.available && data.voice.channels.length > 0 ? (
              <div className="voice-channel-grid">
                {data.voice.channels.map((channel, channelIndex) => (
                  <motion.article
                    className={channel.members.length ? 'voice-channel voice-channel--active' : 'voice-channel'}
                    key={channel.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: channelIndex * 0.045, duration: 0.35 }}
                  >
                    <header>
                      <span><Headphones size={15} aria-hidden="true" />{channel.name}</span>
                      <strong>{channel.members.length.toString().padStart(2, '0')}</strong>
                    </header>
                    {channel.members.length > 0 ? (
                      <ul>
                        {channel.members.map((member, memberIndex) => (
                          <li key={`${channel.id}-${member.username}-${memberIndex}`}>
                            <span className={`voice-member__status voice-member__status--${member.status}`} aria-hidden="true" />
                            <span className="voice-member__avatar" aria-hidden="true">{member.username.trim().charAt(0).toUpperCase() || '?'}</span>
                            <span>{member.username}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>{labels.emptyVoice}</p>
                    )}
                  </motion.article>
                ))}
              </div>
            ) : data.voice.available ? (
              <p className="discord-live__empty">{labels.emptyVoice}</p>
            ) : null}
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
