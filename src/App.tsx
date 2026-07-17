import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence, useReducedMotion, useScroll, useSpring } from 'motion/react'
import * as m from 'motion/react-m'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AmbientField } from './components/AmbientField'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { EasterEggs } from './components/EasterEggs'
import { copy, type Locale, type SiteCopy } from './content'
import { HomePage } from './pages/HomePage'

const ProfilePage = lazy(() => import('./pages/ProfilePage').then((module) => ({ default: module.ProfilePage })))
const CommunitiesPage = lazy(() => import('./pages/CommunitiesPage').then((module) => ({ default: module.CommunitiesPage })))
const EdgarPonsPage = lazy(() => import('./pages/EdgarPonsPage').then((module) => ({ default: module.EdgarPonsPage })))
const GamesAndGearPage = lazy(() => import('./pages/GamesAndGearPage').then((module) => ({ default: module.GamesAndGearPage })))
const MusicPage = lazy(() => import('./pages/MusicPage').then((module) => ({ default: module.MusicPage })))
const AnimePage = lazy(() => import('./pages/AnimePage').then((module) => ({ default: module.AnimePage })))
const AccountPage = lazy(() => import('./pages/AccountPage').then((module) => ({ default: module.AccountPage })))
const ChatPage = lazy(() => import('./pages/ChatPage').then((module) => ({ default: module.ChatPage })))
const MiniGamesPage = lazy(() => import('./pages/MiniGamesPage').then((module) => ({ default: module.MiniGamesPage })))
const ProjectPage = lazy(() => import('./pages/ProjectPage').then((module) => ({ default: module.ProjectPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })))
const NowPlayingDock = lazy(() => import('./components/NowPlayingDock').then((module) => ({ default: module.NowPlayingDock })))
const AnimeNowDock = lazy(() => import('./components/AnimeNowDock').then((module) => ({ default: module.AnimeNowDock })))

const productionOrigin = 'https://pablo-schefer.vercel.app'

function getSeo(content: SiteCopy, pathname: string) {
  if (pathname === '/') return content.seo.home
  if (pathname === '/perfil') return content.seo.profile
  if (pathname === '/comunidades') return content.seo.communities
  if (pathname === '/comunidades/edgar-pons') return content.seo.edgar
  if (pathname === '/juegos-y-equipo') return content.seo.gamesGear
  if (pathname === '/musica') return content.seo.music
  if (pathname === '/anime') return content.seo.anime
  if (pathname === '/cuenta') return { title: 'Cuenta — Pablo Schefer', description: 'Registro, verificación por correo e inicio de sesión en el portfolio de Pablo Schefer.' }
  if (pathname === '/chat') return { title: 'Chat de la comunidad — Pablo Schefer', description: 'Chat en tiempo real para las cuentas del portfolio de Pablo Schefer.' }
  if (pathname === '/minijuegos') return { title: 'Minijuegos — Pablo Schefer', description: 'Ajedrez online entre cuentas, Snake y memoria dentro del portfolio.' }
  if (pathname === '/proyectos/fnlb') return { title: 'FNLB — Proyecto y comunidad', description: 'Colaboración de Pablo Schefer con el ecosistema FNLB.' }
  if (pathname === '/proyectos/kernelos') return { title: 'KernelOS — Proyecto y comunidad', description: 'Colaboración de Pablo Schefer con KernelOS, su CustomOS y comunidad.' }
  return content.seo.notFound
}

function ScrollManager() {
  const location = useLocation()

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (location.hash) {
        const id = decodeURIComponent(location.hash.slice(1))
        document.getElementById(id)?.scrollIntoView({ block: 'start' })
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      }
    })
    return () => window.cancelAnimationFrame(frame)
  }, [location.hash, location.pathname])

  return null
}

