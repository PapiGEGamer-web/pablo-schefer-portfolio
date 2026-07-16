import type { CommunityKey } from './data/communities'
import { communityAssets } from './data/communityAssets'

export type Locale = 'es' | 'en'

type SeoCopy = { title: string; description: string }
type ProofItem = {
  type: string
  metric: string
  title: string
  text: string
  link: string
  linkLabel: string
  image?: string
  imageAlt?: string
  internal?: boolean
}

export type SiteCopy = {
  nav: {
    home: string
    profile: string
    communities: string
    allCommunities: string
    edgarLive: string
    projects: string
    personal: string
    gamesGear: string
    music: string
    anime: string
    fnlb: string
    kernelos: string
    contact: string
  }
  common: {
    homeLabel: string
    navigationLabel: string
    mobileNavigationLabel: string
    socialLabel: string
    backToTopLabel: string
    skipLabel: string
    menu: string
    close: string
    language: string
    current: string
    previous: string
    members: string
    online: string
    open: string
    live: string
    dataNote: string
  }
  seo: {
    home: SeoCopy
    profile: SeoCopy
    communities: SeoCopy
    edgar: SeoCopy
    gamesGear: SeoCopy
    music: SeoCopy
    anime: SeoCopy
    notFound: SeoCopy
  }
  home: {
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
    communityEyebrow: string
    communityTitle: string
    communityIntro: string
    communityCta: string
    proofEyebrow: string
    proofTitle: string
    proofIntro: string
    proof: ProofItem[]
    bridgeLead: string
    bridgeText: string
    methodEyebrow: string
    methodTitle: string
    methodIntro: string
    method: { index: string; title: string; text: string }[]
  }
  profile: {
    eyebrow: string
    title: string
    lede: string
    body: string[]
    portraitLabel: string
    profileLoopLabel: string
    presence: string
    discordIdentity: { label: string; name: string; handle: string; meta: string; action: string }
    location: string
    stats: { value: string; label: string }[]
    rolesEyebrow: string
    rolesTitle: string
    rolesIntro: string
  }
  communities: {
    eyebrow: string
    title: string
    intro: string
    roleLabel: string
    viewCommunity: string
    viewLivePage: string
    cards: Record<CommunityKey, { role: string; text: string }>
    note: string
    philosophyEyebrow: string
    philosophyTitle: string
    philosophyBody: string
    principles: { index: string; title: string; text: string }[]
  }
  edgar: {
    eyebrow: string
    title: string
    intro: string
    roleLabel: string
    role: string
    liveEyebrow: string
    liveTitle: string
    liveIntro: string
    membersLabel: string
    onlineLabel: string
    voiceLabel: string
    visibleVoiceLabel: string
    voiceAvailable: string
    voiceUnavailable: string
    emptyVoice: string
    loading: string
    error: string
    retry: string
    updated: string
    join: string
    publicData: string
    aboutEyebrow: string
    aboutTitle: string
    aboutBody: string
    sourceNote: string
  }
  contact: {
    eyebrow: string
    title: string
    body: string
    cta: string
  }
  footer: string
  notFound: { eyebrow: string; title: string; body: string; cta: string }
}

