'use client'

import { useState } from 'react'
import type React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { SupplierProduct } from '@/lib/collections'
import { T2EnquiryDrawer } from '@/components/t2/T2EnquiryDrawer'

interface T2ExperiencesGridProps {
  products: SupplierProduct[]
  agentId?: string
}

const TABS: { label: string; value: SupplierProduct['category'] | 'all' }[] = [
  { label: 'All',          value: 'all' },
  { label: 'Cruises',      value: 'cruise' },
  { label: 'Hotels',       value: 'hotel' },
  { label: 'Experiences',  value: 'experience' },
]

// Simple linear category icons
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  cruise: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2"/><path d="M12 7v11"/><path d="M5 15H4a8 8 0 0 0 16 0h-1"/><path d="M8 11h8"/>
    </svg>
  ),
  hotel: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><rect x="9" y="13" width="6" height="8"/>
    </svg>
  ),
  experience: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  tour: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
}

// Checkmark icon for highlights
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--t2-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

// ── Brand → URL maps ──────────────────────────────────────────────────────────

// Maps supplier_name → book-hotel?brand= query value
const HOTEL_BRAND_URLS: Record<string, string> = {
  'Four Seasons':         'Four Seasons Hotels and Resorts',
  'Aman':                 'Aman',
  'Belmond':              'Belmond',
  'Rosewood':             'Rosewood Hotels & Resorts',
  'Mandarin Oriental':    'Mandarin Oriental',
  'Hyatt':                'Hyatt Hotels Corporation',
  'Auberge Resorts':      'Auberge Resorts Collection',
  'Shangri-La':           'Shangri-La Group',
  'Ritz-Carlton':         'The Ritz-Carlton',
  'Peninsula Hotels':     'The Peninsula',
}

// Maps supplier_name → cruise line slug used in find-cruise page
const CRUISE_BRAND_SLUGS: Record<string, string> = {
  'Regent Seven Seas':  'Regent Seven Seas Cruises',
  'Silversea Cruises':  'Silversea',
  'Seabourn Cruises':   'Seabourn',
  'Oceania Cruises':    'Oceania Cruises',
}

function getProductHref(product: SupplierProduct, base: string): string | null {
  if (product.category === 'experience' || product.category === 'tour') return null

  if (product.category === 'hotel') {
    const brand = HOTEL_BRAND_URLS[product.supplier_name]
    return brand
      ? `${base}/book-hotel?brand=${encodeURIComponent(brand)}`
      : `${base}/book-hotel`
  }

  if (product.category === 'cruise') {
    const line = CRUISE_BRAND_SLUGS[product.supplier_name]
    return line
      ? `${base}/find-cruise?cruise_line=${encodeURIComponent(line)}`
      : `${base}/find-cruise`
  }

  return null
}

