'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { HotelProgram } from '@/lib/hotel-programs'

// Black transparent PNGs from /public/assets/supplier logos/black transparent/cruise/
const CRUISE_PARTNERS = [
  { slug: 'regent-seven-seas', name: 'Regent Seven Seas Cruises', logo: '/assets/supplier logos/black transparent/cruise/regent-black-600.png' },
  { slug: 'silversea',         name: 'Silversea Cruises',         logo: '/assets/supplier logos/black transparent/cruise/silverSea-black-600.png' },
  { slug: 'seabourn',          name: 'Seabourn Cruises',          logo: '/assets/supplier logos/black transparent/cruise/seabourn-black-600.png' },
  { slug: 'cunard',            name: 'Cunard',                    logo: '/assets/supplier logos/black transparent/cruise/cunard-black-600.png' },
  { slug: 'oceania',           name: 'Oceania Cruises',           logo: '/assets/supplier logos/black transparent/cruise/oceaniaCruises-black-600.png' },
  { slug: 'ponant',            name: 'Ponant',                    logo: '/assets/supplier logos/black transparent/cruise/Ponant-black-600.png' },
  { slug: 'viking',            name: 'Viking',                    logo: '/assets/supplier logos/black transparent/cruise/vikingCruises-black-600.png' },
  { slug: 'holland-america',   name: 'Holland America Line',      logo: '/assets/supplier logos/jpg/Holland-America-black.png' },
  { slug: 'azamara',           name: 'Azamara',                   logo: '/assets/supplier logos/black transparent/cruise/azamara-black-600.png' },
]

interface T4PartnerTabsProps {
  agentId: string
  hotelPrograms: HotelProgram[]
  eyebrow?: string
  heading?: string
  body?: string
}

/**
 * T4 partner programs tabs — thin, centered, desaturated logo grid on a
 * warm cream background. Logos are grayscale until hover.
 */
export function T4PartnerTabs({
  agentId,
  hotelPrograms,
  eyebrow = 'Exclusive Partnerships',
  heading = 'Preferred Partners',
  body = 'Our standing with these programs unlocks privileges — upgrades, credits, priority — unavailable through any other channel.',
}: T4PartnerTabsProps) {
  const [tab, setTab] = useState<'hotels' | 'cruises'>('hotels')
  const base = `/t4/${agentId}`

  const tabStyle = (active: boolean): React.CSSProperties => ({
    background: 'none',
    border: 'none',
    borderBottom: active ? '1px solid var(--t4-text)' : '1px solid transparent',
    padding: '14px 32px',
    cursor: 'pointer',
    fontFamily: 'var(--t4-font-body)',
    fontSize: 11,
    letterSpacing: '0.26em',
    textTransform: 'uppercase',
    fontWeight: 500,
    color: active ? 'var(--t4-text)' : 'var(--t4-text-muted)',
    transition: 'color 0.25s var(--t4-ease), border-color 0.25s var(--t4-ease)',
    marginBottom: '-1px',
  })

  return (
    <section style={{ padding: 'var(--t4-section-pad) 48px', background: 'var(--t4-bg)' }}>
      <div style={{ maxWidth: 'var(--t4-content-max)', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 56px' }}>
          <span
            className="t4-eyebrow t4-eyebrow-center"
            style={{ justifyContent: 'center' }}
          >
            {eyebrow}
          </span>
          <h2 className="t4-headline-xl" style={{ marginTop: 24 }}>
            {heading}
          </h2>
          {body && <p className="t4-body t4-body-lg" style={{ marginTop: 24 }}>{body}</p>}
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 0,
            marginBottom: 72,
            borderBottom: '1px solid var(--t4-divider)',
          }}
        >
          <button type="button" style={tabStyle(tab === 'hotels')} onClick={() => setTab('hotels')}>
            Hotels
          </button>
          <button type="button" style={tabStyle(tab === 'cruises')} onClick={() => setTab('cruises')}>
            Voyages
          </button>
        </div>

        {/* Hotels */}
        {tab === 'hotels' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '64px 48px',
              alignItems: 'center',
              maxWidth: 1200,
              margin: '0 auto',
            }}
            className="t4-partner-grid"
          >
            {hotelPrograms.map((p) => (
              <Link
                key={p.slug}
                href={`${base}/book-hotel/${p.slug}`}
                className="t4-partner-cell"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 130,
                  textDecoration: 'none',
                }}
              >
                {(p.logo_url_black ?? p.logo_url) && (
                  <Image
                    src={p.logo_url_black ?? p.logo_url ?? ''}
                    alt={p.name}
                    width={320}
                    height={110}
                    style={{
                      objectFit: 'contain',
                      maxWidth: '100%',
                      maxHeight: 115,
                      opacity: 0.82,
                      filter: 'grayscale(100%) sepia(0.05)',
                      transition: 'opacity 0.3s var(--t4-ease), filter 0.3s var(--t4-ease)',
                    }}
                    className="t4-partner-logo"
                    unoptimized
                  />
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Cruises */}
        {tab === 'cruises' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '64px 80px',
              alignItems: 'center',
              maxWidth: 1000,
              margin: '0 auto',
            }}
            className="t4-partner-grid"
          >
            {CRUISE_PARTNERS.map((c) => (
              <Link
                key={c.slug}
                href={`${base}/find-cruise/${c.slug}`}
                className="t4-partner-cell"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 140,
                  textDecoration: 'none',
                }}
              >
                <Image
                  src={c.logo}
                  alt={c.name}
                  width={340}
                  height={124}
                  style={{
                    objectFit: 'contain',
                    maxWidth: '100%',
                    maxHeight: 125,
                    opacity: 0.82,
                    filter: 'grayscale(100%) sepia(0.05)',
                    transition: 'opacity 0.3s var(--t4-ease), filter 0.3s var(--t4-ease)',
                  }}
                  className="t4-partner-logo"
                  unoptimized
                />
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .t4-partner-cell:hover .t4-partner-logo {
          opacity: 1 !important;
          filter: grayscale(0%) !important;
        }
        @media (max-width: 1000px) {
          .t4-partner-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 48px 32px !important; }
        }
        @media (max-width: 600px) {
          .t4-partner-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}
