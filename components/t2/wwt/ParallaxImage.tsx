'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

interface ParallaxImageProps {
  src: string
  alt?: string
  /** Strength of parallax — 0 = none, 1 = strong. Default 0.25 (refined). */
  strength?: number
  /** Aspect ratio as a number (width/height) or CSS string. */
  aspect?: number | string
  /** Scroll-linked slow scale-in, subtle. */
  scale?: boolean
  className?: string
  style?: CSSProperties
  /** Darken image with overlay rgba. */
  overlay?: string
  objectPosition?: string
  priority?: boolean
}

/**
 * Scroll-linked parallax image. Uses translateY driven by the element's
 * position within the viewport. Throttled via requestAnimationFrame and
 * respects prefers-reduced-motion.
 */
export function ParallaxImage({
  src,
  alt = '',
  strength = 0.25,
  aspect = '16 / 10',
  scale = false,
  className,
  style,
  overlay,
  objectPosition = 'center',
  priority = false,
}: ParallaxImageProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(m.matches)

    if (m.matches) return

    let raf = 0
    let ticking = false

    const update = () => {
      const frame = frameRef.current
      const img = imgRef.current
      if (!frame || !img) return

      const rect = frame.getBoundingClientRect()
      const vh = window.innerHeight || 1
      // Progress: -1 (below viewport) → 0 (centered) → 1 (above viewport)
      const progress = ((rect.top + rect.height / 2) - vh / 2) / vh
      const clamped = Math.max(-1.2, Math.min(1.2, progress))
      const maxShift = 60 * strength
      const y = clamped * maxShift * -1 // scrolls opposite to the page
      const s = scale ? 1.08 + clamped * 0.02 : 1.12
      img.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${s})`
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        raf = requestAnimationFrame(update)
        ticking = true
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [strength, scale])

  const aspectValue = typeof aspect === 'number' ? `${aspect}` : aspect

  return (
    <div
      ref={frameRef}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: aspectValue,
        ...style,
      }}
    >
      <div
        ref={imgRef}
        style={{
          position: 'absolute',
          inset: '-6%',
          backgroundImage: `url("${encodeURI(src)}")`,
          backgroundSize: 'cover',
          backgroundPosition: objectPosition,
          backgroundRepeat: 'no-repeat',
          transform: reduced ? 'none' : 'translate3d(0,0,0) scale(1.12)',
          willChange: reduced ? 'auto' : 'transform',
        }}
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
      />
      {overlay && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: overlay,
            pointerEvents: 'none',
          }}
        />
      )}
      {/* preload hint for priority hero images */}
      {priority && (
        <link rel="preload" as="image" href={src} fetchPriority="high" />
      )}
    </div>
  )
}
