import { communityAssets } from './communityAssets'

export type CommunityKey = 'fnlb' | 'nate' | 'edgar' | 'kernelos' | 'gw2' | 'valorant'

type CommunityVisual = {
  logo: string
  cover: string
  alt: { es: string; en: string }
  focus?: string
}

export type Community = {
  id: CommunityKey
  name: string
  shortName: string
  guildId: string
  href: string
  internal?: boolean
  current: boolean
  metric: string
  metricLabel?: { es: string; en: string }
  membersApprox?: number
  onlineApprox?: number
  accent: 'amber' | 'blue' | 'cyan' | 'green' | 'red' | 'violet'
  visual: CommunityVisual
}

export const communities: Community[] = [
  {
    id: 'fnlb',
    name: 'FNLB — Fortnite Bot Lobbies',
    shortName: 'FNLB',
    guildId: '1106879710744543303',
    href: 'https://discord.gg/fnlb',
    current: true,
    metric: '60K',
    membersApprox: 60_000,
    onlineApprox: 8_422,
    accent: 'blue',
    visual: {
      logo: communityAssets.fnlbLogo,
      cover: communityAssets.fnlbCover,
      alt: { es: 'Identidad visual de FNLB', en: 'FNLB visual identity' },
      focus: 'center',
    },
  },
  {
    id: 'nate',
    name: 'Nate Gentile',
    shortName: 'Nate Gentile',
    guildId: '1044520223648256011',
    href: 'https://www.nategentile.com/',
    current: true,
    metric: '3.16M',
    metricLabel: { es: 'YouTube · suscriptores', en: 'YouTube · subscribers' },
    membersApprox: 1_612,
    onlineApprox: 207,
    accent: 'green',
    visual: {
      logo: communityAssets.nateLogo,
      cover: communityAssets.nateCover,
      alt: { es: 'Identidad visual de la comunidad de Nate Gentile', en: 'Nate Gentile community visual identity' },
      focus: 'center 42%',
    },
  },
  {
    id: 'edgar',
    name: 'Edgar Pons',
    shortName: 'Edgar Pons',
    guildId: '822550944608026645',
    href: '/comunidades/edgar-pons',
    internal: true,
    current: true,
    metric: '446K',
    metricLabel: { es: 'Instagram · seguidores', en: 'Instagram · followers' },
    membersApprox: 793,
    onlineApprox: 50,
    accent: 'blue',
    visual: {
      logo: communityAssets.edgarLogo,
      cover: communityAssets.edgarBanner,
      alt: { es: 'Identidad visual de la comunidad de Edgar Pons', en: 'Edgar Pons community visual identity' },
      focus: 'center',
    },
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
    accent: 'violet',
    visual: {
      logo: communityAssets.gw2Logo,
      cover: communityAssets.gw2Cover,
      alt: { es: 'Identidad visual de GW2, Gatitos 2', en: 'GW2, Gatitos 2 visual identity' },
      focus: 'center',
    },
  },
  {
    id: 'kernelos',
    name: 'KernelOS',
    shortName: 'KernelOS',
    guildId: 'kernelos-community',
    href: 'https://kernelos.org/',
    current: true,
    metric: '50K+',
    membersApprox: 50_000,
    accent: 'red',
    visual: {
      logo: communityAssets.kernelosLogo,
      cover: '/media/projects/kernelos-cover.webp',
      alt: { es: 'Logo de KernelOS con máscara oni', en: 'KernelOS oni mask logo' },
      focus: 'center',
    },
  },
  {
    id: 'valorant',
    name: 'VALORANT ESP',
    shortName: 'VALORANT ESP',
    guildId: '1084367607982993428',
    href: 'https://discord.gg/valorantesp',
    current: false,
    metric: '98K+',
    accent: 'red',
    visual: {
      logo: communityAssets.valorantEsLogo,
      cover: communityAssets.valorantEsCover,
      alt: { es: 'Identidad visual de VALORANT ESP', en: 'VALORANT ESP visual identity' },
      focus: 'center',
    },
  },
]

export const edgarGuildId = '822550944608026645'
