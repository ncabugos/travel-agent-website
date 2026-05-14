'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { LuxuryHotel } from '@/lib/hotels'
import { HotelCardImage } from '@/components/t2/HotelCardImage'

const INITIAL_COUNT = 9

interface Props {
  hotels: LuxuryHotel[]
  programName: string
  base: string
  eyebrow?: string
  heading?: string
}

export function T3FeaturedProperties({
  hotels,
  programName,
  base,
  eyebrow = 'Within the Collection',
  heading,
}: Props) {
  const [showAll, setShowAll] = useState(false)
  if (!hotels || hotels.length === 0) return null
  const visible = showAll ? hotels : hotels.slice(0, INITIAL_COUNT)
  const hasMore = hotels.length > INITIAL_COUNT && !showAll
  const headingText = heading ?? `${programName} properties.`

  return (
    <section className="t3-section t3-section-alt">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 32,
          alignItems: 'end',
          marginBottom: 'var(--t3-gap)',
        }}
        className="t3-fp-header"
      >
        <div style={{ maxWidth: 'var(--t3-content-narrow)' }}>
          <span className="t3-eyebrow t3-eyebrow-plain">{eyebrow}</span>
          <h2 className="t3-headline-xl" style={{ marginTop: 28 }}>
            {headingText}
          </h2>
        </div>
        <Link href={`${base}/contact`} className="t3-link-arrow">
          Enquire
          <span className="arrow">→</span>
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--t3-gap)',
        }}
        className="t3-fp-grid"
      >
        {visible.map((hotel) => (
          <Link
            key={hotel.slug}
            href={`${base}/hotels/${hotel.slug}`}
            className="t3-fp-card"
            style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}
          >
            <div
              style={{
                position: 'relative',
                aspectRatio: '4 / 3',
                overflow: 'hidden',
                background: 'var(--t3-bg-alt)',
                marginBottom: 20,
              }}
            >
              <HotelCardImage
                src={hotel.cover_image_url}
                alt={hotel.name}
                fallbackLabel={hotel.name}
              />
            </div>
            <div
              style={{
                fontSize: 'clamp(10px, 0.85vw, 11px)',
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--t3-accent)',
                marginBottom: 8,
              }}
            >
              {[hotel.city, hotel.country].filter(Boolean).join(' · ')}
            </div>
            <h3 className="t3-headline-md" style={{ marginBottom: 10, fontSize: 'clamp(17px, 1.5vw, 20px)' }}>
              {hotel.name}
            </h3>
            {hotel.description && (
              <p className="t3-body" style={{ fontSize: 'clamp(13px, 1vw, 14px)', lineHeight: 1.6, margin: 0 }}>
                {hotel.description.length > 110
                  ? hotel.description.slice(0, 107).trimEnd() + '…'
                  : hotel.description}
              </p>
            )}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 'var(--t3-gap)' }}>
        {hasMore && (
          <button
            onClick={() => setShowAll(true)}
            className="t3-btn t3-btn-outline"
          >
            View More Properties
          </button>
        )}
        <Link href={`${base}/book-hotel`} className="t3-btn t3-btn-ghost-dark">
          View the Hotel Catalogue
        </Link>
      </div>

      <style>{`
        .t3-fp-card:hover .t3-fp-img { transform: scale(1.04); }
        @media (max-width: 1024px) {
          .t3-fp-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .t3-fp-header { grid-template-columns: 1fr !important; gap: var(--t3-gap-tight) !important; align-items: start !important; }
        }
        @media (max-width: 768px) {
          .t3-fp-grid { grid-template-columns: 1fr !important; gap: var(--t3-gap-tight) !important; }
        }
      `}</style>
    </section>
  )
}
