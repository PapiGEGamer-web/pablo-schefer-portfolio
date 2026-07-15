export type Locale = 'es' | 'en'

type Copy = {
  nav: { label: string; href: string }[]
  availability: string
  eyebrow: string
  heroTitle: string[]
  heroIntro: string
  primaryCta: string
  secondaryCta: string
  orbitLabel: string
  scroll: string
  expertiseEyebrow: string
  expertiseTitle: string
  expertiseIntro: string
  capabilities: { index: string; title: string; text: string; tags: string[] }[]
  proofEyebrow: string
  proofTitle: string
  proofIntro: string
  proof: { type: string; metric: string; title: string; text: string; link: string; linkLabel: string }[]
  bridgeLead: string
  bridgeText: string
  methodEyebrow: string
  methodTitle: string
  methodIntro: string
  method: { index: string; title: string; text: string }[]
  profileEyebrow: string
  profileTitle: string
  profileBody: string[]
  profileNote: string
  contactEyebrow: string
  contactTitle: string
  contactBody: string
  contactCta: string
  footer: string
  menu: string
  close: string
  language: string
}

export const copy: Record<Locale, Copy> = {
  es: {
    nav: [
      { label: 'Capacidades', href: '#capacidades' },
      { label: 'Evidencia', href: '#evidencia' },
      { label: 'Método', href: '#metodo' },
      { label: 'Perfil', href: '#perfil' },
    ],
    availability: 'Conectando sistemas, procesos y personas',
    eyebrow: 'Automatización · Robótica · Comunidades',
    heroTitle: ['Ingeniería', 'que conecta', 'lo físico', 'y lo humano.'],
    heroIntro:
      'Diseño soluciones donde máquinas, procesos y comunidades trabajan con más precisión, claridad y propósito.',
    primaryCta: 'Explorar capacidades',
    secondaryCta: 'Iniciar conversación',
    orbitLabel: 'Sistemas / Personas / Movimiento',
    scroll: 'Desplazar para explorar',
    expertiseEyebrow: '01 — Capacidades',
    expertiseTitle: 'Pensamiento de sistema, de extremo a extremo.',
    expertiseIntro:
      'La tecnología aporta valor cuando reduce fricción. Trabajo en la intersección entre control industrial, integración robótica y operaciones de comunidad.',
    capabilities: [
      {
        index: '01',
        title: 'Automatización industrial',
        text: 'Sistemas de control legibles, robustos y preparados para evolucionar desde la documentación eléctrica hasta la operación.',
        tags: ['EPLAN', 'Control', 'Procesos', 'Documentación'],
      },
      {
        index: '02',
        title: 'Robótica e integración',
        text: 'Células y flujos que coordinan movimiento, seguridad y datos con una mirada práctica sobre el ciclo completo.',
        tags: ['Robótica', 'Integración', 'Seguridad', 'Optimización'],
      },
      {
        index: '03',
        title: 'Sistemas de comunidad',
        text: 'Estructuras, automatizaciones y dinámicas que permiten a una comunidad crecer sin perder cercanía ni contexto.',
        tags: ['Discord', 'Operaciones', 'Moderación', 'Experiencia'],
      },
    ],
    proofEyebrow: '02 — Evidencia pública',
    proofTitle: 'Trabajo visible. Contexto real.',
    proofIntro:
      'Una selección de señales públicas y verificables. Sin métricas decorativas ni credenciales infladas.',
    proof: [
      {
        type: 'Comunidades · Discord',
        metric: '98K+ / 59K+',
        title: 'ValorantESP + FNLB',
        text: 'Experiencia declarada en moderación y operaciones de dos comunidades españolas de gran escala, conectando personas, normas y automatización.',
        link: 'https://discord.gg/valorantesp',
        linkLabel: 'Ver comunidad',
      },
      {
        type: 'Producto · Open source',
        metric: '45 commits',
        title: 'PapiGEGamersWeb',
        text: 'Portafolio público construido con Next.js, React, TypeScript y CSS: una base real sobre la que seguir iterando con más foco y claridad.',
        link: 'https://github.com/PapiGEGamer-web/PapiGEGamersWeb',
        linkLabel: 'Ver repositorio',
      },
      {
        type: 'Formación · Técnica',
        metric: 'HW ↔ SW',
        title: 'Control y telecomunicaciones',
        text: 'Base técnica en telecomunicaciones y práctica con documentación eléctrica y control de procesos: el puente entre mundo físico y software.',
        link: 'https://github.com/PapiGEGamer-web',
        linkLabel: 'Ver perfil',
      },
    ],
    bridgeLead: 'Un mismo principio:',
    bridgeText: 'hacer que cada parte entienda a las demás.',
    methodEyebrow: '03 — Método',
    methodTitle: 'De la señal al resultado.',
    methodIntro:
      'Un proceso claro para convertir complejidad técnica y humana en sistemas que se pueden comprender, operar y mejorar.',
    method: [
      { index: '01', title: 'Observar', text: 'Entender el proceso real, sus límites y a quienes lo operan.' },
      { index: '02', title: 'Diseñar', text: 'Dar estructura a señales, decisiones e interacciones.' },
      { index: '03', title: 'Integrar', text: 'Conectar componentes sin ocultar la complejidad importante.' },
      { index: '04', title: 'Mejorar', text: 'Medir, documentar y evolucionar con intención.' },
    ],
    profileEyebrow: '04 — Perfil',
    profileTitle: 'Curiosidad técnica. Visión operativa. Cuidado por el detalle.',
    profileBody: [
      'Soy Pablo Schefer Orduña. Mi foco está en la automatización, la robótica industrial y la construcción de comunidades digitales bien coordinadas.',
      'Me interesan especialmente los puntos de unión: entre hardware y software, entre una interfaz y quien la utiliza, entre una comunidad y los sistemas que sostienen su día a día.',
    ],
    profileNote: 'Basado en España · Perspectiva global',
    contactEyebrow: '05 — Contacto',
    contactTitle: 'Construyamos algo que funcione de verdad.',
    contactBody: 'Si hay un proceso que automatizar, un sistema que integrar o una comunidad que activar, conversemos.',
    contactCta: 'Explorar GitHub',
    footer: 'Diseñado y construido con intención.',
    menu: 'Abrir menú',
    close: 'Cerrar menú',
    language: 'Idioma',
  },
  en: {
    nav: [
      { label: 'Capabilities', href: '#capacidades' },
      { label: 'Evidence', href: '#evidencia' },
      { label: 'Method', href: '#metodo' },
      { label: 'Profile', href: '#perfil' },
    ],
    availability: 'Connecting systems, processes and people',
    eyebrow: 'Automation · Robotics · Communities',
    heroTitle: ['Engineering', 'that connects', 'the physical', 'and the human.'],
    heroIntro:
      'I design solutions where machines, processes and communities work with greater precision, clarity and purpose.',
    primaryCta: 'Explore capabilities',
    secondaryCta: 'Start a conversation',
    orbitLabel: 'Systems / People / Motion',
    scroll: 'Scroll to explore',
    expertiseEyebrow: '01 — Capabilities',
    expertiseTitle: 'End-to-end systems thinking.',
    expertiseIntro:
      'Technology creates value when it removes friction. I work at the intersection of industrial control, robotics integration and community operations.',
    capabilities: [
      {
        index: '01',
        title: 'Industrial automation',
        text: 'Readable, robust control systems designed to evolve from electrical documentation through to operation.',
        tags: ['EPLAN', 'Control', 'Processes', 'Documentation'],
      },
      {
        index: '02',
        title: 'Robotics & integration',
        text: 'Cells and workflows that coordinate motion, safety and data with a practical view of the full lifecycle.',
        tags: ['Robotics', 'Integration', 'Safety', 'Optimisation'],
      },
      {
        index: '03',
        title: 'Community systems',
        text: 'Structures, automations and dynamics that help a community scale without losing closeness or context.',
        tags: ['Discord', 'Operations', 'Moderation', 'Experience'],
      },
    ],
    proofEyebrow: '02 — Public evidence',
    proofTitle: 'Visible work. Real context.',
    proofIntro:
      'A selection of public, verifiable signals. No decorative metrics or inflated credentials.',
    proof: [
      {
        type: 'Communities · Discord',
        metric: '98K+ / 59K+',
        title: 'ValorantESP + FNLB',
        text: 'Declared moderation and operations experience across two large Spanish communities, connecting people, rules and automation.',
        link: 'https://discord.gg/valorantesp',
        linkLabel: 'View community',
      },
      {
        type: 'Product · Open source',
        metric: '45 commits',
        title: 'PapiGEGamersWeb',
        text: 'A public portfolio built with Next.js, React, TypeScript and CSS—a real foundation to keep iterating with more focus and clarity.',
        link: 'https://github.com/PapiGEGamer-web/PapiGEGamersWeb',
        linkLabel: 'View repository',
      },
      {
        type: 'Training · Technical',
        metric: 'HW ↔ SW',
        title: 'Control & telecommunications',
        text: 'A technical foundation in telecommunications plus hands-on electrical documentation and process control: bridging the physical world and software.',
        link: 'https://github.com/PapiGEGamer-web',
        linkLabel: 'View profile',
      },
    ],
    bridgeLead: 'One shared principle:',
    bridgeText: 'make every part understand the others.',
    methodEyebrow: '03 — Method',
    methodTitle: 'From signal to outcome.',
    methodIntro:
      'A clear process to turn technical and human complexity into systems that can be understood, operated and improved.',
    method: [
      { index: '01', title: 'Observe', text: 'Understand the real process, its limits and the people who run it.' },
      { index: '02', title: 'Design', text: 'Give structure to signals, decisions and interactions.' },
      { index: '03', title: 'Integrate', text: 'Connect components without hiding important complexity.' },
      { index: '04', title: 'Improve', text: 'Measure, document and evolve with intention.' },
    ],
    profileEyebrow: '04 — Profile',
    profileTitle: 'Technical curiosity. Operational vision. Care for detail.',
    profileBody: [
      'I am Pablo Schefer Orduña. My focus is automation, industrial robotics and building well-coordinated digital communities.',
      'I care deeply about the connection points: between hardware and software, between an interface and its operator, between a community and the systems that support its everyday life.',
    ],
    profileNote: 'Based in Spain · Global perspective',
    contactEyebrow: '05 — Contact',
    contactTitle: "Let's build something that truly works.",
    contactBody: 'If there is a process to automate, a system to integrate or a community to activate, let’s talk.',
    contactCta: 'Explore GitHub',
    footer: 'Designed and built with intention.',
    menu: 'Open menu',
    close: 'Close menu',
    language: 'Language',
  },
}
