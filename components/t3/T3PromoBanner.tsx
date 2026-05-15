import Image from 'next/image'
import Link from 'next/link'
import type { SupplierPromo } from '@/lib/supplier-promos'

interface Props {
  promo: SupplierPromo | null
  fallback?: {
    headline: string
    subheading?: string
    cta_label?: string
    cta_url?: string
    image_url?: string
  }
  agentId: string
}

/**
 * T3 (Meridian) — split image/copy promo banner.
 * Renders nothing if no active promo and no fallback.
 */
export function T3PromoBanner({ promo, fallback, agentId }: Props) {
  const data = promo ?? fallback
  if (!data) return null

  const ctaHref = promo?.cta_url ?? fallback?.cta_url ?? `/t3/${agentId}/contact`
  const ctaLabel = data.cta_label ?? 'Enquire Now'

  return (
    <>
      <style>{`
        .t3-promo-banner {
          display: grid;
          grid-template-columns: 3fr 2fr;
          border: 1px solid var(--t3-divider);
          overflow: hidden;
          background: var(--t3-bg-alt, #f5f3ee);
          max-width: var(--t3-content-narrow, 1100px);
          margin: 0 auto;
        }
        @media (max-width: 768px) {
          .t3-promo-banner { grid-template-columns: 1fr; }
          .t3-promo-img { aspect-ratio: 16/7 !important; }
        }
        .t3-promo-img {
          position: relative; width: 100%; height: 100%;
          overflow: hidden;
        }
        .t3-promo-img img {
          object-fit: cover;
          transition: transform 0.7s var(--t3-ease, ease);
        }
        .t3-promo-banner:hover .t3-promo-img img { transform: scale(1.025); }
        .t3-promo-content {
          display: flex; flex-direction: column;
          justify-content: center; gap: 18px;
          padding: 48px 52px;
          border-left: 1px solid var(--t3-divider);
        }
        @media (max-width: 768px) {
          .t3-promo-content {
            border-left: none;
            border-top: 1px solid var(--t3-divider);
            padding: 36px 28px;
          }
        }
        .t3-promo-headline {
          font-family: var(--t3-font-display);
          font-size: clamp(20px, 2.4vw, 28px);
          font-weight: 400;
          line-height: 1.22;
          letter-spacing: -0.01em;
          color: var(--t3-text);
          margin: 0;
        }
        .t3-promo-sub {
          font-family: var(--t3-font-body);
          font-size: 14px;
          line-height: 1.7;
          color: var(--t3-text-muted);
          margin: 0;
        }
        .t3-promo-cta {
          display: inline-block;
          margin-top: 4px;
          padding: 12px 24px;
          font-family: var(--t3-font-sans, var(--t3-font-body));
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--t3-text);
          border: 1px solid var(--t3-text);
          background: transparent;
          text-decoration: none;
          align-self: flex-start;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .t3-promo-cta:hover {
          background: var(--t3-text);
          color: var(--t3-bg);
        }
      `}</style>

      <div className="t3-promo-banner">
        <div className="t3-promo-img" style={{ aspectRatio: '4 / 3' }}>
          {data.image_url ? (
            <Image
              src={data.image_url}
              alt={data.headline}
              fill
              unoptimized
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'var(--t3-divider)' }} />
          )}
        </div>
        <div className="t3-promo-content">
          <h3 className="t3-promo-headline">{data.headline}</h3>
          {data.subheading && <p className="t3-promo-sub">{data.subheading}</p>}
          <Link href={ctaHref} className="t3-promo-cta">{ctaLabel}</Link>
        </div>
      </div>
    </>
  )
}
