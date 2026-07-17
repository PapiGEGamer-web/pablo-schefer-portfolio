import { Chess, type Square } from 'chess.js'
import { ArrowUpRight, Bot, Crown, Gamepad2, LogIn, RefreshCw, Swords, Trophy } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { Locale } from '../content'
import { useAuth } from '../contexts/AuthContext'
import { accountName } from '../lib/community'
import { getSupabase } from '../lib/supabase'
import './MiniGamesPage.css'

type MiniGameTab = 'chess' | 'snake' | 'memory'

type ChessGame = {
  id: string
  white_id: string
  black_id: string | null
  white_name: string
  black_name: string | null
  fen: string
  pgn: string
  turn: 'w' | 'b'
  status: 'waiting' | 'active' | 'finished'
  winner_id: string | null
  result: 'white' | 'black' | 'draw' | 'resigned' | null
  last_move: string | null
  created_at: string
  updated_at: string
}

const pieceGlyph: Record<string, string> = {
  wp: '♙', wn: '♘', wb: '♗', wr: '♖', wq: '♕', wk: '♔',
  bp: '♟', bn: '♞', bb: '♝', br: '♜', bq: '♛', bk: '♚',
}

function normalizeRpcGame(value: unknown): ChessGame | null {
  const record = Array.isArray(value) ? value[0] : value
  return record && typeof record === 'object' ? record as ChessGame : null
}

