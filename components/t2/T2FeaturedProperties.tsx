'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { LuxuryHotel } from '@/lib/hotels'

interface Props {
  /**
   * Live hotel records from luxury_hotels filtered by the program's
   * hotel_company. Cards link to /t2/{agentId}/hotels/{slug} for the
   * full detail page (no modal — keeps users on-site and gives them
   * the full property profile before they enquire).
   */
  hotels: LuxuryHotel[]
  programName: string
  agentId: string
}

export function T2FeaturedProperties({ hotels, programName, agentId }: Props) {
  if (!hotels || hotels.length === 0) return null
  const base = `/t2/${agentId}`

  return (
    <section style={{ padding: 'var(--t2-section-pad) 0', background: 'var(--t2-bg-alt)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p className="t2-label" style={{ marginBottom: 12, color: 'var(--t2-accent)' }}>
            Within the Collection
          </p>
          <h2 className="t2-heading t2-heading-lg">
            {`A few ${programName} properties.`}
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}
          className="t2-fp-grid"
        >
          {hotels.map((hotel) => (
            <PropertyCard key={hotel.slug} hotel={hotel} base={base} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .t2-fp-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .t2-fp-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

function PropertyCard({ hotel, base }: { hotel: LuxuryHotel; base: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={`${base}/hotels/${hotel.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--t2-bg)',
        borderRadius: 'var(--t2-radius-lg, 0)',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 16px 48px rgba(0,0,0,0.12)'
          : '0 2px 8px rgba(0,0,0,0.06)',
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: '#EDE8E1' }}>
        {hotel.cover_image_url && (
          <Image
            src={hotel.cover_image_url}
            alt={hotel.name}
            fill
            unoptimized
            sizes="(max-width: 900px) 50vw, 33vw"
            style={{
              objectFit: 'cover',
              transition: 'transform 0.6s ease',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 14,
            fontFamily: 'var(--t2-font-sans)',
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          {[hotel.city, hotel.country].filter(Boolean).join(', ')}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 22px 22px' }}>
        <h4
          style={{
            fontFamily: 'var(--t2-font-serif)',
            fontSize: 17,
            fontWeight: 500,
            marginBottom: 6,
            lineHeight: 1.3,
            color: 'var(--t2-text)',
          }}
        >
          {hotel.name}
        </h4>
        {hotel.description && (
          <p
            style={{
              fontFamily: 'var(--t2-font-sans)',
              fontSize: 13,
              lineHeight: 1.65,
              color: 'var(--t2-text-muted)',
              marginBottom: 18,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            } as React.CSSProperties}
          >
            {hotel.description}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span
            style={{
              fontFamily: 'var(--t2-font-sans)',
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: hovered ? 'var(--t2-accent)' : 'var(--t2-text)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'color 0.2s ease',
            }}
          >
            View hotel <span aria-hidden style={{ transition: 'transform 0.2s', transform: hovered ? 'translateX(3px)' : 'none' }}>→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
