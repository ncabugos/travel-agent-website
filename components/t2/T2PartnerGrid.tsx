'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { FeaturedPartner } from '@/lib/collections'

interface T2PartnerGridProps {
  partners: FeaturedPartner[]
  agentId: string
}

const TABS = [
  { label: 'All',    value: '' },
  { label: 'Hotels', value: 'hotel' },
  { label: 'Cruise', value: 'cruise' },
]

// Static fallback partners — shown when no DB rows exist yet
const FALLBACK_PARTNERS: FeaturedPartner[] = [
  // ─── Cruises ────────────────────────────────────────────────────────────
  { id: 'c1',  name: 'Regent Seven Seas',      slug: 'regent-seven-seas',       logo_url: '/media/cruises/regent-seven-seas/regent-black-500.jpg',   category: 'cruise', is_preferred: true, sort_order: 1 },
  { id: 'c2',  name: 'Silversea Cruises',       slug: 'silversea',               logo_url: '/assets/supplier logos/jpg/Silversea-Logo.jpg',            category: 'cruise', is_preferred: true, sort_order: 2 },
  { id: 'c3',  name: 'Seabourn Cruises',        slug: 'seabourn',                logo_url: '/media/cruises/seabourn/seabourn-black-600.png',            category: 'cruise', is_preferred: true, sort_order: 3 },
  { id: 'c4',  name: 'Oceania Cruises',         slug: 'oceania',                 logo_url: '/media/cruises/oceania/oceania-cruises-logo-black-600.jpg', category: 'cruise', is_preferred: true, sort_order: 4 },
  // ─── Hotels ─────────────────────────────────────────────────────────────
  { id: 'p1',  name: 'Four Seasons Preferred Partner', slug: 'four-seasons-preferred-partner', logo_url: '/media/hotel-programs/logos/four-seasons-preferred-partner.jpg', category: 'hotel', is_preferred: true,  sort_order: 5 },
  { id: 'p2',  name: 'Belmond Bellini Club',    slug: 'belmond-bellini-club',    logo_url: '/media/hotel-programs/logos/belmond-bellini-club.jpg',      category: 'hotel', is_preferred: true,  sort_order: 6 },
  { id: 'p3',  name: 'Mandarin Oriental Fan Club', slug: 'mandarin-fan-club',   logo_url: '/media/hotel-programs/logos/mandarin-oriental-fan-club.jpg', category: 'hotel', is_preferred: true,  sort_order: 7 },
  { id: 'p4',  name: 'Rosewood Elite',          slug: 'rosewood-elite',          logo_url: '/media/hotel-programs/logos/rosewood-elite.jpg',            category: 'hotel', is_preferred: true,  sort_order: 8 },
  { id: 'p5',  name: 'Hyatt Privé',             slug: 'hyatt-prive',             logo_url: '/media/hotel-programs/logos/hyatt-prive.jpg',               category: 'hotel', is_preferred: true,  sort_order: 9 },
  { id: 'p6',  name: 'Peninsula Pen Club',      slug: 'peninsula-pen-club',      logo_url: '/media/hotel-programs/logos/peninsula-pen-club.jpg',        category: 'hotel', is_preferred: true,  sort_order: 10 },
  { id: 'p7',  name: 'Dorchester Diamond Club', slug: 'dorchester-diamond-club', logo_url: '/media/hotel-programs/logos/dorchester-diamond-club.jpg',   category: 'hotel', is_preferred: true,  sort_order: 11 },
  { id: 'p8',  name: 'Aman',                    slug: 'aman',                    logo_url: '/media/hotel-programs/logos/aman.jpg',                      category: 'hotel', is_preferred: true,  sort_order: 12 },
  { id: 'p9',  name: 'Rocco Forte Hotels',      slug: 'rocco-forte-hotels',      logo_url: '/media/hotel-programs/logos/rocco-forte-hotels.jpg',        category: 'hotel', is_preferred: false, sort_order: 13 },
  { id: 'p10', name: 'Shangri-La Luxury Circle', slug: 'shangri-la-luxury-circle', logo_url: '/media/hotel-programs/logos/shangri-la-luxury-circle.jpg', category: 'hotel', is_preferred: false, sort_order: 14 },
  { id: 'p11', name: 'One & Only',              slug: 'one-and-only',            logo_url: '/media/hotel-programs/logos/one-and-only.jpg',              category: 'hotel', is_preferred: false, sort_order: 15 },
  { id: 'p12', name: 'Oetker Collection Pearl', slug: 'oetker-pearl',            logo_url: '/media/hotel-programs/logos/oetker-pearl.jpg',              category: 'hotel', is_preferred: false, sort_order: 16 },
  { id: 'p13', name: 'Montage Hotels',          slug: 'montage',                 logo_url: '/media/hotel-programs/logos/montage-hotels.jpg',            category: 'hotel', is_preferred: false, sort_order: 17 },
  { id: 'p14', name: 'Kempinski Club 1897',     slug: 'kempinski-club1897',      logo_url: '/media/hotel-programs/logos/kempinski-club1897.jpg',        category: 'hotel', is_preferred: false, sort_order: 18 },
  { id: 'p15', name: 'COMO Hotels',             slug: 'como-hotels',             logo_url: '/media/hotel-programs/logos/como-hotels.jpg',               category: 'hotel', is_preferred: false, sort_order: 19 },
]

