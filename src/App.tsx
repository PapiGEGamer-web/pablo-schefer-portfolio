import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AmbientField } from './components/AmbientField'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { NowPlayingDock } from './components/NowPlayingDock'
import { copy, type Locale, type SiteCopy } from './content'
import { CommunitiesPage } from './pages/CommunitiesPage'
import { EdgarPonsPage } from './pages/EdgarPonsPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProfilePage } from './pages/ProfilePage'
import { GamesAndGearPage } from './pages/GamesAndGearPage'
import { MusicPage } from './pages/MusicPage'
import { AnimePage } from './pages/AnimePage'

const productionOrigin = 'https://pablo-schefer.vercel.app'

function getSeo(content: SiteCopy, pathname: string) {
  if (pathname === '/') return content.seo.home
  if (pathname === '/perfil') return content.seo.profile
  if (pathname === '/comunidades') return content.seo.communities
  if (pathname === '/comunidades/edgar-pons') return content.seo.edgar
  if (pathname === '/juegos-y-equipo') return content.seo.gamesGear
  if (pathname === '/musica') return content.seo.music
  if (pathname === '/anime') return content.seo.anime
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
  const content = copy[locale]
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 130, damping: 28, mass: 0.25 })

  useEffect(() => {
    document.documentElement.lang = locale
    window.localStorage.setItem('pablo-portfolio-locale', locale)
  }, [locale])

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
      document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`)
      document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`)
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [])

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">{content.common.skipLabel}</a>
      <AmbientField />
      <div className="pointer-glow" aria-hidden="true" />
      <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />
      <SiteHeader content={content} locale={locale} onLocaleChange={setLocale} />
      <ScrollManager />

      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          id="main"
          className="route-stage"
          key={location.pathname}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
          transition={{ duration: reduceMotion ? 0 : 0.38, ease: [0.16, 1, 0.3, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage content={content} locale={locale} />} />
            <Route path="/perfil" element={<ProfilePage content={content} locale={locale} />} />
            <Route path="/comunidades" element={<CommunitiesPage content={content} locale={locale} />} />
            <Route path="/comunidades/edgar-pons" element={<EdgarPonsPage content={content} locale={locale} />} />
            <Route path="/juegos-y-equipo" element={<GamesAndGearPage content={content} locale={locale} />} />
            <Route path="/musica" element={<MusicPage content={content} locale={locale} />} />
            <Route path="/anime" element={<AnimePage content={content} locale={locale} />} />
            <Route path="*" element={<NotFoundPage content={content} />} />
          </Routes>
        </motion.main>
      </AnimatePresence>

      {location.pathname === '/' && <NowPlayingDock locale={locale} />}
      <SiteFooter content={content} />
    </div>
  )
}

export default App
