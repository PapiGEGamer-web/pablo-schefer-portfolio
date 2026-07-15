import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { ArrowDown, ArrowUpRight, AtSign, ChevronDown, Menu, X } from 'lucide-react'
import { AmbientField } from './components/AmbientField'
import { MagneticLink } from './components/MagneticLink'
import { Monogram } from './components/Monogram'
import { copy, type Locale } from './content'

const githubUrl = 'https://github.com/PapiGEGamer-web'
const discordProfileUrl = 'https://discord.com/users/633600812970541056'
const socialLinks = [
  { label: 'Discord', href: discordProfileUrl },
  { label: 'GitHub', href: githubUrl },
  { label: 'X', href: 'https://x.com/PapiGEGamer' },
  { label: 'Instagram', href: 'https://www.instagram.com/papigegamer/' },
  { label: 'YouTube', href: 'https://www.youtube.com/channel/UCcprFWZcz0g9xUtHL5TDERg' },
]

function App() {
  const [locale, setLocale] = useState<Locale>('es')
  const [languageOpen, setLanguageOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const content = copy[locale]
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 130, damping: 28, mass: 0.25 })

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    document.title = content.seoTitle
    document.querySelector('meta[name="description"]')?.setAttribute('content', content.seoDescription)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', content.seoTitle)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', content.seoDescription)
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', content.seoTitle)
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', content.seoDescription)
  }, [content.seoDescription, content.seoTitle])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`)
      document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`)
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [])

  const reveal = {
    initial: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-8% 0px' },
    transition: { duration: reduceMotion ? 0 : 0.75, ease: [0.16, 1, 0.3, 1] as const },
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">{content.skipLabel}</a>
      <AmbientField />
      <div className="pointer-glow" aria-hidden="true" />
      <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#top" aria-label={content.homeLabel}>
          <span className="brand__mark">P</span>
          <span className="brand__name">Pablo Schefer</span>
        </a>

        <nav className="desktop-nav" aria-label={content.navigationLabel}>
          {content.nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <div className="language-picker">
            <button
              className="language-picker__trigger"
              type="button"
              aria-expanded={languageOpen}
              aria-haspopup="listbox"
              onClick={() => setLanguageOpen((open) => !open)}
            >
              {locale.toUpperCase()}
              <ChevronDown size={14} aria-hidden="true" />
              <span className="sr-only">{content.language}</span>
            </button>
            <AnimatePresence>
              {languageOpen && (
                <motion.div
                  className="language-picker__menu"
                  role="listbox"
                  aria-label={content.language}
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
                        setLocale(option)
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
            aria-label={menuOpen ? content.close : content.menu}
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
            aria-label={content.mobileNavigationLabel}
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {content.nav.map((item, index) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                <span>0{index + 1}</span>
                {item.label}
              </a>
            ))}
            <a href="#contacto" onClick={() => setMenuOpen(false)}>
              <span>05</span>
              {locale === 'es' ? 'Contacto' : 'Contact'}
            </a>
          </motion.nav>
        )}
      </AnimatePresence>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero__status">
            <span className="status-dot" aria-hidden="true" />
            {content.availability}
          </div>

          <div className="hero__layout">
            <div className="hero__copy">
              <motion.p
                className="eyebrow hero__eyebrow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.8 }}
              >
                {content.eyebrow}
              </motion.p>
              <h1 className="hero__title" aria-label={content.heroTitle.join(' ')}>
                {content.heroTitle.map((line, index) => (
                  <span className={index === 1 || index === 3 ? 'accent-word' : ''} key={line}>
                    <motion.span
                      initial={reduceMotion ? { opacity: 1 } : { y: '110%', rotate: 2 }}
                      animate={{ y: 0, rotate: 0 }}
                      transition={{ delay: 0.08 + index * 0.08, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </h1>
              <motion.div
                className="hero__intro-wrap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.75 }}
              >
                <p className="hero__intro">{content.heroIntro}</p>
                <div className="hero__actions">
                  <MagneticLink href="#evidencia">{content.primaryCta}</MagneticLink>
                  <MagneticLink href="#perfil" variant="ghost">
                    {content.secondaryCta}
                  </MagneticLink>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="hero__visual"
              initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.25, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Monogram />
              <div className="orbit-copy">{content.orbitLabel}</div>
              <div className="visual-coordinates">SPAIN / UTC+02</div>
            </motion.div>
          </div>

          <a className="scroll-cue" href="#capacidades">
            <ArrowDown size={15} aria-hidden="true" />
            <span>{content.scroll}</span>
          </a>
        </section>

        <div className="signal-strip" aria-hidden="true">
          <div>
            <span>DSC / 01</span><i />
            <span>VIBE / 02</span><i />
            <span>FNLB / 03</span><i />
            <span>KOS / 04</span><i />
            <span>DSC / 01</span><i />
            <span>VIBE / 02</span><i />
          </div>
        </div>

        <section className="section capabilities" id="capacidades">
          <motion.div className="section-heading" {...reveal}>
            <p className="eyebrow">{content.expertiseEyebrow}</p>
            <h2>{content.expertiseTitle}</h2>
            <p className="section-heading__intro">{content.expertiseIntro}</p>
          </motion.div>

          <div className="capability-grid">
            {content.capabilities.map((capability, index) => (
              <motion.article
                className="capability-card"
                key={capability.title}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-5% 0px' }}
                transition={{ delay: reduceMotion ? 0 : index * 0.09, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="capability-card__top">
                  <span>{capability.index}</span>
                  <span className="card-node" />
                </div>
                <h3>{capability.title}</h3>
                <p>{capability.text}</p>
                <ul>
                  {capability.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <div className="capability-card__scan" aria-hidden="true" />
              </motion.article>
            ))}
          </div>
        </section>

        <section className="section proof" id="evidencia">
          <motion.div className="section-heading section-heading--split" {...reveal}>
            <div>
              <p className="eyebrow">{content.proofEyebrow}</p>
              <h2>{content.proofTitle}</h2>
            </div>
            <p className="section-heading__intro">{content.proofIntro}</p>
          </motion.div>
          <div className="proof-grid">
            {content.proof.map((item, index) => (
              <motion.a
                className="proof-card"
                href={item.link}
                target="_blank"
                rel="noreferrer"
                key={item.title}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-5% 0px' }}
                transition={{ delay: reduceMotion ? 0 : index * 0.09, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="proof-card__meta">
                  <span>{item.type}</span>
                  <ArrowUpRight size={17} strokeWidth={1.6} aria-hidden="true" />
                </div>
                <strong>{item.metric}</strong>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span className="proof-card__link">{item.linkLabel}</span>
              </motion.a>
            ))}
          </div>
          <p className="proof__note">{content.proofNote}</p>
        </section>

        <section className="bridge-statement" aria-label={content.bridgeLead}>
          <motion.p {...reveal}>
            <span>{content.bridgeLead}</span>
            {content.bridgeText}
          </motion.p>
          <div className="bridge-line" aria-hidden="true">
            <i /><i /><i />
          </div>
        </section>

        <section className="section method" id="metodo">
          <motion.div className="section-heading section-heading--split" {...reveal}>
            <div>
              <p className="eyebrow">{content.methodEyebrow}</p>
              <h2>{content.methodTitle}</h2>
            </div>
            <p className="section-heading__intro">{content.methodIntro}</p>
          </motion.div>
          <div className="method-list">
            {content.method.map((item, index) => (
              <motion.article
                key={item.title}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: reduceMotion ? 0 : index * 0.08, duration: 0.55 }}
              >
                <span className="method-list__index">{item.index}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span className="method-list__signal" aria-hidden="true" />
              </motion.article>
            ))}
          </div>
        </section>

        <section className="section profile" id="perfil">
          <motion.div className="profile__visual" {...reveal}>
            <div className="profile__portrait">
              <img src="/pablo-schefer-portrait.webp" alt="Pablo Schefer Orduña" width="1200" height="1500" loading="lazy" />
              <div className="profile__crosshair" aria-hidden="true" />
            </div>
            <div className="profile__caption">
              <span>Pablo / PapiGEGamer</span>
              <span>{content.profileLoopLabel}</span>
            </div>
          </motion.div>
          <motion.div className="profile__copy" {...reveal}>
            <p className="eyebrow">{content.profileEyebrow}</p>
            <h2>{content.profileTitle}</h2>
            {content.profileBody.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <a
              className="profile__discord"
              href={discordProfileUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${content.discordIdentity.action}: ${content.discordIdentity.name}`}
            >
              <span className="profile__discord-icon" aria-hidden="true"><AtSign size={20} /></span>
              <span className="profile__discord-copy">
                <span>{content.discordIdentity.label}</span>
                <strong>{content.discordIdentity.name}</strong>
                <small>{content.discordIdentity.meta}</small>
              </span>
              <span className="profile__discord-action">
                {content.discordIdentity.action}<ArrowUpRight size={14} aria-hidden="true" />
              </span>
            </a>
            <div className="profile__location">
              <span className="status-dot" aria-hidden="true" />
              {content.profileNote}
            </div>
          </motion.div>
        </section>

        <section className="contact" id="contacto">
          <motion.div className="contact__inner" {...reveal}>
            <p className="eyebrow">{content.contactEyebrow}</p>
            <h2>{content.contactTitle}</h2>
            <p>{content.contactBody}</p>
            <MagneticLink href={discordProfileUrl} external className="contact__button">
              {content.contactCta}
            </MagneticLink>
            <div className="contact__socials" aria-label={content.socialLabel}>
              {socialLinks.map((link) => (
                <a href={link.href} target="_blank" rel="noreferrer" key={link.label}>
                  {link.label}<ArrowUpRight size={13} aria-hidden="true" />
                </a>
              ))}
            </div>
          </motion.div>
          <div className="contact__orb" aria-hidden="true"><span>PS/O</span></div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand" href="#top" aria-label={content.backToTopLabel}>
          <span className="brand__mark">P</span>
          <span className="brand__name">Pablo Schefer</span>
        </a>
        <p>© {new Date().getFullYear()} · {content.footer}</p>
        <a href="#top">↑ Top</a>
      </footer>
    </div>
  )
}

export default App