function ChessArena({ locale }: { locale: Locale }) {
  const auth = useAuth()
  const [games, setGames] = useState<ChessGame[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selected, setSelected] = useState<Square | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const username = useMemo(() => accountName(auth.user), [auth.user])
  const labels = locale === 'es' ? {
    title: 'Ajedrez online',
    intro: 'Crea una mesa o entra en una partida abierta. Los movimientos se sincronizan en directo entre dos cuentas.',
    create: 'Crear partida',
    open: 'Mesas abiertas',
    your: 'Tus partidas',
    join: 'Unirse',
    waiting: 'Esperando rival',
    turn: 'Tu turno',
    rival: 'Turno del rival',
    ended: 'Partida terminada',
    resign: 'Rendirse',
    back: 'Volver al lobby',
    login: 'Necesitas una cuenta para jugar online.',
    loginCta: 'Iniciar sesión',
    empty: 'No hay mesas abiertas. Crea la primera.',
    white: 'Blancas',
    black: 'Negras',
    won: 'Has ganado',
    lost: 'Ha ganado tu rival',
    draw: 'Tablas',
    error: 'No se ha podido sincronizar la partida.',
  } : {
    title: 'Online chess',
    intro: 'Create a table or join an open game. Moves sync live between two accounts.',
    create: 'Create game',
    open: 'Open tables',
    your: 'Your games',
    join: 'Join',
    waiting: 'Waiting for opponent',
    turn: 'Your turn',
    rival: "Opponent's turn",
    ended: 'Game finished',
    resign: 'Resign',
    back: 'Back to lobby',
    login: 'You need an account to play online.',
    loginCta: 'Sign in',
    empty: 'No open tables. Create the first one.',
    white: 'White',
    black: 'Black',
    won: 'You won',
    lost: 'Your opponent won',
    draw: 'Draw',
    error: 'The game could not sync.',
  }

  const refresh = useCallback(async () => {
    if (!auth.user) return
    const client = await getSupabase()
    if (!client) return
    const { data, error: queryError } = await client
      .from('chess_games')
      .select('*')
      .in('status', ['waiting', 'active', 'finished'])
      .order('updated_at', { ascending: false })
      .limit(40)
    if (queryError) setError(labels.error)
    else {
      setGames((data ?? []) as ChessGame[])
      setSelected(null)
      setError('')
    }
  }, [auth.user, labels.error])

  useEffect(() => {
    if (!auth.user) return undefined
    let channel: { unsubscribe: () => Promise<unknown> } | undefined
    let disposed = false
    void getSupabase().then((client) => {
      if (!client || disposed) return
      void refresh()
      channel = client
        .channel('portfolio-chess-games')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'chess_games' }, () => { void refresh() })
        .subscribe()
    })
    return () => {
      disposed = true
      if (channel) void channel.unsubscribe()
    }
  }, [auth.user, refresh])

  const createGame = async () => {
    if (!auth.user || busy) return
    setBusy(true)
    const client = await getSupabase()
    const { data, error: rpcError } = client
      ? await client.rpc('create_chess_game', { player_name: username })
      : { data: null, error: new Error('not_configured') }
    const created = normalizeRpcGame(data)
    if (rpcError || !created) setError(labels.error)
    else {
      setActiveId(created.id)
      await refresh()
    }
    setBusy(false)
  }

  const joinGame = async (gameId: string) => {
    if (!auth.user || busy) return
    setBusy(true)
    const client = await getSupabase()
    const { data, error: rpcError } = client
      ? await client.rpc('join_chess_game', { game_id: gameId, player_name: username })
      : { data: null, error: new Error('not_configured') }
    const joined = normalizeRpcGame(data)
    if (rpcError || !joined) setError(labels.error)
    else {
      setActiveId(joined.id)
      await refresh()
    }
    setBusy(false)
  }

  const active = games.find((game) => game.id === activeId) ?? null
  const chess = useMemo(() => new Chess(active?.fen), [active?.fen])
  const myColor = active && auth.user
    ? active.white_id === auth.user.id ? 'w' : active.black_id === auth.user.id ? 'b' : null
    : null
  const legalTargets = useMemo(() => {
    if (!selected) return new Set<string>()
    return new Set(chess.moves({ square: selected, verbose: true }).map((move) => move.to))
  }, [chess, selected])

  const movePiece = async (from: Square, to: Square) => {
    if (!active || !auth.user || !myColor || busy) return
    const next = new Chess(active.fen)
    let moved
    try {
      moved = next.move({ from, to, promotion: 'q' })
    } catch {
      return
    }
    if (!moved) return
    const result = next.isCheckmate()
      ? (myColor === 'w' ? 'white' : 'black')
      : next.isDraw()
        ? 'draw'
        : null
    setBusy(true)
    const client = await getSupabase()
    const { error: rpcError } = client
      ? await client.rpc('play_chess_move', {
        game_id: active.id,
        previous_fen: active.fen,
        next_fen: next.fen(),
        next_pgn: next.pgn(),
        next_turn: next.turn(),
        move_uci: `${moved.from}${moved.to}${moved.promotion ?? ''}`,
        game_result: result,
      })
      : { error: new Error('not_configured') }
    if (rpcError) setError(labels.error)
    await refresh()
    setBusy(false)
  }

  const selectSquare = (square: Square) => {
    if (!active || active.status !== 'active' || !myColor || active.turn !== myColor || busy) return
    const piece = chess.get(square)
    if (selected && legalTargets.has(square)) {
      void movePiece(selected, square)
      setSelected(null)
      return
    }
    setSelected(piece?.color === myColor ? square : null)
  }

  const resign = async () => {
    if (!active || busy) return
    setBusy(true)
    const client = await getSupabase()
    const { error: rpcError } = client
      ? await client.rpc('resign_chess_game', { game_id: active.id })
      : { error: new Error('not_configured') }
    if (rpcError) setError(labels.error)
    await refresh()
    setBusy(false)
  }

  if (!auth.user) {
    return (
      <div className="chess-login">
        <LogIn size={34} aria-hidden="true" />
        <p>{labels.login}</p>
        <Link to="/cuenta">{labels.loginCta}<ArrowUpRight size={14} aria-hidden="true" /></Link>
      </div>
    )
  }

  if (active) {
    const files = myColor === 'b' ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    const ranks = myColor === 'b' ? ['1', '2', '3', '4', '5', '6', '7', '8'] : ['8', '7', '6', '5', '4', '3', '2', '1']
    const resultLabel = active.result === 'draw'
      ? labels.draw
      : active.status === 'finished'
        ? active.winner_id === auth.user.id ? labels.won : labels.lost
        : null
    return (
      <div className="chess-match">
        <header>
          <button type="button" onClick={() => setActiveId(null)}>{labels.back}</button>
          <span className={`chess-match__status chess-match__status--${active.status}`}>
            {resultLabel ?? (active.status === 'waiting' ? labels.waiting : active.turn === myColor ? labels.turn : labels.rival)}
          </span>
        </header>
        <div className="chess-match__layout">
          <div className="chess-board" role="grid" aria-label={labels.title}>
            {ranks.flatMap((rank) => files.map((file) => {
              const square = `${file}${rank}` as Square
              const piece = chess.get(square)
              const isLight = (file.charCodeAt(0) + Number(rank)) % 2 === 1
              return (
                <button
                  type="button"
                  role="gridcell"
                  className={`${isLight ? 'is-light' : 'is-dark'}${selected === square ? ' is-selected' : ''}${legalTargets.has(square) ? ' is-target' : ''}`}
                  key={square}
                  onClick={() => selectSquare(square)}
                  aria-label={`${square}${piece ? ` ${piece.type}` : ''}`}
                >
                  {piece && <span className={`piece piece--${piece.color}`}>{pieceGlyph[`${piece.color}${piece.type}`]}</span>}
                  {legalTargets.has(square) && <i aria-hidden="true" />}
                </button>
              )
            }))}
          </div>
          <aside className="chess-match__panel">
            <article className={myColor === 'b' ? 'is-you' : ''}><span><Crown size={16} />{labels.black}</span><strong>{active.black_name ?? labels.waiting}</strong></article>
            <div className="chess-match__versus"><Swords size={20} /><span>{active.status === 'active' ? 'LIVE' : active.status.toUpperCase()}</span></div>
            <article className={myColor === 'w' ? 'is-you' : ''}><span><Crown size={16} />{labels.white}</span><strong>{active.white_name}</strong></article>
            {active.pgn && <pre>{active.pgn}</pre>}
            {active.status === 'active' && <button className="chess-match__resign" type="button" onClick={() => void resign()} disabled={busy}>{labels.resign}</button>}
          </aside>
        </div>
      </div>
    )
  }

  const openGames = games.filter((game) => game.status === 'waiting' && game.white_id !== auth.user?.id)
  const myGames = games.filter((game) => game.white_id === auth.user?.id || game.black_id === auth.user?.id).slice(0, 8)

  return (
    <div className="chess-lobby">
      <header><div><h2>{labels.title}</h2><p>{labels.intro}</p></div><button type="button" onClick={() => void createGame()} disabled={busy}><Crown size={17} />{labels.create}</button></header>
      {error && <p className="minigames-error">{error}</p>}
      <div className="chess-lobby__columns">
        <section><h3>{labels.open}</h3>{openGames.length === 0 && <p className="chess-lobby__empty">{labels.empty}</p>}{openGames.map((game) => <article key={game.id}><span><strong>{game.white_name}</strong><small>{labels.waiting}</small></span><button type="button" onClick={() => void joinGame(game.id)} disabled={busy}>{labels.join}</button></article>)}</section>
        <section><h3>{labels.your}</h3>{myGames.map((game) => <button className="chess-game-row" type="button" key={game.id} onClick={() => setActiveId(game.id)}><span>{game.white_name} <i>vs</i> {game.black_name ?? '…'}</span><small>{game.status === 'waiting' ? labels.waiting : game.status === 'active' ? 'LIVE' : labels.ended}</small></button>)}</section>
      </div>
    </div>
  )
}

