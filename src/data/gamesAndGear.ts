import type { Locale } from '../content'

type LocalizedText = Record<Locale, string>
type LocalizedList = Record<Locale, string[]>

export type GameStatus = 'rotation' | 'favorite' | 'library'

export type Game = {
  id: string
  title: string
  status: GameStatus
  image: string | null
  imageMode?: 'art' | 'logo'
  mark?: string
  accent: string
  description: LocalizedText
  tags: LocalizedList
  filters: Array<'competitive' | 'coop' | 'open-world' | 'story' | 'survival' | 'creative'>
  platform: string
  href: string
}

export const games: Game[] = [
  {
    id: 'gta-vi',
    title: 'Grand Theft Auto VI',
    status: 'rotation',
    image: '/games/grand-theft-auto-vi.webp',
    accent: '#f38ab8',
    description: {
      es: 'Crimen, personajes cruzados y libertad de mundo abierto en Vice City y el estado de Leonida.',
      en: 'Crime, intertwined characters and open-world freedom across Vice City and the state of Leonida.',
    },
    tags: { es: ['Mundo abierto', 'Acción', 'Narrativa'], en: ['Open world', 'Action', 'Story'] },
    filters: ['open-world', 'story'],
    platform: 'Rockstar Games',
    href: 'https://www.rockstargames.com/VI',
  },
  {
    id: 'arc-raiders',
    title: 'ARC Raiders',
    status: 'rotation',
    image: '/games/arc-raiders.jpg',
    accent: '#ff7b35',
    description: {
      es: 'Aventura de extracción PvPvE donde cada incursión mezcla exploración, tensión y decisiones de equipo.',
      en: 'A PvPvE extraction adventure where every run mixes exploration, tension and team decisions.',
    },
    tags: { es: ['Extracción', 'Cooperativo', 'PvPvE'], en: ['Extraction', 'Co-op', 'PvPvE'] },
    filters: ['competitive', 'coop', 'survival'],
    platform: 'PC · Console',
    href: 'https://store.steampowered.com/app/1808500/ARC_Raiders/',
  },
  {
    id: 'the-cycle',
    title: 'The Cycle: Frontier',
    status: 'favorite',
    image: '/games/the-cycle.jpg',
    accent: '#63d7df',
    description: {
      es: 'Mi favorito: extracción, riesgo y encuentros imprevisibles en el planeta hostil de Fortuna III.',
      en: 'My favourite: extraction, risk and unpredictable encounters on the hostile planet Fortuna III.',
    },
    tags: { es: ['Favorito', 'Extracción', 'Ciencia ficción'], en: ['Favourite', 'Extraction', 'Sci-fi'] },
    filters: ['competitive', 'coop', 'survival'],
    platform: 'PC',
    href: 'https://store.steampowered.com/app/868270/The_Cycle_Frontier/',
  },
  {
    id: 'fortnite',
    title: 'Fortnite',
    status: 'library',
    image: '/games/fortnite.webp',
    mark: 'FN',
    accent: '#9b68ff',
    description: {
      es: 'Battle royale en evolución constante con construcción, modos competitivos y experiencias creadas por la comunidad.',
      en: 'An ever-evolving battle royale with building, competitive modes and community-made experiences.',
    },
    tags: { es: ['Battle royale', 'Competitivo', 'Creativo'], en: ['Battle royale', 'Competitive', 'Creative'] },
    filters: ['competitive', 'coop', 'creative'],
    platform: 'Epic Games',
    href: 'https://www.fortnite.com/',
  },
  {
    id: 'valorant',
    title: 'VALORANT',
    status: 'library',
    image: '/games/valorant.webp',
    mark: 'V',
    accent: '#ff4655',
    description: {
      es: 'Shooter táctico 5v5 donde la precisión, la información y las habilidades de cada agente deciden la ronda.',
      en: 'A tactical 5v5 shooter where precision, information and each agent’s abilities decide the round.',
    },
    tags: { es: ['Táctico', '5v5', 'Competitivo'], en: ['Tactical', '5v5', 'Competitive'] },
    filters: ['competitive', 'coop'],
    platform: 'Riot Games',
    href: 'https://playvalorant.com/',
  },
  {
    id: 'red-dead-redemption-2',
    title: 'Red Dead Redemption 2',
    status: 'library',
    image: '/games/red-dead-redemption-2.jpg',
    accent: '#d42b1e',
    description: {
      es: 'Un western de mundo abierto sobre Arthur Morgan, lealtad y supervivencia al final de la era de los forajidos.',
      en: 'An open-world western about Arthur Morgan, loyalty and survival at the end of the outlaw era.',
    },
    tags: { es: ['Western', 'Mundo abierto', 'Historia'], en: ['Western', 'Open world', 'Story'] },
    filters: ['open-world', 'story'],
    platform: 'PC · Console',
    href: 'https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/',
  },
  {
    id: 'forza-horizon-5',
    title: 'Forza Horizon 5',
    status: 'library',
    image: '/games/forza-horizon-5.jpg',
    accent: '#e94ba9',
    description: {
      es: 'Conducción de mundo abierto por México con cientos de coches, festivales y carreras para todos los ritmos.',
      en: 'Open-world driving across Mexico with hundreds of cars, festivals and races for every pace.',
    },
    tags: { es: ['Carreras', 'Mundo abierto', 'Coches'], en: ['Racing', 'Open world', 'Cars'] },
    filters: ['open-world', 'competitive'],
    platform: 'PC · Xbox',
    href: 'https://store.steampowered.com/app/1551360/Forza_Horizon_5/',
  },
  {
    id: 'clash-royale',
    title: 'Clash Royale',
    status: 'library',
    image: '/games/clash-royale.webp',
    mark: 'CR',
    accent: '#55a6ff',
    description: {
      es: 'Duelos rápidos de estrategia en tiempo real, mazos de cartas y lectura constante del rival.',
      en: 'Fast real-time strategy duels built around card decks and continuously reading the opponent.',
    },
    tags: { es: ['Estrategia', 'Cartas', 'Competitivo'], en: ['Strategy', 'Cards', 'Competitive'] },
    filters: ['competitive'],
    platform: 'Mobile',
    href: 'https://supercell.com/en/games/clashroyale/',
  },
  {
    id: 'cyberpunk-2077',
    title: 'Cyberpunk 2077',
    status: 'library',
    image: '/games/cyberpunk-2077.jpg',
    accent: '#f4ed32',
    description: {
      es: 'RPG de acción en Night City, una ciudad de implantes, poder corporativo y decisiones personales.',
      en: 'An action RPG set in Night City, a city of implants, corporate power and personal choices.',
    },
    tags: { es: ['RPG', 'Mundo abierto', 'Ciencia ficción'], en: ['RPG', 'Open world', 'Sci-fi'] },
    filters: ['open-world', 'story'],
    platform: 'PC · Console',
    href: 'https://store.steampowered.com/app/1091500/Cyberpunk_2077/',
  },
  {
    id: 'rust',
    title: 'Rust',
    status: 'library',
    image: '/games/rust.jpg',
    accent: '#ad4f3d',
    description: {
      es: 'Supervivencia multijugador sin concesiones: recolectar, construir, negociar y defenderse de otros jugadores.',
      en: 'Unforgiving multiplayer survival: gather, build, negotiate and defend against other players.',
    },
    tags: { es: ['Supervivencia', 'PvP', 'Construcción'], en: ['Survival', 'PvP', 'Building'] },
    filters: ['competitive', 'coop', 'survival', 'creative'],
    platform: 'PC · Console',
    href: 'https://store.steampowered.com/app/252490/Rust/',
  },
  {
    id: 'star-wars-outlaws',
    title: 'Star Wars Outlaws',
    status: 'library',
    image: '/games/star-wars-outlaws.jpg',
    accent: '#e3a647',
    description: {
      es: 'Aventura de mundo abierto entre sindicatos criminales, golpes arriesgados y viajes por la galaxia.',
      en: 'An open-world adventure across criminal syndicates, risky heists and journeys through the galaxy.',
    },
    tags: { es: ['Star Wars', 'Aventura', 'Mundo abierto'], en: ['Star Wars', 'Adventure', 'Open world'] },
    filters: ['open-world', 'story'],
    platform: 'PC · Console',
    href: 'https://store.steampowered.com/app/2842040/Star_Wars_Outlaws/',
  },
  {
    id: 'hogwarts-legacy',
    title: 'Hogwarts Legacy',
    status: 'library',
    image: '/games/hogwarts-legacy.jpg',
    accent: '#9f8754',
    description: {
      es: 'RPG de acción que permite explorar Hogwarts y su mundo mágico en el siglo XIX.',
      en: 'An action RPG that opens Hogwarts and its magical world for exploration in the 1800s.',
    },
    tags: { es: ['Magia', 'RPG', 'Exploración'], en: ['Magic', 'RPG', 'Exploration'] },
    filters: ['open-world', 'story'],
    platform: 'PC · Console',
    href: 'https://store.steampowered.com/app/990080/Hogwarts_Legacy/',
  },
  {
    id: 'geoguessr',
    title: 'GeoGuessr',
    status: 'library',
    image: '/games/geoguessr.webp',
    mark: 'GEO',
    accent: '#e74755',
    description: {
      es: 'Geografía convertida en juego: observar pistas del entorno y localizar cualquier rincón del mundo.',
      en: 'Geography turned into a game: read environmental clues and locate places anywhere in the world.',
    },
    tags: { es: ['Geografía', 'Deducción', 'Social'], en: ['Geography', 'Deduction', 'Social'] },
    filters: ['competitive', 'creative'],
    platform: 'Web · Mobile',
    href: 'https://www.geoguessr.com/',
  },
  {
    id: 'the-last-of-us-part-ii',
    title: 'The Last of Us Part II Remastered',
    status: 'library',
    image: '/games/the-last-of-us-part-ii.jpg',
    accent: '#8b958f',
    description: {
      es: 'Acción y supervivencia centradas en Ellie, con una narrativa intensa sobre pérdida y consecuencias.',
      en: 'Action and survival centred on Ellie, with an intense story about loss and consequences.',
    },
    tags: { es: ['Narrativa', 'Supervivencia', 'Acción'], en: ['Story', 'Survival', 'Action'] },
    filters: ['story', 'survival'],
    platform: 'PC · PlayStation',
    href: 'https://store.steampowered.com/app/2531310/The_Last_of_Us_Part_II_Remastered/',
  },
  {
    id: 'minecraft',
    title: 'Minecraft',
    status: 'library',
    image: '/games/minecraft.webp',
    mark: 'MC',
    accent: '#67a647',
    description: {
      es: 'Un sandbox de bloques para explorar, sobrevivir, automatizar y construir sin un único camino correcto.',
      en: 'A block-based sandbox for exploring, surviving, automating and building without one correct path.',
    },
    tags: { es: ['Sandbox', 'Construcción', 'Supervivencia'], en: ['Sandbox', 'Building', 'Survival'] },
    filters: ['coop', 'survival', 'creative', 'open-world'],
    platform: 'PC · Console · Mobile',
    href: 'https://www.minecraft.net/',
  },
  {
    id: 'genshin-impact',
    title: 'Genshin Impact',
    status: 'library',
    image: '/games/genshin-impact.webp',
    mark: 'GI',
    accent: '#b9d7ff',
    description: {
      es: 'RPG de acción y mundo abierto basado en exploración, equipos de personajes y reacciones elementales.',
      en: 'An open-world action RPG built around exploration, character teams and elemental reactions.',
    },
    tags: { es: ['RPG', 'Elemental', 'Mundo abierto'], en: ['RPG', 'Elemental', 'Open world'] },
    filters: ['open-world', 'story', 'coop'],
    platform: 'PC · Console · Mobile',
    href: 'https://genshin.hoyoverse.com/',
  },
  {
    id: 'overwatch-2',
    title: 'Overwatch 2',
    status: 'library',
    image: '/games/overwatch-2.jpg',
    accent: '#f59a23',
    description: {
      es: 'Hero shooter por equipos con roles definidos, ritmo alto y combinaciones de habilidades.',
      en: 'A team hero shooter with defined roles, fast pacing and ability combinations.',
    },
    tags: { es: ['Hero shooter', 'Equipo', 'Competitivo'], en: ['Hero shooter', 'Team', 'Competitive'] },
    filters: ['competitive', 'coop'],
    platform: 'PC · Console',
    href: 'https://store.steampowered.com/app/2357570/Overwatch_2/',
  },
  {
    id: 'marvel-spiderman-2',
    title: "Marvel's Spider-Man 2",
    status: 'library',
    image: '/games/marvel-spiderman-2.jpg',
    accent: '#e23b36',
    description: {
      es: 'Aventura de acción con Peter Parker y Miles Morales defendiendo una Nueva York más amplia y vertical.',
      en: 'An action adventure with Peter Parker and Miles Morales defending a larger, more vertical New York.',
    },
    tags: { es: ['Superhéroes', 'Acción', 'Mundo abierto'], en: ['Superheroes', 'Action', 'Open world'] },
    filters: ['open-world', 'story'],
    platform: 'PC · PlayStation',
    href: 'https://store.steampowered.com/app/2651280/Marvels_SpiderMan_2/',
  },
  {
    id: 'roblox',
    title: 'Roblox',
    status: 'library',
    image: '/games/roblox.webp',
    mark: 'R',
    accent: '#ffffff',
    description: {
      es: 'Una plataforma social de experiencias creadas por usuarios, desde minijuegos hasta mundos completos.',
      en: 'A social platform for user-made experiences, from quick minigames to complete worlds.',
    },
    tags: { es: ['Social', 'Creación', 'Multijugador'], en: ['Social', 'Creation', 'Multiplayer'] },
    filters: ['coop', 'creative'],
    platform: 'PC · Console · Mobile',
    href: 'https://www.roblox.com/',
  },
  {
    id: 'zenless-zone-zero',
    title: 'Zenless Zone Zero',
    status: 'library',
    image: '/games/zenless-zone-zero.webp',
    mark: 'ZZZ',
    accent: '#d6ff3f',
    description: {
      es: 'RPG de acción urbano con combates veloces, estilo audiovisual marcado y equipos de agentes.',
      en: 'An urban action RPG with fast combat, a bold audiovisual style and teams of agents.',
    },
    tags: { es: ['Acción', 'RPG', 'Urbano'], en: ['Action', 'RPG', 'Urban'] },
    filters: ['story'],
    platform: 'PC · Console · Mobile',
    href: 'https://zenless.hoyoverse.com/',
  },
  {
    id: 'counter-strike-2',
    title: 'Counter-Strike 2',
    status: 'library',
    image: '/games/counter-strike-2.jpg',
    accent: '#e9a23b',
    description: {
      es: 'Shooter competitivo de rondas donde economía, utilidad, puntería y coordinación pesan por igual.',
      en: 'A round-based competitive shooter where economy, utility, aim and coordination matter equally.',
    },
    tags: { es: ['Táctico', 'FPS', 'Competitivo'], en: ['Tactical', 'FPS', 'Competitive'] },
    filters: ['competitive', 'coop'],
    platform: 'PC',
    href: 'https://store.steampowered.com/app/730/CounterStrike_2/',
  },
  {
    id: 'phasmophobia',
    title: 'Phasmophobia',
    status: 'library',
    image: '/games/phasmophobia.jpg',
    accent: '#7b8d8c',
    description: {
      es: 'Investigación paranormal cooperativa basada en evidencias, comunicación y mucho control de los nervios.',
      en: 'Co-operative paranormal investigation built around evidence, communication and keeping your nerve.',
    },
    tags: { es: ['Terror', 'Cooperativo', 'Investigación'], en: ['Horror', 'Co-op', 'Investigation'] },
    filters: ['coop', 'survival'],
    platform: 'PC · Console',
    href: 'https://store.steampowered.com/app/739630/Phasmophobia/',
  },
]

