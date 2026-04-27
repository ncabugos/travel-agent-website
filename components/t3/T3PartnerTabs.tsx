'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { HotelProgram } from '@/lib/hotel-programs'

// Cruise partners featured on the homepage tab.
// Kept in sync with the cruise-lines data (slugs must match).
const CRUISE_PARTNERS = [
  { slug: 'regent-seven-seas', name: 'Regent Seven Seas Cruises', logo: '/media/cruises/regent-seven-seas/regent-black-500.jpg' },
  { slug: 'silversea',         name: 'Silversea Cruises',         logo: '/assets/supplier logos/jpg/Silversea-Logo.jpg' },
  { slug: 'seabourn',          name: 'Seabourn Cruises',          logo: '/media/cruises/seabourn/seabourn-black-600.png' },
  { slug: 'cunard',            name: 'Cunard',                    logo: '/assets/supplier logos/jpg/Cunard-black.jpg' },
  { slug: 'oceania',           name: 'Oceania Cruises',           logo: '/media/cruises/oceania/oceania-cruises-logo-black-600.jpg' },
  { slug: 'azamara',           name: 'Azamara',                   logo: '/media/cruises/azamara/azamara-logo-black-600.jpg' },
  { slug: 'ponant',            name: 'Ponant',                    logo: '/media/cruises/ponant/ponant-blue-600.jpg' },
  { slug: 'holland-america',   name: 'Holland America Line',      logo: '/assets/supplier logos/jpg/Holland-America-black.jpg' },
  { slug: 'viking',            name: 'Viking',                    logo: '/media/cruises/viking/viking-cruises-black.png' },
]

interface T3PartnerTabsProps {
  agentId: string
  hotelPrograms: HotelProgram[]
  eyebrow?: string
  headline?: string
  body?: string
}

/**
 * "Our Partner Programs" tabbed logo grid. Port of YTCPartnerTabs styled for
 * the T3 Meridian/Starter template. Hotels tab links to program brand pages;
 * Cruise tab links to cruise-line brand pages.
 */
export function T3PartnerTabs({
  agentId,
  hotelPrograms,
  eyebrow = 'Exclusive Partnerships',
  headline = 'Our Partner Programs',
  body = 'Our Virtuoso membership unlocks preferred benefits at these world-class brands — unavailable through any other booking channel.',
}: T3PartnerTabsProps) {
  const [tab, setTab] = useState<'hotels' | 'cruises'>('hotels')
  const base = `/t3/${agentId}`

  const tabStyle = (active: boolean): React.CSSProperties => ({
    background: 'none',
    border: 'none',
    borderBottom: active ? '2px solid var(--t3-accent)' : '2px solid transparent',
    padding: '14px 36px',
    cursor: 'pointer',
    fontFamily: 'var(--t3-font-body)',
    fontSize: 11,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    fontWeight: 500,
    color: active ? 'var(--t3-text)' : 'var(--t3-text-muted)',
    transition: 'color 0.2s ease, border-color 0.2s ease',
    marginBottom: '-1px',
  })

  return (
    <section className="t3-section">
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 56px' }}>
        <span className="t3-eyebrow" style={{ justifyContent: 'center' }}>
          {eyebrow}
        </span>
        <h2 className="t3-headline-xl" style={{ marginTop: 24 }}>
          {headline}
        </h2>
        <p className="t3-body t3-body-lg" style={{ marginTop: 24 }}>
          {body}
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 0,
          marginBottom: 64,
          borderBottom: '1px solid var(--t3-divider)',
        }}
      >
        <button type="button" style={tabStyle(tab === 'hotels')} onClick={() => setTab('hotels')}>
          Hotels
        </button>
        <button type="button" style={tabStyle(tab === 'cruises')} onClick={() => setTab('cruises')}>
          Cruise
        </button>
      </div>

      {/* Hotels tab */}
      {tab === 'hotels' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '56px 48px',
            alignItems: 'center',
            maxWidth: 1200,
            margin: '0 auto',
          }}
          className="t3-partner-grid"
        >
          {hotelPrograms.map((p) => (
            <Link
              key={p.slug}
              href={`${base}/book-hotel/${p.slug}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 120,
                textDecoration: 'none',
              }}
              className="t3-partner-cell"
            >
              {p.logo_url ? (
                <Image
                  src={p.logo_url}
                  alt={p.name}
                  width={234}
                  height={84}
                  style={{
                    objectFit: 'contain',
                    maxWidth: '100%',
                    maxHeight: 110,
                    opacity: 0.55,
                    filter: 'grayscale(100%)',
                    transition: 'opacity 0.3s ease, filter 0.3s ease',
                  }}
                  className="t3-partner-logo"
                  unoptimized
                />
              ) : (
                <span
                  style={{
                    fontFamily: 'var(--t3-font-display)',
                    fontSize: 13,
                    color: 'var(--t3-text-muted)',
                    textAlign: 'center',
                  }}
                >
                  {p.name}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Cruise tab */}
      {tab === 'cruises' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '56px 80px',
            alignItems: 'center',
            maxWidth: 1000,
            margin: '0 auto',
          }}
          className="t3-partner-grid"
        >
          {CRUISE_PARTNERS.map((c) => (
            <Link
              key={c.slug}
              href={`${base}/find-cruise/${c.slug}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 130,
                textDecoration: 'none',
              }}
              className="t3-partner-cell"
            >
              <Image
                src={c.logo}
                alt={c.name}
                width={286}
                height={104}
                style={{
                  objectFit: 'contain',
                  maxWidth: '100%',
                  maxHeight: 120,
                  opacity: 0.55,
                  filter: 'grayscale(100%)',
                  transition: 'opacity 0.3s ease, filter 0.3s ease',
                }}
                className="t3-partner-logo"
                unoptimized
              />
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .t3-partner-cell:hover .t3-partner-logo {
          opacity: 1 !important;
          filter: grayscale(0%) !important;
        }
        @media (max-width: 1000px) {
          .t3-partner-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 40px 32px !important;
          }
        }
        @media (max-width: 640px) {
          .t3-partner-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  )
}