export const copy: Record<Locale, SiteCopy> = {
  es: {
    nav: {
      home: 'Inicio',
      profile: 'Perfil',
      communities: 'Comunidades',
      allCommunities: 'Todas las comunidades',
      edgarLive: 'Edgar Pons · Live',
      projects: 'Proyectos',
      personal: 'Personal',
      gamesGear: 'Juegos y equipo',
      music: 'Música',
      anime: 'Anime',
      fnlb: 'FNLB',
      kernelos: 'KernelOS',
      contact: 'Contacto',
    },
    common: {
      homeLabel: 'Pablo Schefer Orduña — inicio',
      navigationLabel: 'Navegación principal',
      mobileNavigationLabel: 'Navegación móvil',
      socialLabel: 'Redes y perfiles',
      backToTopLabel: 'Volver arriba',
      skipLabel: 'Saltar al contenido',
      menu: 'Abrir menú',
      close: 'Cerrar menú',
      language: 'Idioma',
      current: 'Actual',
      previous: 'Experiencia anterior',
      members: 'miembros aprox.',
      online: 'en línea aprox.',
      open: 'Abrir',
      live: 'En directo',
      dataNote: 'Datos públicos de Discord · 16.07.2026',
    },
    seo: {
      home: {
        title: 'Pablo Schefer — Comunidades, código y cultura digital',
        description: 'Portfolio de Pablo Schefer: moderación en Discord, vibecoding, proyectos digitales y presencia pública en tiempo real.',
      },
      profile: {
        title: 'Perfil — Pablo Schefer Orduña',
        description: 'Perfil de Pablo Schefer Orduña, PapiGEGamer en Discord: moderación de comunidades, vibecoding y colaboración digital.',
      },
      communities: {
        title: 'Comunidades — Pablo Schefer Orduña',
        description: 'Experiencia de Pablo Schefer moderando comunidades de tecnología, gaming y creadores, incluidas FNLB, Nate Gentile y Edgar Pons.',
      },
      edgar: {
        title: 'Comunidad Edgar Pons — Estado de Discord',
        description: 'Panel público casi en tiempo real de la comunidad de Discord de Edgar Pons y experiencia de moderación de Pablo Schefer.',
      },
      gamesGear: {
        title: 'Juegos y equipo — Pablo Schefer',
        description: 'Juegos actuales, equipo real y un setup objetivo extremo con RTX 5090 en una biblioteca visual e interactiva.',
      },
      music: {
        title: 'Música y Spotify — Pablo Schefer',
        description: 'Monitor musical de Pablo Schefer, preparado para mostrar su reproducción pública de Spotify mediante la presencia de Discord.',
      },
      anime: {
        title: 'Anime en directo — Pablo Schefer',
        description: 'Historial local y monitor en tiempo real de actividades públicas de anime detectadas mediante Lanyard y Discord.',
      },
      notFound: { title: 'Página no encontrada — Pablo Schefer', description: 'La página solicitada no existe.' },
    },
    home: {
      availability: 'Construyendo entre comunidad, código y producto',
      eyebrow: 'Discord · Vibecoding · Colaboración',
      heroTitle: ['Comunidades', 'con pulso.', 'Código', 'con intención.'],
      heroIntro: 'Soy Pablo Schefer — PapiGEGamer en Discord. Modero comunidades tecnológicas y convierto ideas en productos digitales mediante desarrollo asistido por IA.',
      primaryCta: 'Explorar comunidades',
      secondaryCta: 'Conocer mi perfil',
      orbitLabel: 'Comunidad / Producto / Código',
      scroll: 'Desplazar para explorar',
      expertiseEyebrow: '01 — Ámbitos',
      expertiseTitle: 'Personas, producto y código en un mismo sistema.',
      expertiseIntro: 'Trabajo donde se cruzan las comunidades online y el desarrollo asistido por IA: entiendo el contexto, construyo rápido y refino con criterio.',
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
      communityEyebrow: '02 — Comunidades',
      communityTitle: 'Moderación con contexto, escala y cercanía.',
      communityIntro: 'Actualmente modero FNLB, Nate Gentile, Edgar Pons y otros servidores. Mi recorrido incluye también GW2 / Gatitos 2, VALORANT ESP y más comunidades.',
      communityCta: 'Ver experiencia completa',
      proofEyebrow: '03 — Proyectos y ecosistemas',
      proofTitle: 'Donde participo. Lo que ayudo a construir.',
      proofIntro: 'Colaboraciones presentadas con contexto y enlaces oficiales, sin inflar credenciales.',
      proof: [
        {
          type: 'Producto · Comunidad',
          metric: '≈60K',
          title: 'FNLB',
          text: 'Colaboro en el ecosistema FNLB, una plataforma de lobby bots para Fortnite donde producto, soporte y comunidad avanzan juntos.',
          link: 'https://fnlb.net/',
          linkLabel: 'Conocer FNLB',
          image: communityAssets.fnlbCover,
          imageAlt: 'Identidad visual azul de FNLB',
        },
        {
          type: 'Proyecto · Comunidad',
          metric: '50K+',
          title: 'KernelOS',
          text: 'Colaboro en el ecosistema KernelOS: CustomOS para gaming, baja latencia y comunidad Discord. Su servidor histórico superó 1.500.000 miembros; tras el cierre, el nuevo reúne más de 50.000.',
          link: 'https://kernelos.org/',
          linkLabel: 'Ver KernelOS',
          image: '/media/projects/kernelos-cover.webp',
          imageAlt: 'Fondo oscuro de KernelOS con una máscara oni',
        },
        {
          type: 'Discord · Operaciones',
          metric: '06+',
          title: 'Red de comunidades',
          text: 'Seis experiencias públicas destacadas y otros roles actuales e históricos en gaming, tecnología y creadores.',
          link: '/comunidades',
          linkLabel: 'Explorar comunidades',
          image: communityAssets.edgarPonsCover,
          imageAlt: 'Identidad visual de la comunidad de Edgar Pons',
          internal: true,
        },
      ],
      bridgeLead: 'Una misma forma de avanzar:',
      bridgeText: 'entender rápido, construir claro, mejorar juntos.',
      methodEyebrow: '04 — Proceso',
      methodTitle: 'Del contexto a una versión que funciona.',
      methodIntro: 'El vibecoding acelera la construcción; el criterio, la revisión y la conversación convierten esa velocidad en resultados útiles.',
      method: [
        { index: '01', title: 'Contextualizar', text: 'Entender la comunidad o el producto, sus límites y las personas que hay detrás.' },
        { index: '02', title: 'Prototipar', text: 'Convertir la intención en una interfaz funcional mediante iteraciones rápidas y enfocadas.' },
        { index: '03', title: 'Validar', text: 'Revisar comportamiento, accesibilidad y coherencia antes de dar algo por terminado.' },
        { index: '04', title: 'Iterar', text: 'Publicar, documentar y mejorar a partir de feedback real.' },
      ],
    },
    profile: {
      eyebrow: 'Perfil — PapiGEGamer',
      title: 'Comunidad primero. Curiosidad técnica. Entrega constante.',
      lede: 'Una identidad digital construida entre Discord, producto y ganas de convertir ideas en algo real.',
      body: [
        'Soy Pablo Schefer Orduña. Mi trayectoria digital nace en Discord, donde actualmente modero las comunidades de FNLB, Nate Gentile, Edgar Pons y otros servidores.',
        'También he moderado GW2 —conocido como Gatitos 2—, VALORANT ESP y más comunidades. Estas seis fichas son experiencias públicas destacadas, no el límite de mi recorrido.',
        'Como programador orientado al vibecoding, utilizo IA y un stack web moderno para llevar ideas a prototipos y productos. Colaboro además con FNLB y con la CustomOS y comunidad del ecosistema KernelOS.',
      ],
      portraitLabel: 'Pablo / PapiGEGamer',
      profileLoopLabel: 'Comunidad en el proceso',
      presence: 'En línea',
      discordIdentity: {
        label: 'Perfil de Discord',
        name: 'PapiGEGamer 🐾',
        handle: '@papigegamerantiguo',
        meta: 'Moderación · Tecnología · Vibecoding',
        action: 'Abrir perfil',
      },
      location: 'España · En Discord desde 2019',
      stats: [
        { value: '03+', label: 'comunidades moderadas actualmente' },
        { value: '02+', label: 'experiencias anteriores destacadas' },
        { value: '2019', label: 'inicio en Discord' },
      ],
      rolesEyebrow: 'Experiencia',
      rolesTitle: 'Comunidades que forman parte de mi recorrido.',
      rolesIntro: 'Seis roles públicos destacados, dentro de una trayectoria que incluye otros servidores actuales e históricos.',
    },
    communities: {
      eyebrow: 'Comunidades — Discord',
      title: 'Detrás de cada cifra hay personas, contexto y confianza.',
      intro: 'Estas seis fichas reúnen experiencias públicas destacadas; además modero y he moderado otros servidores de tecnología, gaming y creadores. El objetivo siempre es que la conversación fluya sin perder identidad.',
      roleLabel: 'Rol',
      viewCommunity: 'Abrir comunidad',
      viewLivePage: 'Ver página en directo',
      cards: {
        fnlb: { role: 'Moderador actual', text: 'Moderación y colaboración dentro de un ecosistema que une lobby bots de Fortnite, soporte, producto y una comunidad cercana a 60.000 miembros.' },
        nate: { role: 'Moderador actual', text: 'Moderación en la comunidad de Nate Gentile, un espacio centrado en tecnología, hardware y divulgación.' },
        edgar: { role: 'Moderador actual', text: 'Moderación en la comunidad de Edgar Pons. Cuenta con una página propia y un panel basado en el widget público de Discord.' },
        kernelos: { role: 'Colaborador · Comunidad', text: 'KernelOS combina CustomOS y comunidad Discord. El servidor histórico superó 1.500.000 miembros; tras su cierre, el nuevo reúne más de 50.000 usuarios.' },
        gw2: { role: 'Moderador anterior', text: 'Experiencia de moderación en GW2, conocido como Gatitos 2: una comunidad social y gaming que supera los 103.000 miembros.' },
        valorant: { role: 'Moderador anterior', text: 'Experiencia histórica en una de las grandes comunidades hispanohablantes dedicadas a VALORANT.' },
      },
      note: 'Selección de seis experiencias públicas; no representa todos los servidores. Los cargos reflejan la información facilitada por Pablo y las cifras son aproximadas.',
      philosophyEyebrow: 'Cómo modero',
      philosophyTitle: 'Presencia visible. Criterio sereno. Sistemas claros.',
      philosophyBody: 'La buena moderación no consiste solo en reaccionar: combina escucha, consistencia, documentación y coordinación para prevenir problemas y sostener una cultura sana.',
      principles: [
        { index: '01', title: 'Escuchar', text: 'Entender primero el contexto y separar una incidencia puntual de un patrón real.' },
        { index: '02', title: 'Decidir', text: 'Aplicar criterios coherentes, proporcionados y comprensibles para la comunidad.' },
        { index: '03', title: 'Documentar', text: 'Dejar procesos claros para que el equipo pueda responder con continuidad.' },
      ],
    },
    edgar: {
      eyebrow: 'Comunidad destacada — Edgar Pons',
      title: 'Una ventana viva a la comunidad.',
      intro: 'Una página dedicada a mi trabajo como moderador y a la actividad pública que Discord permite consultar de forma segura.',
      roleLabel: 'Mi rol',
      role: 'Moderador actual',
      liveEyebrow: 'Discord · Monitor automático',
      liveTitle: 'Actividad pública ahora.',
      liveIntro: 'La web comparte snapshots públicos versionados cada 15 segundos, permite actualizar manualmente y anima cada cambio. La URL estable del widget conserva una caché de 300 segundos.',
      membersLabel: 'Miembros, aprox.',
      onlineLabel: 'En línea, aprox.',
      voiceLabel: 'En voz',
      visibleVoiceLabel: 'visibles públicamente',
      voiceAvailable: 'Actividad pública de voz disponible',
      voiceUnavailable: 'La actividad pública de voz no está disponible.',
      emptyVoice: 'No hay participantes visibles en los canales públicos ahora mismo.',
      loading: 'Conectando con el widget público de Discord…',
      error: 'No he podido actualizar el panel en este momento.',
      retry: 'Reintentar',
      updated: 'Actualizado',
      join: 'Entrar al Discord',
      publicData: 'Datos públicos · Sin bot ni token privado',
      aboutEyebrow: 'La integración',
      aboutTitle: 'Diseñada para encajar. Limitada para respetar.',
      aboutBody: 'En lugar de insertar el iframe genérico, esta web transforma exclusivamente el widget público oficial en una interfaz coherente con el portfolio. No lee mensajes, no instala bots y no accede a canales privados.',
      sourceNote: 'Discord limita el widget a canales visibles para @everyone y a un máximo de 100 miembros públicos. Por eso “en voz” representa personas visibles, no un censo completo del servidor.',
    },
    contact: {
      eyebrow: 'Contacto',
      title: '¿Creamos la siguiente versión?',
      body: 'Si estás construyendo una comunidad, una experiencia digital o un proyecto colaborativo, hablemos.',
      cta: 'Abrir Discord',
    },
    footer: 'Construido entre comunidad, código e iteración.',
    notFound: { eyebrow: '404 — Fuera de ruta', title: 'Esta página no existe.', body: 'La navegación sigue viva; solo has llegado a una ruta que todavía no forma parte del mapa.', cta: 'Volver al inicio' },
  },
  en: {
    nav: {
      home: 'Home',
      profile: 'Profile',
      communities: 'Communities',
      allCommunities: 'All communities',
      edgarLive: 'Edgar Pons · Live',
      projects: 'Projects',
      personal: 'Personal',
      gamesGear: 'Games & gear',
      music: 'Music',
      anime: 'Anime',
      fnlb: 'FNLB',
      kernelos: 'KernelOS',
      contact: 'Contact',
    },
    common: {
      homeLabel: 'Pablo Schefer Orduña — home',
      navigationLabel: 'Main navigation',
      mobileNavigationLabel: 'Mobile navigation',
      socialLabel: 'Social links and profiles',
      backToTopLabel: 'Back to top',
      skipLabel: 'Skip to content',
      menu: 'Open menu',
      close: 'Close menu',
      language: 'Language',
      current: 'Current',
      previous: 'Previous experience',
      members: 'members, approx.',
      online: 'online, approx.',
      open: 'Open',
      live: 'Live',
      dataNote: 'Public Discord data · 16 Jul 2026',
    },
    seo: {
      home: { title: 'Pablo Schefer — Communities, code & digital culture', description: 'Pablo Schefer’s portfolio: Discord moderation, vibe coding, digital projects and public real-time presence.' },
      profile: { title: 'Profile — Pablo Schefer Orduña', description: 'Pablo Schefer Orduña, PapiGEGamer on Discord: community moderation, vibe coding and digital collaboration.' },
      communities: { title: 'Communities — Pablo Schefer Orduña', description: 'Pablo Schefer’s moderation experience across technology, gaming and creator communities, including FNLB, Nate Gentile and Edgar Pons.' },
      edgar: { title: 'Edgar Pons Community — Discord Status', description: 'A near-real-time public panel for the Edgar Pons Discord community and Pablo Schefer’s moderation work.' },
      gamesGear: { title: 'Games & gear — Pablo Schefer', description: 'Current games, real hardware and an extreme RTX 5090 target setup in a visual, interactive library.' },
      music: { title: 'Music & Spotify — Pablo Schefer', description: 'Pablo Schefer’s music monitor, ready to show public Spotify playback through his Discord presence.' },
      anime: { title: 'Live Anime — Pablo Schefer', description: 'Local history and real-time monitor for public anime activities detected through Lanyard and Discord.' },
      notFound: { title: 'Page not found — Pablo Schefer', description: 'The requested page does not exist.' },
    },
    home: {
      availability: 'Building across community, code and product',
      eyebrow: 'Discord · Vibe coding · Collaboration',
      heroTitle: ['Communities', 'with energy.', 'Code', 'with intent.'],
      heroIntro: 'I am Pablo Schefer — PapiGEGamer on Discord. I moderate tech communities and turn ideas into digital products through AI-assisted development.',
      primaryCta: 'Explore communities',
      secondaryCta: 'View my profile',
      orbitLabel: 'Community / Product / Code',
      scroll: 'Scroll to explore',
      expertiseEyebrow: '01 — Areas',
      expertiseTitle: 'People, product and code in one system.',
      expertiseIntro: 'I work where online communities and AI-assisted development meet: understanding context, building quickly and refining with care.',
      capabilities: [
        { index: '01', title: 'Discord & moderation', text: 'I help communities stay clear, safe and active through moderation, coordination, documentation and daily operations.', tags: ['Discord', 'Moderation', 'Operations', 'Community'] },
        { index: '02', title: 'Vibe coding & product', text: 'I turn needs into functional prototypes and web experiences, guiding AI tools with technical and product judgement.', tags: ['React', 'TypeScript', 'Applied AI', 'Prototyping'] },
        { index: '03', title: 'Open collaboration', text: 'I bring execution, context and continuity to shared projects, from the first idea to a version people can test and improve.', tags: ['FNLB', 'KernelOS', 'GitHub', 'Iteration'] },
      ],
      communityEyebrow: '02 — Communities',
      communityTitle: 'Moderation with context, scale and empathy.',
      communityIntro: 'I currently moderate FNLB, Nate Gentile, Edgar Pons and other servers. My path also includes GW2 / Gatitos 2, VALORANT ESP and more communities.',
      communityCta: 'View full experience',
      proofEyebrow: '03 — Projects & ecosystems',
      proofTitle: 'Where I contribute. What I help build.',
      proofIntro: 'Collaborations presented with context and official links—without inflated credentials.',
      proof: [
        { type: 'Product · Community', metric: '≈60K', title: 'FNLB', text: 'I collaborate within the FNLB ecosystem, a Fortnite lobby-bot platform where product, support and community evolve together.', link: 'https://fnlb.net/', linkLabel: 'Discover FNLB', image: communityAssets.fnlbCover, imageAlt: 'Blue FNLB visual identity' },
        { type: 'Project · Community', metric: '50K+', title: 'KernelOS', text: 'I collaborate within the KernelOS ecosystem: a Custom OS for gaming, low latency and a Discord community. Its historic server passed 1,500,000 members; after it closed, the new one has more than 50,000.', link: 'https://kernelos.org/', linkLabel: 'View KernelOS', image: '/media/projects/kernelos-cover.webp', imageAlt: 'Dark KernelOS background with an oni mask' },
        { type: 'Discord · Operations', metric: '06+', title: 'Community network', text: 'Six featured public experiences plus other current and previous roles across gaming, technology and creators.', link: '/comunidades', linkLabel: 'Explore communities', image: communityAssets.edgarPonsCover, imageAlt: 'Edgar Pons community visual identity', internal: true },
      ],
      bridgeLead: 'One way to move forward:',
      bridgeText: 'understand fast, build clearly, improve together.',
      methodEyebrow: '04 — Process',
      methodTitle: 'From context to a working version.',
      methodIntro: 'Vibe coding accelerates the build; judgement, review and conversation turn that speed into useful outcomes.',
      method: [
        { index: '01', title: 'Contextualise', text: 'Understand the community or product, its constraints and the people behind it.' },
        { index: '02', title: 'Prototype', text: 'Turn intent into a working interface through fast, focused iterations.' },
        { index: '03', title: 'Validate', text: 'Review behaviour, accessibility and consistency before treating anything as finished.' },
        { index: '04', title: 'Iterate', text: 'Ship, document and improve with real feedback.' },
      ],
    },
    profile: {
      eyebrow: 'Profile — PapiGEGamer',
      title: 'Community first. Technical curiosity. Consistent delivery.',
      lede: 'A digital identity built across Discord, product work and the drive to turn ideas into something real.',
      body: [
        'I am Pablo Schefer Orduña. My digital path began on Discord, where I currently moderate FNLB, Nate Gentile, Edgar Pons and other servers.',
        'I have also moderated GW2—known as Gatitos 2—VALORANT ESP and more communities. These six cards are public highlights, not the limit of my experience.',
        'As a vibe-coding-oriented developer, I use AI and a modern web stack to turn ideas into prototypes and products. I also collaborate with FNLB and the Custom OS and community within the KernelOS ecosystem.',
      ],
      portraitLabel: 'Pablo / PapiGEGamer',
      profileLoopLabel: 'Community in the loop',
      presence: 'Online',
      discordIdentity: { label: 'Discord profile', name: 'PapiGEGamer 🐾', handle: '@papigegamerantiguo', meta: 'Moderation · Technology · Vibe coding', action: 'Open profile' },
      location: 'Spain · On Discord since 2019',
      stats: [
        { value: '03+', label: 'communities moderated today' },
        { value: '02+', label: 'highlighted previous roles' },
        { value: '2019', label: 'start on Discord' },
      ],
      rolesEyebrow: 'Experience',
      rolesTitle: 'Communities that shaped my path.',
      rolesIntro: 'Six featured public roles within a path that includes other current and previous servers.',
    },
    communities: {
      eyebrow: 'Communities — Discord',
      title: 'Behind every number are people, context and trust.',
      intro: 'These six cards are public highlights; I also moderate and have moderated other technology, gaming and creator servers. The goal remains to help conversations flow without losing identity.',
      roleLabel: 'Role',
      viewCommunity: 'Open community',
      viewLivePage: 'View live page',
      cards: {
        fnlb: { role: 'Current moderator', text: 'Moderation and collaboration in an ecosystem connecting Fortnite lobby bots, support, product and a community of nearly 60,000 members.' },
        nate: { role: 'Current moderator', text: 'Moderation in Nate Gentile’s community, a space focused on technology, hardware and education.' },
        edgar: { role: 'Current moderator', text: 'Moderation in the Edgar Pons community, with its own page and a panel powered by Discord’s public widget.' },
        kernelos: { role: 'Contributor · Community', text: 'KernelOS combines a Custom OS and a Discord community. Its historic server passed 1,500,000 members; after it closed, the new server has more than 50,000 users.' },
        gw2: { role: 'Previous moderator', text: 'Previous moderation work in GW2, known as Gatitos 2: a social and gaming community with more than 103,000 members.' },
        valorant: { role: 'Previous moderator', text: 'Previous experience in one of the large Spanish-speaking communities dedicated to VALORANT.' },
      },
      note: 'A selection of six public experiences, not every server. Roles reflect information provided by Pablo and counts are approximate.',
      philosophyEyebrow: 'How I moderate',
      philosophyTitle: 'Visible presence. Calm judgement. Clear systems.',
      philosophyBody: 'Good moderation is not only reactive. It combines listening, consistency, documentation and coordination to prevent problems and support a healthy culture.',
      principles: [
        { index: '01', title: 'Listen', text: 'Understand context first and separate isolated incidents from meaningful patterns.' },
        { index: '02', title: 'Decide', text: 'Apply coherent, proportionate criteria the community can understand.' },
        { index: '03', title: 'Document', text: 'Leave clear processes so the team can respond with continuity.' },
      ],
    },
    edgar: {
      eyebrow: 'Featured community — Edgar Pons',
      title: 'A living window into the community.',
      intro: 'A dedicated page for my work as a moderator and the public activity Discord allows us to query safely.',
      roleLabel: 'My role',
      role: 'Current moderator',
      liveEyebrow: 'Discord · Automatic monitor',
      liveTitle: 'Public activity now.',
      liveIntro: 'The site shares versioned public snapshots every 15 seconds, supports manual refresh and animates each change. The widget’s stable URL keeps a 300-second cache.',
      membersLabel: 'Members, approx.',
      onlineLabel: 'Online, approx.',
      voiceLabel: 'In voice',
      visibleVoiceLabel: 'publicly visible',
      voiceAvailable: 'Public voice activity available',
      voiceUnavailable: 'Public voice activity is not available.',
      emptyVoice: 'No participants are publicly visible in voice channels right now.',
      loading: 'Connecting to Discord’s public widget…',
      error: 'The panel could not be refreshed right now.',
      retry: 'Try again',
      updated: 'Updated',
      join: 'Join Discord',
      publicData: 'Public data · No bot or private token',
      aboutEyebrow: 'The integration',
      aboutTitle: 'Designed to fit. Limited to respect.',
      aboutBody: 'Instead of embedding the generic iframe, this site transforms only the official public widget into an interface that matches the portfolio. It does not read messages, install bots or access private channels.',
      sourceNote: 'Discord limits the widget to channels visible to @everyone and up to 100 public members. “In voice” therefore represents visible people, not a complete server census.',
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Shall we build the next version?',
      body: 'If you are building a community, a digital experience or a collaborative project, let’s talk.',
      cta: 'Open Discord',
    },
    footer: 'Built through community, code and iteration.',
    notFound: { eyebrow: '404 — Off route', title: 'This page does not exist.', body: 'The navigation is still alive—you have simply reached a route that is not part of the map yet.', cta: 'Back home' },
  },
}
