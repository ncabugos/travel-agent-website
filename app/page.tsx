import Image from 'next/image'
import Link from 'next/link'
import { Globe, FileText, Building2, Paintbrush, Lock, TrendingUp } from 'lucide-react'
import { CheckoutButton } from '@/components/stripe/CheckoutButton'
import { MarketingPricing } from '@/components/marketing/MarketingPricing'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { MarketingSupplierPrograms } from '@/components/marketing/MarketingSupplierPrograms'
import { MarketingClosingCTA } from '@/components/marketing/MarketingClosingCTA'
import { MarketingCuratedEditorial } from '@/components/marketing/MarketingCuratedEditorial'
import { MarketingStudioPromo } from '@/components/marketing/MarketingStudioPromo'
import { MarketingInsightsTeaser } from '@/components/marketing/MarketingInsightsTeaser'
import { MarketingHowItWorks } from '@/components/marketing/MarketingHowItWorks'
import { MarketingNetworkBar } from '@/components/marketing/MarketingNetworkBar'
import { MarketingProof } from '@/components/marketing/MarketingProof'
import { MarketingFAQ } from '@/components/marketing/MarketingFAQ'
import { MarketingStickyCTA } from '@/components/marketing/MarketingStickyCTA'
import {
  CHARCOAL, CREAM, CTA_MICROCOPY, DIVIDER, GOLD, INK,
  PRIMARY_CTA_LABEL, PRIMARY_CTA_STYLE, WARM_GRAY_DARK,
} from '@/components/marketing/tokens'

export const metadata = {
  title: 'Elite Advisor Hub — Websites for Luxury Travel Advisors, Live in Days',
  description:
    'A custom-branded advisor website on your own domain, backed by 1,795+ maintained luxury hotel programs and a weekly editorial pipeline. $59 a month; your first 30 days are with our compliments.',
}

/*
 * Page order follows the conversion research's narrative arc —
 * Relevance → Mechanism → Confidence → Action:
 *
 *   Hero (value + CTA + proof strip)
 *   → Problem + Plan            (MarketingHowItWorks)
 *   → Proof                     (MarketingProof)
 *   → Benefits                  (Features)
 *   → Demos / Suppliers / Editorial
 *   → Offer                     (MarketingPricing)
 *   → FAQ                       (MarketingFAQ)
 *   → Studio cross-sell / Insights
 *   → Closing CTA
 *
 * One primary goal on the page: begin the 30 days. Every primary button posts
 * straight to Stripe Checkout (no detour through #pricing); secondary links
 * are text-weight and never purple.
 */

interface DemoCard {
  slug: string
  name: string
  kind: 'Template' | 'Custom build' | 'Agency'
  tagline: string
  href: string
  thumbnail: string
}

const DEMOS: DemoCard[] = [
  {
    slug: 'vista',
    name: 'Vista',
    kind: 'Template',
    tagline: 'Cinematic widescreen with bold serif typography and antique gold accents.',
    href: '/t2/t2-demo',
    thumbnail: '/demos/demo-homepage-thumbs-web-optimized/demo-luxuryTravel-homepage-thumbs-1.webp',
  },
  {
    slug: 'meridian',
    name: 'Meridian',
    kind: 'Template',
    tagline: 'Modern editorial in sans-serif — warm ivory, bronze italics, generous whitespace.',
    href: '/t3/t3-demo',
    thumbnail: '/demos/demo-homepage-thumbs-web-optimized/demo-meridian-homepage-thumbs-3.webp',
  },
  {
    slug: 'coast-and-compass',
    name: 'Coast & Compass Travel',
    kind: 'Template',
    tagline: 'Small-ship voyages and coastal escapes — Bodoni Moda serif, slideshow hero, editorial services index.',
    href: '/t2/coast-compass-demo',
    thumbnail: '/demos/demo-homepage-thumbs-web-optimized/demo-CoastCompass-homepage-thumbs-4.webp',
  },
  {
    slug: 'eden',
    name: 'Eden',
    kind: 'Custom build',
    tagline: 'An editorial custom build for a boutique advisor, designed from scratch.',
    href: '/frontend/demo-agent',
    thumbnail: '/demos/eden-thumb.jpg',
  },
  {
    slug: 'casa-solis',
    name: 'Casa Solis',
    kind: 'Custom build',
    tagline: 'Quiet-luxury editorial — warm ivory, burnt ochre, Italian-atelier feel.',
    href: '/t4/casa-solis',
    thumbnail: '/demos/demo-homepage-thumbs-web-optimized/demo-casaSolis-homepage-thumbs-2.webp',
  },
  {
    slug: 'ytc',
    name: 'Your Travel Center',
    kind: 'Agency',
    tagline: 'A real Spokane agency, rebranded on the Vista template with custom identity.',
    href: '/t2/ytc-demo',
    thumbnail: '/demos/ytc.png',
  },
  {
    slug: 'lido-collective',
    name: 'The Lido Collective',
    kind: 'Agency',
    tagline: 'An invitation-only collective — editorial white with navy accents, a scalable advisor directory, and a searchable cruise atelier.',
    href: '/t2/lido-collective',
    thumbnail: '/media/cruises/orient-express-sailing-yacht/Orient-Express-Sailing-Yachts-Corinthian-Exterior-Wind-Luxigon.jpg',
  },
]

