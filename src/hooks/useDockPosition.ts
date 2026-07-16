import { useMotionValue, useSpring } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

export type DockCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

type DockId = 'spotify' | 'anime'

const dockRegistry = new Map<DockId, DockCorner>()
const dockSubscribers = new Set<() => void>()
const dockOrder: DockId[] = ['spotify', 'anime']

function notifyDockChange() {
  dockSubscribers.forEach((subscriber) => subscriber())
}

export function useDockPosition(storageKey: string, defaultCorner: DockCorner, id: DockId, active: boolean) {
  const stored = typeof window !== 'undefined' ? window.localStorage.getItem(storageKey) as DockCorner | null : null
  const hasStoredPosition = Boolean(stored)
  const manualRef = useRef(hasStoredPosition)
  const [corner, setCorner] = useState<DockCorner>(stored ?? defaultCorner)
  const [isDragging, setIsDragging] = useState(false)
  const pointerOffset = useRef({ x: 0, y: 0 })
  const targetX = useMotionValue(0)
  const targetY = useMotionValue(0)
  const smoothX = useSpring(targetX, { stiffness: 235, damping: 29, mass: 0.78 })
  const smoothY = useSpring(targetY, { stiffness: 235, damping: 29, mass: 0.78 })
  const [, forceRegistryUpdate] = useState(0)

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

  const finishDrag = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (!isDragging) return
    const nextCorner: DockCorner = `${event.clientY < window.innerHeight / 2 ? 'top' : 'bottom'}-${event.clientX < window.innerWidth / 2 ? 'left' : 'right'}`
    manualRef.current = true
    setCorner(nextCorner)
    window.localStorage.setItem(storageKey, nextCorner)
    setIsDragging(false)
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }, [isDragging, storageKey])

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const target = event.target
    if (target instanceof Element && target.closest('button, a, input, textarea, select')) return
    const card = event.currentTarget.closest<HTMLElement>('.now-dock, .anime-dock')
    const bounds = card?.getBoundingClientRect()
    if (!bounds) return
    pointerOffset.current = { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
    targetX.jump(bounds.left)
    targetY.jump(bounds.top)
    event.currentTarget.setPointerCapture?.(event.pointerId)
    setIsDragging(true)
    event.preventDefault()
  }, [targetX, targetY])

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (!isDragging) return
    const width = Math.min(390, window.innerWidth - 16)
    targetX.set(Math.max(8, Math.min(window.innerWidth - width - 8, event.clientX - pointerOffset.current.x)))
    targetY.set(Math.max(8, Math.min(window.innerHeight - 120, event.clientY - pointerOffset.current.y)))
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
