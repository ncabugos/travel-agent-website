'use client'

import Image from 'next/image'
import { useRef, useState, useCallback } from 'react'
import { useDragScroll } from '@/hooks/useDragScroll'

interface T2HotelGalleryProps {
  images: string[]
  title?: string
}

const CARD_W = 400
const CARD_GAP = 24

export function T2HotelGallery({ images, title }: T2HotelGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { ref: trackRef, handlers } = useDragScroll()

  const scrollTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, images.length - 1))
    setCurrentIndex(clamped)
    if (trackRef.current) {
      trackRef.current.scrollTo({
        left: clamped * (CARD_W + CARD_GAP),
        behavior: 'smooth',
      })
    }
  }, [images.length, trackRef])

  const next = () => scrollTo(currentIndex + 1)
  const prev = () => scrollTo(currentIndex - 1)

  const canNext = currentIndex < images.length - 1
  const progress = images.length > 1 ? (currentIndex / (images.length - 1)) * 100 : 100

  if (images.length === 0) return null

  return (
    <section style={{ padding: 'var(--t2-section-pad) 0', background: 'var(--t2-bg)' }}>
      {title && (
        <div
          style={{
            maxWidth: 'var(--t2-content-max, 1280px)',
            margin: '0 auto',
            padding: '0 48px',
            marginBottom: 52,
          }}
        >
          <p className="t2-label" style={{ marginBottom: 16 }}>Gallery</p>
          <h2 className="t2-heading t2-heading-lg">{title}</h2>
        </div>
      )}

      <div style={{ position: 'relative' }}>
        <div
          ref={trackRef}
          {...handlers}
          style={{
            display: 'flex',
            gap: CARD_GAP,
            overflowX: 'auto',
            padding: '0 48px 8px',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            cursor: 'grab',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                width: CARD_W,
                scrollSnapAlign: 'start',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '4/5',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={src}
                  alt={`Gallery image ${i + 1}`}
                  fill
                  unoptimized
                  draggable={false}
                  style={{ objectFit: 'cover', transition: 'transform 0.8s ease', pointerEvents: 'none' }}
                  sizes="400px"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar + counter + PREV/NEXT */}
      <div
        style={{
          maxWidth: 'var(--t2-content-max, 1280px)',
          margin: '32px auto 0',
          padding: '0 48px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <div
          style={{
            flex: 1,
            maxWidth: 240,
            height: 1,
            background: 'var(--t2-divider)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${progress}%`,
              background: 'var(--t2-text)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>

        <span
          style={{
            fontFamily: 'var(--t2-font-sans)',
            fontSize: 10,
            letterSpacing: '0.15em',
            color: 'var(--t2-text-muted)',
            fontWeight: 400,
          }}
        >
          {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </span>

        <div style={{ display: 'flex', gap: 16, marginLeft: 'auto' }}>
          <button
            onClick={prev}
            disabled={currentIndex === 0}
            style={{
              fontFamily: 'var(--t2-font-sans)',
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: currentIndex === 0 ? 'var(--t2-divider)' : 'var(--t2-text-muted)',
              background: 'none',
              border: 'none',
              cursor: currentIndex === 0 ? 'default' : 'pointer',
              transition: 'color 0.2s ease',
            }}
          >
            Prev
          </button>
          <button
            onClick={next}
            disabled={!canNext}
            style={{
              fontFamily: 'var(--t2-font-sans)',
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: !canNext ? 'var(--t2-divider)' : 'var(--t2-text)',
              background: 'none',
              border: 'none',
              cursor: !canNext ? 'default' : 'pointer',
              transition: 'color 0.2s ease',
            }}
          >
            Next
          </button>
        </div>
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  )
}
