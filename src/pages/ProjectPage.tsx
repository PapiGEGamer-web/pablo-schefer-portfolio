import { ArrowUpRight, Boxes, CheckCircle2, Code2, MessageCircle } from 'lucide-react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { Locale } from '../content'
import { communityAssets } from '../data/communityAssets'
import './ProjectPage.css'

type ProjectId = 'fnlb' | 'kernelos'

const projects = {
  fnlb: {
    accent: '#2e7bdc',
    image: communityAssets.fnlbCover,
    logo: communityAssets.fnlbLogo,
    href: 'https://fnlb.net/',
    es: {
      eyebrow: 'Proyecto · Producto · Comunidad',
      title: 'FNLB',
      intro: 'Un ecosistema de lobby bots para Fortnite en el que producto, soporte y comunidad avanzan juntos.',
      role: 'Colaboración y moderación',
      body: 'Participo en FNLB desde el lado comunitario y de producto: entiendo incidencias, ayudo a mantener una comunicación clara y colaboro en un entorno donde cada mejora técnica llega directamente a usuarios reales.',
      facts: ['Comunidad cercana a 60K', 'Producto digital activo', 'Soporte y moderación', 'Fortnite · Lobby bots'],
      cta: 'Visitar FNLB',
      back: 'Ver todas las comunidades',
    },
    en: {
      eyebrow: 'Project · Product · Community',
      title: 'FNLB',
      intro: 'A Fortnite lobby-bot ecosystem where product, support and community move forward together.',
      role: 'Collaboration and moderation',
      body: 'I contribute to FNLB across community and product work: understanding issues, helping maintain clear communication and working in an environment where every technical improvement reaches real users.',
      facts: ['Community near 60K', 'Active digital product', 'Support and moderation', 'Fortnite · Lobby bots'],
      cta: 'Visit FNLB',
      back: 'View all communities',
    },
  },
  kernelos: {
    accent: '#c93636',
    image: '/media/projects/kernelos-cover.webp',
    logo: '/projects/kernelos-logo.png',
    href: 'https://kernelos.org/',
    es: {
      eyebrow: 'Proyecto · CustomOS · Comunidad',
      title: 'KernelOS',
      intro: 'Una CustomOS orientada al gaming y la baja latencia, acompañada por una comunidad técnica de gran escala.',
      role: 'Colaborador del ecosistema',
      body: 'Mi colaboración se sitúa entre la experiencia de comunidad y la evolución del proyecto. KernelOS conecta optimización, cultura gaming y soporte: una combinación donde la documentación y el contexto importan tanto como la parte técnica.',
      facts: ['CustomOS para gaming', 'Baja latencia', 'Nuevo servidor 50K+', 'Servidor histórico 1,5M+'],
      cta: 'Visitar KernelOS',
      back: 'Ver todas las comunidades',
    },
    en: {
      eyebrow: 'Project · Custom OS · Community',
      title: 'KernelOS',
      intro: 'A Custom OS focused on gaming and low latency, supported by a large technical community.',
      role: 'Ecosystem contributor',
      body: 'My contribution sits between community experience and product evolution. KernelOS connects optimisation, gaming culture and support—an environment where documentation and context matter as much as the technical work.',
      facts: ['Gaming Custom OS', 'Low latency', 'New server 50K+', 'Historic server 1.5M+'],
      cta: 'Visit KernelOS',
      back: 'View all communities',
    },
  },
} as const

export function ProjectPage({ projectId, locale }: { projectId: ProjectId; locale: Locale }) {
  const project = projects[projectId]
  const copy = project[locale]
  return (
    <div className="project-page" style={{ '--project-accent': project.accent } as CSSProperties}>
      <section className="project-hero">
        <div className="project-hero__media">
          <img src={project.image} alt="" width="1600" height="900" />
          <span />
          <img className="project-hero__logo" src={project.logo} alt="" width="256" height="256" />
        </div>
        <div className="project-hero__copy">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
          <a href={project.href} target="_blank" rel="noreferrer">{copy.cta}<ArrowUpRight size={16} /></a>
        </div>
      </section>
      <section className="section project-story">
        <div>
          <span><MessageCircle size={17} />{copy.role}</span>
          <h2>{copy.body}</h2>
        </div>
        <div className="project-facts">
          {copy.facts.map((fact, index) => <article key={fact}><span>{String(index + 1).padStart(2, '0')}</span>{index % 2 === 0 ? <Code2 size={20} /> : <Boxes size={20} />}<strong>{fact}</strong><CheckCircle2 size={15} /></article>)}
        </div>
      </section>
      <div className="project-back"><Link to="/comunidades">{copy.back}<ArrowUpRight size={15} /></Link></div>
    </div>
  )
}
