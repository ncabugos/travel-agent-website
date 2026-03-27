'use client'

import Image from 'next/image'
import { useState, useCallback } from 'react'
import type { PropertyDestination } from '@/lib/collections'
import { useDragScroll } from '@/hooks/useDragScroll'

interface T2DestinationCarouselProps {
  properties: PropertyDestination[]
}

const FALLBACK_SLIDES = [
  {
    id: 'f1',
    name: 'Amanpuri',
    location: 'Phuket, Thailand',
    description: 'The original Aman resort on a private peninsula — a sanctuary of calm above Pansea Beach.',
    image: '/media/hotel-programs/aman/aman-hero-2000.jpg',
  },
  {
    id: 'f2',
    name: 'Four Seasons Maui',
    location: 'Wailea, Hawaii',
    description: 'An oceanfront paradise on Maui\'s most stunning shoreline.',
    image: '/media/hotel-programs/four-seasons/fs-hawaii-1500.jpg',
  },
  {
    id: 'f3',
    name: 'Belmond Hotel Cipriani',
    location: 'Venice, Italy',
    description: 'An iconic retreat steps from St. Mark\'s Square, cradled by Venetian lagoon waters.',
    image: '/media/hotel-programs/belmond-bellini-club/belmond-cap-1500.jpg',
  },
  {
    id: 'f4',
    name: 'Rosewood Miramar Beach',
    location: 'Montecito, California',
    description: 'A coastal sanctuary on storied Miramar Beach with sweeping Pacific views.',
    image: '/media/hotel-programs/rosewood-elite/rosewood-slider-1-1500.jpg',
  },
  {
    id: 'f5',
    name: 'Park Hyatt Dubai',
    location: 'Dubai, UAE',
    description: 'Harbourfront luxury with sweeping marina and skyline views.',
    image: '/media/hotel-programs/hyatt-prive/Park-Hyatt-Dubai-P111-Marina.16x9.jpg',
  },
  {
    id: 'f6',
    name: 'Mandarin Oriental',
    location: 'Paris, France',
    description: 'A legendary address on the Rue Saint-Honoré — art, elegance, and French excellence.',
    image: '/media/hotel-programs/mandarin-oriental/mandarin-hero-2000.jpg',
  },
  {
    id: 'f7',
    name: 'Four Seasons George V',
    location: 'Paris, France',
    description: 'An iconic address steps from the Champs-Élysées, celebrated for its legendary service.',
    image: '/media/hotel-programs/four-seasons/fs-paris-1500.jpg',
  },
  {
    id: 'f8',
    name: 'Regent Seven Seas',
    location: 'Tahiti, French Polynesia',
    description: 'All-suite, all-inclusive expedition cruising in one of Earth\'s most pristine destinations.',
    image: '/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg',
  },
]

const CARD_W = 400
const CARD_GAP = 24

export function T2DestinationCarousel({ properties }: T2DestinationCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { ref: trackRef, handlers } = useDragScroll()

  const slides = properties.length > 0
    ? properties.map(p => ({
        id: p.id,
        name: p.name,
        location: p.location ?? '',
        description: p.description ?? '',
        image: (p.image_gallery && p.image_gallery[0]) ? p.image_gallery[0] : '',
      }))
    : FALLBACK_SLIDES

  const scrollTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, slides.length - 1))
    setCurrentIndex(clamped)
    if (trackRef.current) {
      trackRef.current.scrollTo({
        left: clamped * (CARD_W + CARD_GAP),
        behavior: 'smooth',
      })
    }
  }, [slides.length, trackRef])

  const next = () => scrollTo(currentIndex + 1)
  const prev = () => scrollTo(currentIndex - 1)

  const canNext = currentIndex < slides.length - 1
  const progress = slides.length > 1 ? (currentIndex / (slides.length - 1)) * 100 : 100

  return (
    <section style={{ padding: 'var(--t2-section-pad) 0', background: 'var(--t2-bg)' }}>
      {/* Header */}
      <div
        style={{
          maxWidth: 'var(--t2-content-max, 1280px)',
          margin: '0 auto',
          padding: '0 48px',
          marginBottom: 52,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 32,
        }}
      >
        <div>
          <p className="t2-label" style={{ marginBottom: 16 }}>Destinations</p>
          <h2 className="t2-heading t2-heading-lg">
            The World&apos;s Best Places to Stay
          </h2>
        </div>
        <p
          className="t2-body"
          style={{ maxWidth: 380, marginBottom: 0, textAlign: 'right' }}
        >
          From intimate island retreats to sprawling oceanfront resorts — curated exclusively for you.
        </p>
      </div>

      {/* Track */}
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
          {slides.map((slide) => (
            <div
              key={slide.id}
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
                  marginBottom: 20,
                }}
              >
                <Image
                  src={slide.image}
                  alt={slide.name}
                  fill
                  unoptimized
                  draggable={false}
                  style={{ objectFit: 'cover', transition: 'transform 0.8s ease', pointerEvents: 'none' }}
                  sizes="400px"
                />
              </div>

              <p
                style={{
                  fontFamily: 'var(--t2-font-sans)',
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--t2-accent)',
                  marginBottom: 8,
                }}
              >
                {slide.location}
              </p>
              <h3
                style={{
                  fontFamily: 'var(--t2-font-serif)',
                  fontSize: 24,
                  fontWeight: 300,
                  color: 'var(--t2-text)',
                  marginBottom: 10,
                  lineHeight: 1.2,
                }}
              >
                {slide.name}
              </h3>
              {slide.description && (
                <p
                  style={{
                    fontFamily: 'var(--t2-font-sans)',
                    fontSize: 13,
                    fontWeight: 300,
                    lineHeight: 1.7,
                    color: 'var(--t2-text-muted)',
                  }}
                >
                  {slide.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
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
          {String(currentIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
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

      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
    </section>
  )
}
