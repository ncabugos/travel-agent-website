'use client'
import { useRef } from 'react'
import Link from 'next/link'
import type { PropertyDestination } from '@/lib/collections'

interface T3DestinationScrollProps {
  agentId: string
  eyebrow?: string
  headline: string
  body?: string
  destinations: PropertyDestination[]
}

const FALLBACK_IMAGE = '/media/hero images/four-seasons-sayan-hero.jpg'

export function T3DestinationScroll({
  eyebrow = '04 — Destinations',
  headline,
  body,
  destinations,
}: T3DestinationScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const amount = Math.max(380, el.clientWidth * 0.6)
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  if (!destinations.length) return null

  return (
    <section
      id="destinations"
      className="t3-section-full"
      style={{ paddingBottom: 'var(--t3-section-pad)' }}
    >
      <div
        style={{
          maxWidth: 'var(--t3-content-max)',
          margin: '0 auto',
          padding: '0 48px 48px',
        }}
        className="t3-dest-header-wrap"
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 32,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ maxWidth: 640 }}>
            <span className="t3-eyebrow">{eyebrow}</span>
            <h2 className="t3-headline-xl" style={{ marginTop: 28 }}>
              {headline}
            </h2>
            {body && (
              <p className="t3-body t3-body-lg" style={{ marginTop: 24 }}>
                {body}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <ScrollButton direction="left" onClick={() => scroll('left')} />
            <ScrollButton direction="right" onClick={() => scroll('right')} />
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="t3-scroll-x t3-no-scrollbar"
        style={{
          padding: '8px 48px 48px',
          margin: '0 auto',
          maxWidth: 'var(--t3-content-max)',
        }}
      >
        {destinations.map((d, i) => (
          <DestinationCard key={d.id} destination={d} index={i + 1} total={destinations.length} />
        ))}
      </div>
    </section>
  )
}

function DestinationCard({
  destination,
  index,
  total,
}: {
  destination: PropertyDestination
  index: number
  total: number
}) {
  const image = destination.image_gallery?.[0] || FALLBACK_IMAGE

  return (
    <Link
      href={destination.booking_link || '#'}
      style={{
        display: 'block',
        width: 400,
        textDecoration: 'none',
        color: 'inherit',
      }}
      className="t3-dest-card"
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3 / 4',
          overflow: 'hidden',
          marginBottom: 20,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={destination.name}
          className="t3-dest-img"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 1s var(--t3-ease-out)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            color: '#fff',
            fontSize: 10,
            letterSpacing: '0.2em',
            opacity: 0.8,
            fontWeight: 500,
          }}
        >
          {String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>
      </div>

      <div style={{ padding: '0 4px' }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--t3-text-muted)',
            marginBottom: 8,
          }}
        >
          {destination.location}
        </div>
        <h3 className="t3-headline-md" style={{ margin: 0 }}>
          {destination.name}
        </h3>
        {destination.description && (
          <p
            style={{
              marginTop: 12,
              fontSize: 14,
              color: 'var(--t3-text-muted)',
              lineHeight: 1.65,
              maxWidth: 340,
            }}
          >
            {destination.description}
          </p>
        )}
      </div>

      <style>{`
        .t3-dest-card:hover .t3-dest-img { transform: scale(1.05); }
        @media (max-width: 640px) {
          .t3-dest-card { width: 300px !important; }
        }
      `}</style>
    </Link>
  )
}

function ScrollButton({
  direction,
  onClick,
}: {
  direction: 'left' | 'right'
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-label={`Scroll ${direction}`}
      style={{
        width: 54,
        height: 54,
        borderRadius: 0,
        border: '1px solid var(--t3-divider)',
        background: 'transparent',
        color: 'var(--t3-text)',
        cursor: 'pointer',
        transition: 'all 0.25s var(--t3-ease)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--t3-text)'
        e.currentTarget.style.color = 'var(--t3-bg)'
        e.currentTarget.style.borderColor = 'var(--t3-text)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = 'var(--t3-text)'
        e.currentTarget.style.borderColor = 'var(--t3-divider)'
      }}
    >
      {direction === 'left' ? '←' : '→'}
    </button>
  )
}