type Point = { x: number; y: number }
const snakeSize = 18
const initialSnake: Point[] = [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }]

function SnakeGame({ locale }: { locale: Locale }) {
  const [snake, setSnake] = useState<Point[]>(initialSnake)
  const [food, setFood] = useState<Point>({ x: 13, y: 9 })
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState(0)
  const directionRef = useRef<Point>({ x: 1, y: 0 })
  const labels = locale === 'es' ? { title: 'Snake', play: running ? 'En marcha' : 'Jugar', restart: 'Reiniciar', score: 'Puntuación', hint: 'Flechas, WASD o controles táctiles' } : { title: 'Snake', play: running ? 'Running' : 'Play', restart: 'Restart', score: 'Score', hint: 'Arrow keys, WASD or touch controls' }

  const reset = useCallback(() => {
    setSnake(initialSnake)
    setFood({ x: 13, y: 9 })
    directionRef.current = { x: 1, y: 0 }
    setScore(0)
    setRunning(true)
  }, [])

  const changeDirection = useCallback((next: Point) => {
    const current = directionRef.current
    if (next.x + current.x === 0 && next.y + current.y === 0) return
    directionRef.current = next
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const directions: Record<string, Point> = {
        ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 },
      }
      const next = directions[event.key]
      if (next) {
        event.preventDefault()
        changeDirection(next)
        setRunning(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [changeDirection])

  useEffect(() => {
    if (!running) return undefined
    const timer = window.setInterval(() => {
      setSnake((current) => {
        const head = current[0]
        const next = { x: head.x + directionRef.current.x, y: head.y + directionRef.current.y }
        const crashed = next.x < 0 || next.x >= snakeSize || next.y < 0 || next.y >= snakeSize || current.some((part) => part.x === next.x && part.y === next.y)
        if (crashed) {
          setRunning(false)
          return current
        }
        const ate = next.x === food.x && next.y === food.y
        if (ate) {
          setScore((value) => value + 1)
          let nextFood = { x: Math.floor(Math.random() * snakeSize), y: Math.floor(Math.random() * snakeSize) }
          while (current.some((part) => part.x === nextFood.x && part.y === nextFood.y)) nextFood = { x: Math.floor(Math.random() * snakeSize), y: Math.floor(Math.random() * snakeSize) }
          setFood(nextFood)
        }
        return [next, ...current].slice(0, ate ? current.length + 1 : current.length)
      })
    }, 125)
    return () => window.clearInterval(timer)
  }, [food.x, food.y, running])

  return (
    <div className="snake-game">
      <header><div><h2>{labels.title}</h2><p>{labels.hint}</p></div><strong>{labels.score} · {score.toString().padStart(2, '0')}</strong></header>
      <div className="snake-board" style={{ '--snake-size': snakeSize } as CSSProperties}>
        {Array.from({ length: snakeSize * snakeSize }, (_, index) => {
          const x = index % snakeSize
          const y = Math.floor(index / snakeSize)
          const snakeIndex = snake.findIndex((part) => part.x === x && part.y === y)
          const isFood = food.x === x && food.y === y
          return <span className={`${snakeIndex === 0 ? 'is-head' : snakeIndex > 0 ? 'is-snake' : ''}${isFood ? ' is-food' : ''}`} key={index} />
        })}
      </div>
      <div className="snake-controls">
        <button type="button" onClick={() => changeDirection({ x: 0, y: -1 })}>↑</button>
        <button type="button" onClick={() => changeDirection({ x: -1, y: 0 })}>←</button>
        <button type="button" onClick={() => changeDirection({ x: 0, y: 1 })}>↓</button>
        <button type="button" onClick={() => changeDirection({ x: 1, y: 0 })}>→</button>
        <button type="button" className="snake-controls__main" onClick={running ? () => setRunning(false) : reset}>{score > 0 || snake[0].x !== 8 ? labels.restart : labels.play}</button>
      </div>
    </div>
  )
}

const memorySymbols = ['✦', '◈', '△', '●', '⌁', '✺']
function shuffledCards() { return [...memorySymbols, ...memorySymbols].map((symbol, index) => ({ id: `${symbol}-${index}`, symbol })).sort(() => Math.random() - 0.5) }

function MemoryGame({ locale }: { locale: Locale }) {
  const [cards, setCards] = useState(shuffledCards)
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [moves, setMoves] = useState(0)
  const labels = locale === 'es' ? { title: 'Memoria orbital', moves: 'Movimientos', reset: 'Nueva partida', done: 'Completado' } : { title: 'Orbital memory', moves: 'Moves', reset: 'New game', done: 'Complete' }

  useEffect(() => {
    if (flipped.length !== 2) return undefined
    const [first, second] = flipped
    const timer = window.setTimeout(() => {
      if (cards[first].symbol === cards[second].symbol) setMatched((current) => new Set(current).add(cards[first].symbol))
      setFlipped([])
    }, 520)
    return () => window.clearTimeout(timer)
  }, [cards, flipped])

  const flip = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.has(cards[index].symbol)) return
    setFlipped((current) => [...current, index])
    if (flipped.length === 1) setMoves((value) => value + 1)
  }
  const reset = () => { setCards(shuffledCards()); setFlipped([]); setMatched(new Set()); setMoves(0) }
  return (
    <div className="memory-game">
      <header><div><h2>{labels.title}</h2><p>{matched.size === memorySymbols.length ? labels.done : `${labels.moves} · ${moves}`}</p></div><button type="button" onClick={reset}><RefreshCw size={15} />{labels.reset}</button></header>
      <div className="memory-grid">
        {cards.map((card, index) => {
          const shown = flipped.includes(index) || matched.has(card.symbol)
          return <button type="button" className={shown ? 'is-shown' : ''} key={card.id} onClick={() => flip(index)} aria-label={shown ? card.symbol : '?'}><span>?</span><strong>{card.symbol}</strong></button>
        })}
      </div>
    </div>
  )
}

