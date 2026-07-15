export type Locale = 'es' | 'en'

type Copy = {
  nav: { label: string; href: string }[]
  homeLabel: string
  navigationLabel: string
  mobileNavigationLabel: string
  socialLabel: string
  backToTopLabel: string
  skipLabel: string
  seoTitle: string
  seoDescription: string
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
  proofNote: string
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
  profileLoopLabel: string
  discordIdentity: { label: string; name: string; meta: string; action: string }
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
      { label: 'Ámbitos', href: '#capacidades' },
      { label: 'Proyectos', href: '#evidencia' },
      { label: 'Proceso', href: '#metodo' },
      { label: 'Perfil', href: '#perfil' },
    ],
    homeLabel: 'Pablo Schefer Orduña — inicio',
    navigationLabel: 'Navegación principal',
    mobileNavigationLabel: 'Navegación móvil',
    socialLabel: 'Redes y perfiles',
    backToTopLabel: 'Volver arriba',
    skipLabel: 'Saltar al contenido',
    seoTitle: 'Pablo Schefer Orduña — Discord, Vibecoding y Proyectos',
    seoDescription: 'Portafolio de Pablo Schefer Orduña: Discord, vibecoding y colaboración en comunidades y proyectos como FNLB y KernelOS.',
    availability: 'Construyendo entre comunidad, código y producto',
    eyebrow: 'Discord · Vibecoding · Colaboración',
    heroTitle: ['Comunidades', 'con pulso.', 'Código', 'con intención.'],
    heroIntro:
      'Soy Pablo Schefer — PapiGEGamer en Discord. Modero comunidades y convierto ideas en productos digitales con flujos de desarrollo asistidos por IA.',
    primaryCta: 'Explorar proyectos',
    secondaryCta: 'Conocer mi perfil',
    orbitLabel: 'Comunidad / Producto / Código',
    scroll: 'Desplazar para explorar',
    expertiseEyebrow: '01 — Ámbitos',
    expertiseTitle: 'Personas, producto y código en un mismo sistema.',
    expertiseIntro:
      'Trabajo donde se cruzan las comunidades online y el desarrollo asistido por IA: entiendo el contexto, construyo rápido y refino con criterio.',
    capabilities: [
      {
        index: '01',
        title: 'Discord y moderación',
        text: 'Ayudo a mantener comunidades claras, seguras y activas mediante moderación, coordinación, documentación y operación diaria.',
        tags: ['Discord', 'Moderación', 'Operaciones', 'Comunidad'],
      },
      {
        index: '02',
        title: 'Vibecoding y producto',
        text: 'Transformo necesidades en prototipos y experiencias web funcionales, guiando herramientas de IA con criterio técnico y de producto.',
        tags: ['React', 'TypeScript', 'IA aplicada', 'Prototipado'],
      },
      {
        index: '03',
        title: 'Colaboración abierta',
        text: 'Aporto ejecución, contexto y continuidad a proyectos compartidos, desde la idea hasta una versión que se puede probar y mejorar.',
        tags: ['FNLB', 'KernelOS', 'GitHub', 'Iteración'],
      },
    ],
    proofEyebrow: '02 — Comunidades y proyectos',
    proofTitle: 'Donde participo. Lo que ayudo a construir.',
    proofIntro: 'Experiencia y colaboraciones presentadas con contexto y enlaces oficiales, sin inflar credenciales.',
    proof: [
      {
        type: 'Discord · Moderación histórica',
        metric: '98K+',
        title: 'VALORANT ESP',
        text: 'Mi experiencia histórica de moderación en una gran comunidad hispanohablante de VALORANT.',
        link: 'https://discord.gg/valorantesp',
        linkLabel: 'Ver comunidad',
      },
      {
        type: 'Proyecto · Producto y comunidad',
        metric: '≈60K',
        title: 'FNLB',
        text: 'Colaboro en el ecosistema FNLB, una plataforma de lobby bots para Fortnite donde producto, soporte y comunidad avanzan juntos.',
        link: 'https://fnlb.net/',
        linkLabel: 'Conocer FNLB',
      },
      {
        type: 'Proyecto · CustomOS',
        metric: 'K//OS',
        title: 'KernelOS',
        text: 'Colaboro en el ecosistema KernelOS, un entorno Windows afinado para gaming, baja latencia y estabilidad.',
        link: 'https://kernelos.org/',
        linkLabel: 'Ver KernelOS',
      },
    ],
    proofNote: 'Datos públicos de Discord · 15.07.2026',
    bridgeLead: 'Una misma forma de avanzar:',
    bridgeText: 'entender rápido, construir claro, mejorar juntos.',
    methodEyebrow: '03 — Proceso',
    methodTitle: 'Del contexto a una versión que funciona.',
    methodIntro:
      'El vibecoding acelera la construcción; el criterio, la revisión y la conversación convierten esa velocidad en resultados útiles.',
    method: [
      { index: '01', title: 'Contextualizar', text: 'Entender la comunidad o el producto, sus límites y las personas que hay detrás.' },
      { index: '02', title: 'Prototipar', text: 'Convertir la intención en una interfaz funcional mediante iteraciones rápidas y enfocadas.' },
      { index: '03', title: 'Validar', text: 'Revisar comportamiento, accesibilidad y coherencia antes de dar algo por terminado.' },
      { index: '04', title: 'Iterar', text: 'Publicar, documentar y mejorar a partir de feedback real.' },
    ],
    profileEyebrow: '04 — Perfil',
    profileTitle: 'Comunidad primero. Curiosidad técnica. Entrega constante.',
    profileBody: [
      'Soy Pablo Schefer Orduña. Mi trayectoria digital nace en Discord: he moderado y ayudado a operar comunidades como VALORANT ESP y FNLB, cuidando tanto a las personas como los sistemas que sostienen su día a día.',
      'Como programador orientado al vibecoding, utilizo IA y un stack web moderno para llevar ideas a prototipos y productos. También colaboro con FNLB y con CustomOS dentro del ecosistema KernelOS.',
      'Este portfolio es parte de esa forma de trabajar: contexto, iteración, revisión técnica y una versión real desplegada en producción.',
    ],
    profileNote: 'España · Discord desde 2019',
    profileLoopLabel: 'Comunidad en el proceso',
    discordIdentity: {
      label: 'Perfil de Discord',
      name: 'PapiGEGamer',
      meta: 'Comunidad, moderación y producto',
      action: 'Abrir perfil',
    },
    contactEyebrow: '05 — Contacto',
    contactTitle: '¿Creamos la siguiente versión?',
    contactBody: 'Si estás construyendo una comunidad, una experiencia digital o un proyecto colaborativo, hablemos.',
    contactCta: 'Abrir Discord',
    footer: 'Construido entre comunidad, código e iteración.',
    menu: 'Abrir menú',
    close: 'Cerrar menú',
    language: 'Idioma',
  },
  en: {
    nav: [
      { label: 'Areas', href: '#capacidades' },
      { label: 'Projects', href: '#evidencia' },
      { label: 'Process', href: '#metodo' },
      { label: 'Profile', href: '#perfil' },
    ],
    homeLabel: 'Pablo Schefer Orduña — home',
    navigationLabel: 'Main navigation',
    mobileNavigationLabel: 'Mobile navigation',
    socialLabel: 'Social links and profiles',
    backToTopLabel: 'Back to top',
    skipLabel: 'Skip to content',
    seoTitle: 'Pablo Schefer Orduña — Discord, Vibe Coding & Projects',
    seoDescription: 'Pablo Schefer Orduña’s portfolio: Discord, vibe coding and collaboration across communities and projects including FNLB and KernelOS.',
    availability: 'Building across community, code and product',
    eyebrow: 'Discord · Vibe coding · Collaboration',
    heroTitle: ['Communities', 'with energy.', 'Code', 'with intent.'],
    heroIntro:
      'I am Pablo Schefer — PapiGEGamer on Discord. I moderate communities and turn ideas into digital products through AI-assisted development workflows.',
    primaryCta: 'Explore projects',
    secondaryCta: 'View my profile',
    orbitLabel: 'Community / Product / Code',
    scroll: 'Scroll to explore',
    expertiseEyebrow: '01 — Areas',
    expertiseTitle: 'People, product and code in one system.',
    expertiseIntro:
      'I work where online communities and AI-assisted development meet: understanding context, building quickly and refining with care.',
    capabilities: [
      {
        index: '01',
        title: 'Discord & moderation',
        text: 'I help communities stay clear, safe and active through moderation, coordination, documentation and daily operations.',
        tags: ['Discord', 'Moderation', 'Operations', 'Community'],
      },
      {
        index: '02',
        title: 'Vibe coding & product',
        text: 'I turn needs into functional prototypes and web experiences, guiding AI tools with technical and product judgement.',
        tags: ['React', 'TypeScript', 'Applied AI', 'Prototyping'],
      },
      {
        index: '03',
        title: 'Open collaboration',
        text: 'I bring execution, context and continuity to shared projects, from the first idea to a version people can test and improve.',
        tags: ['FNLB', 'KernelOS', 'GitHub', 'Iteration'],
      },
    ],
    proofEyebrow: '02 — Communities & projects',
    proofTitle: 'Where I contribute. What I help build.',
    proofIntro: 'Experience and collaborations presented with context and official links—without inflated credentials.',
    proof: [
      {
        type: 'Discord · Previous moderation',
        metric: '98K+',
        title: 'VALORANT ESP',
        text: 'My previous moderation experience in a large Spanish-speaking VALORANT community.',
        link: 'https://discord.gg/valorantesp',
        linkLabel: 'View community',
      },
      {
        type: 'Project · Product & community',
        metric: '≈60K',
        title: 'FNLB',
        text: 'I collaborate within the FNLB ecosystem, a Fortnite lobby-bot platform where product, support and community evolve together.',
        link: 'https://fnlb.net/',
        linkLabel: 'Discover FNLB',
      },
      {
        type: 'Project · CustomOS',
        metric: 'K//OS',
        title: 'KernelOS',
        text: 'I collaborate within the KernelOS ecosystem, a Windows environment tuned for gaming, low latency and stability.',
        link: 'https://kernelos.org/',
        linkLabel: 'View KernelOS',
      },
    ],
    proofNote: 'Public Discord data · 15 Jul 2026',
    bridgeLead: 'One way to move forward:',
    bridgeText: 'understand fast, build clearly, improve together.',
    methodEyebrow: '03 — Process',
    methodTitle: 'From context to a working version.',
    methodIntro:
      'Vibe coding accelerates the build; judgement, review and conversation turn that speed into useful outcomes.',
    method: [
      { index: '01', title: 'Contextualise', text: 'Understand the community or product, its constraints and the people behind it.' },
      { index: '02', title: 'Prototype', text: 'Turn intent into a working interface through fast, focused iterations.' },
      { index: '03', title: 'Validate', text: 'Review behaviour, accessibility and consistency before treating anything as finished.' },
      { index: '04', title: 'Iterate', text: 'Ship, document and improve with real feedback.' },
    ],
    profileEyebrow: '04 — Profile',
    profileTitle: 'Community first. Technical curiosity. Consistent delivery.',
    profileBody: [
      'I am Pablo Schefer Orduña. My digital path began on Discord, moderating and helping operate communities such as VALORANT ESP and FNLB while caring for both people and the systems supporting their daily experience.',
      'As a vibe-coding-oriented developer, I use AI and a modern web stack to turn ideas into prototypes and products. I also collaborate with FNLB and with CustomOS within the KernelOS ecosystem.',
      'This portfolio is part of that working style: context, iteration, technical review and a real version deployed to production.',
    ],
    profileNote: 'Spain · On Discord since 2019',
    profileLoopLabel: 'Community in the loop',
    discordIdentity: {
      label: 'Discord profile',
      name: 'PapiGEGamer',
      meta: 'Community, moderation and product',
      action: 'Open profile',
    },
    contactEyebrow: '05 — Contact',
    contactTitle: 'Shall we build the next version?',
    contactBody: 'If you are building a community, a digital experience or a collaborative project, let’s talk.',
    contactCta: 'Open Discord',
    footer: 'Built through community, code and iteration.',
    menu: 'Open menu',
    close: 'Close menu',
    language: 'Language',
  },
}
