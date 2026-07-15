const discordApi = 'https://discord.com/api/v10'
const edgarGuildId = '822550944608026645'
const discordHeaders = {
  Accept: 'application/json',
  'User-Agent': 'PabloScheferPortfolio/1.0 (+https://pablo-schefer.vercel.app)',
}

type JsonRecord = Record<string, unknown>

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null
}

function stringValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function numberValue(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function safeText(value: unknown, maxLength: number, fallback: string) {
  const text = stringValue(value, fallback).trim()
  return (text || fallback).slice(0, maxLength)
}

function errorResponse() {
  return Response.json(
    { error: 'discord_unavailable' },
    {
      status: 503,
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    },
  )
}

export async function GET() {
  try {
    const widgetResponse = await fetch(`${discordApi}/guilds/${edgarGuildId}/widget.json`, {
      headers: discordHeaders,
      signal: AbortSignal.timeout(5_000),
    })
    if (!widgetResponse.ok) return errorResponse()

    const widget: unknown = await widgetResponse.json()
    if (!isRecord(widget) || stringValue(widget.id) !== edgarGuildId) return errorResponse()

    const inviteUrl = typeof widget.instant_invite === 'string' ? widget.instant_invite : null
    let invite: JsonRecord | null = null
    if (inviteUrl) {
      const inviteCode = new URL(inviteUrl).pathname.split('/').filter(Boolean).pop()
      if (inviteCode) {
        const inviteResponse = await fetch(`${discordApi}/invites/${encodeURIComponent(inviteCode)}?with_counts=true`, {
          headers: discordHeaders,
          signal: AbortSignal.timeout(5_000),
        })
        if (inviteResponse.ok) {
          const inviteJson: unknown = await inviteResponse.json()
          if (isRecord(inviteJson)) invite = inviteJson
        }
      }
    }

    const rawMembers = Array.isArray(widget.members) ? widget.members.filter(isRecord).slice(0, 100) : []
    const rawChannels = Array.isArray(widget.channels) ? widget.channels.filter(isRecord).slice(0, 100) : []
    const voiceChannels = rawChannels
      .map((channel) => {
        const id = stringValue(channel.id)
        const members = rawMembers
          .filter((member) => stringValue(member.channel_id) === id)
          .map((member) => {
            const rawStatus = stringValue(member.status, 'offline')
            const status = ['online', 'idle', 'dnd', 'offline'].includes(rawStatus) ? rawStatus : 'offline'
            return {
              username: safeText(member.username, 64, 'Discord member'),
              status,
            }
          })
        return {
          id,
          name: safeText(channel.name, 100, 'Voice channel'),
          position: numberValue(channel.position) ?? 0,
          members,
        }
      })
      .filter((channel) => channel.id)
      .sort((left, right) => {
        if (left.members.length !== right.members.length) return right.members.length - left.members.length
        return left.position - right.position
      })
      .map((channel) => ({ id: channel.id, name: channel.name, members: channel.members }))

    const inviteGuild = invite && isRecord(invite.guild) ? invite.guild : null
    const membersApprox = invite ? numberValue(invite.approximate_member_count) : null
    const onlineFromInvite = invite ? numberValue(invite.approximate_presence_count) : null
    const onlineFromWidget = numberValue(widget.presence_count)

    return Response.json(
      {
        server: {
          id: edgarGuildId,
          name: safeText(inviteGuild?.name ?? widget.name, 100, 'Edgar Pons'),
          membersApprox,
          onlineApprox: onlineFromInvite ?? onlineFromWidget,
          inviteUrl,
        },
        voice: {
          available: true,
          visibleMemberCount: voiceChannels.reduce((total, channel) => total + channel.members.length, 0),
          channels: voiceChannels,
        },
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=300, stale-if-error=3600',
          'Vercel-CDN-Cache-Control': 'max-age=60, stale-while-revalidate=300, stale-if-error=3600',
          'X-Content-Type-Options': 'nosniff',
        },
      },
    )
  } catch {
    return errorResponse()
  }
}
