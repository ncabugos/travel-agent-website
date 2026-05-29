import { Sparkles, CalendarCheck, Lock, Palette, Building2, Anchor, Check } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { BetaWaitlistForm } from '@/components/marketing/BetaWaitlistForm'

export const metadata = {
  title: 'Founding Advisor Beta — Elite Advisor Hub',
  description:
    'Join the waitlist for the Elite Advisor Hub Founding Advisor beta: a Virtuoso-grade website with the setup fee waived, three months free, and a locked founding rate.',
}

// Match the marketing homepage exactly: system font stack, full-bleed hero
// image + dark overlay, purple-gradient accent, rounded cards.
const SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
const PURPLE_GRADIENT = 'linear-gradient(135deg, #a5b4fc, #c4b5fd)'

// Full-bleed hero background — Six Senses infinity pool at sunset.
const HERO_IMAGE = '/media/hotel-programs/six-senses/Six_Senses-Hero-2000.jpg'

const HIGHLIGHTS = [
  {
    icon: <Sparkles size={26} strokeWidth={1.5} />,
    title: 'Setup fee waived',
    body: 'We design, build, and launch your site at no setup cost.',
  },
  {
    icon: <CalendarCheck size={26} strokeWidth={1.5} />,
    title: 'Three months free',
    body: 'Your first 90 days are on us — nothing charged at signup.',
  },
  {
    icon: <Lock size={26} strokeWidth={1.5} />,
    title: 'A founding rate, locked',
    body: 'Keep a discounted monthly rate for the life of your subscription.',
  },
]

// What every site includes — the value pillars.
const PILLARS = [
  {
    icon: <Palette size={24} strokeWidth={1.5} />,
    title: 'Designed around your brand',
    body: 'Not a stock template — a custom-branded site built to your identity: your typography, palette, and voice.',
  },
  {
    icon: <Building2 size={24} strokeWidth={1.5} />,
    title: 'Luxury hotel programs & directory',
    body: 'Aman, Four Seasons, Belmond and more — plus a searchable directory of 1,795+ properties, maintained for you.',
  },
  {
    icon: <Anchor size={24} strokeWidth={1.5} />,
    title: 'Suppliers integrated everywhere',
    body: 'Cruise partners, villas, and supplier perks wired into every page — so your whole network is one click away.',
  },
]

// Founding pricing — regular vs. locked founding rate. Mirrors lib/stripe.ts.
const FOUNDING_TIERS = [
  { name: 'Starter', setup: '$499', regular: 89, founding: 59, popular: false, note: 'For advisors building toward Growth.' },
  { name: 'Growth', setup: '$1,499', regular: 179, founding: 119, popular: true, note: 'Our most popular — directories, feed, curated stream.' },
  { name: 'Custom', setup: '$2,999', regular: 349, founding: 249, popular: false, note: 'Bespoke design, villas, premium modules.' },
]

// Partner logos for the marquee (transparent-black wordmarks).
const LOGO_BASE = '/assets/supplier logos/black transparent'
const HOTEL_LOGOS = [
  'Aman-black-600.png', 'FS_preferred-600-black.png', 'belmond_bellini-logo-black-600.png',
  'Marriott_stars_luminous-black-600.png', 'mandarin-oriental-fan-club-Mandarin-black-600.png',
  'rosewood_elite-black-600.png', 'ritz-carlton-stars-black-600.png', 'SixSenses-logo-black-600.png',
  'dorchester_diamond-logo-black-600.png', 'oetker-pearl-black-600.png', 'Peninsula_PenClub-black-600.png',
  'LeadingHotels-black-600.png', 'ShangriLa-black-600.png', 'como-hotels-black-600.png',
].map((f) => `${LOGO_BASE}/${f}`)
const CRUISE_LOGOS = [
  'regent-black-600.png', 'seabourn-black-600.png', 'oceaniaCruises-black-600.png', 'cunard-black-600.png',
  'celebrityCruises-black-600.png', 'royalCaribbean-black-600.png', 'princessCruises-black-600.png',
  'azamara-black-600.png', 'amaWaterways-black-600.png', 'sceniceCruises-black-600.png',
].map((f) => `${LOGO_BASE}/cruise/${f}`)

