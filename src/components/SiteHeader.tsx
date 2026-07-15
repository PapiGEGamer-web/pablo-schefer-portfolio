import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, Gamepad2, Menu, Music2, Radio, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import type { Locale, SiteCopy } from '../content'

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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
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
          <span className="brand__mark">P</span>
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
                <motion.div
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
                </motion.div>
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
                <motion.div
                  className="nav-dropdown__menu"
                  role="menu"
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                >
                  <Link to="/#fnlb" role="menuitem" onClick={closeNavigation}><span>{content.nav.fnlb}</span><small>{locale === 'es' ? 'Comunidad' : 'Community'}</small></Link>
                  <Link to="/#kernelos" role="menuitem" onClick={closeNavigation}><span>{content.nav.kernelos}</span><small>CustomOS</small></Link>
                </motion.div>
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
                <motion.div
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="header-actions">
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
                <motion.div
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
                </motion.div>
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
          <motion.nav
            className="mobile-menu"
            aria-label={content.common.mobileNavigationLabel}
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            <NavLink to="/" end onClick={closeNavigation}><span>01</span>{content.nav.home}</NavLink>
            <NavLink to="/perfil" onClick={closeNavigation}><span>02</span>{content.nav.profile}</NavLink>

            <div className="mobile-menu__group">
              <button type="button" aria-expanded={mobileGroup === 'communities'} onClick={() => toggleMobileGroup('communities')}>
                <span>03</span>{content.nav.communities}<ChevronDown size={20} aria-hidden="true" />
              </button>
              <AnimatePresence initial={false}>
                {mobileGroup === 'communities' && (
                  <motion.div className="mobile-menu__submenu" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <Link to="/comunidades" onClick={closeNavigation}>{content.nav.allCommunities}</Link>
                    <Link to="/comunidades/edgar-pons" onClick={closeNavigation}>{content.nav.edgarLive}</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mobile-menu__group">
              <button type="button" aria-expanded={mobileGroup === 'projects'} onClick={() => toggleMobileGroup('projects')}>
                <span>04</span>{content.nav.projects}<ChevronDown size={20} aria-hidden="true" />
              </button>
              <AnimatePresence initial={false}>
                {mobileGroup === 'projects' && (
                  <motion.div className="mobile-menu__submenu" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <Link to="/#fnlb" onClick={closeNavigation}>{content.nav.fnlb}</Link>
                    <Link to="/#kernelos" onClick={closeNavigation}>{content.nav.kernelos}</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mobile-menu__group">
              <button type="button" aria-expanded={mobileGroup === 'personal'} onClick={() => toggleMobileGroup('personal')}>
                <span>05</span>{content.nav.personal}<ChevronDown size={20} aria-hidden="true" />
              </button>
              <AnimatePresence initial={false}>
                {mobileGroup === 'personal' && (
                  <motion.div className="mobile-menu__submenu" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <Link to="/juegos-y-equipo" onClick={closeNavigation}>{content.nav.gamesGear}</Link>
                    <Link to="/musica" onClick={closeNavigation}>{content.nav.music}</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
