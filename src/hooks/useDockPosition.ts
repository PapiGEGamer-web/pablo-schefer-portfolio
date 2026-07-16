import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

export type DockCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

type DragPoint = { x: number; y: number }

export function useDockPosition(storageKey: string, defaultCorner: DockCorner) {
  const stored = typeof window !== 'undefined' ? window.localStorage.getItem(storageKey) as DockCorner | null : null
  const hasStoredPosition = Boolean(stored)
  const manualRef = useRef(hasStoredPosition)
  const [corner, setCorner] = useState<DockCorner>(stored ?? defaultCorner)
  const [dragPoint, setDragPoint] = useState<DragPoint | null>(null)

  useEffect(() => {
    if (!manualRef.current) setCorner(defaultCorner)
  }, [defaultCorner])

  const finishDrag = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (!dragPoint) return
    const nextCorner: DockCorner = `${event.clientY < window.innerHeight / 2 ? 'top' : 'bottom'}-${event.clientX < window.innerWidth / 2 ? 'left' : 'right'}`
    manualRef.current = true
    setCorner(nextCorner)
    window.localStorage.setItem(storageKey, nextCorner)
    setDragPoint(null)
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }, [dragPoint, storageKey])

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    event.currentTarget.setPointerCapture?.(event.pointerId)
    setDragPoint({ x: event.clientX, y: event.clientY })
    event.preventDefault()
  }, [])

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (!dragPoint) return
    setDragPoint({ x: event.clientX, y: event.clientY })
  }, [dragPoint])

  const style = dragPoint
    ? { left: `${Math.max(8, Math.min(window.innerWidth - 380, dragPoint.x - 180))}px`, top: `${Math.max(8, Math.min(window.innerHeight - 130, dragPoint.y - 20))}px`, right: 'auto', bottom: 'auto' }
    : undefined

  return {
    corner,
    isDragging: Boolean(dragPoint),
    style,
    dragHandlers: { onPointerDown, onPointerMove, onPointerUp: finishDrag, onPointerCancel: finishDrag },
  }
}
