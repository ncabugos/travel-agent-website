import Image from 'next/image'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { StudioPricing } from '@/components/marketing/StudioPricing'
import { StudioServices } from '@/components/marketing/StudioServices'
import { StudioInquiryForm } from '@/components/marketing/StudioInquiryForm'
import { Reveal } from '@/components/marketing/Reveal'
import { buildMarketingMetadata } from '@/lib/seo'
import {
  BODY_FONT, BODY_STYLE, CHARCOAL, CREAM, DISPLAY_FONT, DIVIDER, H2_STYLE, LABEL_STYLE, NEAR_BLACK,
  PRIMARY_CTA_STYLE, SECONDARY_CTA_STYLE, WARM_GRAY, WARM_GRAY_DARK,
} from '@/components/marketing/tokens'

export const metadata = buildMarketingMetadata({
  title: 'Studio — Done-for-You Social, Content & Design for Travel Advisors | Elite Advisor Hub',
  description:
    'Studio is the done-for-you creative and marketing service from Elite Advisor Hub. Social, content, design, email, and AI visibility, handled for luxury travel advisors.',
  path: 'studio',
})

const HOW_IT_WORKS: { title: string; body: string }[] = [
  { title: 'Unlimited requests, queued', body: 'Submit as much as you want. We complete a set number at a time, by plan, so quality stays high and scope stays sane.' },
  { title: 'Fast, predictable turnaround', body: 'Most single requests land inside your plan window. Larger projects are scoped and scheduled up front.' },
  { title: 'Unlimited revisions', body: 'We refine until it is right. No per-change fees, no rationing of feedback.' },
  { title: 'You own everything', body: 'Every source file and final asset is yours to keep, reuse, and take with you.' },
]

const ADD_ONS: string[] = [
  'Paid ad management (Meta, Google), quoted per campaign',
  'Photography and videography, art-directed by us, production quoted per project',
  'Website build or redesign on Elite Advisor Hub, one time',
  'Brand identity package, one time',
  'Rush delivery on a specific request, quoted per request',
  'Event and print collateral at volume, quoted per project',
]

const A_LA_CARTE: string[] = [
  'AI visibility audit: see how AI search describes you today',
  'Source-of-truth page: one authoritative page AI can trust',
  'Journal jumpstart: four GEO-optimized articles on your specialty',
  'Social launch pack: a month of on-brand content and templates',
  'Brand refresh: palette, type, and usage tune-up',
  'Marketing game plan: a working session and a 90-day plan',
  'Website build on Elite Advisor Hub: branded site and content system',
]