function App() {
  const [locale, setLocale] = useState<Locale>(() => {
    const stored = window.localStorage.getItem('pablo-portfolio-locale')
    return stored === 'en' ? 'en' : 'es'
  })
  const [liveUiReady, setLiveUiReady] = useState(false)
  const content = copy[locale]
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 130, damping: 28, mass: 0.25 })
  const pointerFrame = useRef(0)

  useEffect(() => {
    const timer = window.setTimeout(() => setLiveUiReady(true), 650)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    window.localStorage.setItem('pablo-portfolio-locale', locale)
  }, [locale])

  useEffect(() => {
    const updateDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const coarsePointer = window.matchMedia('(pointer: coarse)').matches
      const narrowViewport = window.matchMedia('(max-width: 820px)').matches
      const platform = /android/.test(userAgent)
        ? 'android'
        : /iphone|ipad|ipod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
          ? 'ios'
          : coarsePointer && narrowViewport
            ? 'mobile'
            : 'desktop'
      const height = window.visualViewport?.height ?? window.innerHeight
      const width = window.visualViewport?.width ?? window.innerWidth
      const resolution = width <= 480
        ? 'compact'
        : width <= 820
          ? 'mobile'
          : width <= 1100
            ? 'tablet'
            : width <= 1920
              ? 'desktop'
              : 'wide'

      document.documentElement.dataset.mobilePlatform = platform
      document.documentElement.dataset.viewport = resolution
      document.documentElement.style.setProperty('--app-height', `${height}px`)
    }

    updateDevice()
    window.addEventListener('resize', updateDevice, { passive: true })
    window.visualViewport?.addEventListener('resize', updateDevice)
    return () => {
      window.removeEventListener('resize', updateDevice)
      window.visualViewport?.removeEventListener('resize', updateDevice)
    }
  }, [])

  useEffect(() => {
    const seo = getSeo(content, location.pathname)
    const canonicalUrl = `${productionOrigin}${location.pathname === '/' ? '/' : location.pathname}`
    document.title = seo.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', seo.description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', seo.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', seo.description)
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalUrl)
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', seo.title)
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', seo.description)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl)
  }, [content, location.pathname])

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      if (pointerFrame.current) return
      const { clientX, clientY } = event
      pointerFrame.current = window.requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--pointer-x', `${clientX}px`)
        document.documentElement.style.setProperty('--pointer-y', `${clientY}px`)
        pointerFrame.current = 0
      })
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.cancelAnimationFrame(pointerFrame.current)
    }
  }, [])

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">{content.common.skipLabel}</a>
      <AmbientField />
      <EasterEggs />
      <div className="pointer-glow" aria-hidden="true" />
      <m.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />
      <SiteHeader content={content} locale={locale} onLocaleChange={setLocale} />
      <ScrollManager />

      <AnimatePresence mode="wait" initial={false}>
        <m.main
          id="main"
          className="route-stage"
          key={location.pathname}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
          transition={{ duration: reduceMotion ? 0 : 0.38, ease: [0.16, 1, 0.3, 1] }}
        >
          <Suspense fallback={<div className="route-loader" role="status" aria-label={locale === 'es' ? 'Cargando página' : 'Loading page'}><span /></div>}>
            <Routes location={location}>
              <Route path="/" element={<HomePage content={content} locale={locale} />} />
              <Route path="/perfil" element={<ProfilePage content={content} locale={locale} />} />
              <Route path="/comunidades" element={<CommunitiesPage content={content} locale={locale} />} />
              <Route path="/comunidades/edgar-pons" element={<EdgarPonsPage content={content} locale={locale} />} />
              <Route path="/juegos-y-equipo" element={<GamesAndGearPage content={content} locale={locale} />} />
              <Route path="/musica" element={<MusicPage content={content} locale={locale} />} />
              <Route path="/anime" element={<AnimePage content={content} locale={locale} />} />
              <Route path="/cuenta" element={<AccountPage locale={locale} />} />
              <Route path="/chat" element={<ChatPage locale={locale} />} />
              <Route path="/minijuegos" element={<MiniGamesPage locale={locale} />} />
              <Route path="/proyectos/fnlb" element={<ProjectPage projectId="fnlb" locale={locale} />} />
              <Route path="/proyectos/kernelos" element={<ProjectPage projectId="kernelos" locale={locale} />} />
              <Route path="*" element={<NotFoundPage content={content} />} />
            </Routes>
          </Suspense>
        </m.main>
      </AnimatePresence>

      {liveUiReady && !['/musica', '/anime'].includes(location.pathname) && (
        <Suspense fallback={null}>
          <NowPlayingDock locale={locale} placement={location.pathname === '/perfil' ? 'top-left' : 'bottom-right'} />
          <AnimeNowDock locale={locale} />
        </Suspense>
      )}
      <SiteFooter content={content} />
    </div>
  )
}

export default App
