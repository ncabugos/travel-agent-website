'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const HOTEL_PARTNERS = [
  { id: 'h1',  name: 'Four Seasons Preferred Partner',   logo: '/assets/ytc/partners/four-seasons.jpg',              href: '/book-hotel?brand=Four+Seasons' },
  { id: 'h2',  name: 'Belmond Bellini Club',              logo: '/assets/ytc/partners/belmond-bellini-club.jpg',       href: '/book-hotel?brand=Belmond' },
  { id: 'h3',  name: 'Stars of The Ritz-Carlton',         logo: '/assets/ytc/partners/stars-ritz-carlton.jpg',        href: '/book-hotel?brand=Ritz-Carlton' },
  { id: 'h4',  name: 'Mandarin Oriental Fan Club',        logo: '/assets/ytc/partners/mandarin-fan-club.jpg',         href: '/book-hotel?brand=Mandarin+Oriental' },
  { id: 'h5',  name: 'The Peninsula Hotel PenClub',       logo: '/assets/ytc/partners/peninsula.jpg',                 href: '/book-hotel?brand=Peninsula' },
  { id: 'h6',  name: 'Design Hotels',                     logo: '/assets/ytc/partners/design-hotels.png',             href: '/book-hotel?brand=Design+Hotels' },
]

const CRUISE_PARTNERS = [
  { id: 'c1',  name: 'Regent Seven Seas Cruises',  logo: '/media/cruises/regent-seven-seas/regent-black-500.jpg',   darkBg: false, href: '/find-cruise?line=Regent+Seven+Seas' },
  { id: 'c2',  name: 'Silversea',                   logo: '/media/cruises/silversea/silversea-logo_white.png',       darkBg: true,  href: '/find-cruise?line=Silversea' },
  { id: 'c3',  name: 'Seabourn',                    logo: '/media/cruises/seabourn/seabourn-black-600.png',          darkBg: false, href: '/find-cruise?line=Seabourn' },
  { id: 'c4',  name: 'Cunard',                      logo: '/media/cruises/cunard/cunard-logo-black-600.jpg',         darkBg: false, href: '/find-cruise?line=Cunard' },
  { id: 'c5',  name: 'Oceania Cruises',             logo: '/media/cruises/oceania/oceania-cruises-logo-black-600.jpg', darkBg: false, href: '/find-cruise?line=Oceania' },
  { id: 'c6',  name: 'Azamara',                     logo: '/media/cruises/azamara/azamara-logo-black-600.jpg',       darkBg: false, href: '/find-cruise?line=Azamara' },
  { id: 'c7',  name: 'Ponant',                      logo: '/media/cruises/ponant/PONANT_Logo_white-500.png',          darkBg: true,  href: '/find-cruise?line=Ponant' },
  { id: 'c8',  name: 'Holland America Line',         logo: '/media/cruises/holland-america/hal_white-logo-700.png',  darkBg: true,  href: '/find-cruise?line=Holland+America' },
  { id: 'c9',  name: 'Viking',                      logo: '/media/cruises/viking/viking-cruises-black.png',           darkBg: false, href: '/find-cruise?line=Viking' },
]

interface Props {
  base: string
}

export function YTCPartnerTabs({ base }: Props) {
  const [activeTab, setActiveTab] = useState<'hotels' | 'cruises'>('hotels')

  const tabStyle = (active: boolean) => ({
    background: 'none' as const,
    border: 'none' as const,
    borderBottom: active ? '2px solid var(--t2-accent)' : '2px solid transparent',
    padding: '12px 32px',
    cursor: 'pointer' as const,
    fontFamily: 'var(--t2-font-sans)',
    fontSize: 11,
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    fontWeight: 500,
    color: active ? 'var(--t2-text)' : 'var(--t2-text-muted)',
    transition: 'all 0.2s ease',
  })

  return (
    <div id="partner-programs" style={{ marginTop: 40 }}>
      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 56, borderBottom: '1px solid var(--t2-divider)' }}>
        <button style={tabStyle(activeTab === 'hotels')} onClick={() => setActiveTab('hotels')}>Hotels</button>
        <button style={tabStyle(activeTab === 'cruises')} onClick={() => setActiveTab('cruises')}>Cruises</button>
      </div>

      {/* Hotel Partners */}
      {activeTab === 'hotels' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '40px 64px',
          alignItems: 'center',
          maxWidth: 860,
          margin: '0 auto',
        }} className="ytc-partner-grid">
          {HOTEL_PARTNERS.map(p => (
            <Link
              key={p.id}
              href={`${base}${p.href}`}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 80, textDecoration: 'none' }}
              className="ytc-partner-cell"
            >
              <Image
                src={p.logo}
                alt={p.name}
                width={200}
                height={70}
                style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: 60, opacity: 0.65, filter: 'grayscale(100%)', transition: 'opacity 0.35s ease, filter 0.35s ease' }}
                className="ytc-partner-logo"
                unoptimized
              />
            </Link>
          ))}
        </div>
      )}

      {/* Cruise Partners */}
      {activeTab === 'cruises' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '40px 64px',
          alignItems: 'center',
          maxWidth: 900,
          margin: '0 auto',
        }} className="ytc-partner-grid">
          {CRUISE_PARTNERS.map(p => (
            <Link
              key={p.id}
              href={`${base}${p.href}`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: 90, textDecoration: 'none',
                background: p.darkBg ? '#0E0E0E' : 'transparent',
                borderRadius: 2, padding: p.darkBg ? '8px 16px' : 0,
              }}
              className="ytc-partner-cell"
            >
              <Image
                src={p.logo}
                alt={p.name}
                width={220}
                height={80}
                style={{
                  objectFit: 'contain', maxWidth: '100%', maxHeight: 70,
                  opacity: p.darkBg ? 0.85 : 0.65,
                  filter: p.darkBg ? 'none' : 'grayscale(100%)',
                  transition: 'opacity 0.35s ease, filter 0.35s ease',
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