const FEATURES = [
  {
    icon: <Globe size={22} strokeWidth={1.5} />,
    title: 'Custom-branded website',
    desc: 'Your name, palette, and typography on your own domain. Three editorial templates underneath — or a build designed from scratch.',
  },
  {
    icon: <Building2 size={22} strokeWidth={1.5} />,
    title: 'Maintained supplier catalog',
    desc: 'Hotel programs from Aman, Belmond, Rosewood, and Four Seasons, plus 30+ cruise partners. Perks stay current without you touching them.',
  },
  {
    icon: <FileText size={22} strokeWidth={1.5} />,
    title: 'Journal + curated editorial',
    desc: 'Publish your own pieces from the portal, or add the weekly curated stream in the categories that match your niche.',
  },
  {
    icon: <Lock size={22} strokeWidth={1.5} />,
    title: 'Lead inbox + advisor portal',
    desc: 'Inquiries land in one place. Edit requests, supplier selections, and journal posts are managed from the same dashboard.',
  },
  {
    icon: <Paintbrush size={22} strokeWidth={1.5} />,
    title: 'Hosting and updates handled',
    desc: 'No hosting bill, no developer retainer, no plugin updates. Performance, SEO, and platform changes are on our side.',
  },
  {
    icon: <TrendingUp size={22} strokeWidth={1.5} />,
    title: 'Grows with the practice',
    desc: 'Add modules or studio services from the portal as the book grows. Nothing is rebuilt; the site comes with you.',
  },
]

