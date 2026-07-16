import { useEffect, useRef } from 'react'

type Point = {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  phase: number
}

export function AmbientField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lowPower = window.matchMedia('(pointer: coarse), (max-width: 820px)').matches
    const pointer = { x: -1000, y: -1000 }
    let points: Point[] = []
    let frame = 0
    let width = 0
    let height = 0
    let lastDraw = 0

    const createPoints = () => {
      const maximum = lowPower ? 30 : 46
      const minimum = lowPower ? 16 : 22
      const count = Math.min(maximum, Math.max(minimum, Math.floor((width * height) / (lowPower ? 38_000 : 28_000))))
      points = Array.from({ length: count }, (_, index) => ({
        x: (index * 137.5) % width,
        y: (index * 83.7) % height,
        vx: ((index % 3) - 1) * 0.055,
        vy: (((index + 1) % 3) - 1) * 0.045,
        radius: index % 7 === 0 ? 1.7 : 1,
        phase: index * 0.47,
      }))
    }

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      createPoints()
    }

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
    }

    const draw = (time = 0) => {
      const minimumFrameDuration = lowPower ? 32 : 20
      if (!reduceMotion && time - lastDraw < minimumFrameDuration) {
        frame = window.requestAnimationFrame(draw)
        return
      }
      lastDraw = time
      context.clearRect(0, 0, width, height)

      points.forEach((point, index) => {
        if (!reduceMotion) {
          point.x += point.vx
          point.y += point.vy
          if (point.x < -12) point.x = width + 12
          if (point.x > width + 12) point.x = -12
          if (point.y < -12) point.y = height + 12
          if (point.y > height + 12) point.y = -12
        }

        const pointerDistance = Math.hypot(point.x - pointer.x, point.y - pointer.y)
        const active = pointerDistance < 180
        const pulse = reduceMotion ? 0.45 : 0.38 + Math.sin(time * 0.00055 + point.phase) * 0.12

        context.beginPath()
        context.arc(point.x, point.y, point.radius + (active ? 0.7 : 0), 0, Math.PI * 2)
        context.fillStyle = active ? `rgba(240, 162, 74, ${pulse + 0.18})` : `rgba(129, 216, 204, ${pulse})`
        context.fill()

        for (let otherIndex = index + 1; otherIndex < points.length; otherIndex += 1) {
          const other = points[otherIndex]
          const distance = Math.hypot(point.x - other.x, point.y - other.y)
          if (distance < 136) {
            const opacity = (1 - distance / 136) * (active ? 0.16 : 0.07)
            context.beginPath()
            context.moveTo(point.x, point.y)
            context.lineTo(other.x, other.y)
            context.strokeStyle = active ? `rgba(240, 162, 74, ${opacity})` : `rgba(142, 157, 158, ${opacity})`
            context.lineWidth = 0.65
            context.stroke()
          }
        }
      })

      if (!reduceMotion) frame = window.requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    draw()

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="ambient-field" aria-hidden="true" />
}
