import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { ArrowDown, Headphones, MessageCircle, Radio, ShieldCheck } from 'lucide-react'
import type { Locale, SiteCopy } from '../content'
import { ContactSection } from '../components/ContactSection'
import { DiscordLivePanel } from '../components/DiscordLivePanel'
import { communityAssets } from '../data/communityAssets'

export function EdgarPonsPage({ content, locale }: { content: SiteCopy; locale: Locale }) {
  const reduceMotion = useReducedMotion()
  const page = content.edgar
  const reveal = {
    initial: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-8% 0px' },
    transition: { duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }

  return (
    <>
      <section className="page-hero page-hero--edgar">
        <m.div className="page-hero__copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}>
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
          <div className="edgar-role">
            <span><ShieldCheck size={17} aria-hidden="true" />{page.roleLabel}</span>
            <strong>{page.role}</strong>
          </div>
        </m.div>

        <m.div className="discord-orbit" initial={{ opacity: 0, scale: 0.88, rotate: -4 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: 0.16, duration: 0.85, ease: [0.16, 1, 0.3, 1] }} aria-hidden="true">
          <div className="discord-orbit__core"><img src={communityAssets.edgarLogo} alt="" width="256" height="256" /></div>
          <span className="discord-orbit__node discord-orbit__node--one"><MessageCircle size={18} /></span>
          <span className="discord-orbit__node discord-orbit__node--two"><Headphones size={18} /></span>
          <span className="discord-orbit__node discord-orbit__node--three"><Radio size={18} /></span>
        </m.div>
        <a className="page-hero__scroll" href="#live"><ArrowDown size={15} aria-hidden="true" />{locale === 'es' ? 'Panel en directo' : 'Live widget'}</a>
      </section>

      <section className="section edgar-live-section" id="live">
        <m.div className="section-heading section-heading--split" {...reveal}>
          <div>
            <p className="eyebrow">{page.liveEyebrow}</p>
            <h2>{page.liveTitle}</h2>
          </div>
          <p className="section-heading__intro">{page.liveIntro}</p>
        </m.div>
        <DiscordLivePanel content={content} locale={locale} />
      </section>

      <section className="edgar-integration">
        <m.div className="edgar-integration__copy" {...reveal}>
          <p className="eyebrow">{page.aboutEyebrow}</p>
          <h2>{page.aboutTitle}</h2>
          <p>{page.aboutBody}</p>
        </m.div>
        <div className="edgar-integration__diagram" aria-hidden="true">
          <span>Discord public widget</span><i />
          <span>Same-origin API</span><i />
          <span>Portfolio UI</span>
        </div>
      </section>

      <ContactSection content={content} />
    </>
  )
}