export default function StudioPage() {
  return (
    <div className="eah-marketing" style={{ fontFamily: BODY_FONT, color: CHARCOAL, background: '#fff' }}>
      <MarketingNav overlay />
      <main>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section
          className="eah-hero"
          style={{ position: 'relative', minHeight: '88dvh', display: 'flex', alignItems: 'flex-end', background: NEAR_BLACK, color: '#fff', overflow: 'hidden', padding: '160px 0 72px' }}
        >
          <Image src="/media/hero images/four-seasons-taormina-pool_2-hero.jpg" alt="" fill priority sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }} />
          <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'rgba(11,10,9,0.55)', zIndex: 1 }} />
          <div className="eah-container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
            <p style={{ ...LABEL_STYLE, color: 'rgba(255,255,255,0.7)', marginBottom: '28px' }}>Studio</p>
            <h1 style={{ fontFamily: DISPLAY_FONT, fontSize: 'clamp(40px, 5.8vw, 84px)', fontWeight: 300, letterSpacing: '-0.035em', lineHeight: 1.0, margin: '0 0 28px', maxWidth: '14ch' }}>
              Your website is built. Now keep it alive.
            </h1>
            <p style={{ fontSize: '19px', lineHeight: 1.55, color: 'rgba(255,255,255,0.86)', maxWidth: '54ch', margin: '0 0 36px' }}>
              Studio is the done-for-you creative and marketing layer on top of your Elite Advisor Hub site. Social, content, design, email, and AI visibility, handled for you, so your presence stays current without you having to think about it.
            </p>
            <div className="eah-hero-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <a href="#inquire" className="eah-cta-primary" style={PRIMARY_CTA_STYLE}>Request a conversation</a>
              <a href="#plans" className="eah-cta-secondary" style={{ ...SECONDARY_CTA_STYLE, color: '#fff' }}>See the plans</a>
            </div>
          </div>
        </section>

        {/* ── Positioning ──────────────────────────────────────────────── */}
        <section className="eah-section" style={{ padding: '120px 0', background: CREAM }}>
          <div className="eah-container studio-two-col" style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '64px' }}>
            <Reveal>
              <p style={{ ...LABEL_STYLE, marginBottom: '20px' }}>Why Studio</p>
              <h2 style={{ ...H2_STYLE, maxWidth: '16ch' }}>Not a design queue. A marketing partner who knows your world.</h2>
            </Reveal>
            <Reveal delay={100}>
              <p style={{ ...BODY_STYLE, fontSize: '18px', maxWidth: '58ch' }}>
                Studio is led by someone who built this platform and works in luxury travel. You are not buying graphics by the hour. You are buying a current, consistent, credible presence: social that keeps moving, journals that publish on cadence, design that looks the part, and an identity AI describes correctly when a client goes looking. All of it handled, so you can stay with your clients.
              </p>
            </Reveal>
          </div>
        </section>

        <StudioServices />
        <StudioPricing />

        {/* ── How it works ─────────────────────────────────────────────── */}
        <section className="eah-section" style={{ padding: '120px 0', background: '#fff' }}>
          <div className="eah-container studio-two-col" style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '64px' }}>
            <Reveal>
              <p style={{ ...LABEL_STYLE, marginBottom: '20px' }}>How it works</p>
              <h2 style={{ ...H2_STYLE, maxWidth: '12ch' }}>A subscription, not a project.</h2>
            </Reveal>
            <ol role="list" style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: `1px solid ${DIVIDER}` }}>
              {HOW_IT_WORKS.map((item, i) => (
                <li key={item.title} style={{ borderBottom: `1px solid ${DIVIDER}` }}>
                  <Reveal delay={i * 50} className="studio-row" style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: '24px', padding: '28px 0' }}>
                    <span style={{ fontSize: '12px', color: WARM_GRAY_DARK, paddingTop: '6px', fontVariantNumeric: 'tabular-nums' }}>{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.25 }}>{item.title}</h3>
                      <p style={{ ...BODY_STYLE, fontSize: '16px', maxWidth: '56ch' }}>{item.body}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Beyond the monthly ───────────────────────────────────────── */}
        <section className="eah-section" style={{ padding: '120px 0', background: CREAM }}>
          <div className="eah-container">
            <Reveal>
              <p style={{ ...LABEL_STYLE, marginBottom: '20px' }}>Add-ons and one-time projects</p>
              <h2 style={{ ...H2_STYLE, marginBottom: '56px', maxWidth: '16ch' }}>Beyond the monthly plan.</h2>
            </Reveal>
            <div className="studio-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>
              <Reveal>
                <h3 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 400, letterSpacing: '-0.015em' }}>Add-ons</h3>
                <p style={{ fontSize: '14px', color: WARM_GRAY, margin: '0 0 20px', lineHeight: 1.6 }}>Specialist or hard-cost work, outside the standard queue. Preferred rates for subscribers.</p>
                <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: `1px solid ${DIVIDER}` }}>
                  {ADD_ONS.map((a) => (
                    <li key={a} style={{ padding: '14px 0', borderBottom: `1px solid ${DIVIDER}`, fontSize: '15px', color: WARM_GRAY_DARK, lineHeight: 1.5 }}>{a}</li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={80}>
                <h3 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 400, letterSpacing: '-0.015em' }}>One-time projects</h3>
                <p style={{ fontSize: '14px', color: WARM_GRAY, margin: '0 0 20px', lineHeight: 1.6 }}>Not ready to subscribe? Start with a single project you can build on.</p>
                <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: `1px solid ${DIVIDER}` }}>
                  {A_LA_CARTE.map((item) => (
                    <li key={item} style={{ padding: '14px 0', borderBottom: `1px solid ${DIVIDER}`, fontSize: '15px', color: WARM_GRAY_DARK, lineHeight: 1.5 }}>{item}</li>
                  ))}
                </ul>
              </Reveal>
            </div>
            <Reveal>
              <p style={{ ...BODY_STYLE, fontSize: '15px', marginTop: '48px', maxWidth: '70ch' }}>
                <span style={{ color: CHARCOAL }}>What stays out of the monthly:</span> paid ad spend itself, third-party production (photo, video, print), large website builds, and specialist-vendor work. All are quoted separately, so your monthly stays predictable.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── Inquiry ──────────────────────────────────────────────────── */}
        <section id="inquire" className="eah-section" style={{ padding: '120px 0', background: '#fff', scrollMarginTop: '80px' }}>
          <div className="eah-container studio-form-grid" style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '64px', alignItems: 'start' }}>
            <Reveal>
              <p style={{ ...LABEL_STYLE, marginBottom: '20px' }}>Get started</p>
              <h2 style={{ ...H2_STYLE, marginBottom: '20px', maxWidth: '12ch' }}>Tell us what to hand off.</h2>
              <p style={{ ...BODY_STYLE, marginBottom: '40px', maxWidth: '40ch' }}>
                Tell us where you are stretched. We reply personally with a recommendation. No obligation, no pressure to subscribe.
              </p>
              <div className="studio-form-image" style={{ position: 'relative', aspectRatio: '4 / 5', background: DIVIDER }}>
                <Image src="/media/hero images/four-seasons-CapFerrat-pool-hero.jpg" alt="" fill sizes="(max-width: 900px) 100vw, 40vw" style={{ objectFit: 'cover' }} />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <StudioInquiryForm />
            </Reveal>
          </div>
        </section>
      </main>

      <MarketingFooter />

      <style>{`
        @media (max-width: 900px) {
          .studio-two-col, .studio-form-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .studio-form-image { display: none; }
        }
        @media (max-width: 640px) {
          .eah-section { padding-top: 80px !important; padding-bottom: 80px !important; }
          .eah-hero { padding-top: 120px !important; padding-bottom: 48px !important; min-height: 0 !important; }
          .eah-hero-actions { flex-direction: column; align-items: stretch !important; }
          .eah-hero-actions a { width: 100%; }
          .studio-row { grid-template-columns: 1fr !important; gap: 8px !important; padding: 22px 0 !important; }
        }
      `}</style>
    </div>
  )
}
