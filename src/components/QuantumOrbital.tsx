import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type WheelEvent as ReactWheelEvent } from 'react'
import { Atom, Pause, Play, RotateCcw, Sparkles } from 'lucide-react'
import type { Locale } from '../content'
import './QuantumOrbital.css'

type OrbitalSettings = {
  n: number
  l: number
  m: number
  intensity: number
  clipX: number
  clipY: number
  clipZ: number
}

type OrbitalCloud = {
  positions: Float32Array
  signs: Int8Array
  strengths: Float32Array
  count: number
}

const defaultSettings: OrbitalSettings = {
  n: 4,
  l: 3,
  m: 1,
  intensity: 1.4,
  clipX: 0,
  clipY: 0,
  clipZ: 0,
}

function seededRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    return (state >>> 0) / 4_294_967_296
  }
}

function laguerre(order: number, alpha: number, x: number) {
  if (order === 0) return 1
  if (order === 1) return 1 + alpha - x
  let previous = 1
  let current = 1 + alpha - x
  for (let index = 2; index <= order; index += 1) {
    const next = ((2 * index - 1 + alpha - x) * current - (index - 1 + alpha) * previous) / index
    previous = current
    current = next
  }
  return current
}

function associatedLegendre(l: number, mValue: number, x: number) {
  const m = Math.abs(mValue)
  let pmm = 1
  if (m > 0) {
    const root = Math.sqrt(Math.max(0, (1 - x) * (1 + x)))
    let factor = 1
    for (let index = 1; index <= m; index += 1) {
      pmm *= -factor * root
      factor += 2
    }
  }
  if (l === m) return pmm
  let pm1m = x * (2 * m + 1) * pmm
  if (l === m + 1) return pm1m
  for (let degree = m + 2; degree <= l; degree += 1) {
    const next = ((2 * degree - 1) * x * pm1m - (degree + m - 1) * pmm) / (degree - m)
    pmm = pm1m
    pm1m = next
  }
  return pm1m
}

function normalizedCdf(size: number, weightAt: (index: number) => number) {
  const cdf = new Float64Array(size)
  let total = 0
  for (let index = 0; index < size; index += 1) {
    total += Math.max(0, weightAt(index))
    cdf[index] = total
  }
  if (total <= 0) return cdf
  for (let index = 0; index < size; index += 1) cdf[index] /= total
  return cdf
}

function sampleCdf(cdf: Float64Array, randomValue: number) {
  let low = 0
  let high = cdf.length - 1
  while (low < high) {
    const middle = (low + high) >>> 1
    if (cdf[middle] < randomValue) low = middle + 1
    else high = middle
  }
  return low
}

function createOrbitalCloud(settings: OrbitalSettings, compact: boolean): OrbitalCloud {
  const count = compact ? 8_500 : 17_000
  const positions = new Float32Array(count * 3)
  const signs = new Int8Array(count)
  const strengths = new Float32Array(count)
  const random = seededRandom(settings.n * 100_003 + settings.l * 1_009 + (settings.m + 8) * 97)
  const radialSize = 1_536
  const angularSize = 1_024
  const radialMax = Math.max(18, settings.n * settings.n * 4.6)
  const radialOrder = settings.n - settings.l - 1
  const radialAlpha = 2 * settings.l + 1

  const radialCdf = normalizedCdf(radialSize, (index) => {
    const radius = (index / (radialSize - 1)) * radialMax
    const rho = (2 * radius) / settings.n
    const amplitude = Math.exp(-rho / 2) * Math.pow(rho, settings.l) * laguerre(radialOrder, radialAlpha, rho)
    return radius * radius * amplitude * amplitude
  })

  const thetaCdf = normalizedCdf(angularSize, (index) => {
    const theta = (index / (angularSize - 1)) * Math.PI
    const angular = associatedLegendre(settings.l, settings.m, Math.cos(theta))
    return Math.sin(theta) * angular * angular
  })

  for (let point = 0; point < count; point += 1) {
    const radialIndex = sampleCdf(radialCdf, random())
    const thetaIndex = sampleCdf(thetaCdf, random())
    const radius = (radialIndex / (radialSize - 1)) * radialMax
    const theta = (thetaIndex / (angularSize - 1)) * Math.PI
    const phi = random() * Math.PI * 2
    const normalizedRadius = radius / radialMax
    const sinTheta = Math.sin(theta)
    const positionIndex = point * 3
    positions[positionIndex] = normalizedRadius * sinTheta * Math.cos(phi)
    positions[positionIndex + 1] = normalizedRadius * Math.cos(theta)
    positions[positionIndex + 2] = normalizedRadius * sinTheta * Math.sin(phi)

    const rho = (2 * radius) / settings.n
    const radialWave = Math.exp(-rho / 2) * Math.pow(rho, settings.l) * laguerre(radialOrder, radialAlpha, rho)
    const angularWave = associatedLegendre(settings.l, settings.m, Math.cos(theta))
    signs[point] = radialWave * angularWave * Math.cos(settings.m * phi) >= 0 ? 1 : -1
    strengths[point] = Math.min(1, 0.22 + Math.pow(random(), 0.38) * 0.78)
  }

  return { positions, signs, strengths, count }
}

