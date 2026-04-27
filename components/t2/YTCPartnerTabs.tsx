'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { MOCK_HOTEL_PROGRAMS } from '@/lib/hotel-programs'

// ─── Cruise lines to feature — black logos, link to landing pages ─────────────
const CRUISE_PARTNERS = [
  { slug: 'regent-seven-seas', name: 'Regent Seven Seas Cruises',  logo: '/media/cruises/regent-seven-seas/regent-black-500.jpg' },
  { slug: 'silversea',          name: 'Silversea Cruises',          logo: '/assets/supplier logos/jpg/Silversea-Logo.jpg' },
  { slug: 'seabourn',           name: 'Seabourn Cruises',           logo: '/media/cruises/seabourn/seabourn-black-600.png' },
  { slug: 'cunard',             name: 'Cunard',                     logo: '/assets/supplier logos/jpg/Cunard-black.jpg' },
  { slug: 'oceania',            name: 'Oceania Cruises',            logo: '/media/cruises/oceania/oceania-cruises-logo-black-600.jpg' },
  { slug: 'azamara',            name: 'Azamara',                    logo: '/media/cruises/azamara/azamara-logo-black-600.jpg' },
  { slug: 'ponant',             name: 'Ponant',                     logo: '/media/cruises/ponant/ponant-blue-600.jpg' },
  { slug: 'holland-america',    name: 'Holland America Line',       logo: '/assets/supplier logos/jpg/Holland-America-black.jpg' },
  { slug: 'viking',             name: 'Viking',                     logo: '/media/cruises/viking/viking-cruises-black.png' },
]

interface Props {
  base: string
}

export function YTCPartnerTabs({ base }: Props) {
  const [activeTab, setActiveTab] = useState<'hotels' | 'cruises'>('hotels')

  const tabStyle = (active: boolean): React.CSSProperties => ({
    background: 'none',
    border: 'none',
    borderBottom: active ? '2px solid var(--t2-accent)' : '2px solid transparent',
    padding: '12px 32px',
    cursor: 'pointer',
    fontFamily: 'var(--t2-font-sans)',
    fontSize: 11,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    fontWeight: 500,
    color: active ? 'var(--t2-text)' : 'var(--t2-text-muted)',
    transition: 'all 0.2s ease',
  })

  return (
    <div style={{ marginTop: 40 }}>
      {/* Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 0,
        marginBottom: 56,
        borderBottom: '1px solid var(--t2-divider)',
      }}>
        <button style={tabStyle(activeTab === 'hotels')} onClick={() => setActiveTab('hotels')}>Hotels</button>
        <button style={tabStyle(activeTab === 'cruises')} onClick={() => setActiveTab('cruises')}>Cruises</button>
      </div>

      {/* ── Hotel Partners — all programs, black logo, link to program landing page ── */}
      {activeTab === 'hotels' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '72px 64px',
            alignItems: 'center',
            maxWidth: 1200,
            margin: '0 auto',
          }}
          className="ytc-partner-grid"
        >
          {MOCK_HOTEL_PROGRAMS.map(p => (
            <Link
              key={p.slug}
              href={`${base}/book-hotel/${p.slug}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 170,
                textDecoration: 'none',
              }}
              className="ytc-partner-cell"
            >
              {p.logo_url ? (
                <Image
                  src={p.logo_url}
                  alt={p.name}
                  width={360}
                  height={120}
                  style={{
                    objectFit: 'contain',
                    maxWidth: '100%',
                    maxHeight: 150,
                    opacity: 0.55,
                    filter: 'grayscale(100%)',
                    transition: 'opacity 0.3s ease, filter 0.3s ease',
                  }}
                  className="ytc-partner-logo"
                  unoptimized
                />
              ) : (
                <span style={{
                  fontFamily: 'var(--t2-font-serif)',
                  fontSize: 12,
                  color: 'var(--t2-text-muted)',
                  textAlign: 'center',
                }}>{p.name}</span>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* ── Cruise Partners — featured lines, black logos, link to cruise landing pages ── */}
      {activeTab === 'cruises' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '56px 80px',
            alignItems: 'center',
            maxWidth: 1000,
            margin: '0 auto',
          }}
          className="ytc-partner-grid"
        >
          {CRUISE_PARTNERS.map(c => (
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
              className="ytc-partner-cell"
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
                className="ytc-partner-logo"
                unoptimized
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
