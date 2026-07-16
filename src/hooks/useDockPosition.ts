import { useMotionValue, useSpring } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

export type DockCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

type DockId = 'spotify' | 'anime'

const dockRegistry = new Map<DockId, DockCorner>()
const dockSubscribers = new Set<() => void>()
const dockOrder: DockId[] = ['spotify', 'anime']
const dockCorners: DockCorner[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

function isDockCorner(value: string | null): value is DockCorner {
  return value !== null && dockCorners.includes(value as DockCorner)
}

function readStoredCorner(storageKey: string) {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(storageKey)
  } catch {
    return null
  }
}

function removeStoredCorner(storageKey: string) {
  try {
    window.localStorage.removeItem(storageKey)
  } catch {
    // Storage may be unavailable in strict privacy modes.
  }
}

function storeCorner(storageKey: string, corner: DockCorner) {
  try {
    window.localStorage.setItem(storageKey, corner)
  } catch {
    // The dock still works for the current session without persistence.
  }
}

function viewportSize() {
  return {
    width: document.documentElement.clientWidth || window.innerWidth,
    height: document.documentElement.clientHeight || window.innerHeight,
  }
}

function notifyDockChange() {
  dockSubscribers.forEach((subscriber) => subscriber())
}

export function useDockPosition(storageKey: string, defaultCorner: DockCorner, id: DockId, active: boolean) {
  const storedValue = readStoredCorner(storageKey)
  const stored = isDockCorner(storedValue) ? storedValue : null
  const hasStoredPosition = Boolean(stored)
  const manualRef = useRef(hasStoredPosition)
  const [corner, setCorner] = useState<DockCorner>(stored ?? defaultCorner)
  const [isDragging, setIsDragging] = useState(false)
  const pointerOffset = useRef({ x: 0, y: 0 })
  const cardSize = useRef({ width: 0, height: 0 })
  const snapTimeout = useRef<number | null>(null)
  const targetX = useMotionValue(0)
  const targetY = useMotionValue(0)
  const smoothX = useSpring(targetX, { stiffness: 235, damping: 29, mass: 0.78 })
  const smoothY = useSpring(targetY, { stiffness: 235, damping: 29, mass: 0.78 })
  const [, forceRegistryUpdate] = useState(0)

  useEffect(() => {
    if (storedValue && !stored) removeStoredCorner(storageKey)
  }, [storageKey, stored, storedValue])

  useEffect(() => {
    const subscriber = () => forceRegistryUpdate((value) => value + 1)
    dockSubscribers.add(subscriber)
    return () => { dockSubscribers.delete(subscriber) }
  }, [])

  useEffect(() => {
    if (active) dockRegistry.set(id, corner)
    else dockRegistry.delete(id)
    notifyDockChange()
    return () => {
      dockRegistry.delete(id)
      notifyDockChange()
    }
  }, [active, corner, id])

  useEffect(() => {
    if (!manualRef.current) setCorner(defaultCorner)
  }, [defaultCorner])

  useEffect(() => () => {
    if (snapTimeout.current !== null) window.clearTimeout(snapTimeout.current)
  }, [])

  const fixedPosition = useCallback((nextCorner: DockCorner, bounds: DOMRect) => {
    const viewport = viewportSize()
    const mobile = viewport.width <= 700
    const edge = mobile ? 8 : 20
    const topOffset = mobile ? 92 : 118
    const stackGap = mobile ? 190 : 330
    const stackIndex = dockOrder.filter((dockId) => dockRegistry.get(dockId) === nextCorner && dockOrder.indexOf(dockId) < dockOrder.indexOf(id)).length
    const left = nextCorner.endsWith('left') ? edge : viewport.width - bounds.width - edge
    const top = nextCorner.startsWith('top')
      ? topOffset + (stackIndex * stackGap)
      : viewport.height - bounds.height - edge - (stackIndex * stackGap)
    return {
      left: Math.max(8, Math.min(viewport.width - bounds.width - 8, left)),
      top: Math.max(8, Math.min(viewport.height - bounds.height - 8, top)),
    }
  }, [id])

  const finishDrag = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (!isDragging) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const centerX = bounds.left + (bounds.width / 2)
    const centerY = bounds.top + (bounds.height / 2)
    const nextCorner = dockCorners.reduce((closest, candidate) => {
      const target = fixedPosition(candidate, bounds)
      const targetCenterX = target.left + (bounds.width / 2)
      const targetCenterY = target.top + (bounds.height / 2)
      const distance = ((targetCenterX - centerX) ** 2) + ((targetCenterY - centerY) ** 2)
      return distance < closest.distance ? { corner: candidate, distance } : closest
    }, { corner: dockCorners[0], distance: Number.POSITIVE_INFINITY }).corner
    const target = fixedPosition(nextCorner, bounds)
    manualRef.current = true
    targetX.set(target.left)
    targetY.set(target.top)
    if (snapTimeout.current !== null) window.clearTimeout(snapTimeout.current)
    snapTimeout.current = window.setTimeout(() => {
      setCorner(nextCorner)
      storeCorner(storageKey, nextCorner)
      setIsDragging(false)
      snapTimeout.current = null
    }, 720)
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }, [fixedPosition, isDragging, storageKey, targetX, targetY])

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const target = event.target
    if (target instanceof Element && target.closest('button, a, input, textarea, select')) return
    if (snapTimeout.current !== null) {
      window.clearTimeout(snapTimeout.current)
      snapTimeout.current = null
    }
    const card = event.currentTarget.closest<HTMLElement>('.now-dock, .anime-dock')
    const bounds = card?.getBoundingClientRect()
    if (!bounds) return
    cardSize.current = { width: bounds.width, height: bounds.height }
    pointerOffset.current = { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
    targetX.jump(bounds.left)
    targetY.jump(bounds.top)
    event.currentTarget.setPointerCapture?.(event.pointerId)
    setIsDragging(true)
    event.preventDefault()
  }, [targetX, targetY])

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (!isDragging) return
    const viewport = viewportSize()
    const width = Math.min(cardSize.current.width || 390, viewport.width - 16)
    const height = Math.min(cardSize.current.height || 120, viewport.height - 16)
    targetX.set(Math.max(8, Math.min(viewport.width - width - 8, event.clientX - pointerOffset.current.x)))
    targetY.set(Math.max(8, Math.min(viewport.height - height - 8, event.clientY - pointerOffset.current.y)))
  }, [isDragging, targetX, targetY])

  const style = isDragging
    ? { left: smoothX, top: smoothY, right: 'auto', bottom: 'auto' }
    : undefined
  const stackIndex = active ? dockOrder.filter((dockId) => dockRegistry.get(dockId) === corner && dockOrder.indexOf(dockId) < dockOrder.indexOf(id)).length : 0

  return {
    corner,
    stackIndex,
    isDragging,
    style,
    dragHandlers: { onPointerDown, onPointerMove, onPointerUp: finishDrag, onPointerCancel: finishDrag },
  }
}