export type HardwareId = 'cpu' | 'gpu' | 'memory' | 'board' | 'storage' | 'power'

export type HardwareItem = {
  id: HardwareId
  label: LocalizedText
  model: string
  metric: string
  summary: LocalizedText
  details: LocalizedList
  source?: {
    href: string
    label: LocalizedText
  }
}

export const hardware: HardwareItem[] = [
  {
    id: 'cpu',
    label: { es: 'Procesador', en: 'Processor' },
    model: 'AMD Ryzen 7 7800X3D',
    metric: '8C / 16T',
    summary: {
      es: 'El centro del equipo: arquitectura Zen 4 y 3D V-Cache orientada a un rendimiento especialmente fuerte en juegos.',
      en: 'The centre of the build: Zen 4 architecture and 3D V-Cache tuned for especially strong gaming performance.',
    },
    details: { es: ['8 núcleos', '16 hilos', 'Socket AM5'], en: ['8 cores', '16 threads', 'AM5 socket'] },
  },
  {
    id: 'gpu',
    label: { es: 'Tarjeta gráfica', en: 'Graphics card' },
    model: 'NVIDIA GeForce RTX 5070',
    metric: 'RTX 5070',
    summary: {
      es: 'La pieza gráfica principal para jugar a alta calidad, acelerar cargas creativas y mover interfaces fluidas.',
      en: 'The main graphics engine for high-quality gaming, accelerated creative workloads and fluid interfaces.',
    },
    details: { es: ['GPU dedicada NVIDIA', 'Aceleración RTX', 'Configuración detectada localmente'], en: ['Dedicated NVIDIA GPU', 'RTX acceleration', 'Locally detected configuration'] },
  },
  {
    id: 'memory',
    label: { es: 'Memoria', en: 'Memory' },
    model: 'Corsair DDR5',
    metric: '16 GB · 6000',
    summary: {
      es: 'Memoria DDR5 configurada a 6000 MT/s para mantener baja latencia y buen ritmo entre juego, Discord y herramientas.',
      en: 'DDR5 memory configured at 6000 MT/s to keep latency low across games, Discord and creative tools.',
    },
    details: { es: ['16 GB instalados', '6000 MT/s', 'Módulo CMH32GX5M2B6000C30'], en: ['16 GB installed', '6000 MT/s', 'CMH32GX5M2B6000C30 module'] },
  },
  {
    id: 'board',
    label: { es: 'Placa base', en: 'Motherboard' },
    model: 'MSI X670E Gaming Plus WiFi',
    metric: 'X670E · AM5',
    summary: {
      es: 'La base de la configuración AM5, con conectividad Wi-Fi y margen para ampliar almacenamiento y periféricos.',
      en: 'The foundation of the AM5 build, with Wi-Fi connectivity and room for storage and peripheral expansion.',
    },
    details: { es: ['Chipset X670E', 'Socket AM5', 'Wi-Fi integrado'], en: ['X670E chipset', 'AM5 socket', 'Integrated Wi-Fi'] },
  },
  {
    id: 'storage',
    label: { es: 'Almacenamiento', en: 'Storage' },
    model: 'WD_BLACK SN770 + unidades secundarias',
    metric: '1 TB NVMe',
    summary: {
      es: 'Un NVMe WD_BLACK SN770 de 1 TB como unidad principal, acompañado de SSD y HDD secundarios para biblioteca y archivo.',
      en: 'A 1 TB WD_BLACK SN770 NVMe as the primary drive, backed by secondary SSDs and an HDD for library and archive storage.',
    },
    details: {
      es: ['WD_BLACK SN770 · 1 TB', 'Samsung 840 EVO · 250 GB', 'Toshiba HDD · 1 TB', 'Dos SSD WDC · 256 GB'],
      en: ['WD_BLACK SN770 · 1 TB', 'Samsung 840 EVO · 250 GB', 'Toshiba HDD · 1 TB', 'Two WDC SSDs · 256 GB'],
    },
  },
]

