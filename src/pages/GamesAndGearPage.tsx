import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { AnimatePresence, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import {
  Activity,
  ArrowDown,
  ArrowUpRight,
  CircuitBoard,
  Cpu,
  Gamepad2,
  HardDrive,
  MemoryStick,
  Monitor,
  Radio,
  SlidersHorizontal,
  Sparkles,
  Zap,
  X,
  type LucideIcon,
} from 'lucide-react'
import type { Locale, SiteCopy } from '../content'
import { dreamHardware, games, hardware, type Game, type HardwareItem } from '../data/gamesAndGear'
import { type LanyardActivity, useLanyardPresence } from '../hooks/useLanyardPresence'
import { ContactSection } from '../components/ContactSection'
import './GamesAndGearPage.css'

type GameFilter = 'all' | 'competitive' | 'coop' | 'open-world' | 'story' | 'survival' | 'creative'
type HardwareMode = 'current' | 'dream'

const hardwareIcons: Record<HardwareItem['id'], LucideIcon> = {
  cpu: Cpu,
  gpu: Monitor,
  memory: MemoryStick,
  board: CircuitBoard,
  storage: HardDrive,
  power: Zap,
}

function GameCover({ game, eager = false }: { game: Game; eager?: boolean }) {
  const style = { '--game-accent': game.accent } as CSSProperties

  return (
    <div className={`game-cover game-cover--${game.imageMode ?? 'art'} game-cover--${game.id}`} style={style}>
      {game.image ? (
        <img src={game.image} alt="" loading={eager ? 'eager' : 'lazy'} width="600" height="900" />
      ) : (
        <span className="game-cover__mark">{game.mark ?? game.title.slice(0, 2)}</span>
      )}
      <span className="game-cover__shine" aria-hidden="true" />
    </div>
  )
}

const nonGameActivities = [
  'custom status', 'kernelos', 'discord', 'spotify', 'visual studio code', 'chrome', 'github',
  'crunchyroll', 'anilist', 'myanimelist', 'animeflv', 'hidive', 'plex', 'jellyfin',
]

function activityImage(activity: LanyardActivity) {
  const image = activity.assets?.large_image
  if (!image) return undefined
  if (/^https?:\/\//i.test(image)) return image
  if (image.startsWith('mp:')) return `https://media.discordapp.net/${image.slice(3)}`
  if (activity.application_id) return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${image}.png`
  return undefined
}

function activityText(activity: LanyardActivity) {
  return [activity.name, activity.details, activity.state, activity.assets?.large_text, activity.assets?.small_text].filter(Boolean).join(' ')
}

function normalizeActivityTitle(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function gameFromActivity(activity: LanyardActivity): Game | null {
  if (activity.type !== 0) return null
  const normalized = normalizeActivityTitle(activityText(activity))
  if (!normalized || nonGameActivities.some((name) => normalized.includes(name))) return null

  const matched = games.find((game) => {
    const title = normalizeActivityTitle(game.title)
    if (normalized.includes(title)) return true
    return game.id === 'arc-raiders' && normalized.includes('raiders')
  })
  if (matched) return matched

  const title = activity.name.trim()
  if (!title || title.length > 80) return null
  return {
    id: `live-${normalizeActivityTitle(title).replace(/\s+/g, '-')}`,
    title,
    status: 'library',
    image: activityImage(activity) ?? null,
    accent: '#f0a24a',
    description: { es: activity.details || activity.state || 'Actividad de juego detectada en Discord.', en: activity.details || activity.state || 'Game activity detected on Discord.' },
    tags: { es: ['En directo', 'Discord'], en: ['Live', 'Discord'] },
    filters: [],
    platform: 'Discord Rich Presence',
    href: '',
  }
}

export function GamesAndGearPage({ content, locale }: { content: SiteCopy; locale: Locale }) {
  const reduceMotion = useReducedMotion()
  const { activities, phase, socketLive } = useLanyardPresence()
  const [filter, setFilter] = useState<GameFilter>('all')
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [hardwareMode, setHardwareMode] = useState<HardwareMode>('current')
  const [activeHardwareId, setActiveHardwareId] = useState<HardwareItem['id']>('gpu')
  const dialogRef = useRef<HTMLElement | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const featuredGames = games.filter((game) => game.status !== 'library')
  const libraryGames = games.filter((game) => game.status === 'library' || game.id === 'arc-raiders')
  const hardwareItems = hardwareMode === 'current' ? hardware : dreamHardware
  const activeHardware = hardwareItems.find((item) => item.id === activeHardwareId) ?? hardwareItems[0]

  const labels = locale === 'es' ? {
    eyebrow: 'Gaming · Hardware · Perfil',
    title: 'Lo que juego.\nLa máquina que lo mueve.',
    intro: 'Una biblioteca personal inspirada en mi perfil de Discord, con los juegos que están en mi rotación, mi favorito y el hardware detectado en este equipo.',
    explore: 'Explorar biblioteca',
    rotation: 'En rotación',
    favorite: 'Juego favorito',
    featuredEyebrow: 'Selección actual',
    featuredTitle: 'Dos en rotación. Uno que dejó huella.',
    featuredIntro: 'Pulsa cualquier portada para abrir su ficha, ver de qué trata y consultar sus etiquetas.',
    libraryEyebrow: 'Biblioteca personal',
    libraryTitle: '20 juegos que forman parte de mi perfil.',
    libraryIntro: 'Filtra por el tipo de experiencia y abre cada portada para descubrir por qué encaja en la colección.',
    filters: {
      all: 'Todos', competitive: 'Competitivo', coop: 'Cooperativo', 'open-world': 'Mundo abierto', story: 'Narrativa', survival: 'Supervivencia', creative: 'Creativo',
    },
    results: 'juegos visibles',
    details: 'Abrir ficha',
    visit: 'Ver página oficial',
    close: 'Cerrar ficha',
    setupEyebrow: 'Hardware · Actual + objetivo',
    setupTitle: 'Equipo actual. Próximo nivel.',
    setupIntro: 'Alterna entre la configuración detectada en este ordenador y un setup objetivo de gama extrema. Son dos inventarios separados y nunca se publican números de serie.',
    currentSetup: 'Equipo actual',
    currentHint: 'Detectado en este ordenador',
    dreamSetup: 'Setup objetivo',
    dreamHint: 'Aspiracional · No adquirido',
    detected: 'Configuración verificada',
    aspirational: 'Objetivo aspiracional · No es el equipo actual',
    currentDisclosure: 'Hardware instalado y detectado localmente. Esta vista representa el equipo que utilizo ahora.',
    dreamDisclosure: 'Configuración de referencia que me gustaría construir. Los componentes se basan en fichas oficiales, pero no forman parte de mi equipo actual.',
    liveEyebrow: 'Discord · Rich Presence',
    liveTitle: 'Jugando ahora',
    liveIntro: 'La actividad pública de Discord aparece aquí en directo con su portada, estado y ficha del juego.',
    idleTitle: 'Ahora mismo no estoy jugando.',
    idleBody: 'Cuando Discord detecte un juego abierto, esta tarjeta se actualizará automáticamente.',
    liveBadge: 'EN DIRECTO',
    connection: 'Conexión Lanyard',
  } : {
    eyebrow: 'Gaming · Hardware · Profile',
    title: 'What I play.\nThe machine behind it.',
    intro: 'A personal library inspired by my Discord profile, with the games in my rotation, my favourite and the hardware detected on this machine.',
    explore: 'Explore library',
    rotation: 'In rotation',
    favorite: 'Favourite game',
    featuredEyebrow: 'Current selection',
    featuredTitle: 'Two in rotation. One that stayed with me.',
    featuredIntro: 'Select any cover to open its profile, understand the game and browse its tags.',
    libraryEyebrow: 'Personal library',
    libraryTitle: '20 games that are part of my profile.',
    libraryIntro: 'Filter by experience and open each cover to see why it belongs in the collection.',
    filters: {
      all: 'All', competitive: 'Competitive', coop: 'Co-op', 'open-world': 'Open world', story: 'Story', survival: 'Survival', creative: 'Creative',
    },
    results: 'games visible',
    details: 'Open details',
    visit: 'View official page',
    close: 'Close details',
    setupEyebrow: 'Hardware · Current + target',
    setupTitle: 'Current machine. Next level.',
    setupIntro: 'Switch between the configuration detected on this computer and an extreme target setup. They are separate inventories and serial numbers are never published.',
    currentSetup: 'Current machine',
    currentHint: 'Detected on this computer',
    dreamSetup: 'Target setup',
    dreamHint: 'Aspirational · Not acquired',
    detected: 'Verified configuration',
    aspirational: 'Aspirational target · Not the current machine',
    currentDisclosure: 'Locally installed and detected hardware. This view represents the machine I use today.',
    dreamDisclosure: 'A reference configuration I would like to build. Components are based on official specifications, but they are not part of my current machine.',
    liveEyebrow: 'Discord · Rich Presence',
    liveTitle: 'Playing now',
    liveIntro: 'Public Discord activity appears here live with the game cover, current state and profile.',
    idleTitle: 'I am not playing right now.',
    idleBody: 'As soon as Discord detects an open game, this card updates automatically.',
    liveBadge: 'LIVE',
    connection: 'Lanyard connection',
  }

  const liveActivity = useMemo(() => activities.find((activity) => gameFromActivity(activity) !== null) ?? null, [activities])
  const liveGame = useMemo(() => liveActivity ? gameFromActivity(liveActivity) : null, [liveActivity])
const connectionLabel = phase === 'ready'
  ? (socketLive ? 'WebSocket live' : 'REST · 15 s')
  : locale === 'es' ? 'Conectando…' : 'Connecting…'

  const filteredGames = useMemo(
    () => filter === 'all' ? libraryGames : libraryGames.filter((game) => game.filters.includes(filter)),
    [filter, libraryGames],
  )

  const openGame = (game: Game) => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setSelectedGame(game)
  }

  const closeGame = () => setSelectedGame(null)

  const selectHardwareMode = (mode: HardwareMode) => {
    const nextItems = mode === 'current' ? hardware : dreamHardware
    setHardwareMode(mode)
    if (!nextItems.some((item) => item.id === activeHardwareId)) {
      setActiveHardwareId(nextItems[0].id)
    }
  }

  const handleHardwareKey = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End']
    if (!keys.includes(event.key)) return
    event.preventDefault()
    const offset = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? hardwareItems.length - 1
        : (index + offset + hardwareItems.length) % hardwareItems.length
    const nextItem = hardwareItems[nextIndex]
    setActiveHardwareId(nextItem.id)
    window.requestAnimationFrame(() => document.getElementById(`hardware-tab-${hardwareMode}-${nextItem.id}`)?.focus())
  }

  useEffect(() => {
    if (!selectedGame) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const dialog = dialogRef.current
    const page = document.querySelector('.games-page')
    const backgroundTargets = [
      document.querySelector<HTMLElement>('.site-header'),
      ...Array.from(page?.children ?? []).filter((element): element is HTMLElement => element instanceof HTMLElement && !element.classList.contains('game-dialog')),
    ].filter((element): element is HTMLElement => element instanceof HTMLElement)
    const inertState = backgroundTargets.map((element) => [element, element.hasAttribute('inert')] as const)
    backgroundTargets.forEach((element) => element.setAttribute('inert', ''))

    const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    const focusTimer = window.setTimeout(() => {
      dialog?.querySelector<HTMLElement>(focusableSelector)?.focus()
    }, 0)

    const handleDialogKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedGame(null)
        return
      }
      if (event.key !== 'Tab' || !dialog) return

      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)).filter((element) => !element.hasAttribute('disabled'))
      if (focusable.length === 0) {
        event.preventDefault()
        dialog.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleDialogKeys)
    return () => {
      window.clearTimeout(focusTimer)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleDialogKeys)
      inertState.forEach(([element, wasInert]) => {
        if (!wasInert) element.removeAttribute('inert')
      })
      previousFocusRef.current?.focus()
    }
  }, [selectedGame])

  const reveal = {
    initial: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-7% 0px' },
    transition: { duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }

  return (
    <div className="games-page">
      <section className="page-hero games-hero">
        <m.div className="page-hero__copy" initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.75, ease: [0.16, 1, 0.3, 1] }}>
          <p className="eyebrow">{labels.eyebrow}</p>
          <h1>{labels.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h1>
          <p>{labels.intro}</p>
        </m.div>

        <m.div className="games-hero__stack" initial={reduceMotion ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.92, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: reduceMotion ? 0 : 0.12, duration: reduceMotion ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }} aria-hidden="true">
          {featuredGames.map((game, index) => (
            <div className={`games-hero__cover games-hero__cover--${index + 1}`} key={game.id}>
              <GameCover game={game} eager />
            </div>
          ))}
          <span className="games-hero__count"><strong>20+</strong>{locale === 'es' ? 'mundos' : 'worlds'}</span>
        </m.div>

        <a className="page-hero__scroll" href="#seleccion"><ArrowDown size={15} aria-hidden="true" />{labels.explore}</a>
      </section>

      <section className="section games-live" id="juego-en-directo">
        <m.div className="section-heading section-heading--split" {...reveal}>
          <div>
            <p className="eyebrow">{labels.liveEyebrow}</p>
            <h2>{labels.liveTitle}</h2>
          </div>
          <p className="section-heading__intro">{labels.liveIntro}</p>
        </m.div>

        <m.article
          className={`game-live-card${liveGame ? ' game-live-card--active' : ''}`}
          style={{ '--game-accent': liveGame?.accent ?? '#f0a24a' } as CSSProperties}
          aria-live="polite"
          {...reveal}
        >
          <header>
            <span><span className="status-dot" aria-hidden="true" />{connectionLabel}</span>
            <span><Radio size={14} aria-hidden="true" />DISCORD / LANYARD</span>
          </header>

          {liveGame && liveActivity ? (
            <div className="game-live-card__content">
              <GameCover game={liveGame} eager />
              <div className="game-live-card__copy">
                <span className="eyebrow"><Activity size={14} aria-hidden="true" />{labels.liveBadge}</span>
                <h3>{liveGame.title}</h3>
                <p>{[liveActivity.details, liveActivity.state].filter(Boolean).join(' · ') || liveGame.description[locale]}</p>
                <span className="game-tags">{liveGame.tags[locale].map((tag) => <i key={tag}>{tag}</i>)}</span>
                <div className="game-live-card__actions">
                  <button type="button" onClick={() => openGame(liveGame)}><Gamepad2 size={16} aria-hidden="true" />{labels.details}</button>
                  {liveGame.href && <a href={liveGame.href} target="_blank" rel="noreferrer"><ArrowUpRight size={16} aria-hidden="true" />{labels.visit}</a>}
                </div>
              </div>
              <aside className="game-live-card__facts">
                <strong>{liveGame.platform}</strong>
                <span>{labels.connection}</span>
                <small>{liveActivity.name}</small>
              </aside>
            </div>
          ) : (
            <div className="game-live-card__idle">
              <span className="game-live-card__icon"><Gamepad2 size={38} aria-hidden="true" /></span>
              <div>
                <h3>{labels.idleTitle}</h3>
                <p>{labels.idleBody}</p>
              </div>
            </div>
          )}
        </m.article>
      </section>

      <section className="section games-featured" id="seleccion">
        <m.div className="section-heading section-heading--split" {...reveal}>
          <div>
            <p className="eyebrow">{labels.featuredEyebrow}</p>
            <h2>{labels.featuredTitle}</h2>
          </div>
          <p className="section-heading__intro">{labels.featuredIntro}</p>
        </m.div>

        <div className="featured-game-grid">
          {featuredGames.map((game, index) => (
            <m.button
              className={`featured-game featured-game--${game.status}`}
              type="button"
              key={game.id}
              onClick={() => openGame(game)}
              initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: reduceMotion ? 0 : index * 0.08, duration: reduceMotion ? 0 : 0.65 }}
              style={{ '--game-accent': game.accent } as CSSProperties}
              aria-label={`${labels.details}: ${game.title}`}
            >
              <GameCover game={game} />
              <span className="featured-game__copy">
                <span className="featured-game__status"><Sparkles size={13} aria-hidden="true" />{game.status === 'favorite' ? labels.favorite : labels.rotation}</span>
                <strong>{game.title}</strong>
                <span>{game.description[locale]}</span>
                <span className="game-tags">{game.tags[locale].map((tag) => <i key={tag}>{tag}</i>)}</span>
              </span>
            </m.button>
          ))}
        </div>
      </section>

      <section className="games-library" id="biblioteca">
        <div className="games-library__inner">
          <m.div className="section-heading section-heading--split" {...reveal}>
            <div>
              <p className="eyebrow">{labels.libraryEyebrow}</p>
              <h2>{labels.libraryTitle}</h2>
            </div>
            <p className="section-heading__intro">{labels.libraryIntro}</p>
          </m.div>

          <div className="game-filters" aria-label={locale === 'es' ? 'Filtros de juegos' : 'Game filters'}>
            <span><SlidersHorizontal size={15} aria-hidden="true" /></span>
            {(Object.keys(labels.filters) as GameFilter[]).map((option) => (
              <button type="button" key={option} className={filter === option ? 'is-active' : ''} onClick={() => setFilter(option)} aria-pressed={filter === option}>
                {labels.filters[option]}
              </button>
            ))}
            <small>{filteredGames.length} {labels.results}</small>
          </div>

          <m.div className="game-grid">
            <AnimatePresence mode="popLayout">
              {filteredGames.map((game) => (
                <m.button
                  className="game-card"
                  type="button"
                  key={game.id}
                  initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: reduceMotion ? 0 : 0.28 }}
                  onClick={() => openGame(game)}
                  style={{ '--game-accent': game.accent } as CSSProperties}
                  aria-label={`${labels.details}: ${game.title}`}
                >
                  <GameCover game={game} />
                  <span className="game-card__copy">
                    <strong>{game.title}</strong>
                    <small>{game.tags[locale].slice(0, 2).join(' · ')}</small>
                  </span>
                </m.button>
              ))}
            </AnimatePresence>
          </m.div>
        </div>
      </section>

      <section className="section setup-section" id="equipo">
        <m.div className="section-heading section-heading--split" {...reveal}>
          <div>
            <p className="eyebrow">{labels.setupEyebrow}</p>
            <h2>{labels.setupTitle}</h2>
          </div>
          <p className="section-heading__intro">{labels.setupIntro}</p>
        </m.div>

        <div className={`setup-mode-switch setup-mode-switch--${hardwareMode}`} role="group" aria-label={locale === 'es' ? 'Seleccionar configuración' : 'Select setup'}>
          <button type="button" aria-pressed={hardwareMode === 'current'} onClick={() => selectHardwareMode('current')}>
            <span aria-hidden="true">01</span>
            <strong>{labels.currentSetup}</strong>
            <small>{labels.currentHint}</small>
          </button>
          <button type="button" aria-pressed={hardwareMode === 'dream'} onClick={() => selectHardwareMode('dream')}>
            <span aria-hidden="true">02</span>
            <strong>{labels.dreamSetup}</strong>
            <small>{labels.dreamHint}</small>
          </button>
        </div>

        <p className={`setup-disclosure setup-disclosure--${hardwareMode}`}>
          <span className="status-dot" aria-hidden="true" />
          {hardwareMode === 'current' ? labels.currentDisclosure : labels.dreamDisclosure}
        </p>

        <div className={`setup-console setup-console--${hardwareMode}`}>
          <div className="setup-console__rail" role="tablist" aria-label={locale === 'es' ? 'Componentes del ordenador' : 'Computer components'}>
            {hardwareItems.map((item, index) => {
              const Icon = hardwareIcons[item.id]
              const selected = item.id === activeHardware.id
              return (
                <button
                  id={`hardware-tab-${hardwareMode}-${item.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="hardware-panel"
                  tabIndex={selected ? 0 : -1}
                  className={selected ? 'is-active' : ''}
                  key={item.id}
                  onClick={() => setActiveHardwareId(item.id)}
                  onKeyDown={(event) => handleHardwareKey(event, index)}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <Icon size={20} aria-hidden="true" />
                  <span><strong>{item.label[locale]}</strong><small>{item.metric}</small></span>
                </button>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            <m.article
              className="setup-console__detail"
              id="hardware-panel"
              role="tabpanel"
              aria-labelledby={`hardware-tab-${hardwareMode}-${activeHardware.id}`}
              aria-live="polite"
              key={`${hardwareMode}-${activeHardware.id}`}
              initial={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -14 }}
              transition={{ duration: reduceMotion ? 0 : 0.32 }}
            >
              <header>
                <span><span className="status-dot" aria-hidden="true" />{hardwareMode === 'current' ? labels.detected : labels.aspirational}</span>
                <strong>{activeHardware.metric}</strong>
              </header>
              <div className="setup-console__icon">
                {(() => {
                  const Icon = hardwareIcons[activeHardware.id]
                  return <Icon size={54} aria-hidden="true" />
                })()}
              </div>
              <p className="eyebrow">{activeHardware.label[locale]}</p>
              <h3>{activeHardware.model}</h3>
              <p>{activeHardware.summary[locale]}</p>
              <ul>
                {activeHardware.details[locale].map((detail) => <li key={detail}>{detail}</li>)}
              </ul>
              {activeHardware.source && (
                <a className="setup-console__source" href={activeHardware.source.href} target="_blank" rel="noreferrer">
                  {activeHardware.source.label[locale]}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              )}
            </m.article>
          </AnimatePresence>
        </div>
      </section>

      <ContactSection content={content} />

      <AnimatePresence>
        {selectedGame && (
          <m.div className="game-dialog" initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }} animate={{ opacity: 1 }} exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }} onClick={closeGame}>
            <m.article
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="game-dialog-title"
              tabIndex={-1}
              initial={reduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 18, scale: 0.97 }}
              transition={{ duration: reduceMotion ? 0 : 0.34, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
              style={{ '--game-accent': selectedGame.accent } as CSSProperties}
            >
              <button className="game-dialog__close" type="button" onClick={closeGame} aria-label={labels.close}><X size={20} /></button>
              <GameCover game={selectedGame} eager />
              <div className="game-dialog__copy">
                <span className="eyebrow"><Gamepad2 size={14} aria-hidden="true" />{selectedGame.platform}</span>
                <h2 id="game-dialog-title">{selectedGame.title}</h2>
                <p>{selectedGame.description[locale]}</p>
                <div className="game-tags">{selectedGame.tags[locale].map((tag) => <i key={tag}>{tag}</i>)}</div>
                <a href={selectedGame.href} target="_blank" rel="noreferrer">{labels.visit}<ArrowUpRight size={16} aria-hidden="true" /></a>
              </div>
            </m.article>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
