import Link from 'next/link'
import type { SupplierProduct } from '@/lib/collections'

interface T3ProductGridProps {
  agentId: string
  products: SupplierProduct[]
  eyebrow?: string
  headline?: string
  subheading?: string
  columns?: 2 | 3
}

const FALLBACK_IMAGE = '/media/hero images/four-seasons-sayan-hero.jpg'

export function T3ProductGrid({
  agentId,
  products,
  eyebrow,
  headline,
  subheading,
  columns = 2,
}: T3ProductGridProps) {
  const base = `/t3/${agentId}`

  if (!products.length) return null

  return (
    <section className="t3-section">
      {(eyebrow || headline || subheading) && (
        <div style={{ maxWidth: 720, marginBottom: 80 }}>
          {eyebrow && <span className="t3-eyebrow">{eyebrow}</span>}
          {headline && (
            <h2 className="t3-headline-xl" style={{ marginTop: 28 }}>
              {headline}
            </h2>
          )}
          {subheading && (
            <p className="t3-body t3-body-lg" style={{ marginTop: 24 }}>
              {subheading}
            </p>
          )}
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 48,
          rowGap: 96,
        }}
        className="t3-product-grid"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} contactHref={`${base}/contact`} />
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .t3-product-grid {
            grid-template-columns: 1fr !important;
            gap: 64px !important;
          }
        }
      `}</style>
    </section>
  )
}

function ProductCard({
  product,
  contactHref,
}: {
  product: SupplierProduct
  contactHref: string
}) {
  const image = product.image_url || FALLBACK_IMAGE

  return (
    <article
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
      className="t3-product-card"
    >
      {/* Image */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '5 / 4',
          overflow: 'hidden',
          marginBottom: 32,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={product.title}
          className="t3-product-img"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.9s var(--t3-ease-out)',
          }}
        />
        {/* Supplier tag */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            padding: '8px 14px',
            background: 'rgba(247, 245, 240, 0.94)',
            color: 'var(--t3-text)',
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            backdropFilter: 'blur(6px)',
          }}
        >
          {product.supplier_name}
        </div>
        {/* Duration */}
        {product.duration && (
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              padding: '8px 14px',
              background: 'rgba(20, 17, 15, 0.78)',
              color: '#fff',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              backdropFilter: 'blur(6px)',
            }}
          >
            {product.duration}
          </div>
        )}
      </div>

      {/* Location */}
      {product.location && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--t3-text-muted)',
            marginBottom: 12,
          }}
        >
          {product.location}
          {product.subcategory && <span style={{ color: 'var(--t3-text-soft)' }}> · {product.subcategory}</span>}
        </div>
      )}

      {/* Title */}
      <h3 className="t3-headline-lg" style={{ marginBottom: 16, fontSize: 'clamp(1.5rem, 2.2vw, 1.9rem)' }}>
        {product.title}
      </h3>

      {/* Description */}
      {product.description && (
        <p className="t3-body" style={{ marginBottom: 24 }}>
          {product.description}
        </p>
      )}

      {/* Highlights */}
      {product.highlights && product.highlights.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 0 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            borderTop: '1px solid var(--t3-divider)',
            paddingTop: 24,
          }}
        >
          {product.highlights.slice(0, 4).map((h, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                fontSize: 13.5,
                color: 'var(--t3-text-muted)',
                lineHeight: 1.55,
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  flexShrink: 0,
                  width: 6,
                  height: 6,
                  marginTop: 8,
                  background: 'var(--t3-accent)',
                }}
              />
              {h}
            </li>
          ))}
        </ul>
      )}

      {/* Footer */}
      <div
        style={{
          marginTop: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          paddingTop: 24,
          borderTop: '1px solid var(--t3-divider)',
          flexWrap: 'wrap',
        }}
      >
        {product.starting_from && (
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--t3-text-soft)',
                marginBottom: 4,
              }}
            >
              Starting
            </div>
            <div
              style={{
                fontFamily: 'var(--t3-font-display)',
                fontSize: 18,
                color: 'var(--t3-text)',
              }}
            >
              {product.starting_from}
            </div>
          </div>
        )}
        <Link href={contactHref} className="t3-link-arrow" style={{ marginLeft: 'auto' }}>
          Enquire
          <span className="arrow">→</span>
        </Link>
      </div>

      <style>{`
        .t3-product-card:hover .t3-product-img {
          transform: scale(1.04);
        }
      `}</style>
    </article>
  )
}
