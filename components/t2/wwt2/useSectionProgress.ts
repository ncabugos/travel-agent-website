'use client'

import { useEffect, type RefObject } from 'react'

/**
 * Reports how far a tall section has scrolled through the viewport as 0..1:
 * 0 when the section top reaches the viewport top, 1 when the section bottom
 * reaches the viewport bottom. The engine for pinned (sticky) scrollytelling.
 *
 * rAF-throttled; the callback should write DOM/CSS directly or set state only
 * on discrete changes (e.g. an active-index flip) to avoid 60fps re-renders.
 */
export function useSectionProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress: (p: number) => void,
  enabled = true,
) {
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return

    let ticking = false
    let raf = 0
    const update = () => {
      ticking = false
      const rect = el.getBoundingClientRect()
      const span = rect.height - window.innerHeight
      if (span <= 0) return
      const p = Math.max(0, Math.min(1, -rect.top / span))
      onProgress(p)
    }
    const onScroll = () => {
      if (!ticking) {
        raf = requestAnimationFrame(update)
        ticking = true
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ref, onProgress, enabled])
}
