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
- Despliegue SPA compatible con rutas directas en Vercel

## Rutas

- `/` — portada
- `/perfil` — perfil completo
- `/comunidades` — experiencia de moderación
- `/comunidades/edgar-pons` — panel público de Discord casi en tiempo real

La función `api/edgar-community.ts` utiliza únicamente los endpoints públicos de Discord. No requiere bot, token ni acceso a canales privados.