function RangeControl({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
}) {
  return (
    <label className="quantum-control">
      <span><strong>{label}</strong><output>{Number.isInteger(step) ? value : value.toFixed(1)}</output></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  )
}

export function QuantumOrbital({ locale }: { locale: Locale }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef(0)
  const rotationRef = useRef({ x: -0.24, y: 0.58 })
  const dragRef = useRef({ active: false, x: 0, y: 0 })
  const zoomRef = useRef(1)
  const [settings, setSettings] = useState(defaultSettings)
  const [autoRotate, setAutoRotate] = useState(true)
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 700px)').matches)
  const cloud = useMemo(
    () => createOrbitalCloud({ ...defaultSettings, n: settings.n, l: settings.l, m: settings.m }, compact),
    [compact, settings.l, settings.m, settings.n],
  )

  const labels = locale === 'es' ? {
    title: 'Orbital cuántico interactivo',
    live: 'Simulación local · Tiempo real',
    drag: 'Arrastra para rotar · Rueda para ampliar',
    quantum: 'Números cuánticos',
    visual: 'Visualización',
    principal: 'n · Principal',
    azimuthal: 'l · Azimutal',
    magnetic: 'm · Magnético',
    intensity: 'Intensidad de color',
    clipping: 'Recorte de planos',
    reset: 'Restablecer',
    pause: 'Pausar rotación',
    play: 'Activar rotación',
    particles: 'partículas',
  } : {
    title: 'Interactive quantum orbital',
    live: 'Local simulation · Real time',
    drag: 'Drag to rotate · Wheel to zoom',
    quantum: 'Quantum numbers',
    visual: 'Visualization',
    principal: 'n · Principal',
    azimuthal: 'l · Azimuthal',
    magnetic: 'm · Magnetic',
    intensity: 'Colour intensity',
    clipping: 'Plane clipping',
    reset: 'Reset',
    pause: 'Pause rotation',
    play: 'Enable rotation',
    particles: 'particles',
  }

  const setValue = useCallback((key: keyof OrbitalSettings, value: number) => {
    setSettings((current) => {
      if (key === 'n') {
        const nextL = Math.min(current.l, value - 1)
        return { ...current, n: value, l: nextL, m: Math.max(-nextL, Math.min(nextL, current.m)) }
      }
      if (key === 'l') return { ...current, l: value, m: Math.max(-value, Math.min(value, current.m)) }
      return { ...current, [key]: value }
    })
  }, [])

  const reset = () => {
    setSettings(defaultSettings)
    rotationRef.current = { x: -0.24, y: 0.58 }
    zoomRef.current = 1
    setAutoRotate(true)
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { active: true, x: event.clientX, y: event.clientY }
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current.active) return
    rotationRef.current.y += (event.clientX - dragRef.current.x) * 0.006
    rotationRef.current.x = Math.max(-1.35, Math.min(1.35, rotationRef.current.x + (event.clientY - dragRef.current.y) * 0.006))
    dragRef.current = { active: true, x: event.clientX, y: event.clientY }
  }

  const endPointer = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    dragRef.current.active = false
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }

  const onWheel = (event: ReactWheelEvent<HTMLCanvasElement>) => {
    event.preventDefault()
    zoomRef.current = Math.max(0.58, Math.min(2.2, zoomRef.current * Math.exp(-event.deltaY * 0.001)))
  }

  useEffect(() => {
    const query = window.matchMedia('(max-width: 700px)')
    const update = () => setCompact(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return undefined

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.6)
      canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio))
      canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio))
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    let previousTime = performance.now()
    const render = (time: number) => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      const elapsed = Math.min(40, time - previousTime)
      previousTime = time
      if (autoRotate && !dragRef.current.active) rotationRef.current.y += elapsed * (0.00005 + Math.abs(settings.m) * 0.000018)

      context.clearRect(0, 0, width, height)
      const gradient = context.createRadialGradient(width * 0.5, height * 0.48, 0, width * 0.5, height * 0.48, Math.max(width, height) * 0.58)
      gradient.addColorStop(0, 'rgba(129, 216, 204, 0.055)')
      gradient.addColorStop(0.48, 'rgba(240, 162, 74, 0.018)')
      gradient.addColorStop(1, 'rgba(7, 9, 10, 0)')
      context.fillStyle = gradient
      context.fillRect(0, 0, width, height)

      const size = Math.min(width, height) * 0.62 * zoomRef.current
      const centerX = width / 2
      const centerY = height / 2
      const sinX = Math.sin(rotationRef.current.x)
      const cosX = Math.cos(rotationRef.current.x)
      const sinY = Math.sin(rotationRef.current.y)
      const cosY = Math.cos(rotationRef.current.y)
      const points = cloud.positions
      const alphaScale = Math.min(1.7, settings.intensity) * (compact ? 0.8 : 0.68)

      context.save()
      context.globalCompositeOperation = 'lighter'
      for (let point = 0; point < cloud.count; point += 1) {
        const offset = point * 3
        const x = points[offset]
        const y = points[offset + 1]
        const z = points[offset + 2]
        if (settings.clipX !== 0 && x * 100 > settings.clipX) continue
        if (settings.clipY !== 0 && y * 100 > settings.clipY) continue
        if (settings.clipZ !== 0 && z * 100 > settings.clipZ) continue

        const rotatedX = x * cosY + z * sinY
        const firstZ = -x * sinY + z * cosY
        const rotatedY = y * cosX - firstZ * sinX
        const rotatedZ = y * sinX + firstZ * cosX
        const perspective = 1 / (2.5 - rotatedZ * 0.58)
        const screenX = centerX + rotatedX * size * perspective
        const screenY = centerY + rotatedY * size * perspective
        if (screenX < 0 || screenX > width || screenY < 0 || screenY > height) continue

        const strength = cloud.strengths[point]
        const opacity = Math.min(0.7, (0.06 + strength * 0.22) * alphaScale * perspective)
        if (cloud.signs[point] > 0) context.fillStyle = `rgba(240, 162, 74, ${opacity})`
        else context.fillStyle = `rgba(129, 216, 204, ${opacity})`
        const pointSize = (compact ? 1.05 : 1.25) * (0.65 + perspective * 0.9)
        context.fillRect(screenX, screenY, pointSize, pointSize)
      }
      context.restore()

      context.strokeStyle = 'rgba(226, 225, 219, 0.16)'
      context.lineWidth = 1
      context.beginPath()
      context.arc(centerX, centerY, Math.min(width, height) * 0.34, 0, Math.PI * 2)
      context.stroke()
      context.strokeStyle = 'rgba(129, 216, 204, 0.2)'
      context.beginPath()
      context.ellipse(centerX, centerY, Math.min(width, height) * 0.39, Math.min(width, height) * 0.11, rotationRef.current.y * 0.22, 0, Math.PI * 2)
      context.stroke()

      animationRef.current = window.requestAnimationFrame(render)
    }
    animationRef.current = window.requestAnimationFrame(render)

    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(animationRef.current)
    }
  }, [autoRotate, cloud, compact, settings.clipX, settings.clipY, settings.clipZ, settings.intensity, settings.m])

  return (
    <section className="quantum-lab" aria-labelledby="quantum-lab-title">
      <header className="quantum-lab__header">
        <span><span className="status-dot" aria-hidden="true" />{labels.live}</span>
        <span>{cloud.count.toLocaleString(locale === 'es' ? 'es-ES' : 'en-US')} {labels.particles}</span>
      </header>

      <div className="quantum-stage">
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
          onWheel={onWheel}
          aria-label={labels.title}
        />
        <div className="quantum-stage__badge">
          <Atom size={18} aria-hidden="true" />
          <span><strong id="quantum-lab-title">{settings.n}{['s', 'p', 'd', 'f', 'g', 'h', 'i'][settings.l]}<sup>{settings.m}</sup></strong>{labels.drag}</span>
        </div>
        <div className="quantum-stage__actions">
          <button type="button" onClick={() => setAutoRotate((active) => !active)} aria-pressed={autoRotate}>
            {autoRotate ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
            {autoRotate ? labels.pause : labels.play}
          </button>
          <button type="button" onClick={reset}><RotateCcw size={16} aria-hidden="true" />{labels.reset}</button>
        </div>
      </div>

      <div className="quantum-console">
        <fieldset>
          <legend><Sparkles size={14} aria-hidden="true" />{labels.quantum}</legend>
          <RangeControl label={labels.principal} value={settings.n} min={1} max={7} onChange={(value) => setValue('n', value)} />
          <RangeControl label={labels.azimuthal} value={settings.l} min={0} max={settings.n - 1} onChange={(value) => setValue('l', value)} />
          <RangeControl label={labels.magnetic} value={settings.m} min={-settings.l} max={settings.l} onChange={(value) => setValue('m', value)} />
        </fieldset>
        <fieldset>
          <legend><Atom size={14} aria-hidden="true" />{labels.visual}</legend>
          <RangeControl label={labels.intensity} value={settings.intensity} min={0.1} max={3} step={0.1} onChange={(value) => setValue('intensity', value)} />
          <div className="quantum-clipping">
            <span>{labels.clipping}</span>
            <RangeControl label="X" value={settings.clipX} min={-100} max={100} onChange={(value) => setValue('clipX', value)} />
            <RangeControl label="Y" value={settings.clipY} min={-100} max={100} onChange={(value) => setValue('clipY', value)} />
            <RangeControl label="Z" value={settings.clipZ} min={-100} max={100} onChange={(value) => setValue('clipZ', value)} />
          </div>
        </fieldset>
      </div>
    </section>
  )
}
