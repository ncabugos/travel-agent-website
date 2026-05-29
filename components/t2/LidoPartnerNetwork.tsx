'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface LidoPartnerNetworkProps {
  /** Tenant base path, e.g. /t2/lido-collective */
  base: string
}

type Logo = { name: string; src: string }

const WHITE = '/assets/supplier logos/white transparent'

const HOTEL_PROGRAMS: Logo[] = [
  { name: 'Aman',                src: `${WHITE}/Aman-white-600.png` },
  { name: 'Belmond Bellini Club', src: `${WHITE}/belmond-bellini_club.png` },
  { name: 'Four Seasons Preferred', src: `${WHITE}/FS_preferred-600.png` },
  { name: 'Rosewood Elite',      src: `${WHITE}/rosewood-elite-white.png` },
  { name: 'Mandarin Oriental Fan Club', src: `${WHITE}/mandarin-oriental-fan-club-Mandarin-white-600.png` },
  { name: 'Ritz-Carlton STARS', src: `${WHITE}/ritz-carlton-stars-white.png` },
  { name: 'Oetker Collection',  src: `${WHITE}/oetker-pearl-white-600.png` },
  { name: 'Rocco Forte',        src: `${WHITE}/Rocco_Forte-White-600.png` },
]

const CRUISE_PARTNERS: Logo[] = [
  { name: 'Aman at Sea',        src: `${WHITE}/cruise/aman_at_sea-white-600.png` },
  { name: 'Orient Express Sailing', src: `${WHITE}/cruise/orient_express_sailing-white-600.png` },
  { name: 'Four Seasons Yachts', src: `${WHITE}/cruise/FourSeasons_Yacht-white-600.png` },
  { name: 'Ritz-Carlton Yacht Collection', src: `${WHITE}/cruise/RitzCarlton_Yacht-white-600.png` },
  { name: 'Regent Seven Seas',  src: `${WHITE}/cruise/regent-white-600.png` },
  { name: 'Silversea',          src: `${WHITE}/cruise/silverSea-wnite-600.png` },
  { name: 'Cunard',             src: `${WHITE}/cruise/cunard-white-600.png` },
  { name: 'Ponant',             src: `${WHITE}/cruise/ponant-white-600.png` },
]

const FILTERS = [
  { key: 'hotels',  label: 'Hotel Programs', logos: HOTEL_PROGRAMS, href: '/book-hotel' },
  { key: 'cruise',  label: 'Cruise Partners', logos: CRUISE_PARTNERS, href: '/find-cruise' },
] as const

/**
 * The Lido Collective partner network — a dark navy band showing the white
 * supplier marks behind the collective's access, split by two filters:
 * Hotel Programs and Cruise Partners. Click a logo to jump to that catalog.
 */
export function LidoPartnerNetwork({ base }: LidoPartnerNetworkProps) {
  const [active, setActive] = useState<'hotels' | 'cruise'>('hotels')
  const current = FILTERS.find((f) => f.key === active)!

  return (
    <section className="lido-dark">
      <div className="lido-section" style={{ paddingTop: 'clamp(72px, 9vw, 110px)', paddingBottom: 'clamp(72px, 9vw, 110px)', textAlign: 'center' }}>
        <p className="lido-eyebrow" style={{ marginBottom: 28 }}>Preferred Partner Relationships</p>

        {/* Two filters */}
        <div className="lido-pn-tabs">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setActive(f.key)}
              className={`lido-pn-tab ${active === f.key ? 'is-active' : ''}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* White logo grid */}
        <div className="lido-pn-grid">
          {current.logos.map((logo) => (
            <Link key={logo.name} href={`${base}${current.href}`} className="lido-pn-cell" aria-label={logo.name}>
              <Image src={logo.src} alt={logo.name} width={300} height={120} unoptimized className="lido-pn-logo" />
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .lido-pn-tabs { display: inline-flex; gap: 8px; margin-bottom: clamp(40px, 5vw, 64px); }
        .lido-pn-tab {
          font-family: var(--lido-font-body); font-size: 11px; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase; cursor: pointer;
          background: transparent; border: 1px solid var(--lido-line-dark);
          color: var(--lido-on-dark); opacity: 0.55; border-radius: 999px;
          padding: 10px 22px; transition: opacity 0.25s ease, background 0.25s ease, border-color 0.25s ease;
        }
        .lido-pn-tab:hover { opacity: 0.85; }
        .lido-pn-tab.is-active {
          opacity: 1; background: rgba(237,234,228,0.10); border-color: rgba(237,234,228,0.5);
        }
        .lido-pn-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: clamp(28px, 4vw, 56px) clamp(24px, 4vw, 56px);
          align-items: center; max-width: 920px; margin: 0 auto;
        }
        .lido-pn-cell { display: flex; align-items: center; justify-content: center; min-height: 56px; }
        .lido-pn-logo {
          width: auto; height: auto; max-height: 42px; max-width: 100%;
          object-fit: contain; opacity: 0.62; transition: opacity 0.3s ease;
        }
        .lido-pn-cell:hover .lido-pn-logo { opacity: 1; }
        @media (max-width: 720px) {
          .lido-pn-grid { grid-template-columns: repeat(2, 1fr); }
          .lido-pn-logo { max-height: 34px; }
        }
      `}</style>
    </section>
  )
}
