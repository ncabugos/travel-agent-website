import Link from 'next/link'
import { Globe, FileText, Building2, Paintbrush, Lock, TrendingUp } from 'lucide-react'
import { CheckoutButton } from '@/components/stripe/CheckoutButton'

export const metadata = {
  title: 'EliteAdvisorHub — Websites for Elite Travel Advisors',
  description:
    'A premium website platform for luxury travel advisors. Stunning templates, curated blog content, supplier integrations, and zero tech burden.',
}

interface DemoCard {
  slug: string
  name: string
  kind: 'Custom' | 'Standard' | 'Agency'
  tagline: string
  href: string
  thumbnail: string
}

const DEMOS: DemoCard[] = [
  {
    slug: 'eden',
    name: 'Eden',
    kind: 'Custom',
    tagline: 'An editorial custom build for a boutique advisor, designed from scratch.',
    href: '/frontend/demo-agent',
    thumbnail: '/demos/eden.png',
  },
  {
    slug: 'vista',
    name: 'Vista',
    kind: 'Standard',
    tagline: 'Cinematic widescreen with bold serif typography and antique gold accents.',
    href: '/t2/t2-demo',
    thumbnail: '/demos/vista.png',
  },
  {
    slug: 'meridian',
    name: 'Meridian',
    kind: 'Standard',
    tagline: 'Modern editorial in sans-serif — warm ivory, bronze italics, generous whitespace.',
    href: '/t3/t3-demo',
    thumbnail: '/demos/meridian.png',
  },
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
    }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        backgroundColor: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        padding: '0 40px',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          height: '64px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #111 0%, #374151 100%)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ color: '#fff', fontSize: '16px', fontWeight: 700, letterSpacing: '-0.02em' }}>E</span>
            </div>
            <span style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.02em' }}>EliteAdvisorHub</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <a href="#features" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>Features</a>
            <a href="#pricing" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>Pricing</a>
            <a href="#demos" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>Demos</a>
            <Link
              href="/agent-portal/login"
              style={{
                padding: '8px 20px', backgroundColor: '#111', color: '#fff',
                borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Agent Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=2560&q=80"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        />
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
            ✦ The Website Platform for Elite Travel Advisors
          </div>

          <h1 style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            margin: '0 0 24px',
            maxWidth: '860px',
            color: '#fff',
          }}>
            Your clients dream.
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #a5b4fc, #c4b5fd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Your website delivers.
            </span>
          </h1>

          <p style={{
            fontSize: '18px', lineHeight: 1.7, color: 'rgba(255,255,255,0.82)',
            maxWidth: '600px', margin: '0 auto 40px',
          }}>
            EliteAdvisorHub is the turn-key website platform built for luxury travel advisors —
            stunning templates, curated editorial content, supplier integrations, and zero tech burden.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="#pricing"
              style={{
                padding: '14px 32px', backgroundColor: '#fff', color: '#111',
                borderRadius: '10px', fontSize: '15px', fontWeight: 600,
                textDecoration: 'none', transition: 'transform 0.15s',
              }}
            >
              Get Started
            </a>
            <a
              href="#demos"
              style={{
                padding: '14px 32px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff',
                borderRadius: '10px', fontSize: '15px', fontWeight: 500,
                textDecoration: 'none', border: '1px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(8px)',
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
            Everything you need, nothing you don&apos;t
          </h2>
          <p style={{
            textAlign: 'center', fontSize: '16px', color: '#6b7280',
            margin: '0 0 60px', maxWidth: '520px', marginInline: 'auto',
          }}>
            Focus on selling travel. We handle the technology.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }} className="eah-features-grid">
            {[
              { icon: <Globe size={28} strokeWidth={1.5} />, title: 'Branded Website', desc: 'A premium, branded website that mirrors the luxury experience you sell. Choose from editorial templates or commission a fully custom design.' },
              { icon: <FileText size={28} strokeWidth={1.5} />, title: 'Curated Editorial', desc: 'Our in-house editorial team publishes destination guides and travel tips weekly. Choose the categories that appear on your site.' },
              { icon: <Building2 size={28} strokeWidth={1.5} />, title: 'Supplier Integrations', desc: 'Showcase your preferred hotels, cruises, villas, and tour partners with rich media from our centralized supplier directory.' },
              { icon: <Paintbrush size={28} strokeWidth={1.5} />, title: 'Zero Tech Burden', desc: 'No coding, no hosting, no maintenance. We handle updates, SEO, and performance so you can focus on clients.' },
              { icon: <Lock size={28} strokeWidth={1.5} />, title: 'Advisor Portal', desc: 'Manage your content, submit edit requests, publish journal posts, and update your profile from a clean, intuitive dashboard.' },
              { icon: <TrendingUp size={28} strokeWidth={1.5} />, title: 'Built to Scale', desc: 'From a single page to a full marketing hub. Upgrade tiers as your business grows — no migration, no re-design.' },
            ].map((f) => (
              <div key={f.title} style={{
                padding: '32px', borderRadius: '16px', border: '1px solid #f3f4f6',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}>
                <div style={{ marginBottom: '16px', color: '#374151' }}>{f.icon}</div>
                <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 600 }}>{f.title}</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{
        padding: '100px 24px', backgroundColor: '#fafafa',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '36px', fontWeight: 700, textAlign: 'center',
            letterSpacing: '-0.02em', margin: '0 0 12px',
          }}>
            Simple, transparent pricing
          </h2>
          <p style={{
            textAlign: 'center', fontSize: '16px', color: '#6b7280',
            margin: '0 0 60px',
          }}>
            Choose the plan that fits your business.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="eah-pricing-grid">
            {[
              {
                name: 'Starter', tier: 'starter' as const, price: '$79', setup: '$299', popular: false,
                features: ['Branded Vista template', 'Curated blog content', 'Supplier showcase', 'Advisor portal access', 'Email support'],
              },
              {
                name: 'Growth', tier: 'growth' as const, price: '$149', setup: '$499', popular: true,
                features: ['Everything in Starter', 'Vista or Meridian template', 'Custom domain', 'Priority support', 'Advanced analytics', 'Journal authoring tools'],
              },
              {
                name: 'Custom', tier: 'custom' as const, price: '$299', setup: '$1,500', popular: false,
                features: ['Everything in Growth', 'Custom-designed template', 'Dedicated account manager', 'API integrations', 'White-label options', 'Custom supplier pages'],
              },
            ].map((plan) => (
              <div key={plan.name} style={{
                padding: '40px 32px',
                borderRadius: '16px',
                backgroundColor: '#fff',
                border: plan.popular ? '2px solid #111' : '1px solid #e5e7eb',
                position: 'relative',
                boxShadow: plan.popular ? '0 8px 30px rgba(0,0,0,0.08)' : 'none',
              }}>
                {plan.popular && (
                  <div style={{
                    position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                    backgroundColor: '#111', color: '#fff', fontSize: '11px', fontWeight: 600,
                    padding: '4px 16px', borderRadius: '20px', textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    Most Popular
                  </div>
                )}
                <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 600 }}>{plan.name}</h3>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-0.03em' }}>{plan.price}</span>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>/month</span>
                </div>
                <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 24px' }}>
                  + {plan.setup} one-time setup
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span> {f}
                    </div>
                  ))}
                </div>

                <CheckoutButton tier={plan.tier} popular={plan.popular}>
                  Get Started
                </CheckoutButton>
              </div>
            ))}
          </div>
        </div>
      </section>

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
            Four live demo sites built on EliteAdvisorHub — two standard templates,
            one custom build, and one real agency example.
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
                    <span style={{ fontSize: '13px', color: '#111', fontWeight: 600 }}>
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

      {/* Footer */}
      <footer style={{
        padding: '48px 24px', borderTop: '1px solid #f3f4f6',
        backgroundColor: '#fafafa',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '6px',
              background: 'linear-gradient(135deg, #111 0%, #374151 100%)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>E</span>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>EliteAdvisorHub</span>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>
            © {new Date().getFullYear()} EliteAdvisorHub. All rights reserved. ·{' '}
            <a href="https://eliteadvisorhub.com" style={{ color: '#9ca3af', textDecoration: 'none' }}>eliteadvisorhub.com</a>
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/admin/login" style={{ fontSize: '13px', color: '#9ca3af', textDecoration: 'none' }}>Admin</Link>
            <Link href="/agent-portal/login" style={{ fontSize: '13px', color: '#9ca3af', textDecoration: 'none' }}>Agent Login</Link>
          </div>
        </div>
      </footer>

      {/* Responsive + hover styles */}
      <style>{`
        .eah-demo-card:hover {
          transform: translateY(-4px);
          border-color: #d1d5db !important;
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
        }
        .eah-demo-card:hover .eah-demo-thumb {
          transform: scale(1.04);
        }
        @media (max-width: 900px) {
          .eah-features-grid,
          .eah-pricing-grid,
          .eah-demos-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

function kindBadgeBg(kind: DemoCard['kind']): string {
  switch (kind) {
    case 'Custom':   return 'rgba(139, 92, 246, 0.92)'   // purple
    case 'Standard': return 'rgba(17, 17, 17, 0.92)'     // near-black
    case 'Agency':   return 'rgba(22, 163, 74, 0.92)'    // green
  }
}

function kindBadgeColor(_kind: DemoCard['kind']): string {
  return '#ffffff'
}
