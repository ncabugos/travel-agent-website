import Image from 'next/image'
import Link from 'next/link'
import type { SupplierPromo } from '@/lib/supplier-promos'

interface T2PromoBannerProps {
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
 * Peninsula-style promotional banner:
 * Left: wide landscape image | Right: logo-less, headline, CTA
 *
 * Data source: supplier_promos (Supabase), with a hardcoded fallback
 * for when no active promo is configured.
 */
export function T2PromoBanner({ promo, fallback, agentId }: T2PromoBannerProps) {
  const data = promo ?? fallback
  if (!data) return null

  const ctaHref = promo?.cta_url ?? fallback?.cta_url ?? `/t2/${agentId}/contact`
  const ctaLabel = data.cta_label ?? 'Enquire Now'

  return (
    <>
      <style>{`
        .t2-promo-banner {
          display: grid;
          grid-template-columns: 3fr 2fr;
          border: 1px solid var(--t2-divider);
          overflow: hidden;
          background: var(--t2-bg-alt, #f7f5f1);
          max-width: 1100px;
          margin: 0 auto;
        }
        @media (max-width: 720px) {
          .t2-promo-banner { grid-template-columns: 1fr; }
          .t2-promo-image { aspect-ratio: 16/7 !important; }
        }
        .t2-promo-image {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .t2-promo-image img {
          object-fit: cover;
          width: 100%;
          height: 100%;
          transition: transform 0.7s ease;
        }
        .t2-promo-banner:hover .t2-promo-image img {
          transform: scale(1.025);
        }
        .t2-promo-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 16px;
          padding: 44px 48px;
          border-left: 1px solid var(--t2-divider);
        }
        @media (max-width: 720px) {
          .t2-promo-content {
            border-left: none;
            border-top: 1px solid var(--t2-divider);
            padding: 36px 28px;
          }
        }
        .t2-promo-headline {
          font-family: var(--t2-font-serif);
          font-size: clamp(18px, 2.5vw, 26px);
          font-weight: 400;
          line-height: 1.25;
          color: var(--t2-text);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin: 0;
        }
        .t2-promo-sub {
          font-family: var(--t2-font-sans);
          font-size: 13px;
          line-height: 1.7;
          color: var(--t2-text-muted);
          margin: 0;
        }
        .t2-promo-cta {
          display: inline-block;
          margin-top: 8px;
          padding: 10px 22px;
          font-family: var(--t2-font-sans);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--t2-text);
          border: 1px solid var(--t2-divider-heavy, rgba(50,40,30,0.35));
          background: transparent;
          text-decoration: none;
          transition: background 0.2s ease, color 0.2s ease;
          align-self: flex-start;
        }
        .t2-promo-cta:hover {
          background: var(--t2-text);
          color: var(--t2-bg);
        }
      `}</style>

      <div className="t2-promo-banner">
        {/* Left — image */}
        <div className="t2-promo-image">
          {data.image_url ? (
            <Image
              src={data.image_url}
              alt={data.headline}
              fill
              unoptimized
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 720px) 100vw, 60vw"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'var(--t2-divider)' }} />
          )}
        </div>

        {/* Right — content */}
        <div className="t2-promo-content">
          <h3 className="t2-promo-headline">{data.headline}</h3>
          {data.subheading && (
            <p className="t2-promo-sub">{data.subheading}</p>
          )}
          <Link href={ctaHref} className="t2-promo-cta">
            {ctaLabel}
          </Link>
        </div>
      </div>
    </>
  )
}