export function T2ExperiencesGrid({ products, agentId = 't2-demo' }: T2ExperiencesGridProps) {
  const [activeTab, setActiveTab] = useState<'all' | SupplierProduct['category']>('all')
  const [enquiryProduct, setEnquiryProduct] = useState<SupplierProduct | null>(null)

  const base = `/t2/${agentId}`
  const filtered = activeTab === 'all' ? products : products.filter(p => p.category === activeTab)
  const featured = filtered.filter(p => p.is_featured)
  const rest = filtered.filter(p => !p.is_featured)

  return (
    <div>
      {/* ── Tab bar ── */}
      <div
        style={{
          display: 'flex', justifyContent: 'center', gap: 0,
          borderBottom: '1px solid var(--t2-divider)',
          marginBottom: 64,
        }}
      >
        {TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            style={{
              fontFamily: 'var(--t2-font-sans)', fontSize: 10, fontWeight: 500,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              padding: '14px 32px',
              color: activeTab === tab.value ? 'var(--t2-text)' : 'var(--t2-text-muted)',
              border: 'none', background: 'none', cursor: 'pointer',
              borderBottom: activeTab === tab.value ? '1px solid var(--t2-text)' : '1px solid transparent',
              marginBottom: -1, transition: 'color 0.2s ease, border-color 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Featured products — large 2-up ── */}
      {featured.length > 0 && (
        <div style={{ marginBottom: 72 }}>
          <p className="t2-label" style={{ marginBottom: 28, letterSpacing: '0.2em' }}>Featured</p>
          <div
            className="t2-exp-featured"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}
          >
            {featured.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                featured
                href={getProductHref(product, base)}
                onEnquire={setEnquiryProduct}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── All other products — 3-column grid ── */}
      {rest.length > 0 && (
        <div>
          {featured.length > 0 && (
            <p className="t2-label" style={{ marginBottom: 28, letterSpacing: '0.2em' }}>All Partners</p>
          )}
          <div
            className="t2-exp-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}
          >
            {rest.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                featured={false}
                href={getProductHref(product, base)}
                onEnquire={setEnquiryProduct}
              />
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <p style={{
          textAlign: 'center', color: 'var(--t2-text-muted)',
          fontFamily: 'var(--t2-font-sans)', fontSize: 14, marginTop: 40, fontWeight: 300,
        }}>
          No experiences found in this category.
        </p>
      )}

      <style>{`
        @media (max-width: 900px) {
          .t2-exp-featured { grid-template-columns: 1fr !important; }
          .t2-exp-grid     { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .t2-exp-grid     { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <T2EnquiryDrawer
        product={enquiryProduct}
        onClose={() => setEnquiryProduct(null)}
      />
    </div>
  )
}

// ── Product card ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  featured,
  href,
  onEnquire,
}: {
  product: SupplierProduct
  featured: boolean
  href: string | null          // null → enquire modal (experiences); string → navigation link
  onEnquire: (p: SupplierProduct) => void
}) {
  const imageHeight = featured ? 340 : 220

  const imageContent = product.image_url && (
    <div style={{ position: 'relative', height: imageHeight }}>
      <Image
        src={product.image_url}
        alt={product.title}
        fill
        style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
        sizes={featured ? '(max-width: 900px) 100vw, 50vw' : '(max-width: 900px) 50vw, 33vw'}
        className="t2-exp-img"
        unoptimized
      />
      {/* Category badge */}
      <div style={{
        position: 'absolute', top: 16, left: 16,
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)',
        padding: '6px 12px',
      }}>
        <span style={{ color: 'var(--t2-text-muted)', display: 'flex', alignItems: 'center' }}>
          {CATEGORY_ICONS[product.category]}
        </span>
        <span style={{
          fontFamily: 'var(--t2-font-sans)', fontSize: 9,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'var(--t2-text-muted)', fontWeight: 500,
        }}>
          {product.subcategory ?? product.category}
        </span>
      </div>
    </div>
  )

  return (
    <article
      style={{
        background: '#ffffff',
        border: '1px solid var(--t2-divider)',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s ease',
      }}
      className="t2-exp-card"
    >
      {/* Image — links if it's a brand page, stays static for experiences */}
      {product.image_url && (
        href ? (
          <Link href={href} style={{ display: 'block', textDecoration: 'none' }} className="t2-exp-img-link">
            {imageContent}
          </Link>
        ) : (
          imageContent
        )
      )}

      {/* Content */}
      <div style={{ padding: featured ? '28px 32px 32px' : '20px 24px 28px' }}>
        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          {product.logo_url && (
            <Image
              src={product.logo_url}
              alt={product.supplier_name}
              width={200}
              height={75}
              style={{ objectFit: 'contain', maxHeight: 75, opacity: 0.7, filter: 'grayscale(100%)' }}
              unoptimized
            />
          )}
          {product.logo_url && (
            <div style={{ width: 1, height: 14, background: 'var(--t2-divider)' }} />
          )}
          <span style={{
            fontFamily: 'var(--t2-font-sans)', fontSize: 10, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'var(--t2-text-muted)',
          }}>
            {product.location}
          </span>
        </div>

        {/* Title — link if brand page */}
        {href ? (
          <Link href={href} style={{ textDecoration: 'none' }}>
            <h3 style={{
              fontFamily: 'var(--t2-font-serif)',
              fontSize: featured ? 26 : 20,
              fontWeight: 400, color: 'var(--t2-text)',
              lineHeight: 1.2, marginBottom: 12,
            }}>
              {product.title}
            </h3>
          </Link>
        ) : (
          <h3 style={{
            fontFamily: 'var(--t2-font-serif)',
            fontSize: featured ? 26 : 20,
            fontWeight: 400, color: 'var(--t2-text)',
            lineHeight: 1.2, marginBottom: 12,
          }}>
            {product.title}
          </h3>
        )}

        {/* Description */}
        {product.description && (
          <p style={{
            fontFamily: 'var(--t2-font-sans)', fontSize: 13, fontWeight: 300,
            lineHeight: 1.75, color: 'var(--t2-text-muted)',
            marginBottom: product.highlights.length > 0 ? 20 : 0,
          }}>
            {product.description}
          </p>
        )}

        {/* Highlights */}
        {product.highlights.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {product.highlights.slice(0, featured ? 3 : 2).map((h, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ flexShrink: 0, marginTop: 2 }}><CheckIcon /></span>
                <span style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 12, color: 'var(--t2-text-muted)', lineHeight: 1.5 }}>
                  {h}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Footer row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderTop: '1px solid var(--t2-divider)', paddingTop: 16, marginTop: 4,
        }}>
          <div style={{ display: 'flex', gap: 16 }}>
            {product.duration && (
              <span style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 11, color: 'var(--t2-text-muted)', letterSpacing: '0.05em' }}>
                {product.duration}
              </span>
            )}
            {product.starting_from && (
              <span style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 11, color: 'var(--t2-accent)', fontWeight: 500, letterSpacing: '0.05em' }}>
                {product.starting_from}
              </span>
            )}
          </div>

          {/* CTA: navigate for brand pages, enquire modal for experiences */}
          {href ? (
            <Link
              href={href}
              style={{
                fontFamily: 'var(--t2-font-sans)', fontSize: 10, letterSpacing: '0.18em',
                textTransform: 'uppercase', fontWeight: 500,
                color: 'var(--t2-text)', textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: 6,
                transition: 'color 0.2s ease',
              }}
              className="t2-exp-link"
            >
              View Hotels
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          ) : (
            <button
              onClick={() => onEnquire(product)}
              style={{
                fontFamily: 'var(--t2-font-sans)', fontSize: 10, letterSpacing: '0.18em',
                textTransform: 'uppercase', fontWeight: 500,
                color: 'var(--t2-text)', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                display: 'flex', alignItems: 'center', gap: 6,
                transition: 'color 0.2s ease',
              }}
              className="t2-exp-link"
            >
              Enquire
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      <style>{`
        .t2-exp-card:hover { box-shadow: 0 8px 40px rgba(0,0,0,0.08) !important; }
        .t2-exp-card:hover .t2-exp-img { transform: scale(1.03) !important; }
        .t2-exp-img-link:hover .t2-exp-img { transform: scale(1.03) !important; }
        .t2-exp-link:hover { color: var(--t2-accent) !important; }
      `}</style>
    </article>
  )
}
