import Link from 'next/link'
import Image from 'next/image'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { templatePath } from '@/lib/tenant-paths'
import { buildMarketingMetadata } from '@/lib/seo'

const SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
const PURPLE = '#8b5cf6'

export const metadata = buildMarketingMetadata({
  title: 'Website Templates for Luxury Travel Advisors — Elite Advisor Hub',
  description:
    'Explore the three Elite Advisor Hub templates — Vista, Meridian, and Casa Solis. See a live demo of each Virtuoso-grade design built for luxury travel advisors.',
  path: 'templates',
  image: '/demos/vista.png',
  imageAlt: 'Elite Advisor Hub templates — Vista, Meridian, and Casa Solis',
})

interface TemplateCard {
  name: string
  /** Badge label, matching the homepage demo-card vocabulary. */
  kind: 'Standard' | 'Custom'
  /** Which tiers can choose this template. */
  tiers: string
  description: string
  href: string
  thumbnail: string
}

// Demo links are composed through lib/tenant-paths.ts — never hand-built.
const TEMPLATES: TemplateCard[] = [
  {
    name: 'Vista',
    kind: 'Standard',
    tiers: 'Growth · Custom',
    description:
      'Cinematic widescreen with bold serif typography and antique gold accents — dramatic, editorial, unmistakably luxury.',
    href: templatePath('t2', 't2-demo'),
    thumbnail: '/demos/vista.png',
  },
  {
    name: 'Meridian',
    kind: 'Standard',
    tiers: 'Growth · Custom',
    description:
      'Modern editorial in clean sans-serif — warm ivory, bronze italics, and generous whitespace for a quietly confident feel.',
    href: templatePath('t3', 't3-demo'),
    thumbnail: '/demos/meridian.png',
  },
  {
    name: 'Casa Solis',
    kind: 'Custom',
    tiers: 'Custom flagship',
    description:
      'Quiet-luxury editorial for the Custom tier — warm ivory, burnt ochre, and an Italian-atelier feel built for boutique advisors.',
    href: templatePath('t4', 'casa-solis'),
    thumbnail: '/demos/casa_solis.jpg',
  },
]

export default function TemplatesPage() {
  return (
    <div style={{ fontFamily: SANS, color: '#111', background: '#fff' }}>
      <MarketingNav />

      {/* ── Header ─────────────────────────────────────────────────── */}
      <section style={{ padding: '140px 24px 64px', textAlign: 'center' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: PURPLE,
              marginBottom: '20px',
            }}
          >
            Templates
          </div>
          <h1
            style={{
              fontSize: 'clamp(38px, 5.5vw, 60px)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              margin: '0 0 20px',
            }}
          >
            Three designs.
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #a5b4fc, #c4b5fd)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              One standard: exceptional.
            </span>
          </h1>
          <p style={{ fontSize: '18px', lineHeight: 1.7, color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
            Every Elite Advisor Hub site is a Virtuoso-grade build. Choose the design
            that fits your brand — then see it live, running on a real demo site.
          </p>
        </div>
      </section>

      {/* ── Template cards ─────────────────────────────────────────── */}
      <section style={{ padding: '0 24px 100px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="tpl-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {TEMPLATES.map((t) => (
              <Link
                key={t.name}
                href={t.href}
                target="_blank"
                className="tpl-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '16px',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: '#111',
                  background: '#fff',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16 / 10',
                    overflow: 'hidden',
                    background: '#f3f4f6',
                    borderBottom: '1px solid #f3f4f6',
                  }}
                >
                  <Image
                    src={t.thumbnail}
                    alt={`${t.name} template preview`}
                    fill
                    sizes="(max-width: 900px) 100vw, 33vw"
                    style={{ objectFit: 'cover', objectPosition: 'top' }}
                    className="tpl-thumb"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      padding: '6px 12px',
                      background: t.kind === 'Custom' ? 'rgba(139, 92, 246, 0.92)' : 'rgba(17, 17, 17, 0.92)',
                      color: '#fff',
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      borderRadius: '999px',
                      backdropFilter: 'blur(6px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                    }}
                  >
                    {t.kind}
                  </div>
                </div>

                {/* Body */}
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '24px 28px 28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                    <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, letterSpacing: '-0.01em' }}>{t.name}</h2>
                    <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500 }}>{t.tiers}</span>
                  </div>
                  <p style={{ margin: '8px 0 24px', fontSize: '14px', color: '#6b7280', lineHeight: 1.6, flex: 1 }}>
                    {t.description}
                  </p>
                  <span style={{ fontSize: '14px', color: '#111', fontWeight: 600 }}>View live demo →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px 100px', backgroundColor: '#fafafa', borderTop: '1px solid #f3f4f6' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 12px' }}>
            Ready to launch yours?
          </h2>
          <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: 1.7, margin: '0 0 32px' }}>
            Join the Founding Advisor beta — a Virtuoso-grade site with the setup fee
            waived, three months free, and a locked founding rate.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/beta"
              style={{
                padding: '14px 32px',
                backgroundColor: '#111',
                color: '#fff',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Join the founding beta
            </Link>
            <Link
              href="/#pricing"
              style={{
                padding: '14px 32px',
                backgroundColor: '#fff',
                color: '#111',
                border: '1px solid #d1d5db',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />

      <style>{`
        .tpl-card:hover {
          transform: translateY(-4px);
          border-color: #d1d5db !important;
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
        }
        .tpl-card:hover .tpl-thumb {
          transform: scale(1.04);
        }
        .tpl-thumb {
          transition: transform 0.6s ease;
        }
        @media (max-width: 900px) {
          .tpl-grid { grid-template-columns: 1fr !important; max-width: 480px; margin: 0 auto; }
        }
      `}</style>
    </div>
  )
}
