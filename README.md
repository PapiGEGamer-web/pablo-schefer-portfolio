# Pablo Schefer Orduña — Portfolio

Portafolio bilingüe y multipágina centrado en Discord, vibecoding y colaboración en comunidades y proyectos como FNLB y KernelOS.

Producción: [pablo-schefer.vercel.app](https://pablo-schefer.vercel.app)

## Desarrollo

```bash
pnpm install
pnpm dev
```

## Verificación

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Stack

- React + TypeScript + Vite
- React Router
- Motion for React
- CSS/SVG/Canvas nativos
- Vercel Function para normalizar el widget público de Discord
- Integración de presencia de Spotify mediante Lanyard REST + WebSocket
- Despliegue SPA compatible con rutas directas en Vercel

## Rutas

- `/` — portada
- `/perfil` — perfil completo
- `/comunidades` — experiencia de moderación
- `/comunidades/edgar-pons` — monitor interactivo del widget público de Discord
- `/juegos-y-equipo` — rotación, juego favorito, biblioteca de 20 títulos y hardware
- `/musica` — monitor de Spotify preparado para activación pública

La función `api/edgar-community.ts` utiliza únicamente los endpoints públicos de Discord. No requiere bot, token ni acceso a canales privados. Discord impone una caché de 300 segundos a la URL estable del widget; la función comparte una consulta versionada por intervalos para obtener un snapshot público nuevo cada 15 segundos. La interfaz ofrece actualización manual y diferencia la hora de comprobación del último cambio detectado.

La ruta `/musica` no incluye credenciales de Spotify. Se suscribe a la presencia pública de Discord mediante Lanyard y se activa automáticamente cuando el usuario `633600812970541056` forma parte voluntariamente de ese servicio y muestra Spotify en Discord.

Las portadas se sirven localmente. Sus orígenes promocionales se documentan en [GAME_ASSETS.md](./GAME_ASSETS.md).
