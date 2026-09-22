import Image from 'next/image'
import Link from 'next/link'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { MarketingNetworkBar } from '@/components/marketing/MarketingNetworkBar'
import { PlatformSpecList } from '@/components/marketing/PlatformSpecList'
import { MarketingSupplierPrograms } from '@/components/marketing/MarketingSupplierPrograms'
import { MarketingCuratedEditorial } from '@/components/marketing/MarketingCuratedEditorial'
import { MarketingHowItWorks } from '@/components/marketing/MarketingHowItWorks'
import { MarketingPricing } from '@/components/marketing/MarketingPricing'
import { MarketingStudioPromo } from '@/components/marketing/MarketingStudioPromo'
import { MarketingFAQ } from '@/components/marketing/MarketingFAQ'
import { MarketingInsightsTeaser } from '@/components/marketing/MarketingInsightsTeaser'
import { MarketingClosingCTA } from '@/components/marketing/MarketingClosingCTA'
import { MarketingStickyCTA } from '@/components/marketing/MarketingStickyCTA'
import { Reveal } from '@/components/marketing/Reveal'
import {
  BODY_FONT, BODY_STYLE, CHARCOAL, DISPLAY_FONT, DIVIDER, H2_STYLE, LABEL_STYLE, NEAR_BLACK,
  PRIMARY_CTA_LABEL, PRIMARY_CTA_STYLE, SECONDARY_CTA_STYLE, WARM_GRAY,
} from '@/components/marketing/tokens'

export const metadata = {
  title: 'Elite Advisor Hub — Websites for Luxury Travel Advisors',
  description:
    'A custom-branded advisor website on your own domain, with 24 preferred-partner hotel programs, 1,805 luxury hotels, 28 cruise lines, and a journal that publishes every week. Live within days.',
}

/*
 * Page order: relevance, mechanism, proof, action. One primary button per
 * screen, always "Request a consultation". Secondary links are text-weight.
 *
 *   Hero → Networks → Platform (spec list) → Catalog → Work → Editorial
 *   → How it works → Studio band → Questions → Insights → Closing
 */

interface Demo {
  slug: string
  name: string
  kind: 'In production' | 'Live' | 'Template' | 'Custom build' | 'Agency'
  line: string
  href: string
  thumbnail: string
  external?: boolean
}

const DEMOS: Demo[] = [
  {
    slug: 'eden',
    name: 'Eden For Your World',
    kind: 'In production',
    line: 'A Virtuoso advisor site on the platform since April 2026.',
    href: 'https://www.edenforyourworld.com',
    thumbnail: '/demos/eden.png',
    external: true,
  },
  {
    slug: 'wine-and-wellness-travel',
    name: 'Wine & Wellness Travel',
    kind: 'Live',
    line: 'Wine country, wellness retreats, villas, and river cruises with VIP hotel benefits.',
    href: 'https://wineandwellnesstravel.com',
    thumbnail: '/demos/wine_and_wellness-v2.jpg',
    external: true,
  },
  {
    slug: 'vista',
    name: 'Vista',
    kind: 'Template',
    line: 'Cinematic widescreen, serif typography, antique gold accents.',
    href: '/t2/t2-demo',
    thumbnail: '/demos/demo-homepage-thumbs-web-optimized/demo-luxuryTravel-homepage-thumbs-1.webp',
  },
  {
    slug: 'meridian',
    name: 'Meridian',
    kind: 'Template',
    line: 'Editorial sans-serif, warm ivory, bronze italics, generous whitespace.',
    href: '/t3/t3-demo',
    thumbnail: '/demos/demo-homepage-thumbs-web-optimized/demo-meridian-homepage-thumbs-3.webp',
  },
  {
    slug: 'casa-solis',
    name: 'Casa Solis',
    kind: 'Custom build',
    line: 'Warm ivory and burnt ochre for a boutique Italian specialist.',
    href: '/t4/casa-solis',
    thumbnail: '/demos/demo-homepage-thumbs-web-optimized/demo-casaSolis-homepage-thumbs-2.webp',
  },
  {
    slug: 'coast-and-compass',
    name: 'Coast & Compass Travel',
    kind: 'Template',
    line: 'Small-ship voyages and coastal escapes with a slideshow hero.',
    href: '/t2/coast-compass-demo',
    thumbnail: '/demos/demo-homepage-thumbs-web-optimized/demo-CoastCompass-homepage-thumbs-4.webp',
  },
  {
    slug: 'ytc',
    name: 'Your Travel Center',
    kind: 'Agency',
    line: 'A Spokane agency on the Vista template with its own identity.',
    href: '/t2/ytc-demo',
    thumbnail: '/demos/ytc.png',
  },
  {
    slug: 'lido-collective',
    name: 'The Lido Collective',
    kind: 'Agency',
    line: 'An invitation-only collective with an advisor directory and a searchable cruise catalog.',
    href: '/t2/lido-collective',
    thumbnail: '/media/cruises/orient-express-sailing-yacht/Orient-Express-Sailing-Yachts-Corinthian-Exterior-Wind-Luxigon.jpg',
  },
]

const HERO_PROOF = [
  { value: '1,805', label: 'luxury hotels' },
  { value: '103', label: 'countries' },
  { value: '28', label: 'cruise lines' },
  { value: 'Days', label: 'to a live site' },
]

