'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { MOCK_HOTEL_PROGRAMS } from '@/lib/hotel-programs'
import type { FeaturedPartner } from '@/lib/collections'

interface T2PartnerGridProps {
  partners: FeaturedPartner[]
  agentId: string
}

const TABS = [
  { label: 'Hotels', value: 'hotel'  },
  { label: 'Cruise', value: 'cruise' },
]

// ─── Cruise fallback rows (black logos, slugs match find-cruise routes) ───────
const FALLBACK_CRUISES: FeaturedPartner[] = [
  { id: 'c1', name: 'Regent Seven Seas',  slug: 'regent-seven-seas', logo_url: '/media/cruises/regent-seven-seas/regent-black-500.jpg',   category: 'cruise', is_preferred: true, sort_order: 1 },
  { id: 'c2', name: 'Silversea Cruises',  slug: 'silversea',         logo_url: '/assets/supplier logos/jpg/Silversea-Logo.jpg',            category: 'cruise', is_preferred: true, sort_order: 2 },
  { id: 'c3', name: 'Seabourn Cruises',   slug: 'seabourn',          logo_url: '/media/cruises/seabourn/seabourn-black-600.png',            category: 'cruise', is_preferred: true, sort_order: 3 },
  { id: 'c4', name: 'Cunard',             slug: 'cunard',            logo_url: '/assets/supplier logos/jpg/Cunard-black.jpg',               category: 'cruise', is_preferred: true, sort_order: 4 },
  { id: 'c5', name: 'Oceania Cruises',    slug: 'oceania',           logo_url: '/media/cruises/oceania/oceania-cruises-logo-black-600.jpg', category: 'cruise', is_preferred: true, sort_order: 5 },
  { id: 'c6', name: 'Azamara',            slug: 'azamara',           logo_url: '/media/cruises/azamara/azamara-logo-black-600.jpg',         category: 'cruise', is_preferred: true, sort_order: 6 },
  { id: 'c7', name: 'Ponant',             slug: 'ponant',            logo_url: '/media/cruises/ponant/ponant-blue-600.jpg',                 category: 'cruise', is_preferred: true, sort_order: 7 },
  { id: 'c8', name: 'Holland America',    slug: 'holland-america',   logo_url: '/assets/supplier logos/jpg/Holland-America-black.jpg',      category: 'cruise', is_preferred: true, sort_order: 8 },
  { id: 'c9', name: 'Viking',             slug: 'viking',            logo_url: '/media/cruises/viking/viking-cruises-black.png',            category: 'cruise', is_preferred: true, sort_order: 9 },
]

// ─── Hotel fallback — built from the canonical MOCK_HOTEL_PROGRAMS list ───────
const FALLBACK_HOTELS: FeaturedPartner[] = MOCK_HOTEL_PROGRAMS.map((p, i) => ({
  id: `h${i + 1}`,
  name: p.name,
  slug: p.slug,
  logo_url: p.logo_url,
  category: 'hotel',
  is_preferred: true,
  sort_order: i + 10,
}))

const FALLBACK_PARTNERS = [...FALLBACK_HOTELS, ...FALLBACK_CRUISES]

export function T2PartnerGrid({ partners, agentId }: T2PartnerGridProps) {
  const [activeTab, setActiveTab] = useState('hotel')

  // Use DB data if available, otherwise canonical fallback
  const source = partners.length > 0 ? partners : FALLBACK_PARTNERS

  const filtered = source.filter(p => p.category === activeTab)

  const base = `/t2/${agentId}`

  function partnerHref(partner: FeaturedPartner) {
    if (partner.category === 'cruise') return `${base}/find-cruise/${partner.slug}`
    // Hotels always route to the program landing page
    return `${base}/book-hotel/${partner.slug}`
  }

  const isHotelTab = activeTab === 'hotel'

  return (
    <section style={{ padding: 'var(--t2-section-pad) 0', background: '#ffffff' }}>
      <div style={{ maxWidth: 'var(--t2-content-max, 1280px)', margin: '0 auto', padding: '0 48px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="t2-label" style={{ marginBottom: 16 }}>Exclusive Partnerships</p>
          <h2 className="t2-heading t2-heading-lg">Our Partner Programs</h2>
          <p style={{
            fontFamily: 'var(--t2-font-sans)', fontSize: 15, lineHeight: 1.9,
            color: 'var(--t2-text-muted)', fontWeight: 300,
            maxWidth: 580, margin: '16px auto 0',
          }}>
            Our Virtuoso membership unlocks preferred benefits at these world-class brands — unavailable through any other booking channel.
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 0,
          borderBottom: '1px solid var(--t2-divider)',
          marginBottom: 56,
        }}>
          {TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              style={{
                fontFamily: 'var(--t2-font-sans)',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '12px 32px',
                color: activeTab === tab.value ? 'var(--t2-text)' : 'var(--t2-text-muted)',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                borderBottom: activeTab === tab.value ? '2px solid var(--t2-accent)' : '2px solid transparent',
                marginBottom: -1,
                transition: 'color 0.2s ease, border-color 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Logo grid — 5 columns for hotels, 3 for cruises */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isHotelTab ? 'repeat(5, 1fr)' : 'repeat(3, 1fr)',
            gap: isHotelTab ? '48px 40px' : '48px 64px',
            alignItems: 'center',
            maxWidth: isHotelTab ? 1100 : 860,
            margin: '0 auto',
          }}
          className="t2-logo-grid"
        >
          {filtered.map(partner => (
            <Link
              key={partner.id}
              href={partnerHref(partner)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: isHotelTab ? 72 : 90,
                textDecoration: 'none',
              }}
              className="t2-logo-cell"
            >
              {partner.logo_url ? (
                <Image
                  src={partner.logo_url}
                  alt={partner.name}
                  width={isHotelTab ? 180 : 220}
                  height={isHotelTab ? 60 : 80}
                  style={{
                    objectFit: 'contain',
                    maxWidth: '100%',
                    maxHeight: isHotelTab ? 52 : 64,
                    opacity: 0.55,
                    filter: 'grayscale(100%)',
                    transition: 'opacity 0.3s ease, filter 0.3s ease',
                  }}
                  className="t2-logo-img"
                  unoptimized
                />
              ) : (
                <span style={{
                  fontFamily: 'var(--t2-font-sans)',
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--t2-text-muted)',
                  textAlign: 'center',
                  opacity: 0.6,
                }}>
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
          opacity: 1 !important;
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