export default function BetaWaitlistPage() {
  return (
    <div style={{ fontFamily: SANS, color: '#111', background: '#fff' }}>
      <MarketingNav />

      {/* ── Hero — full-bleed luxury hotel background (matches homepage) ── */}
      <section
        style={{
          minHeight: '86vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: '140px 24px 96px',
        }}
      >
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_IMAGE}
          alt=""
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        />
        {/* Dark gradient overlay (identical to homepage hero) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '760px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.85)',
              marginBottom: '32px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            ✦ Founding Advisor Beta
          </div>

          <h1
            style={{
              fontSize: 'clamp(40px, 6vw, 68px)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              margin: '0 0 24px',
              color: '#fff',
            }}
          >
            Join the
            <br />
            <span
              style={{
                background: PURPLE_GRADIENT,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              founding group.
            </span>
          </h1>

          <p
            style={{
              fontSize: '18px',
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.82)',
              maxWidth: '600px',
              margin: '0 auto 40px',
            }}
          >
            Elite Advisor Hub is opening to a small founding cohort of independent
            luxury travel advisors — a Virtuoso-grade website, built and launched
            in days. Add your name to the waitlist for the next cohort.
          </p>

          <a
            href="#waitlist"
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              backgroundColor: '#fff',
              color: '#111',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Join the waitlist
          </a>
        </div>
      </section>

      {/* ── Offer highlights (homepage feature-card style) ──────────── */}
      <section style={{ padding: '100px 24px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 700, textAlign: 'center', letterSpacing: '-0.02em', margin: '0 0 12px' }}>
            What founding advisors get
          </h2>
          <p style={{ textAlign: 'center', fontSize: '16px', color: '#6b7280', margin: '0 0 60px', maxWidth: '520px', marginInline: 'auto' }}>
            A genuine partnership rate for the advisors who help shape the platform.
          </p>

          <div className="beta-highlights" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {HIGHLIGHTS.map((h) => (
              <div key={h.title} style={{ padding: '32px', borderRadius: '16px', border: '1px solid #f3f4f6' }}>
                <div style={{ marginBottom: '16px', color: '#8b5cf6' }}>{h.icon}</div>
                <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 600 }}>{h.title}</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: 1.6 }}>{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What every site includes + partner marquee ────────────── */}
      <section style={{ padding: '100px 24px 84px', backgroundColor: '#fafafa', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px' }}>
            <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7c3aed', marginBottom: '16px' }}>
              Built in, not bolted on
            </span>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 16px' }}>
              Unmistakably yours.<br />Effortlessly complete.
            </h2>
            <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#6b7280', margin: 0 }}>
              Every founding site is custom-designed around your brand — then ships with the
              entire luxury supplier network already wired in. No plugins, no piecing it together.
            </p>
          </div>

          <div className="beta-pillars" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '76px' }}>
            {PILLARS.map((p) => (
              <div key={p.title} style={{ padding: '32px', borderRadius: '18px', background: '#fff', border: '1px solid #ececec' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #ede9fe, #f5f3ff)', color: '#7c3aed', marginBottom: '18px' }}>
                  {p.icon}
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 600, letterSpacing: '-0.01em' }}>{p.title}</h3>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#6b7280' }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 600, margin: '0 0 30px' }}>
          Hotel programs &amp; cruise partners — on every site
        </p>
        <div className="eah-mq" aria-hidden="true">
          <div className="eah-mq-row eah-mq-left">
            {[...HOTEL_LOGOS, ...HOTEL_LOGOS].map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={`h${i}`} src={src} alt="" className="eah-mq-logo" />
            ))}
          </div>
          <div className="eah-mq-row eah-mq-right">
            {[...CRUISE_LOGOS, ...CRUISE_LOGOS].map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={`c${i}`} src={src} alt="" className="eah-mq-logo" />
            ))}
          </div>
        </div>
      </section>

      {/* ── Founding pricing (crossed-off comparison) ──────────────── */}
      <section style={{ padding: '100px 24px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px' }}>
            <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7c3aed', marginBottom: '16px' }}>
              Founding rates
            </span>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 16px' }}>
              Your founding rate, locked for life.
            </h2>
            <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#6b7280', margin: 0 }}>
              Setup waived. Three months free. Then a founding monthly rate you keep for as long
              as you stay — even after public prices rise.
            </p>
          </div>

          <div className="beta-pricing" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', alignItems: 'stretch' }}>
            {FOUNDING_TIERS.map((t) => (
              <div
                key={t.name}
                style={{
                  position: 'relative',
                  padding: '36px 32px',
                  borderRadius: '20px',
                  background: '#fff',
                  border: t.popular ? '1.5px solid #7c3aed' : '1px solid #ececec',
                  boxShadow: t.popular ? '0 20px 50px -24px rgba(124,58,237,0.45)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {t.popular && (
                  <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', color: '#fff', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '5px 14px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                    Most Popular
                  </span>
                )}
                <h3 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 700, letterSpacing: '-0.01em' }}>{t.name}</h3>
                <p style={{ margin: '0 0 24px', fontSize: '13.5px', color: '#6b7280', lineHeight: 1.5, minHeight: '40px' }}>{t.note}</p>

                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'nowrap', marginBottom: '6px' }}>
                  <span style={{ fontSize: '17px', color: '#9ca3af', textDecoration: 'line-through', textDecorationColor: '#d1d5db' }}>${t.regular}</span>
                  <span style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '-0.03em', color: '#0a0a0a' }}>${t.founding}</span>
                  <span style={{ fontSize: '14px', color: '#6b7280', whiteSpace: 'nowrap' }}>/mo</span>
                </div>
                <p style={{ margin: '0 0 22px', fontSize: '13px', fontWeight: 600, color: '#7c3aed' }}>
                  Save ${t.regular - t.founding}/mo — locked for life
                </p>

                {/* Setup */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '20px', borderTop: '1px solid #f3f4f6', fontSize: '14px' }}>
                  <Check size={16} strokeWidth={2.5} style={{ color: '#16a34a', flexShrink: 0 }} />
                  <span style={{ color: '#374151' }}>
                    Setup <span style={{ textDecoration: 'line-through', color: '#9ca3af' }}>{t.setup}</span>{' '}
                    <strong style={{ color: '#16a34a' }}>Waived</strong>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', fontSize: '14px' }}>
                  <Check size={16} strokeWidth={2.5} style={{ color: '#16a34a', flexShrink: 0 }} />
                  <span style={{ color: '#374151' }}>First 3 months free</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <a href="#waitlist" className="eah-cta-primary" style={{ display: 'inline-block', padding: '14px 36px', background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', color: '#fff', borderRadius: '10px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', boxShadow: '0 1px 2px rgba(124,58,237,0.25)' }}>
              Claim a founding rate
            </a>
            <p style={{ margin: '18px 0 0', fontSize: '13px', color: '#9ca3af' }}>
              Founding pricing is reserved for cohort-one advisors. Agency plans are quoted separately.
            </p>
          </div>
        </div>
      </section>

      {/* ── Waitlist form ──────────────────────────────────────────── */}
      <section id="waitlist" style={{ padding: '100px 24px', backgroundColor: '#fafafa', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '620px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 700, textAlign: 'center', letterSpacing: '-0.02em', margin: '0 0 12px' }}>
            Request your place
          </h2>
          <p style={{ textAlign: 'center', fontSize: '16px', color: '#6b7280', margin: '0 0 40px' }}>
            Cohort one is by invitation. We&apos;ll reach out personally as places open.
          </p>
          <BetaWaitlistForm />
        </div>
      </section>

      <MarketingFooter />

      <style>{`
        /* Partner logo marquee */
        .eah-mq {
          display: flex;
          flex-direction: column;
          gap: 22px;
          overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
        }
        .eah-mq-row { display: flex; align-items: center; gap: 64px; width: max-content; }
        .eah-mq-left  { animation: eah-mq-l 50s linear infinite; }
        .eah-mq-right { animation: eah-mq-r 44s linear infinite; }
        .eah-mq-logo {
          height: 30px; width: auto; flex: none;
          opacity: 0.5; filter: grayscale(100%);
        }
        @keyframes eah-mq-l { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes eah-mq-r { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        @media (prefers-reduced-motion: reduce) {
          .eah-mq-left, .eah-mq-right { animation: none; }
        }
        .eah-cta-primary { transition: transform 0.15s ease, box-shadow 0.2s ease; }
        .eah-cta-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px -8px rgba(124,58,237,0.5); }
        @media (max-width: 900px) {
          .beta-pricing { grid-template-columns: 1fr !important; max-width: 440px; margin-inline: auto; }
        }
        @media (max-width: 768px) {
          .beta-highlights { grid-template-columns: 1fr !important; }
          .beta-pillars { grid-template-columns: 1fr !important; }
          .eah-mq-logo { height: 26px; }
        }
      `}</style>
    </div>
  )
}
