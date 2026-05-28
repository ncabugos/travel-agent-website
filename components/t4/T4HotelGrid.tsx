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
              className="t4-hg-card"
            >
              <div className="t4-hg-img-wrap">
                {hotel.cover_image_url ? (
                  <Image
                    src={hotel.cover_image_url}
                    alt={hotel.name}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--t4-bg-alt)' }} />
                )}
                {hotel.vibe && (
                  <span className="t4-hg-vibe">{hotel.vibe}</span>
                )}
              </div>
              {hotel.city && (
                <p className="t4-hg-loc">
                  {hotel.city}{hotel.country ? `, ${hotel.country}` : ''}
                </p>
              )}
              <h3 className="t4-hg-name">{hotel.name}</h3>
              <span className="t4-hg-cta">
                View hotel <span aria-hidden>→</span>
              </span>
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
        .t4-hg-card {
          display: flex; flex-direction: column;
          text-decoration: none; color: inherit;
          transition: transform 0.4s var(--t4-ease, cubic-bezier(0.25, 0.1, 0.25, 1));
        }
        .t4-hg-card:hover { transform: translateY(-4px); }
        .t4-hg-img-wrap {
          position: relative;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background: var(--t4-bg-alt);
          margin-bottom: 18px;
        }
        .t4-hg-img-wrap img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.9s var(--t4-ease-out, cubic-bezier(0.16, 1, 0.3, 1));
        }
        .t4-hg-card:hover .t4-hg-img-wrap img { transform: scale(1.05); }
        .t4-hg-vibe {
          position: absolute; top: 14px; left: 14px;
          font-family: var(--t4-font-body);
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.2em; text-transform: uppercase;
          background: #fff;
          color: var(--t4-text, #1a1715);
          padding: 7px 14px;
          box-shadow: 0 2px 12px rgba(20,17,15,0.18);
          transition: transform 0.3s ease;
        }
        .t4-hg-card:hover .t4-hg-vibe { transform: translateY(-2px); }
        .t4-hg-loc {
          font-family: var(--t4-font-body);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--t4-accent);
          margin: 0 0 8px;
        }
        .t4-hg-name {
          font-family: var(--t4-font-display);
          font-size: clamp(18px, 1.5vw, 22px);
          font-weight: 400;
          letter-spacing: -0.01em;
          margin: 0 0 14px;
        }
        .t4-hg-cta {
          font-family: var(--t4-font-body);
          font-size: 10.5px; font-weight: 500;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--t4-text, #1a1715);
          padding-top: 14px;
          border-top: 1px solid var(--t4-divider);
          margin-top: auto;
          transition: color 0.25s ease;
        }
        .t4-hg-cta span {
          margin-left: 6px;
          display: inline-block;
          transition: transform 0.3s ease;
        }
        .t4-hg-card:hover .t4-hg-cta { color: var(--t4-accent); }
        .t4-hg-card:hover .t4-hg-cta span { transform: translateX(5px); }

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