export function MiniGamesPage({ locale }: { locale: Locale }) {
  const [tab, setTab] = useState<MiniGameTab>('chess')
  const labels = locale === 'es' ? {
    eyebrow: 'Juegos · Cuentas · Tiempo real',
    title: 'Un pequeño arcade dentro del portfolio.',
    intro: 'Ajedrez entre cuentas, Snake y memoria. El ajedrez usa partidas sincronizadas; los otros juegos se ejecutan al instante en tu dispositivo.',
    chess: 'Ajedrez online',
    snake: 'Snake',
    memory: 'Memoria',
  } : {
    eyebrow: 'Games · Accounts · Real time',
    title: 'A small arcade inside the portfolio.',
    intro: 'Account-to-account chess, Snake and memory. Chess uses synced matches; the other games run instantly on your device.',
    chess: 'Online chess',
    snake: 'Snake',
    memory: 'Memory',
  }
  const tabs: { id: MiniGameTab; label: string; Icon: typeof Crown }[] = [
    { id: 'chess', label: labels.chess, Icon: Crown },
    { id: 'snake', label: labels.snake, Icon: Gamepad2 },
    { id: 'memory', label: labels.memory, Icon: Bot },
  ]
  return (
    <div className="minigames-page">
      <section className="page-hero minigames-hero">
        <div className="page-hero__copy"><p className="eyebrow">{labels.eyebrow}</p><h1>{labels.title}</h1><p>{labels.intro}</p></div>
        <div className="minigames-hero__trophy" aria-hidden="true"><Trophy size={72} /><span>03</span></div>
      </section>
      <section className="section minigames-console">
        <nav aria-label={locale === 'es' ? 'Seleccionar minijuego' : 'Select minigame'}>
          {tabs.map(({ id, label, Icon }) => <button type="button" className={tab === id ? 'is-active' : ''} aria-pressed={tab === id} onClick={() => setTab(id)} key={id}><Icon size={17} />{label}</button>)}
        </nav>
        <div className="minigames-stage">
          {tab === 'chess' && <ChessArena locale={locale} />}
          {tab === 'snake' && <SnakeGame locale={locale} />}
          {tab === 'memory' && <MemoryGame locale={locale} />}
        </div>
      </section>
    </div>
  )
}
