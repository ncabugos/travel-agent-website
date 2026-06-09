'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { HotelProgram } from '@/lib/hotel-programs'
import type { CruiseLine } from '@/lib/cruise-lines'
import type { FeaturedPartner } from '@/lib/collections'

interface T2PartnerGridProps {
  programs: HotelProgram[]
  cruises: CruiseLine[]
  agentId: string
}

const TABS = [
  { label: 'Hotels', value: 'hotel'  },
  { label: 'Cruise', value: 'cruise' },
]

export function T2PartnerGrid({ programs, cruises, agentId }: T2PartnerGridProps) {
  const [activeTab, setActiveTab] = useState('hotel')

  // Both lists come from the DB catalogs (hotel_programs / cruise_lines), black
  // logos on the white grid — black/white only, single source of truth.
  const hotelPartners: FeaturedPartner[] = programs.map((p, i) => ({
    id: `h${i + 1}`,
    name: p.name,
    slug: p.slug,
    logo_url: p.logo_url_black ?? p.logo_url,
    category: 'hotel',
    is_preferred: true,
    sort_order: i + 10,
  }))
  const cruisePartners: FeaturedPartner[] = cruises.map((c, i) => ({
    id: `c${i + 1}`,
    name: c.name,
    slug: c.slug,
    logo_url: c.logo_url_black ?? c.logo_url,
    category: 'cruise',
    is_preferred: true,
    sort_order: i + 1,
  }))
  const filtered = activeTab === 'hotel' ? hotelPartners : cruisePartners

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
                height: isHotelTab ? 120 : 130,
                textDecoration: 'none',
              }}
              className="t2-logo-cell"
            >
              {partner.logo_url ? (
                <Image
                  src={partner.logo_url}
                  alt={partner.name}
                  width={isHotelTab ? 320 : 360}
                  height={isHotelTab ? 110 : 124}
                  style={{
                    objectFit: 'contain',
                    maxWidth: '100%',
                    maxHeight: isHotelTab ? 100 : 110,
                    opacity: 0.78,
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