export default function EliteAdvisorHubHomePage() {
  return (
    <div className="eah-marketing" style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: INK,
      background: '#fff',
    }}>
      <a href="#main" className="eah-skip-link">Skip to main content</a>
      <MarketingNav />
      <main id="main">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="eah-section eah-hero"
        style={{
          minHeight: '92vh',
          display: 'flex',
          alignItems: 'center',
          padding: '140px 24px 96px',
          position: 'relative',
          overflow: 'hidden',
          background: CHARCOAL,
        }}
      >
        {/* Single still (no slideshow): faster LCP, and video/rotating heroes
            test negative against a static image in the research corpus. */}
        <Image
          src="/media/hotel-programs/aman/aman-hero-2000.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
        />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(90deg, rgba(10,9,8,0.82) 0%, rgba(10,9,8,0.62) 45%, rgba(10,9,8,0.28) 100%)',
        }} />
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: '160px', zIndex: 1,
          background: 'linear-gradient(180deg, rgba(10,9,8,0) 0%, rgba(10,9,8,0.55) 100%)',
        }} />

        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ maxWidth: '640px' }}>
            <div style={{
              fontSize: '12px', fontWeight: 700, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#D8C28A', marginBottom: '22px',
            }}>
              Websites for luxury travel advisors
            </div>

            <h1 style={{
              fontSize: 'clamp(38px, 5.4vw, 66px)',
              fontWeight: 800,
              lineHeight: 1.06,
              letterSpacing: '-0.03em',
              margin: '0 0 22px',
              color: '#fff',
            }}>
              Built for the $25,000 booking.{' '}
              <span style={{
                display: 'block',
                background: 'linear-gradient(135deg, #a5b4fc, #c4b5fd)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Live within days.
              </span>
            </h1>

            <p style={{
              fontSize: '18px', lineHeight: 1.6, color: 'rgba(255,255,255,0.86)',
              maxWidth: '54ch', margin: '0 0 32px',
            }}>
              A custom-branded site on your own domain, backed by 1,795+ maintained luxury hotel
              programs and kept current for you. $59 a month — your first 30 days are with our
              compliments.
            </p>

            <div className="eah-hero-actions" style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              <CheckoutButton
                tier="starter"
                popular
                className="eah-cta-primary"
                style={{ ...PRIMARY_CTA_STYLE, width: 'auto' }}
              >
                {PRIMARY_CTA_LABEL}
              </CheckoutButton>
              <a
                href="#pricing"
                className="eah-hero-secondary eah-focus-ring"
                style={{
                  color: 'rgba(255,255,255,0.86)', fontSize: '15px', fontWeight: 500,
                  textDecoration: 'underline', textUnderlineOffset: '4px',
                  textDecorationColor: 'rgba(255,255,255,0.4)',
                }}
              >
                See what&rsquo;s included
              </a>
            </div>
            <p style={{ margin: '14px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.68)' }}>
              {CTA_MICROCOPY}
            </p>

            {/* Proof strip — specific, verifiable, inside the first viewport. */}
            <ul className="eah-hero-proof" role="list" style={{
              listStyle: 'none', margin: '44px 0 0', padding: '20px 0 0',
              borderTop: '1px solid rgba(255,255,255,0.18)',
              display: 'flex', flexWrap: 'wrap', gap: '10px 28px',
              fontSize: '13px', color: 'rgba(255,255,255,0.78)',
            }}>
              <li><strong style={{ color: '#fff', fontWeight: 700 }}>1,795+</strong> luxury hotel programs</li>
              <li><strong style={{ color: '#fff', fontWeight: 700 }}>30+</strong> cruise lines</li>
              <li>Trusted by <strong translate="no" style={{ color: '#fff', fontWeight: 600 }}>edenforyourworld.com</strong></li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Network logo bar ─────────────────────────────────────────────── */}
      <MarketingNetworkBar />

      {/* ── Problem → Plan ───────────────────────────────────────────────── */}
      <MarketingHowItWorks />

      {/* ── Proof ────────────────────────────────────────────────────────── */}
      <MarketingProof />

      {/* ── Benefits ─────────────────────────────────────────────────────── */}
      <section id="features" className="eah-section" style={{ padding: '100px 24px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{
            fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: GOLD, marginBottom: '18px',
          }}>
            What&rsquo;s included
          </div>
          <h2 style={{
            fontSize: 'clamp(30px, 3.4vw, 42px)', fontWeight: 700,
            letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 14px', maxWidth: '20ch',
          }}>
            All of the essentials. Maintenance done for you.
          </h2>
          <p style={{ fontSize: '17px', color: WARM_GRAY_DARK, margin: '0 0 56px', maxWidth: '58ch', lineHeight: 1.6 }}>
            Everything on the $59 plan, on every site. Modules and studio services are added from
            the portal only when the practice calls for them.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="eah-features-grid">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="eah-feature-card"
                style={{
                  padding: '28px', borderRadius: '14px',
                  border: `1px solid ${DIVIDER}`,
                  background: '#fff',
                  transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
                  animationDelay: `${i * 80}ms`,
                }}
              >
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: CREAM, border: `1px solid ${DIVIDER}`, color: GOLD,
                  marginBottom: '18px',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 600, letterSpacing: '-0.01em', color: CHARCOAL }}>{f.title}</h3>
                <p style={{ margin: 0, fontSize: '16px', color: WARM_GRAY_DARK, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Demos ────────────────────────────────────────────────────────── */}
      <section id="demos" className="eah-section" style={{ padding: '100px 24px', backgroundColor: CREAM }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: GOLD, marginBottom: '18px',
          }}>
            See the work
          </div>
          <h2 style={{
            fontSize: 'clamp(30px, 3.4vw, 42px)', fontWeight: 700,
            letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 14px', maxWidth: '22ch',
          }}>
            Every site starts from one of these — and ends up yours.
          </h2>
          <p style={{ fontSize: '17px', color: WARM_GRAY_DARK, margin: '0 0 56px', maxWidth: '58ch', lineHeight: 1.6 }}>
            Open any demo to see the depth of a finished build. We choose the starting point with
            you and finish it to your brand.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '28px' }} className="eah-demos-grid">
            {DEMOS.map((demo) => (
              <Link
                key={demo.slug}
                href={demo.href}
                target="_blank"
                rel="noopener"
                aria-label={`${demo.name} — view demo (opens in a new tab)`}
                className="eah-demo-card eah-focus-ring-dark"
                style={{
                  display: 'block',
                  borderRadius: '14px',
                  border: `1px solid ${DIVIDER}`,
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: INK,
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  background: '#fff',
                }}
              >
                {/* 2:1 crop of a 16:10 full-page screenshot keeps just the hero. */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '2 / 1', overflow: 'hidden', background: CREAM }}>
                  <Image
                    src={demo.thumbnail}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 100vw, 50vw"
                    className="eah-demo-thumb"
                    style={{ objectFit: 'cover', objectPosition: 'top', transition: 'transform 0.6s ease' }}
                  />
                  <div style={{
                    position: 'absolute', top: '16px', left: '16px',
                    padding: '6px 12px',
                    background: 'rgba(26,23,21,0.88)', color: '#fff',
                    fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    borderRadius: '999px', backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255,255,255,0.25)',
                  }}>
                    {demo.kind}
                  </div>
                </div>
                <div style={{ padding: '22px 26px 26px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, letterSpacing: '-0.01em', color: CHARCOAL }}>
                      {demo.name}
                    </h3>
                    <span style={{ fontSize: '13px', color: GOLD, fontWeight: 600, whiteSpace: 'nowrap' }}>
                      View demo →
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '15px', color: WARM_GRAY_DARK, lineHeight: 1.55 }}>
                    {demo.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <MarketingSupplierPrograms />
      <MarketingCuratedEditorial />

      {/* ── Offer ────────────────────────────────────────────────────────── */}
      <MarketingPricing />

      {/* ── Objections ───────────────────────────────────────────────────── */}
      <MarketingFAQ />

      {/* Studio cross-sell + Insights sit after the offer and the objections so
          they never interrupt the path to the primary action. */}
      <MarketingStudioPromo />
      <MarketingInsightsTeaser />

      {/* ── Closing CTA ──────────────────────────────────────────────────── */}
      <MarketingClosingCTA />
      </main>

      <MarketingFooter />

      {/* Mobile-only sticky CTA; hidden on desktop and over the pricing block. */}
      <MarketingStickyCTA />

      <style>{`
        html { scroll-padding-top: 80px; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .eah-cta-primary:hover { box-shadow: 0 6px 32px rgba(124,58,237,0.5) !important; }
        .eah-hero-secondary:hover { color: #fff !important; text-decoration-color: #fff !important; }

        .eah-feature-card { animation: fadeUp 0.5s ease both; }
        .eah-feature-card:hover {
          transform: translateY(-3px);
          border-color: ${GOLD} !important;
          box-shadow: 0 8px 32px rgba(26,23,21,0.08);
        }
        .eah-demo-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(26,23,21,0.10);
        }
        .eah-demo-card:hover .eah-demo-thumb { transform: scale(1.04); }

        @media (max-width: 900px) {
          .eah-features-grid, .eah-demos-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .eah-section { padding-top: 60px !important; padding-bottom: 60px !important; }
          .eah-section p { line-height: 1.55 !important; }
          .eah-hero { padding-top: 112px !important; padding-bottom: 56px !important; min-height: 0 !important; }
          .eah-hero-actions { flex-direction: column; align-items: stretch !important; gap: 14px !important; }
          .eah-hero-actions button { width: 100% !important; }
          .eah-hero-actions a { text-align: center; }
          .eah-hero-proof { gap: 8px 18px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .eah-feature-card { animation: none !important; }
          .eah-feature-card, .eah-demo-card, .eah-demo-thumb { transition: none !important; }
          .eah-feature-card:hover, .eah-demo-card:hover { transform: none !important; }
          .eah-demo-card:hover .eah-demo-thumb { transform: none !important; }
        }
      `}</style>
    </div>
  )
}
