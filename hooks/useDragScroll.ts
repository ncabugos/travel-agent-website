'use client'

import { useRef, useCallback } from 'react'

/**
 * useDragScroll — attaches smooth pointer-based drag-scroll with momentum
 * to any scrollable container ref.
 *
 * Key design decisions:
 * - Uses setPointerCapture so drag continues even when pointer leaves element
 * - Disables scroll-snap during drag (re-enables on release) to prevent jumps
 * - Applies momentum via rAF loop after release
 * - Suppresses click events that fire after a drag
 */
export function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null)

  const isDragging  = useRef(false)
  const didDrag     = useRef(false)   // true once pointer moved ≥ 4px
  const startX      = useRef(0)
  const startScroll = useRef(0)
  const velX        = useRef(0)
  const lastX       = useRef(0)
  const lastT       = useRef(0)
  const rafId       = useRef<number | null>(null)

  // ── Momentum loop ──────────────────────────────────────────────────────────
  const momentum = useCallback(() => {
    const el = ref.current
    if (!el) return
    velX.current *= 0.93                // friction — tweak for feel
    if (Math.abs(velX.current) < 0.4) {
      velX.current = 0
      return
    }
    el.scrollLeft += velX.current
    rafId.current = requestAnimationFrame(momentum)
  }, [])

  const stopMomentum = () => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current)
      rafId.current = null
    }
  }

  // ── Pointer handlers ───────────────────────────────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    stopMomentum()
    isDragging.current  = true
    didDrag.current     = false
    startX.current      = e.clientX
    startScroll.current = el.scrollLeft
    velX.current        = 0
    lastX.current       = e.clientX
    lastT.current       = performance.now()
    // Disable snap so browser doesn't fight us mid-drag
    el.style.scrollSnapType = 'none'
    el.style.cursor = 'grabbing'
    // Capture keeps getting events even when pointer leaves element
    el.setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !ref.current) return
    const dx = e.clientX - startX.current
    if (Math.abs(dx) > 4) didDrag.current = true
    if (!didDrag.current) return
    e.preventDefault()
    ref.current.scrollLeft = startScroll.current - dx

    const now = performance.now()
    const dt  = now - lastT.current
    if (dt > 0) velX.current = ((lastX.current - e.clientX) / dt) * 16
    lastX.current = e.clientX
    lastT.current = now
  }, [])

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!isDragging.current || !el) return
    isDragging.current = false
    el.style.cursor = 'grab'
    el.releasePointerCapture(e.pointerId)
    // Re-enable snap after momentum settles
    const restoreSnap = () => {
      if (el && !isDragging.current) el.style.scrollSnapType = ''
    }
    setTimeout(restoreSnap, 600)
    rafId.current = requestAnimationFrame(momentum)
  }, [momentum])

  // Suppress click if user actually dragged (prevents accidental link clicks)
  const onClick = useCallback((e: React.MouseEvent) => {
    if (didDrag.current) {
      e.preventDefault()
      e.stopPropagation()
    }
  }, [])

  return {
    ref,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onClick,
    } as Pick<React.HTMLAttributes<HTMLDivElement>, 'onPointerDown' | 'onPointerMove' | 'onPointerUp' | 'onClick'>,
  }
}
