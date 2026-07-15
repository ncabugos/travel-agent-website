'use client'

import { useEffect, useRef } from 'react'

interface WWT2ParallaxProps {
  src: string
  alt?: string
  /** 0..1 — how far the image drifts against the scroll. */
  strength?: number
  /** CSS aspect-ratio for the frame, e.g. '4 / 5'. */
  aspect?: string
  className?: string
}

/**
 * Scroll-linked parallax: the image layer translates against scroll inside an
 * overflow-hidden frame. rAF-throttled, passive listener, no-op under
 * reduced-motion. Renders as a background-image layer (full-bleed cover
 * imagery paints reliably — see task-doc lesson).
 */
export function WWT2Parallax({
  src,
  alt = '',
  strength = 0.25,
  aspect = '4 / 5',
  className = '',
}: WWT2ParallaxProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const frame = frameRef.current
    const layer = layerRef.current
    if (!frame || !layer) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ticking = false
    let raf = 0
    const maxShift = 64 * strength

    const update = () => {
      ticking = false
      const rect = frame.getBoundingClientRect()
      const vh = window.innerHeight
      if (rect.bottom < -80 || rect.top > vh + 80) return
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh
      const clamped = Math.max(-1.2, Math.min(1.2, progress))
      layer.style.transform = `translate3d(0, ${(clamped * maxShift * -1).toFixed(2)}px, 0) scale(1.14)`
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
  }, [strength])

  return (
    <div
      ref={frameRef}
      className={`wwt-plx ${className}`}
      style={{ aspectRatio: aspect }}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
    >
      <div
        ref={layerRef}
        className="wwt-plx-layer"
        style={{ backgroundImage: `url("${src}")` }}
      />
    </div>
  )
}
