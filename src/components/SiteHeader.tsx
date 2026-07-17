import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { Atom, ChevronDown, Gamepad2, Menu, Music2, Radio, Tv, UserRound, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import type { Locale, SiteCopy } from '../content'
import { useAuth } from '../contexts/AuthContext'

type SiteHeaderProps = {
  content: SiteCopy
  locale: Locale
  onLocaleChange: (locale: Locale) => void
}

type DropdownId = 'communities' | 'projects' | 'personal' | null

export function SiteHeader({ content, locale, onLocaleChange }: SiteHeaderProps) {
  const [dropdown, setDropdown] = useState<DropdownId>(null)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileGroup, setMobileGroup] = useState<DropdownId>(null)
  const headerRef = useRef<HTMLElement>(null)
  const auth = useAuth()

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    document.body.classList.toggle('mobile-nav-open', menuOpen)
    return () => {
      document.body.style.overflow = ''
      document.body.classList.remove('mobile-nav-open')
    }
  }, [menuOpen])

  useEffect(() => {
    const closeMenus = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setDropdown(null)
        setLanguageOpen(false)
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdown(null)
        setLanguageOpen(false)
        setMenuOpen(false)
      }
    }
    document.addEventListener('pointerdown', closeMenus)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeMenus)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  const toggleDropdown = (id: Exclude<DropdownId, null>) => {
    setLanguageOpen(false)
    setDropdown((active) => (active === id ? null : id))
  }

  const toggleMobileGroup = (id: Exclude<DropdownId, null>) => {
    setMobileGroup((active) => (active === id ? null : id))
  }

  const closeNavigation = () => {
    setDropdown(null)
    setLanguageOpen(false)
    setMenuOpen(false)
    setMobileGroup(null)
  }

  return (
    <>
      <header className="site-header" ref={headerRef}>
        <Link className="brand" to="/" aria-label={content.common.homeLabel} onClick={closeNavigation}>
          <span className="brand__mark" aria-hidden="true">
            <img src="/media/profile/pablo-schefer-avatar.webp" alt="" width="64" height="64" />
          </span>
          <span className="brand__name">Pablo Schefer</span>
        </Link>

        <nav className="desktop-nav" aria-label={content.common.navigationLabel}>
          <NavLink to="/" end onClick={closeNavigation}>{content.nav.home}</NavLink>
          <NavLink to="/perfil" onClick={closeNavigation}>{content.nav.profile}</NavLink>

          <div className="nav-dropdown">
            <button
              type="button"
              aria-expanded={dropdown === 'communities'}
              aria-haspopup="menu"
              onClick={() => toggleDropdown('communities')}
            >
              {content.nav.communities}
              <ChevronDown size={13} aria-hidden="true" />
            </button>
            <AnimatePresence>
              {dropdown === 'communities' && (
                <m.div
                  className="nav-dropdown__menu"
                  role="menu"
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                >
                  <Link to="/comunidades" role="menuitem" onClick={closeNavigation}>
                    <span>{content.nav.allCommunities}</span>
                    <small>01</small>
                  </Link>
                  <Link to="/comunidades/edgar-pons" role="menuitem" onClick={closeNavigation}>
                    <span>{content.nav.edgarLive}</span>
                    <small className="nav-live"><Radio size={11} aria-hidden="true" /> Live</small>
                  </Link>
                </m.div>
              )}
            </AnimatePresence>
          </div>

          <div className="nav-dropdown">
            <button
              type="button"
              aria-expanded={dropdown === 'projects'}
              aria-haspopup="menu"
              onClick={() => toggleDropdown('projects')}
            >
              {content.nav.projects}
              <ChevronDown size={13} aria-hidden="true" />
            </button>
            <AnimatePresence>
              {dropdown === 'projects' && (
                <m.div
                  className="nav-dropdown__menu"
                  role="menu"
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                >
                  <Link to="/proyectos/fnlb" role="menuitem" onClick={closeNavigation}><span>{content.nav.fnlb}</span><small>{locale === 'es' ? 'Proyecto · Comunidad' : 'Project · Community'}</small></Link>
                  <Link to="/proyectos/kernelos" role="menuitem" onClick={closeNavigation}><span>{content.nav.kernelos}</span><small>{locale === 'es' ? 'Comunidad · CustomOS' : 'Community · Custom OS'}</small></Link>
                </m.div>
              )}
            </AnimatePresence>
          </div>

          <div className="nav-dropdown">
            <button
              type="button"
              aria-expanded={dropdown === 'personal'}
              aria-haspopup="menu"
              onClick={() => toggleDropdown('personal')}
            >
              {content.nav.personal}
              <ChevronDown size={13} aria-hidden="true" />
            </button>
            <AnimatePresence>
              {dropdown === 'personal' && (
                <m.div
                  className="nav-dropdown__menu"
                  role="menu"
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                >
                  <Link to="/juegos-y-equipo" role="menuitem" onClick={closeNavigation}>
                    <span>{content.nav.gamesGear}</span>
                    <small><Gamepad2 size={11} aria-hidden="true" /> 20+</small>
                  </Link>
                  <Link to="/musica" role="menuitem" onClick={closeNavigation}>
                    <span>{content.nav.music}</span>
                    <small className="nav-live"><Music2 size={11} aria-hidden="true" /> Ready</small>
                  </Link>
                  <Link to="/anime" role="menuitem" onClick={closeNavigation}>
                    <span>{content.nav.anime}</span>
                    <small className="nav-live"><Tv size={11} aria-hidden="true" /> Lanyard</small>
                  </Link>
                  <Link to="/experimentos" role="menuitem" onClick={closeNavigation}>
                    <span>{content.nav.experiments}</span>
                    <small><Atom size={11} aria-hidden="true" /> Lab</small>
                  </Link>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="header-actions">
          <Link className={`account-trigger${auth.user ? ' is-authenticated' : ''}`} to="/cuenta" onClick={closeNavigation} aria-label={locale === 'es' ? 'Cuenta e inicio de sesión' : 'Account and sign in'}>
            <UserRound size={17} aria-hidden="true" />
            {auth.user && <span aria-hidden="true" />}
          </Link>
          <div className="language-picker">
            <button
              className="language-picker__trigger"
              type="button"
              aria-expanded={languageOpen}
              aria-haspopup="listbox"
              onClick={() => {
                setDropdown(null)
                setLanguageOpen((open) => !open)
              }}
            >
              {locale.toUpperCase()}
              <ChevronDown size={14} aria-hidden="true" />
              <span className="sr-only">{content.common.language}</span>
            </button>
            <AnimatePresence>
              {languageOpen && (
                <m.div
                  className="language-picker__menu"
                  role="listbox"
                  aria-label={content.common.language}
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                >
                  {(['es', 'en'] as Locale[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      role="option"
                      aria-selected={locale === option}
                      onClick={() => {
                        onLocaleChange(option)
                        setLanguageOpen(false)
                      }}
                    >
                      <span>{option === 'es' ? 'Español' : 'English'}</span>
                      <span>{option.toUpperCase()}</span>
                    </button>
                  ))}
                </m.div>
              )}
            </AnimatePresence>
          </div>

          <button
            className="menu-trigger"
            type="button"
            aria-label={menuOpen ? content.common.close : content.common.menu}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <m.nav
            className="mobile-menu"
            aria-label={content.common.mobileNavigationLabel}
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            <NavLink to="/" end onClick={closeNavigation}><span>01</span>{content.nav.home}</NavLink>
            <NavLink to="/perfil" onClick={closeNavigation}><span>02</span>{content.nav.profile}</NavLink>
            <NavLink to="/cuenta" onClick={closeNavigation}><span>•</span>{locale === 'es' ? 'Cuenta' : 'Account'}</NavLink>

            <div className="mobile-menu__group">
              <button type="button" aria-expanded={mobileGroup === 'communities'} onClick={() => toggleMobileGroup('communities')}>
                <span>03</span>{content.nav.communities}<ChevronDown size={20} aria-hidden="true" />
              </button>
              <AnimatePresence initial={false}>
                {mobileGroup === 'communities' && (
                  <m.div className="mobile-menu__submenu" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <Link to="/comunidades" onClick={closeNavigation}>{content.nav.allCommunities}</Link>
                    <Link to="/comunidades/edgar-pons" onClick={closeNavigation}>{content.nav.edgarLive}</Link>
                  </m.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mobile-menu__group">
              <button type="button" aria-expanded={mobileGroup === 'projects'} onClick={() => toggleMobileGroup('projects')}>
                <span>04</span>{content.nav.projects}<ChevronDown size={20} aria-hidden="true" />
              </button>
              <AnimatePresence initial={false}>
                {mobileGroup === 'projects' && (
                  <m.div className="mobile-menu__submenu" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <Link to="/proyectos/fnlb" onClick={closeNavigation}>{content.nav.fnlb}</Link>
                    <Link to="/proyectos/kernelos" onClick={closeNavigation}>{content.nav.kernelos}</Link>
                  </m.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mobile-menu__group">
              <button type="button" aria-expanded={mobileGroup === 'personal'} onClick={() => toggleMobileGroup('personal')}>
                <span>05</span>{content.nav.personal}<ChevronDown size={20} aria-hidden="true" />
              </button>
              <AnimatePresence initial={false}>
                {mobileGroup === 'personal' && (
                  <m.div className="mobile-menu__submenu" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <Link to="/juegos-y-equipo" onClick={closeNavigation}>{content.nav.gamesGear}</Link>
                    <Link to="/musica" onClick={closeNavigation}>{content.nav.music}</Link>
                    <Link to="/anime" onClick={closeNavigation}>{content.nav.anime}</Link>
                    <Link to="/experimentos" onClick={closeNavigation}>{content.nav.experiments}</Link>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </m.nav>
        )}
      </AnimatePresence>
    </>
  )
}