export function T2PartnerGrid({ partners, agentId }: T2PartnerGridProps) {
  const [activeTab, setActiveTab] = useState('')

  const source = partners.length > 0 ? partners : FALLBACK_PARTNERS

  const filtered = activeTab
    ? source.filter(p => p.category === activeTab)
    : source

  const base = `/t2/${agentId}`

  // Hotel brand names that match hotel_company values in the DB
  const HOTEL_BRAND_MAP: Record<string, string> = {
    'four-seasons-preferred-partner': 'Four Seasons Hotels and Resorts',
    'belmond-bellini-club':           'Belmond',
    'mandarin-fan-club':              'Mandarin Oriental',
    'rosewood-elite':                 'Rosewood Hotels & Resorts',
    'hyatt-prive':                    'Hyatt Hotels Corporation',
    'peninsula-pen-club':             'The Peninsula',
    'dorchester-diamond-club':        'Dorchester Collection',
    'aman':                           'Aman',
    'rocco-forte-hotels':             'Rocco Forte Hotels',
    'shangri-la-luxury-circle':       'Shangri-La Group',
    'one-and-only':                   'One&Only Resorts',
    'oetker-pearl':                   'Oetker Hotels',
    'montage':                        'Montage International',
    'kempinski-club1897':             'Kempinski Hotels',
    'como-hotels':                    'COMO Hotels and Resorts',
  }

  function partnerHref(partner: FeaturedPartner) {
    if (partner.category === 'cruise') return `${base}/find-cruise/${partner.slug}`
    const brand = HOTEL_BRAND_MAP[partner.slug]
    return brand
      ? `${base}/book-hotel?brand=${encodeURIComponent(brand)}`
      : `${base}/book-hotel`
  }

  return (
    <section style={{ padding: 'var(--t2-section-pad) 0', background: '#ffffff' }}>
      <div style={{ maxWidth: 'var(--t2-content-max, 1280px)', margin: '0 auto', padding: '0 48px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="t2-label" style={{ marginBottom: 16 }}>Our Partners in Travel</p>
          <h2 className="t2-heading t2-heading-lg">Featured Partners</h2>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 0,
            borderBottom: '1px solid var(--t2-divider)',
            marginBottom: 56,
          }}
        >
          {TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              style={{
                fontFamily: 'var(--t2-font-sans)',
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                padding: '14px 28px',
                color: activeTab === tab.value ? 'var(--t2-text)' : 'var(--t2-text-muted)',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                borderBottom: activeTab === tab.value ? '1px solid var(--t2-text)' : '1px solid transparent',
                marginBottom: -1,
                transition: 'color 0.2s ease, border-color 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Logo grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '56px 48px',
            alignItems: 'center',
            maxWidth: 1100,
            margin: '0 auto',
          }}
          className="t2-logo-grid"
        >
          {filtered.map(partner => (
            <Link
              key={partner.id}
              href={partnerHref(partner)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 90, textDecoration: 'none' }}
              className="t2-logo-cell"
            >
              {partner.logo_url ? (
                <Image
                  src={partner.logo_url}
                  alt={partner.name}
                  width={220}
                  height={90}
                  style={{
                    objectFit: 'contain',
                    maxWidth: '100%',
                    maxHeight: 80,
                    opacity: 0.75,
                    filter: 'grayscale(100%)',
                    transition: 'opacity 0.35s ease, filter 0.35s ease',
                  }}
                  className="t2-logo-img"
                  unoptimized
                />
              ) : (
                <span
                  style={{
                    fontFamily: 'var(--t2-font-sans)',
                    fontSize: 10,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--t2-text-muted)',
                    textAlign: 'center',
                    opacity: 0.6,
                  }}
                >
                  {partner.name}
                </span>
              )}
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={{
            textAlign: 'center',
            color: 'var(--t2-text-muted)',
            fontFamily: 'var(--t2-font-sans)',
            fontSize: 14,
            marginTop: 40,
            fontWeight: 300,
          }}>
            No partners found in this category.
          </p>
        )}
      </div>

      <style>{`
        .t2-logo-cell:hover .t2-logo-img {
          opacity: 0.9 !important;
          filter: grayscale(0%) !important;
        }
        @media (max-width: 1024px) {
          .t2-logo-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .t2-logo-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}
