'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { HotelProgram } from '@/lib/hotel-programs'

const CRUISE_PARTNERS = [
  { slug: 'regent-seven-seas', name: 'Regent Seven Seas Cruises', logo: '/media/cruises/regent-seven-seas/regent-black-500.jpg' },
  { slug: 'silversea',         name: 'Silversea Cruises',         logo: '/assets/supplier logos/jpg/Silversea-Logo.jpg' },
  { slug: 'seabourn',          name: 'Seabourn Cruises',          logo: '/media/cruises/seabourn/seabourn-black-600.png' },
  { slug: 'cunard',            name: 'Cunard',                    logo: '/assets/supplier logos/jpg/Cunard-black.jpg' },
  { slug: 'oceania',           name: 'Oceania Cruises',           logo: '/media/cruises/oceania/oceania-cruises-logo-black-600.jpg' },
  { slug: 'ponant',            name: 'Ponant',                    logo: '/media/cruises/ponant/ponant-blue-600.jpg' },
  { slug: 'viking',            name: 'Viking',                    logo: '/media/cruises/viking/viking-cruises-black.png' },
  { slug: 'holland-america',   name: 'Holland America Line',      logo: '/assets/supplier logos/jpg/Holland-America-black.jpg' },
  { slug: 'azamara',           name: 'Azamara',                   logo: '/media/cruises/azamara/azamara-logo-black-600.jpg' },
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
  heading = 'The Houses We Know',
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
                  height: 110,
                  textDecoration: 'none',
                }}
              >
                {p.logo_url && (
                  <Image
                    src={p.logo_url}
                    alt={p.name}
                    width={220}
                    height={78}
                    style={{
                      objectFit: 'contain',
                      maxWidth: '100%',
                      maxHeight: 100,
                      opacity: 0.5,
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
                  height: 120,
                  textDecoration: 'none',
                }}
              >
                <Image
                  src={c.logo}
                  alt={c.name}
                  width={240}
                  height={96}
                  style={{
                    objectFit: 'contain',
                    maxWidth: '100%',
                    maxHeight: 110,
                    opacity: 0.5,
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
