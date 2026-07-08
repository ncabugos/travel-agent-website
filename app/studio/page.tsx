import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { StudioPricing } from '@/components/marketing/StudioPricing'
import { StudioServices } from '@/components/marketing/StudioServices'
import { StudioInquiryForm } from '@/components/marketing/StudioInquiryForm'
import { buildMarketingMetadata } from '@/lib/seo'

// ── Brand tokens (mirror app/globals.css) — one palette for the whole page ────
const SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
const INK = '#1A1715'     // charcoal — headings / strong text
const BODY = '#57514A'    // warm body text
const MUTE = '#8A8279'    // warm muted — captions / labels
const LINE = '#E8E4DC'    // hairline dividers / borders
const CREAM = '#FAFAF5'   // section / card background
const GOLD = '#B49A5A'
const GOLD_L = '#D8C28A'  // gold on dark backgrounds
// Purple carries actions/emphasis; gold carries editorial accents — per
// brand/EAH_Brand_Style_Guide.html (the homepage uses the same pairing).
const PURPLE_GRAD = 'linear-gradient(135deg, #7c3aed, #a78bfa)'
const LAV_GRAD = 'linear-gradient(135deg, #a5b4fc, #c4b5fd)'

export const metadata = buildMarketingMetadata({
  title: 'Studio — Done-for-You Social, Content & Design for Travel Advisors | Elite Advisor Hub',
  description:
    'Studio is the done-for-you creative and marketing service from Elite Advisor Hub. Social, content, design, email, and AI visibility — handled for luxury travel advisors at a flat monthly rate.',
  path: 'studio',
})

const HOW_IT_WORKS: { title: string; body: string }[] = [
  { title: 'Unlimited requests, queued', body: 'Submit as much as you want. We complete a set number at a time, by plan, so quality stays high and scope stays sane.' },
  { title: 'Fast, predictable turnaround', body: "Most single requests land inside your plan's window. Larger projects are scoped and scheduled up front." },
  { title: 'Unlimited revisions', body: 'We refine until it is right. No per-change fees, no rationing of feedback.' },
  { title: 'You own everything', body: 'Every source file and final asset is yours to keep, reuse, and take with you.' },
  { title: 'Flat monthly, no surprises', body: 'No hourly billing. Monthly rolling, with the option to pause for a season — travel is seasonal, and so are advisors.' },
  { title: 'Annual option', body: 'Prepay the year and get two months free. The same work, at a lower effective rate.' },
]

const ADD_ONS: string[] = [
  'Paid ad management (Meta, Google) — 15% of ad spend, $500/mo minimum',
  'Photography & videography — art-directed by us, production quoted per project',
  'Website build or redesign on Elite Advisor Hub — one-time',
  'Brand identity package — one-time',
  'Rush delivery on a specific request — flat rush fee',
  'Event & print collateral at volume — quoted per project',
]

const A_LA_CARTE: { name: string; price: string }[] = [
  { name: 'AI Visibility Audit — see how AI search describes you today', price: 'from $500' },
  { name: 'Source-of-Truth Page — one authoritative page AI can trust', price: 'from $750' },
  { name: 'Journal Jumpstart — four GEO-optimized articles on your specialty', price: 'from $1,200' },
  { name: 'Social Launch Pack — a month of on-brand content + templates', price: 'from $850' },
  { name: 'Brand Refresh — palette, type, and usage tune-up', price: 'from $1,500' },
  { name: 'Marketing Game Plan — a working session + a 90-day plan', price: 'from $750' },
  { name: 'Website Build on Elite Advisor Hub — branded site + content system', price: 'from $3,000' },
]

