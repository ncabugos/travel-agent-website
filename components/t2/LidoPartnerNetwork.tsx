'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { HotelProgram } from '@/lib/hotel-programs'

interface LidoPartnerNetworkProps {
  /** Tenant base path, e.g. /t2/lido-collective */
  base: string
  /** DB-driven hotel programs — white logos for the dark band */
  programs: HotelProgram[]
}

type Logo = { name: string; src: string }

const WHITE = '/assets/supplier logos/white transparent'

const CRUISE_PARTNERS: Logo[] = [
  { name: 'Aman at Sea',                    src: `${WHITE}/cruise/aman_at_sea-white-600.png` },
  { name: 'Orient Express Sailing',         src: `${WHITE}/cruise/orient_express_sailing-white-600.png` },
  { name: 'Four Seasons Yachts',            src: `${WHITE}/cruise/FourSeasons_Yacht-white-600.png` },
  { name: 'Ritz-Carlton Yacht Collection',  src: `${WHITE}/cruise/RitzCarlton_Yacht-white-600.png` },
  { name: 'Regent Seven Seas',              src: `${WHITE}/cruise/regent-white-600.png` },
  { name: 'Silversea',                      src: `${WHITE}/cruise/silverSea-wnite-600.png` },
  { name: 'Cunard',                         src: `${WHITE}/cruise/cunard-white-600.png` },
  { name: 'Ponant',                         src: `${WHITE}/cruise/ponant-white-600.png` },
  { name: 'Crystal Cruises',                src: `${WHITE}/cruise/crystalCruises-white-600.png` },
  { name: 'Explora Journeys',               src: `${WHITE}/cruise/explora-white-600.png` },
  { name: 'Scenic',                         src: `${WHITE}/cruise/scenicCruises-white-600.png` },
  { name: 'Windstar',                       src: `${WHITE}/cruise/windstarCruises-white-600.png` },
]

/**
 * The Lido Collective partner network — a dark navy band showing the white
 * supplier marks behind the collective's access, split by two filters:
 * Hotel Programs and Cruise Partners. The filter is a sliding toggle; the logo
 * grid crossfades between the two sets. Click a logo to jump to that catalog.
 */
export function LidoPartnerNetwork({ base, programs }: LidoPartnerNetworkProps) {
  const [active, setActive] = useState<'hotels' | 'cruise'>('hotels')
  // Hotel marks come from the DB-driven hotel_programs catalog (white variant).
  const hotelLogos: Logo[] = programs
    .map((p) => ({ name: p.name, src: p.logo_url_white ?? '' }))
    .filter((l) => l.src)
  const FILTERS = [
    { key: 'hotels' as const, label: 'Hotel Programs',  logos: hotelLogos,      href: '/book-hotel' },
    { key: 'cruise' as const, label: 'Cruise Partners', logos: CRUISE_PARTNERS, href: '/find-cruise' },
  ]
  const current = FILTERS.find((f) => f.key === active)!
  const activeIndex = FILTERS.findIndex((f) => f.key === active)

  return (
    <section className="lido-dark">
      <div className="lido-section" style={{ paddingTop: 'clamp(72px, 9vw, 110px)', paddingBottom: 'clamp(72px, 9vw, 110px)', textAlign: 'center' }}>
        <p className="lido-eyebrow" style={{ marginBottom: 28 }} data-reveal>Preferred Partner Relationships</p>

        {/* Sliding toggle */}
        <div className="lido-pn-toggle" role="tablist" aria-label="Partner type" data-reveal>
          <span className="lido-pn-thumb" aria-hidden style={{ transform: `translateX(${activeIndex * 100}%)` }} />
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={active === f.key}
              onClick={() => setActive(f.key)}
              className={`lido-pn-tab ${active === f.key ? 'is-active' : ''}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* White logo grid — keyed on active so it crossfades on switch */}
        <div key={active} className="lido-pn-grid" data-reveal>
          {current.logos.map((logo, i) => (
            <Link
              key={logo.name}
              href={`${base}${current.href}`}
              className="lido-pn-cell"
              aria-label={logo.name}
              style={{ ['--i' as string]: i }}
            >
              <Image src={logo.src} alt={logo.name} width={360} height={150} unoptimized className="lido-pn-logo" />
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .lido-pn-toggle {
          position: relative; display: inline-flex; isolation: isolate;
          padding: 5px; border-radius: 999px;
          border: 1px solid var(--lido-line-dark); background: rgba(237,234,228,0.04);
          margin-bottom: clamp(48px, 6vw, 72px);
        }
        .lido-pn-thumb {
          position: absolute; z-index: 0; top: 5px; left: 5px;
          width: calc(50% - 5px); height: calc(100% - 10px);
          border-radius: 999px; background: rgba(237,234,228,0.14);
          box-shadow: inset 0 0 0 1px rgba(237,234,228,0.28);
          transition: transform 0.45s cubic-bezier(0.65, 0, 0.35, 1);
        }
        .lido-pn-tab {
          position: relative; z-index: 1; flex: 1 0 auto; min-width: 150px;
          font-family: var(--lido-font-body); font-size: 11px; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase; cursor: pointer;
          background: transparent; border: 0; color: var(--lido-on-dark);
          opacity: 0.5; border-radius: 999px; padding: 12px 26px;
          transition: opacity 0.3s ease;
        }
        .lido-pn-tab:hover { opacity: 0.8; }
        .lido-pn-tab.is-active { opacity: 1; }

        .lido-pn-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: clamp(36px, 4.5vw, 64px) clamp(28px, 4vw, 60px);
          align-items: center; max-width: 1040px; margin: 0 auto;
          animation: lido-pn-fade 0.6s var(--t2-ease-out) both;
        }
        @keyframes lido-pn-fade { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }

        .lido-pn-cell {
          display: flex; align-items: center; justify-content: center; min-height: 84px;
          animation: lido-pn-cell 0.5s var(--t2-ease-out) both;
          animation-delay: calc(var(--i) * 35ms);
        }
        @keyframes lido-pn-cell { from { opacity: 0; } to { opacity: 1; } }
        .lido-pn-logo {
          width: auto; height: auto; max-height: 63px; max-width: 100%;
          object-fit: contain; opacity: 0.62;
          transition: opacity 0.3s ease, transform 0.45s var(--t2-ease-out);
        }
        .lido-pn-cell:hover .lido-pn-logo { opacity: 1; transform: scale(1.06); }

        @media (max-width: 720px) {
          .lido-pn-grid { grid-template-columns: repeat(2, 1fr); }
          .lido-pn-logo { max-height: 51px; }
          .lido-pn-tab { min-width: 0; padding: 12px 16px; }
        }
      `}</style>
    </section>
  )
}
