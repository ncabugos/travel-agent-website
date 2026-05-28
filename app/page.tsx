import Link from 'next/link'
import { Globe, FileText, Building2, Paintbrush, Lock, TrendingUp } from 'lucide-react'
import { MarketingPricing } from '@/components/marketing/MarketingPricing'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { HeroSlideshow } from '@/components/marketing/HeroSlideshow'
import { MarketingBrandedWebsite } from '@/components/marketing/MarketingBrandedWebsite'
import { MarketingSupplierPrograms } from '@/components/marketing/MarketingSupplierPrograms'
import { MarketingReachSection } from '@/components/marketing/MarketingReachSection'
import { MarketingCuratedEditorial } from '@/components/marketing/MarketingCuratedEditorial'
import { MarketingAdvisorPortal } from '@/components/marketing/MarketingAdvisorPortal'

export const metadata = {
  title: 'Elite Advisor Hub — For the Top 1% of Travel Advisors',
  description:
    'Infrastructure for advisors working at elite advisor standards — maintained hotel programs, a weekly editorial pipeline, and templates built for a $25,000 booking, not a $250 one.',
}

interface DemoCard {
  slug: string
  name: string
  kind: 'Starter' | 'Growth' | 'Custom' | 'Agency'
  tagline: string
  href: string
  thumbnail: string
}

// Demos are grouped by tier (Starter → Growth → Custom → Agency) so they
// read in the same order as the pricing tiers above.
const DEMOS: DemoCard[] = [
  // ── Starter ─────────────────────────────────────────────────────────────────
  {
    slug: 'vista',
    name: 'Vista',
    kind: 'Starter',
    tagline: 'Cinematic widescreen with bold serif typography and antique gold accents.',
    href: '/t2/t2-demo',
    thumbnail: '/demos/vista.png',
  },
  {
    slug: 'meridian',
    name: 'Meridian',
    kind: 'Starter',
    tagline: 'Modern editorial in sans-serif — warm ivory, bronze italics, generous whitespace.',
    href: '/t3/t3-demo',
    thumbnail: '/demos/meridian.png',
  },
  // ── Growth ──────────────────────────────────────────────────────────────────
  {
    slug: 'coast-and-compass',
    name: 'Coast & Compass Travel',
    kind: 'Growth',
    tagline: 'Small-ship voyages and coastal escapes — Bodoni Moda serif, slideshow hero, editorial services index.',
    href: '/t2/coast-compass-demo',
    thumbnail: '/media/hero images/four-seasons-yacht-hero.jpg',
  },
  // ── Custom ──────────────────────────────────────────────────────────────────
  {
    slug: 'eden',
    name: 'Eden',
    kind: 'Custom',
    tagline: 'An editorial custom build for a boutique advisor, designed from scratch.',
    href: '/frontend/demo-agent',
    thumbnail: '/demos/eden-thumb.jpg',
  },
  {
    slug: 'casa-solis',
    name: 'Casa Solis',
    kind: 'Custom',
    tagline: 'Quiet-luxury editorial for the Custom tier — warm ivory, burnt ochre, Italian-atelier feel.',
    href: '/t4/casa-solis',
    thumbnail: '/demos/casa_solis.jpg',
  },
  // ── Agency ──────────────────────────────────────────────────────────────────
  {
    slug: 'ytc',
    name: 'Your Travel Center',
    kind: 'Agency',
    tagline: 'A real Spokane agency, rebranded on the Vista template with custom identity.',
    href: '/t2/ytc-demo',
    thumbnail: '/demos/ytc.png',
  },
]

