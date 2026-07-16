import { apiSecurityHeaders, enforceRateLimit, jsonResponse } from '../server/security.js'

const anilistEndpoint = 'https://graphql.anilist.co'
const requestTimeoutMs = 6_000
const maxTitleLength = 120

const animeQuery = /* GraphQL */ `
  query AnimeByTitle($search: String!) {
    Page(page: 1, perPage: 1) {
      media(
        search: $search
        type: ANIME
        isAdult: false
        sort: [SEARCH_MATCH]
      ) {
        id
        title {
          romaji
          english
          native
          userPreferred
        }
        description(asHtml: false)
        coverImage {
          extraLarge
          large
          medium
          color
        }
        bannerImage
        averageScore
        genres
        episodes
        duration
        seasonYear
        startDate {
          year
        }
        format
        status
        siteUrl
        externalLinks {
          site
          url
          icon
          isDisabled
        }
      }
    }
  }
`

type JsonRecord = Record<string, unknown>

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function stringValue(value: unknown, maxLength = 500) {
  if (typeof value !== 'string') return null
  const result = value.trim()
  return result ? result.slice(0, maxLength) : null
}

function finiteInteger(value: unknown, minimum = 0, maximum = Number.MAX_SAFE_INTEGER) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null
  const result = Math.round(value)
  return result >= minimum && result <= maximum ? result : null
}

function httpsUrl(value: unknown) {
  const raw = stringValue(value, 2_048)
  if (!raw) return null

  try {
    const parsed = new URL(raw)
    return parsed.protocol === 'https:' ? parsed.toString() : null
  } catch {
    return null
  }
}

function decodeHtmlEntities(value: string) {
  const named: Record<string, string> = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
  }

  return value.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);/gi, (entity, code: string) => {
    if (code[0] !== '#') return named[code.toLowerCase()] ?? entity

    const hexadecimal = code[1]?.toLowerCase() === 'x'
    const numeric = Number.parseInt(code.slice(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10)
    if (!Number.isFinite(numeric) || numeric < 0 || numeric > 0x10ffff) return ''

    try {
      return String.fromCodePoint(numeric)
    } catch {
      return ''
    }
  })
}

function cleanSynopsis(value: unknown) {
  const raw = stringValue(value, 12_000)
  if (!raw) return null

  const normalized = decodeHtmlEntities(
    raw
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
      .replace(/~!|!~|[*_`>#]/g, '')
      .replace(/\r/g, ''),
  )
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  const synopsis = normalized.split(/\n(?:\(Source:|Source:|Notes?:)/i)[0]?.trim()
  return synopsis?.slice(0, 3_000) || null
}

function errorResponse(error: string, status: number) {
  return jsonResponse({ error }, status)
}

function validatedTitle(request: Request) {
  let raw: string | null

  try {
    raw = new URL(request.url).searchParams.get('title')
  } catch {
    return null
  }

  if (!raw) return null
  const title = raw.normalize('NFKC').replace(/\s+/g, ' ').trim()
  const hasControlCharacter = Array.from(title).some((character) => {
    const code = character.charCodeAt(0)
    return code <= 31 || code === 127
  })
  if (!title || title.length > maxTitleLength || hasControlCharacter) return null
  return title
}

export async function GET(request: Request) {
  const limited = enforceRateLimit(request, { scope: 'anime', limit: 150, windowMs: 60_000 })
  if (limited) return limited
  const title = validatedTitle(request)
  if (!title) return errorResponse('invalid_title', 400)

  try {
    const upstream = await fetch(anilistEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'PabloScheferPortfolio/1.0 (+https://pablo-schefer.vercel.app)',
      },
      body: JSON.stringify({ query: animeQuery, variables: { search: title } }),
      cache: 'no-store',
      signal: AbortSignal.timeout(requestTimeoutMs),
    })

    if (!upstream.ok) return errorResponse('anilist_unavailable', upstream.status === 429 ? 429 : 503)

    const payload: unknown = await upstream.json()
    const data = isRecord(payload) && isRecord(payload.data) ? payload.data : null
    const page = data && isRecord(data.Page) ? data.Page : null
    const mediaList = page && Array.isArray(page.media) ? page.media : []
    const media = mediaList.find(isRecord)
    if (!media) return errorResponse('anime_not_found', 404)

    const titles = isRecord(media.title) ? media.title : {}
    const safeTitles = {
      romaji: stringValue(titles.romaji, 300),
      english: stringValue(titles.english, 300),
      native: stringValue(titles.native, 300),
      userPreferred: stringValue(titles.userPreferred, 300),
    }
    const displayTitle = safeTitles.english ?? safeTitles.userPreferred ?? safeTitles.romaji ?? safeTitles.native ?? title

    const cover = isRecord(media.coverImage) ? media.coverImage : {}
    const externalLinks = Array.isArray(media.externalLinks) ? media.externalLinks.filter(isRecord) : []
    const crunchyroll = externalLinks.find((link) => {
      if (link.isDisabled === true) return false
      const site = stringValue(link.site, 100)?.toLowerCase()
      return site?.includes('crunchyroll') ?? false
    })

    const accent = stringValue(cover.color, 7)
    const score = finiteInteger(media.averageScore, 0, 100)
    const crunchyrollUrl = httpsUrl(crunchyroll?.url) ?? `https://www.crunchyroll.com/search?q=${encodeURIComponent(displayTitle)}`
    const genres = Array.isArray(media.genres)
      ? media.genres.map((genre) => stringValue(genre, 50)).filter((genre): genre is string => Boolean(genre)).slice(0, 12)
      : []
    const startDate = isRecord(media.startDate) ? media.startDate : null

    const mediaId = finiteInteger(media.id, 1)
    if (!mediaId) return errorResponse('anime_not_found', 404)

    return Response.json(
      {
        anime: {
        id: mediaId,
        title: displayTitle,
        titleRomaji: safeTitles.romaji ?? '',
        titleNative: safeTitles.native ?? '',
        synopsis: cleanSynopsis(media.description),
        coverImage: httpsUrl(cover.extraLarge) ?? httpsUrl(cover.large) ?? httpsUrl(cover.medium),
        bannerImage: httpsUrl(media.bannerImage),
        accent: accent && /^#[0-9a-f]{6}$/i.test(accent) ? accent : null,
        score,
        scoreSource: 'AniList',
        genres,
        episodes: finiteInteger(media.episodes, 0, 100_000),
        duration: finiteInteger(media.duration, 0, 100_000),
        year: finiteInteger(media.seasonYear, 1800, 3000) ?? finiteInteger(startDate?.year, 1800, 3000),
        format: stringValue(media.format, 50),
        status: stringValue(media.status, 50),
        anilistUrl: httpsUrl(media.siteUrl),
        crunchyrollUrl,
        crunchyrollIcon: httpsUrl(crunchyroll?.icon),
        },
      },
      {
        headers: {
          ...apiSecurityHeaders,
          'Cache-Control': 'public, max-age=300, s-maxage=86400, stale-while-revalidate=604800, stale-if-error=604800',
          'Vercel-CDN-Cache-Control': 'max-age=86400, stale-while-revalidate=604800, stale-if-error=604800',
        },
      },
    )
  } catch {
    return errorResponse('anilist_unavailable', 503)
  }
}
