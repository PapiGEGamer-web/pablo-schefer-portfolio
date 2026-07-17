import { useMotionValue, useSpring } from 'motion/react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

export type DockCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

type DockId = 'spotify' | 'anime'

const dockRegistry = new Map<DockId, DockCorner>()
const dockSubscribers = new Set<() => void>()
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
  const [isReady, setIsReady] = useState(false)
  const dockElement = useRef<HTMLElement | null>(null)
  const pointerOffset = useRef({ x: 0, y: 0 })
  const pointerPosition = useRef({ x: 0, y: 0 })
  const cardSize = useRef({ width: 0, height: 0 })
  const targetX = useMotionValue(0)
  const targetY = useMotionValue(0)
  const smoothX = useSpring(targetX, { stiffness: 360, damping: 34, mass: 0.58 })
  const smoothY = useSpring(targetY, { stiffness: 360, damping: 34, mass: 0.58 })
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
    if (active) {
      const occupied = new Set<DockCorner>()
      dockRegistry.forEach((registeredCorner, registeredId) => {
        if (registeredId !== id) occupied.add(registeredCorner)
      })
      if (occupied.has(corner)) {
        const openCorner = dockCorners.find((candidate) => !occupied.has(candidate))
        if (openCorner) {
          storeCorner(storageKey, openCorner)
          window.queueMicrotask(() => setCorner(openCorner))
          return undefined
        }
      }
      dockRegistry.set(id, corner)
    } else {
      dockRegistry.delete(id)
    }
    notifyDockChange()
    return () => {
      dockRegistry.delete(id)
      notifyDockChange()
    }
  }, [active, corner, id, storageKey])

  const fixedPosition = useCallback((nextCorner: DockCorner, size: { width: number; height: number }) => {
    const viewport = viewportSize()
    const mobile = viewport.width <= 700
    const edge = mobile ? 8 : 20
    const topOffset = mobile ? 76 : 118
    const left = mobile
      ? edge
      : nextCorner.endsWith('left')
        ? edge
        : viewport.width - size.width - edge
    const top = nextCorner.startsWith('top')
      ? topOffset
      : viewport.height - size.height - edge
    return {
      left: Math.max(edge, Math.min(viewport.width - size.width - edge, left)),
      top: Math.max(edge, Math.min(viewport.height - size.height - edge, top)),
    }
  }, [])

  const measureSize = useCallback(() => {
    const bounds = dockElement.current?.getBoundingClientRect()
    return {
      width: bounds?.width || cardSize.current.width || 360,
      height: bounds?.height || cardSize.current.height || 120,
    }
  }, [])

  const moveToCorner = useCallback((nextCorner: DockCorner, immediate = false) => {
    const size = measureSize()
    cardSize.current = size
    const target = fixedPosition(nextCorner, size)
    if (immediate) {
      targetX.jump(target.left)
      targetY.jump(target.top)
    } else {
      targetX.set(target.left)
      targetY.set(target.top)
    }
  }, [fixedPosition, measureSize, targetX, targetY])

  const ref = useCallback((element: HTMLElement | null) => {
    dockElement.current = element
    if (element) {
      const bounds = element.getBoundingClientRect()
      cardSize.current = { width: bounds.width, height: bounds.height }
      moveToCorner(corner, true)
      setIsReady(true)
    }
  }, [corner, moveToCorner])

  const occupiedCorners = useCallback(() => {
    const occupied = new Set<DockCorner>()
    dockRegistry.forEach((registeredCorner, registeredId) => {
      if (registeredId !== id) occupied.add(registeredCorner)
    })
    return occupied
  }, [id])

  useEffect(() => {
    if (!manualRef.current) setCorner(defaultCorner)
  }, [defaultCorner])

  useLayoutEffect(() => {
    if (!active) return undefined
    moveToCorner(corner, !isReady)
    const onResize = () => moveToCorner(corner, true)
    window.addEventListener('resize', onResize)
    window.visualViewport?.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.visualViewport?.removeEventListener('resize', onResize)
    }
  }, [active, corner, isReady, moveToCorner])

  useLayoutEffect(() => {
    const element = dockElement.current
    if (!active || !isReady || !element || typeof ResizeObserver === 'undefined') return undefined

    let frame = 0
    const observer = new ResizeObserver(() => {
      if (isDragging) return
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const bounds = element.getBoundingClientRect()
        cardSize.current = { width: bounds.width, height: bounds.height }
        moveToCorner(corner, true)
      })
    })

    observer.observe(element)
    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [active, corner, isDragging, isReady, moveToCorner])

  const finishDrag = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (!isDragging) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const releaseX = event.clientX || pointerPosition.current.x
    const releaseY = event.clientY || pointerPosition.current.y
    const centerX = releaseX - pointerOffset.current.x + (bounds.width / 2)
    const centerY = releaseY - pointerOffset.current.y + (bounds.height / 2)
    const occupied = occupiedCorners()
    const candidates = dockCorners.filter((candidate) => !occupied.has(candidate) || candidate === corner)
    const nextCorner = candidates.reduce((closest, candidate) => {
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
    setCorner(nextCorner)
    storeCorner(storageKey, nextCorner)
    setIsDragging(false)
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }, [corner, fixedPosition, isDragging, occupiedCorners, storageKey, targetX, targetY])

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const target = event.target
    if (target instanceof Element && target.closest('button, a, input, textarea, select')) return
    const bounds = event.currentTarget.getBoundingClientRect()
    if (!bounds) return
    cardSize.current = { width: bounds.width, height: bounds.height }
    pointerPosition.current = { x: event.clientX, y: event.clientY }
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
    pointerPosition.current = { x: event.clientX, y: event.clientY }
    targetX.set(Math.max(8, Math.min(viewport.width - width - 8, event.clientX - pointerOffset.current.x)))
    targetY.set(Math.max(8, Math.min(viewport.height - height - 8, event.clientY - pointerOffset.current.y)))
  }, [isDragging, targetX, targetY])

  const style = { left: smoothX, top: smoothY, right: 'auto', bottom: 'auto', visibility: isReady ? 'visible' : 'hidden' } as const

  return {
    bindDock: ref,
    corner,
    isDragging,
    style,
    dragHandlers: { onPointerDown, onPointerMove, onPointerUp: finishDrag, onPointerCancel: finishDrag },
  }
}