export const dreamHardware: HardwareItem[] = [
  {
    id: 'gpu',
    label: { es: 'Gráfica objetivo', en: 'Target graphics card' },
    model: 'NVIDIA GeForce RTX 5090',
    metric: '32 GB GDDR7',
    summary: {
      es: 'La meta gráfica del setup: la GeForce de referencia más potente de NVIDIA, planteada para juego 4K extremo, creación y cargas aceleradas por IA.',
      en: 'The graphics target for the build: NVIDIA’s most powerful reference GeForce, intended for extreme 4K gaming, creation and AI-accelerated workloads.',
    },
    details: {
      es: ['Arquitectura Blackwell', '21.760 núcleos CUDA', '32 GB GDDR7 · 512-bit', '575 W TGP'],
      en: ['Blackwell architecture', '21,760 CUDA cores', '32 GB GDDR7 · 512-bit', '575 W TGP'],
    },
    source: {
      href: 'https://www.nvidia.com/en-gb/geforce/graphics-cards/50-series/rtx-5090/',
      label: { es: 'Ficha oficial de NVIDIA', en: 'Official NVIDIA specifications' },
    },
  },
  {
    id: 'cpu',
    label: { es: 'Procesador objetivo', en: 'Target processor' },
    model: 'AMD Ryzen 9 9950X3D2 Dual Edition',
    metric: '16C / 32T',
    summary: {
      es: 'Un objetivo de plataforma AM5 de gama entusiasta, con 3D V-Cache en ambos chiplets para combinar juego, desarrollo y creación exigente.',
      en: 'An enthusiast-class AM5 platform target, with 3D V-Cache on both chiplets to combine gaming, development and demanding creative work.',
    },
    details: {
      es: ['Zen 5 · 16 núcleos', 'Hasta 5,6 GHz', '208 MB de caché L2 + L3', '200 W · PCIe 5.0'],
      en: ['Zen 5 · 16 cores', 'Up to 5.6 GHz', '208 MB L2 + L3 cache', '200 W · PCIe 5.0'],
    },
    source: {
      href: 'https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-9-9950x3d2-dual-edition.html',
      label: { es: 'Ficha oficial de AMD', en: 'Official AMD specifications' },
    },
  },
  {
    id: 'board',
    label: { es: 'Placa base objetivo', en: 'Target motherboard' },
    model: 'MSI MEG X870E GODLIKE MAX',
    metric: 'X870E · AM5',
    summary: {
      es: 'La base soñada para la plataforma: conectividad de primer nivel, amplia expansión PCIe 5.0 y margen para evolucionar el equipo.',
      en: 'The dream foundation for the platform: flagship connectivity, broad PCIe 5.0 expansion and room for the build to evolve.',
    },
    details: {
      es: ['Hasta 256 GB DDR5', '7 ranuras M.2', 'Wi-Fi 7 · USB4 40 Gbps', 'LAN 10 Gb + 5 Gb'],
      en: ['Up to 256 GB DDR5', '7 M.2 slots', 'Wi-Fi 7 · USB4 40 Gbps', '10 Gb + 5 Gb LAN'],
    },
    source: {
      href: 'https://www.msi.com/Motherboard/MEG-X870E-GODLIKE-MAX/Specification',
      label: { es: 'Especificaciones oficiales de MSI', en: 'Official MSI specifications' },
    },
  },
  {
    id: 'memory',
    label: { es: 'Memoria objetivo', en: 'Target memory' },
    model: 'Corsair Dominator Titanium RGB',
    metric: '96 GB · 6000',
    summary: {
      es: 'Un kit premium de dos módulos para ganar capacidad sin cargar cuatro ranuras, manteniendo una configuración DDR5 rápida y de baja latencia.',
      en: 'A premium two-module kit that adds capacity without loading all four slots, while keeping a fast, low-latency DDR5 configuration.',
    },
    details: {
      es: ['96 GB · 2 × 48 GB', 'DDR5-6000 · CL30', 'AMD EXPO + Intel XMP', 'Disipadores de aluminio'],
      en: ['96 GB · 2 × 48 GB', 'DDR5-6000 · CL30', 'AMD EXPO + Intel XMP', 'Aluminium heat spreaders'],
    },
    source: {
      href: 'https://www.corsair.com/us/en/p/memory/cmp96gx5m2b6000z30/dominator-titanium-rgb-96gb-2x48gb-ddr5-dram-6000mt-s-cl30-amd-expo-intel-xmp-memory-kit-grey-cmp96gx5m2b6000z30',
      label: { es: 'Ficha oficial de Corsair', en: 'Official Corsair specifications' },
    },
  },
  {
    id: 'storage',
    label: { es: 'Almacenamiento objetivo', en: 'Target storage' },
    model: 'Samsung 9100 PRO 8 TB',
    metric: '14,8 GB/s',
    summary: {
      es: 'Almacenamiento PCIe 5.0 de gran capacidad para biblioteca, proyectos y edición, con velocidades de referencia de nueva generación.',
      en: 'High-capacity PCIe 5.0 storage for the library, projects and editing, with next-generation reference speeds.',
    },
    details: {
      es: ['8 TB · NVMe 2.0', 'Lectura hasta 14.800 MB/s', 'Escritura hasta 13.400 MB/s', '4.800 TBW'],
      en: ['8 TB · NVMe 2.0', 'Up to 14,800 MB/s read', 'Up to 13,400 MB/s write', '4,800 TBW'],
    },
    source: {
      href: 'https://download.semiconductor.samsung.com/resources/data-sheet/Samsung_NVMe_SSD_9100_PRO_Datasheet_Rev.2.0.pdf',
      label: { es: 'Ficha técnica oficial de Samsung', en: 'Official Samsung data sheet' },
    },
  },
  {
    id: 'power',
    label: { es: 'Fuente objetivo', en: 'Target power supply' },
    model: 'Corsair HX1500i',
    metric: '1500 W',
    summary: {
      es: 'La fuente prevista para alimentar el conjunto con margen, conectividad nativa para GPU de nueva generación y una plataforma ATX actual.',
      en: 'The planned power supply for comfortable headroom, native next-generation GPU connectivity and a modern ATX platform.',
    },
    details: {
      es: ['1500 W · 80 PLUS Platinum', 'ATX 3.1 · PCIe 5.1', 'Doble cable 12V-2x6', 'Garantía de 10 años'],
      en: ['1500 W · 80 PLUS Platinum', 'ATX 3.1 · PCIe 5.1', 'Dual 12V-2x6 cables', '10-year warranty'],
    },
    source: {
      href: 'https://www.corsair.com/us/en/p/psu/cp-9020309-na/hx1500i-fully-modular-ultra-low-noise-platinum-atx-1500-watt-pc-power-supply-cp-9020309-na',
      label: { es: 'Ficha oficial de Corsair', en: 'Official Corsair specifications' },
    },
  },
]
