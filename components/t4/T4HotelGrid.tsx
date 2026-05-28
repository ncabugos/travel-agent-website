'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { LuxuryHotel } from '@/lib/hotels'

const INITIAL_COUNT = 9

interface Props {
  hotels: LuxuryHotel[]
  programName: string
  base: string
}

export function T4HotelGrid({ hotels, programName, base }: Props) {
  const [showAll, setShowAll] = useState(false)
  if (!hotels || hotels.length === 0) return null
  const visible = showAll ? hotels : hotels.slice(0, INITIAL_COUNT)
  const hasMore = hotels.length > INITIAL_COUNT && !showAll

  return (
    <section className="t4-section">
      <div style={{ maxWidth: 'var(--t4-content-wide)', margin: '0 auto' }}>
        <div style={{ marginBottom: 56 }}>
          <span className="t4-eyebrow">The Collection</span>
          <h2 className="t4-headline-xl" style={{ marginTop: 28 }}>
            {programName} properties.
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 32,
          }}
          className="t4-hotels-grid"
        >
          {visible.map((hotel) => (
            <Link
              key={hotel.slug}
              href={`${base}/hotels/${hotel.slug}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '4 / 3',
                  overflow: 'hidden',
                  background: 'var(--t4-bg-alt)',
                  marginBottom: 20,
                }}
              >
                {hotel.cover_image_url ? (
                  <Image
                    src={hotel.cover_image_url}
                    alt={hotel.name}
                    fill
                    style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--t4-bg-alt)' }} />
                )}
              </div>
              {hotel.city && (
                <p
                  style={{
                    fontFamily: 'var(--t4-font-body)',
                    fontSize: 11,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--t4-accent)',
                    margin: '0 0 8px',
                  }}
                >
                  {hotel.city}{hotel.country ? `, ${hotel.country}` : ''}
                </p>
              )}
              <h3
                style={{
                  fontFamily: 'var(--t4-font-display)',
                  fontSize: 'clamp(18px, 1.5vw, 22px)',
                  fontWeight: 400,
                  margin: '0 0 8px',
                  letterSpacing: '-0.01em',
                }}
              >
                {hotel.name}
              </h3>
              {hotel.vibe && (
                <p
                  style={{
                    fontFamily: 'var(--t4-font-body)',
                    fontSize: 13,
                    color: 'var(--t4-muted)',
                    margin: 0,
                    fontWeight: 300,
                  }}
                >
                  {hotel.vibe}
                </p>
              )}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 56 }}>
          {hasMore && (
            <button
              onClick={() => setShowAll(true)}
              className="t4-btn"
            >
              View More Properties
            </button>
          )}
          <Link href={`${base}/book-hotel`} className="t4-btn t4-btn-solid">
            View the Hotel Catalogue
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .t4-hotels-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .t4-hotels-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
