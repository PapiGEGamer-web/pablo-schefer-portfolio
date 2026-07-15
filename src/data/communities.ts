export type CommunityKey = 'fnlb' | 'nate' | 'edgar' | 'gw2' | 'valorant'

export type Community = {
  id: CommunityKey
  name: string
  shortName: string
  guildId: string
  href: string
  internal?: boolean
  current: boolean
  metric: string
  membersApprox?: number
  onlineApprox?: number
  accent: 'amber' | 'cyan' | 'violet'
}

export const communities: Community[] = [
  {
    id: 'fnlb',
    name: 'FNLB — Fortnite Bot Lobbies',
    shortName: 'FNLB',
    guildId: '1106879710744543303',
    href: 'https://discord.gg/fnlb',
    current: true,
    metric: '≈60K',
    membersApprox: 59_999,
    onlineApprox: 8_422,
    accent: 'amber',
  },
  {
    id: 'nate',
    name: 'Nate Gentile',
    shortName: 'Nate Gentile',
    guildId: '1044520223648256011',
    href: 'https://www.nategentile.com/',
    current: true,
    metric: 'TECH',
    accent: 'cyan',
  },
  {
    id: 'edgar',
    name: 'Edgar Pons',
    shortName: 'Edgar Pons',
    guildId: '822550944608026645',
    href: '/comunidades/edgar-pons',
    internal: true,
    current: true,
    metric: 'LIVE',
    accent: 'violet',
  },
  {
    id: 'gw2',
    name: 'GW2 — Gatitos 2',
    shortName: 'GW2 / Gatitos 2',
    guildId: '1196972070253383742',
    href: 'https://discord.gg/gatitos2',
    current: false,
    metric: '103K+',
    membersApprox: 103_192,
    onlineApprox: 18_510,
    accent: 'cyan',
  },
  {
    id: 'valorant',
    name: 'VALORANT ESP',
    shortName: 'VALORANT ESP',
    guildId: '1084367607982993428',
    href: 'https://discord.gg/valorantesp',
    current: false,
    metric: '98K+',
    accent: 'amber',
  },
]

export const edgarGuildId = '822550944608026645'
