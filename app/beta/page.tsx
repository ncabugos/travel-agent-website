import { Sparkles, CalendarCheck, Lock } from 'lucide-react'
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
        @media (max-width: 768px) {
          .beta-highlights { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