export default function StudioPage() {
  return (
    <div style={{ fontFamily: SANS, color: INK, background: '#fff' }}>
      <MarketingNav />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="eah-section" style={{ position: 'relative', overflow: 'hidden', padding: '184px 24px 112px', textAlign: 'center' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: "url('/media/hero images/four-seasons-taormina-pool_2-hero.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,18,15,0.64) 0%, rgba(20,18,15,0.5) 45%, rgba(20,18,15,0.72) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '860px', margin: '0 auto' }}>
          <p style={{ ...eyebrowStyle, color: GOLD_L }}>Elite Advisor Hub · Studio</p>
          <h1 style={{ fontSize: 'clamp(34px, 5vw, 58px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 22px', color: '#fff' }}>
            Your website is built.{' '}
            <span style={{ background: LAV_GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Now keep it alive.
            </span>
          </h1>
          <p style={{ fontSize: '19px', lineHeight: 1.65, color: 'rgba(255,255,255,0.88)', maxWidth: '640px', margin: '0 auto 36px' }}>
            Studio is the done-for-you creative and marketing layer on top of your Elite Advisor Hub site.
            Social, content, design, email, and AI visibility — handled for you at a flat monthly rate,
            so your presence stays current without you having to think about it.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#plans" style={btnPrimary}>See the plans</a>
            <a href="#inquire" style={btnGhostDark}>Request a conversation</a>
          </div>
        </div>
      </section>

      {/* ── Positioning ──────────────────────────────────────────────────── */}
      <section className="eah-section" style={{ padding: '96px 24px', background: CREAM }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <p style={eyebrowStyle}>Why Studio</p>
          <h2 style={{ fontSize: 'clamp(26px, 3vw, 34px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2, margin: '0 0 20px', color: INK }}>
            Not a commodity design queue. A marketing partner who knows your world.
          </h2>
          <p style={{ fontSize: '17px', color: BODY, lineHeight: 1.75, margin: 0 }}>
            Studio is led by someone who built this platform and works in luxury travel. You are not
            buying graphics by the hour. You are buying a current, consistent, credible presence —
            social that keeps moving, journals that publish on cadence, design that looks the part, and
            an identity AI describes correctly when a client goes looking. All of it handled, so you can
            stay with your clients.
          </p>
        </div>
      </section>

      {/* ── Capabilities showcase (animated, dark) ───────────────────────── */}
      <StudioServices />

      {/* ── Plans (cards + comparison, one block) ────────────────────────── */}
      <StudioPricing />

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="eah-section" style={{ padding: '96px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={eyebrowStyle}>How it works</p>
            <h2 style={{ fontSize: 'clamp(28px, 3.2vw, 36px)', fontWeight: 700, textAlign: 'center', letterSpacing: '-0.02em', margin: 0, color: INK }}>
              A subscription, not a project
            </h2>
          </div>
          <div className="studio-how-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {HOW_IT_WORKS.map((item) => (
              <div key={item.title} style={{ padding: '28px', borderRadius: '14px', background: CREAM, border: `1px solid ${LINE}` }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: 700, color: INK }}>{item.title}</h3>
                <p style={{ margin: 0, fontSize: '14px', color: BODY, lineHeight: 1.65 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Beyond the monthly (add-ons + à la carte + scope) ────────────── */}
      <section className="eah-section" style={{ padding: '96px 24px', background: CREAM }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={eyebrowStyle}>Add-ons &amp; one-time projects</p>
            <h2 style={{ fontSize: 'clamp(28px, 3.2vw, 36px)', fontWeight: 700, letterSpacing: '-0.02em', margin: '0 auto', color: INK, maxWidth: '620px' }}>
              Beyond the monthly retainer
            </h2>
          </div>

          <div className="studio-extras-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 6px', color: INK }}>Add-ons</h3>
              <p style={{ fontSize: '14px', color: MUTE, margin: '0 0 20px', lineHeight: 1.6 }}>
                Specialist or hard-cost work, outside the standard queue. Preferred rates for subscribers.
              </p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {ADD_ONS.map((a) => (
                  <li key={a} style={{ display: 'flex', gap: '10px', fontSize: '14px', color: BODY, lineHeight: 1.55 }}>
                    <span style={{ color: GOLD, fontWeight: 700, flexShrink: 0 }}>+</span> {a}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 6px', color: INK }}>À la carte</h3>
              <p style={{ fontSize: '14px', color: MUTE, margin: '0 0 20px', lineHeight: 1.6 }}>
                Not ready to subscribe? Start with a single project — a foundation you can build on. Starting anchors.
              </p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {A_LA_CARTE.map((item) => (
                  <li key={item.name} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', fontSize: '14px', color: BODY, lineHeight: 1.55, paddingBottom: '12px', borderBottom: `1px solid ${LINE}` }}>
                    <span>{item.name}</span>
                    <span style={{ color: GOLD, fontWeight: 600, whiteSpace: 'nowrap' }}>{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p style={{ marginTop: '40px', padding: '18px 22px', background: '#fff', border: `1px solid ${LINE}`, borderRadius: '12px', fontSize: '13.5px', color: BODY, lineHeight: 1.65, textAlign: 'center' }}>
            <strong style={{ color: INK }}>What stays out of the monthly:</strong> paid ad spend itself,
            third-party production (photo, video, print), large website builds, and specialist-vendor work — all
            quoted separately, so your monthly stays predictable.
          </p>
        </div>
      </section>

      {/* ── Lead form ────────────────────────────────────────────────────── */}
      <section className="eah-section" id="inquire" style={{ padding: '96px 24px', background: '#fff', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p style={eyebrowStyle}>Get started</p>
            <h2 style={{ fontSize: 'clamp(28px, 3.2vw, 36px)', fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 12px', color: INK }}>
              Let&apos;s talk about what to hand off
            </h2>
            <p style={{ fontSize: '16px', color: BODY, margin: '0 auto', maxWidth: '620px', lineHeight: 1.65 }}>
              Tell us where you&apos;re stretched. We&apos;ll reply personally with a recommendation — no obligation,
              no pressure to subscribe.
            </p>
          </div>
          <div className="studio-form-grid" style={{ display: 'grid', gridTemplateColumns: '0.82fr 1fr', gap: '32px', alignItems: 'stretch' }}>
            <div className="studio-form-image" aria-hidden="true" style={{ position: 'relative', minHeight: '440px', borderRadius: '16px', overflow: 'hidden', border: `1px solid ${LINE}`, backgroundImage: "url('/four-seasons-hero.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div><StudioInquiryForm /></div>
          </div>
        </div>
      </section>

      <MarketingFooter />

      <style>{`
        @media (max-width: 900px) {
          .studio-how-grid { grid-template-columns: 1fr !important; }
          .studio-extras-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
        @media (max-width: 760px) {
          .studio-form-grid { grid-template-columns: 1fr !important; }
          .studio-form-image { min-height: 200px !important; }
        }
        @media (max-width: 640px) {
          .eah-section { padding-top: 60px !important; padding-bottom: 60px !important; }
        }
      `}</style>
    </div>
  )
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const eyebrowStyle: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: GOLD,
  margin: '0 0 16px',
}
const btnPrimary: React.CSSProperties = {
  padding: '14px 32px',
  background: PURPLE_GRAD,
  color: '#fff',
  borderRadius: '10px',
  fontSize: '15px',
  fontWeight: 600,
  textDecoration: 'none',
  boxShadow: '0 4px 24px rgba(124, 58, 237, 0.35)',
}
const btnGhostDark: React.CSSProperties = {
  padding: '14px 32px',
  background: 'rgba(255,255,255,0.12)',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.55)',
  borderRadius: '10px',
  fontSize: '15px',
  fontWeight: 600,
  textDecoration: 'none',
  backdropFilter: 'blur(6px)',
}
