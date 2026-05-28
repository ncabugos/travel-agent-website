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
 * T4 (Casa Solis) — split image/copy promo banner with editorial styling.
 * Renders nothing if no active promo and no fallback.
 */
export function T4PromoBanner({ promo, fallback, agentId }: Props) {
  const data = promo ?? fallback
  if (!data) return null

  const ctaHref = promo?.cta_url ?? fallback?.cta_url ?? `/t4/${agentId}/contact`
  const ctaLabel = data.cta_label ?? 'Enquire'

  return (
    <>
      <style>{`
        .t4-promo-banner {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          background: var(--t4-bg-alt);
          max-width: var(--t4-content-wide);
          margin: 0 auto;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .t4-promo-banner { grid-template-columns: 1fr; }
          .t4-promo-img { aspect-ratio: 16/8 !important; }
        }
        .t4-promo-img {
          position: relative;
          aspect-ratio: 4 / 3;
          overflow: hidden;
        }
        .t4-promo-img img {
          object-fit: cover;
          transition: transform 1.1s var(--t4-ease-out, ease);
        }
        .t4-promo-banner:hover .t4-promo-img img { transform: scale(1.04); }
        .t4-promo-content {
          display: flex; flex-direction: column;
          justify-content: center; gap: 22px;
          padding: clamp(36px, 5vw, 60px) clamp(28px, 4vw, 56px);
        }
        .t4-promo-eyebrow {
          font-family: var(--t4-font-body);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--t4-accent);
          margin: 0;
        }
        .t4-promo-headline {
          font-family: var(--t4-font-display);
          font-size: clamp(24px, 2.6vw, 34px);
          font-weight: 400;
          line-height: 1.18;
          letter-spacing: -0.015em;
          color: var(--t4-text);
          margin: 0;
        }
        .t4-promo-sub {
          font-family: var(--t4-font-body);
          font-size: 14.5px;
          line-height: 1.75;
          color: var(--t4-text-muted);
          margin: 0;
          font-weight: 300;
        }
        .t4-promo-cta {
          display: inline-block;
          margin-top: 6px;
          padding: 14px 30px;
          font-family: var(--t4-font-body);
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--t4-text);
          border: 1px solid var(--t4-text);
          background: transparent;
          text-decoration: none;
          align-self: flex-start;
          transition: background 0.25s ease, color 0.25s ease;
        }
        .t4-promo-cta:hover {
          background: var(--t4-text);
          color: var(--t4-bg);
        }
      `}</style>

      <div className="t4-promo-banner">
        <div className="t4-promo-img">
          {data.image_url ? (
            <Image
              src={data.image_url}
              alt={data.headline}
              fill
              unoptimized
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 55vw"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'var(--t4-divider)' }} />
          )}
        </div>
        <div className="t4-promo-content">
          <span className="t4-promo-eyebrow">Featured Partner</span>
          <h3 className="t4-promo-headline">{data.headline}</h3>
          {data.subheading && <p className="t4-promo-sub">{data.subheading}</p>}
          <Link href={ctaHref} className="t4-promo-cta">{ctaLabel}</Link>
        </div>
      </div>
    </>
  )
}