export default function EliteAdvisorHubHomePage() {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#111',
      background: '#fff',
    }}>
      {/* Navigation */}
      <MarketingNav />

      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background slideshow */}
        <HeroSlideshow />
        {/* Dark gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.6) 100%)',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '20px',
            fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.85)',
            marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '0.05em',
            backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)',
          }}>
            ✦ Built for the top 1% of travel advisors
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 5.5vw, 66px)',
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: '-0.03em',
            margin: '0 0 24px',
            maxWidth: '900px',
            color: '#fff',
          }}>
            Websites for{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a5b4fc, #c4b5fd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Elite Travel Advisors
            </span>
          </h1>

          <p style={{
            fontSize: '18px', lineHeight: 1.7, color: 'rgba(255,255,255,0.82)',
            maxWidth: '620px', margin: '0 auto 40px',
          }}>
            A website platform for independent travel advisors and boutique agencies. A curated network of luxury hotels, cruise lines, and more — kept current for you so you can spend the day selling travel.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="#pricing"
              className="eah-cta-primary"
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                color: '#fff',
                borderRadius: '10px', fontSize: '15px', fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 4px 24px rgba(124, 58, 237, 0.35)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              Explore Tiers
            </a>
            <a
              href="#demos"
              style={{
                padding: '14px 32px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff',
                borderRadius: '10px', fontSize: '15px', fontWeight: 500,
                textDecoration: 'none', border: '1px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(8px)',
                transition: 'background 0.2s',
              }}
            >
              View Demos
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{
        padding: '100px 24px', backgroundColor: '#fff',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '36px', fontWeight: 700, textAlign: 'center',
            letterSpacing: '-0.02em', margin: '0 0 12px',
          }}>
            The platform behind the practice
          </h2>
          <p style={{
            textAlign: 'center', fontSize: '16px', color: '#6b7280',
            margin: '0 0 60px', maxWidth: '520px', marginInline: 'auto',
          }}>
            Built by a working advisor. Maintained for practices that treat every booking as a credential.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }} className="eah-features-grid">
            {[
              {
                icon: <Globe size={22} strokeWidth={1.5} />,
                title: 'Branded Website',
                desc: "Three editorial templates — Vista, Meridian, and Casa Solis — plus fully custom builds for advisors whose brand exists in their clients' minds before the site does.",
              },
              {
                icon: <FileText size={22} strokeWidth={1.5} />,
                title: 'Curated Editorial',
                desc: 'Articles drafted by the editorial team and published to your journal weekly. Choose the categories — destinations, hotels, wellness, or wine — that reflect your niche.',
              },
              {
                icon: <Building2 size={22} strokeWidth={1.5} />,
                title: 'Supplier Programs',
                desc: 'Hotel programs from Aman, Belmond, Rosewood, and Four Seasons — plus 30+ cruise partners. Each advisor selects the suppliers that match their actual book.',
              },
              {
                icon: <Paintbrush size={22} strokeWidth={1.5} />,
                title: 'Managed Infrastructure',
                desc: 'No hosting fees, no developer retainers, no maintenance windows. SEO, performance, and platform updates are handled — so you stay in front of clients.',
              },
              {
                icon: <Lock size={22} strokeWidth={1.5} />,
                title: 'Advisor Portal',
                desc: 'Submit edit requests, manage your journal, update preferred suppliers, and track site modifications from one dashboard. Changes are turned around within 24 hours.',
              },
              {
                icon: <TrendingUp size={22} strokeWidth={1.5} />,
                title: 'Built to Scale',
                desc: 'Tiers stack — no rebuilds, no migrations. Add modules, upgrade your template, or expand to an agency plan as your practice grows. The site comes with you.',
              },
            ].map((f, i) => (
              <div
                key={f.title}
                className="eah-feature-card"
                style={{
                  padding: '28px', borderRadius: '16px',
                  border: '1px solid #f0eeff',
                  background: '#fff',
                  transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
                  animationDelay: `${i * 80}ms`,
                }}
              >
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(196,181,253,0.12))',
                  border: '1px solid rgba(139,92,246,0.15)',
                  color: '#8b5cf6',
                  marginBottom: '18px',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em' }}>{f.title}</h3>
                <p style={{ margin: 0, fontSize: '13.5px', color: '#6b7280', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep-dive feature sections */}
      <MarketingBrandedWebsite />
      <MarketingSupplierPrograms />
      <MarketingReachSection />
      <MarketingCuratedEditorial />
      <MarketingAdvisorPortal />

      {/* Pricing */}
      <MarketingPricing />

      {/* Demos */}
      <section id="demos" style={{
        padding: '100px 24px', backgroundColor: '#fff',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '36px', fontWeight: 700, textAlign: 'center',
            letterSpacing: '-0.02em', margin: '0 0 12px',
          }}>
            See it in action
          </h2>
          <p style={{
            textAlign: 'center', fontSize: '16px', color: '#6b7280',
            margin: '0 0 60px', maxWidth: '580px', marginInline: 'auto',
          }}>
            Seven live sites on Elite Advisor Hub, organized by tier — two Starter templates,
            one Growth build, three Custom builds, and one Agency example. Each is live and
            available to explore.
          </p>

          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}
            className="eah-demos-grid"
          >
            {DEMOS.map((demo) => (
              <Link
                key={demo.slug}
                href={demo.href}
                target="_blank"
                style={{
                  display: 'block',
                  borderRadius: '16px',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: '#111',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                  background: '#fff',
                }}
                className="eah-demo-card"
              >
                {/* Thumbnail — 2:1 cinematic crop. Source PNGs are 16:10 full-
                    page screenshots; the 2:1 container forces object-fit:cover
                    to scale them up and crop the bottom 20% (the lighter
                    footer / testimonial area), keeping only each demo's hero. */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '2 / 1',
                    overflow: 'hidden',
                    background: '#f3f4f6',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={demo.thumbnail}
                    alt={`${demo.name} demo preview`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'top',
                      transition: 'transform 0.6s ease',
                    }}
                    className="eah-demo-thumb"
                  />
                  {/* Kind badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      padding: '6px 12px',
                      background: kindBadgeBg(demo.kind),
                      color: kindBadgeColor(demo.kind),
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      borderRadius: '999px',
                      backdropFilter: 'blur(6px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                    }}
                  >
                    {demo.kind}
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '24px 28px 28px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, letterSpacing: '-0.01em' }}>
                      {demo.name}
                    </h3>
                    <span className="eah-demo-cta" style={{ fontSize: '13px', color: '#8b5cf6', fontWeight: 600, transition: 'gap 0.2s' }}>
                      View Demo →
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: 1.55 }}>
                    {demo.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Global platform footer */}
      <MarketingFooter />

      <style>{`
        /* ── Keyframes ─────────────────────────────────────────── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ctaPulse {
          0%, 100% { box-shadow: 0 4px 24px rgba(124,58,237,0.35); }
          50%       { box-shadow: 0 4px 36px rgba(124,58,237,0.55); }
        }

        /* ── Hero CTA ───────────────────────────────────────────── */
        .eah-cta-primary {
          animation: ctaPulse 3s ease-in-out infinite;
        }
        .eah-cta-primary:hover {
          transform: translateY(-1px);
          animation: none;
          box-shadow: 0 6px 32px rgba(124,58,237,0.5) !important;
        }

        /* ── Feature cards ──────────────────────────────────────── */
        .eah-feature-card {
          animation: fadeUp 0.5s ease both;
        }
        .eah-feature-card:hover {
          transform: translateY(-3px);
          border-color: rgba(139,92,246,0.25) !important;
          box-shadow: 0 8px 32px rgba(139,92,246,0.08);
        }

        /* ── Pricing cards ──────────────────────────────────────── */
        .eah-pricing-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(139,92,246,0.1);
        }
        .eah-pricing-popular:hover {
          box-shadow: 0 12px 48px rgba(124,58,237,0.2) !important;
        }

        /* ── Demo cards ─────────────────────────────────────────── */
        .eah-demo-card:hover {
          transform: translateY(-4px);
          border-color: rgba(139,92,246,0.3) !important;
          box-shadow: 0 12px 40px rgba(139,92,246,0.1);
        }
        .eah-demo-card:hover .eah-demo-thumb {
          transform: scale(1.04);
        }

        /* ── Responsive ─────────────────────────────────────────── */
        @media (max-width: 1200px) {
          .eah-pricing-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 900px) {
          .eah-features-grid,
          .eah-demos-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .eah-pricing-grid { grid-template-columns: 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .eah-feature-card,
          .eah-cta-primary { animation: none !important; }
        }
      `}</style>
    </div>
  )
}

function kindBadgeBg(kind: DemoCard['kind']): string {
  switch (kind) {
    case 'Starter':  return 'rgba(17, 17, 17, 0.92)'     // near-black
    case 'Growth':   return 'rgba(184, 146, 106, 0.95)'  // antique gold
    case 'Custom':   return 'rgba(139, 92, 246, 0.92)'   // purple
    case 'Agency':   return 'rgba(22, 163, 74, 0.92)'    // green
  }
}

function kindBadgeColor(_kind: DemoCard['kind']): string {
  return '#ffffff'
}
