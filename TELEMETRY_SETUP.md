# Monitor local de componentes

El portfolio no puede leer el hardware de un PC desde Vercel: el navegador solo permite mostrar datos que un agente local exponga explícitamente. El agente de este repositorio queda limitado a `127.0.0.1`, sin puertos públicos ni credenciales.

1. Desde la carpeta del proyecto ejecuta `pnpm install` una vez.
2. Ejecuta `pnpm telemetry:start` y déjalo abierto mientras quieras ver los datos.
3. Abre `https://pablo-schefer.vercel.app/juegos-y-equipo` en ese mismo ordenador.

Actualiza CPU, RAM, GPU, almacenamiento y red cada cinco segundos. El historial se guarda localmente en `.telemetry/metrics.sqlite` y se conserva un máximo de 31 días. La GPU se muestra como no disponible cuando el controlador no expone su uso a Windows; no se inventan datos.
