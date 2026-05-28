'use client'

import { useCallback, useEffect, useState } from 'react'

interface Props {
  images: string[]
  alt: string
  autoAdvanceMs?: number
}

export function T4HotelGallerySlideshow({ images, alt, autoAdvanceMs = 5000 }: Props) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length])
  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length])

  useEffect(() => {
    if (paused || images.length < 2) return
    const t = setInterval(next, autoAdvanceMs)
    return () => clearInterval(t)
  }, [next, paused, autoAdvanceMs, images.length])

  if (images.length === 0) return null

  return (
    <div
      className="t4-gallery-slideshow"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: 'relative',
        aspectRatio: '16 / 9',
        overflow: 'hidden',
        background: 'var(--t4-bg-alt)',
      }}
    >
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={`${alt} — image ${i + 1} of ${images.length}`}
          loading={i === 0 ? 'eager' : 'lazy'}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: i === index ? 1 : 0,
            transition: 'opacity 800ms ease-in-out',
          }}
        />
      ))}

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={prev}
            className="t4-slideshow-nav t4-slideshow-prev"
            style={navButtonStyle('left')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={next}
            className="t4-slideshow-nav t4-slideshow-next"
            style={navButtonStyle('right')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <div
            style={{
              position: 'absolute',
              bottom: 18,
              right: 18,
              padding: '6px 14px',
              fontFamily: 'var(--t4-font-display)',
              fontSize: 13,
              letterSpacing: '0.08em',
              color: '#fff',
              background: 'rgba(20,17,15,0.55)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 999,
            }}
          >
            {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </div>
        </>
      )}

      <style>{`
        .t4-slideshow-nav { transition: background 0.2s ease, opacity 0.2s ease; }
        .t4-slideshow-nav:hover { background: rgba(20,17,15,0.78) !important; }
      `}</style>
    </div>
  )
}

function navButtonStyle(side: 'left' | 'right'): React.CSSProperties {
  return {
    position: 'absolute',
    top: '50%',
    [side]: 18,
    transform: 'translateY(-50%)',
    width: 44,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(20,17,15,0.55)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: '50%',
    color: '#fff',
    cursor: 'pointer',
    zIndex: 2,
  }
}