export default function EliteAdvisorHubHomePage() {
  return (
    <div className="eah-marketing" style={{ fontFamily: BODY_FONT, color: CHARCOAL, background: '#fff' }}>
      <a href="#main" className="eah-skip-link">Skip to main content</a>
      <MarketingNav overlay />
      <main id="main">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section
          id="hero"
          className="eah-hero"
          style={{
            position: 'relative', minHeight: '100dvh', display: 'flex', alignItems: 'flex-end',
            background: NEAR_BLACK, color: '#fff', overflow: 'hidden', padding: '160px 0 56px',
          }}
        >
          <Image
            src="/media/hotel-programs/aman/aman-hero-2000.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
          />
          <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'rgba(11,10,9,0.5)', zIndex: 1 }} />

          <div className="eah-container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
            <p style={{ ...LABEL_STYLE, color: 'rgba(255,255,255,0.7)', marginBottom: '28px' }}>
              Websites for luxury travel advisors
            </p>
            <h1 style={{
              fontFamily: DISPLAY_FONT, fontSize: 'clamp(44px, 6.4vw, 92px)', fontWeight: 300,
              letterSpacing: '-0.035em', lineHeight: 1.0, margin: '0 0 28px', maxWidth: '14ch',
            }}>
              Websites for the world&rsquo;s top travel advisors.
            </h1>
            <p style={{ fontSize: '19px', lineHeight: 1.55, color: 'rgba(255,255,255,0.86)', maxWidth: '52ch', margin: '0 0 36px' }}>
              A custom-branded site on your own domain, with 24 preferred-partner hotel programs, 28 cruise lines, and a journal that publishes every week. Built for you. Live within days.
            </p>
            <div className="eah-hero-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/schedule-consultation" className="eah-cta-primary" style={PRIMARY_CTA_STYLE}>
                {PRIMARY_CTA_LABEL}
              </Link>
              <a href="#platform" className="eah-cta-secondary" style={{ ...SECONDARY_CTA_STYLE, color: '#fff' }}>
                See the platform
              </a>
            </div>

            <ul className="eah-hero-proof" role="list" style={{
              listStyle: 'none', margin: '72px 0 0', padding: '24px 0 0',
              borderTop: '1px solid rgba(255,255,255,0.2)',
              display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '24px',
            }}>
              {HERO_PROOF.map((p) => (
                <li key={p.label}>
                  <div style={{ fontFamily: DISPLAY_FONT, fontSize: '30px', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{p.value}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.68)', marginTop: '8px' }}>{p.label}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <MarketingNetworkBar />
        <PlatformSpecList />
        <MarketingSupplierPrograms />

        {/* ── Work ─────────────────────────────────────────────────────── */}
        <section id="work" className="eah-section" style={{ background: '#fff', padding: '120px 0' }}>
          <div className="eah-container">
            <Reveal>
              <p style={{ ...LABEL_STYLE, marginBottom: '20px' }}>The work</p>
              <h2 style={{ ...H2_STYLE, marginBottom: '20px', maxWidth: '16ch' }}>Sites built on the platform.</h2>
              <p style={{ ...BODY_STYLE, maxWidth: '56ch', marginBottom: '64px' }}>
                Every site starts from one of three editorial templates or a build designed from scratch, and ends up under your brand.
              </p>
            </Reveal>
            <div className="eah-work-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '56px 40px' }}>
              {DEMOS.map((demo, i) => (
                <Reveal key={demo.slug} delay={(i % 2) * 80}>
                  <Link
                    href={demo.href}
                    target="_blank"
                    rel="noopener"
                    aria-label={`${demo.name}, opens in a new tab`}
                    className="eah-work-item"
                    style={{ display: 'block', textDecoration: 'none', color: CHARCOAL }}
                  >
                    <div style={{ position: 'relative', aspectRatio: '16 / 10', overflow: 'hidden', background: DIVIDER }}>
                      <Image
                        src={demo.thumbnail}
                        alt=""
                        fill
                        sizes="(max-width: 900px) 100vw, 50vw"
                        className="eah-work-thumb"
                        style={{ objectFit: 'cover', objectPosition: 'top', transition: 'opacity 0.3s ease' }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px', marginTop: '18px' }}>
                      <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 400, letterSpacing: '-0.015em' }}>{demo.name}</h3>
                      <span style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: demo.kind === 'In production' || demo.kind === 'Live' ? CHARCOAL : WARM_GRAY, whiteSpace: 'nowrap' }}>
                        {demo.kind}
                      </span>
                    </div>
                    <p style={{ ...BODY_STYLE, fontSize: '15px', marginTop: '6px', maxWidth: '48ch' }}>{demo.line}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <MarketingCuratedEditorial />
        <MarketingHowItWorks />
        <MarketingPricing />
        <MarketingStudioPromo />
        <MarketingFAQ />
        <MarketingInsightsTeaser />
        <MarketingClosingCTA />
      </main>

      <MarketingFooter />
      <MarketingStickyCTA />

      <style>{`
        html { scroll-padding-top: 88px; }
        .eah-work-item:hover .eah-work-thumb { opacity: 0.9; }
        @media (max-width: 900px) {
          .eah-work-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
        @media (max-width: 640px) {
          .eah-section { padding-top: 80px !important; padding-bottom: 80px !important; }
          .eah-hero { padding-top: 120px !important; padding-bottom: 40px !important; }
          .eah-hero-actions { flex-direction: column; align-items: stretch !important; }
          .eah-hero-actions a { width: 100%; }
          .eah-hero-proof { grid-template-columns: repeat(2, 1fr) !important; margin-top: 48px !important; }
        }
      `}</style>
    </div>
  )
}
