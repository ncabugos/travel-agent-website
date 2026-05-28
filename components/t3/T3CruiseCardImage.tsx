'use client'
/**
 * Cruise card hero image with a fallback chain:
 *   primary (hero_image_url) → fallback (e.g. first slider image) → SHARED_FALLBACK.
 * Handles both runtime errors (onError) and post-hydration broken images
 * (useEffect ref-check) — the onError event doesn't replay if the SSR'd image
 * had already errored before client hydration.
 */
import { useState, useEffect, useRef } from 'react'

const SHARED_FALLBACK = '/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg'

interface Props {
  src: string | null | undefined
  fallback?: string | null
  alt: string
  badge: string
}

export function T3CruiseCardImage({ src, fallback, alt, badge }: Props) {
  const chain = [src, fallback, SHARED_FALLBACK].filter(
    (u, i, arr): u is string => !!u && arr.indexOf(u) === i,
  )
  const [idx, setIdx] = useState(0)
  const imgRef = useRef<HTMLImageElement>(null)
  const current = chain[idx] || SHARED_FALLBACK

  const advance = () => {
    if (idx < chain.length - 1) setIdx(idx + 1)
  }

  // Catches images that errored during SSR/hydration (onError won't replay)
  useEffect(() => {
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth === 0) advance()
    // idx is intentionally in deps so we re-check after a fallback also fails
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx])

  return (
    <div
      style={{
        position: 'relative',
        aspectRatio: '16 / 10',
        overflow: 'hidden',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={current}
        alt={alt}
        className="t3-cruise-card-img"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.9s var(--t3-ease-out)',
        }}
        onError={advance}
      />
      <span
        style={{
          position: 'absolute', top: 14, left: 14,
          fontFamily: 'var(--t3-font-sans)',
          fontSize: 10, fontWeight: 600,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          background: '#fff',
          color: 'var(--t3-text)',
          padding: '7px 14px',
          boxShadow: '0 2px 12px rgba(20,17,15,0.18)',
        }}
      >
        {badge}
      </span>
    </div>
  )
}
