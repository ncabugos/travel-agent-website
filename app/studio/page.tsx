import Image from 'next/image'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { StudioPricing } from '@/components/marketing/StudioPricing'
import { StudioServices } from '@/components/marketing/StudioServices'
import { StudioInquiryForm } from '@/components/marketing/StudioInquiryForm'
import { Reveal } from '@/components/marketing/Reveal'
import { buildMarketingMetadata } from '@/lib/seo'
import {
  BODY_FONT, BODY_STYLE, CHARCOAL, CREAM, DISPLAY_FONT, DIVIDER, H2_STYLE, NEAR_BLACK,
  PRIMARY_CTA_STYLE, SECONDARY_CTA_STYLE, WARM_GRAY_DARK,
} from '@/components/marketing/tokens'

export const metadata = buildMarketingMetadata({
  title: 'Done-for-You Marketing for Travel Advisors | Elite Advisor Hub',
  description:
    'We handle your social media, blog, newsletter, and design. You approve everything and stay with your clients. Plans for solo advisors and agencies.',
  path: 'studio',
})

const HOW_IT_WORKS: { title: string; body: string }[] = [
  { title: 'Schedule a consultation', body: 'Tell us about your business and where you need help. We recommend a plan.' },
  { title: 'Send us what you need', body: 'Email us anytime, or use your portal if your site is on Elite Advisor Hub. We work through requests in order and keep your regular posts and articles on schedule.' },
  { title: 'You approve, we publish', body: 'Nothing goes out without your OK. Changes are included.' },
]

const FAQS: { q: string; a: string }[] = [
  { q: 'Do I need an Elite Advisor Hub website?', a: 'No. We work with any travel advisor. If your site is on Elite Advisor Hub, we publish to it directly. If not, we work with the site you already have.' },
  { q: 'How do I send a request?', a: 'Email us anytime. If your site is on Elite Advisor Hub, you can also send requests from your portal.' },
  { q: 'What is not included?', a: 'Ad spend, photo and video shoots, and printing. We can arrange them and quote them separately.' },
  { q: 'Can I start with a single project?', a: 'Yes. Common starting points are a month of social posts, four blog articles, a brand refresh, or a new website. We quote each one.' },
  { q: 'Who owns the work?', a: 'You do. Every file is yours to keep.' },
]

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
}

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
            <h1 style={{ fontFamily: DISPLAY_FONT, fontSize: 'clamp(40px, 5.8vw, 84px)', fontWeight: 300, letterSpacing: '-0.035em', lineHeight: 1.0, margin: '0 0 28px', maxWidth: '16ch' }}>
              Marketing for travel advisors, done for you.
            </h1>
            <p style={{ fontSize: '19px', lineHeight: 1.55, color: 'rgba(255,255,255,0.86)', maxWidth: '54ch', margin: '0 0 36px' }}>
              We post to your social media, write your blog, send your newsletter, and design what you need. You approve everything. You stay with your clients.
            </p>
            <div className="eah-hero-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <a href="#inquire" className="eah-cta-primary" style={PRIMARY_CTA_STYLE}>Schedule a consultation</a>
              <a href="#plans" className="eah-cta-secondary" style={{ ...SECONDARY_CTA_STYLE, color: '#fff' }}>See the plans</a>
            </div>
          </div>
        </section>

        <StudioServices />

        {/* ── How it works ─────────────────────────────────────────────── */}
        <section className="eah-section" style={{ padding: '120px 0', background: '#fff' }}>
          <div className="eah-container studio-two-col" style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '64px' }}>
            <Reveal>
              <h2 style={H2_STYLE}>How it works</h2>
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

        <StudioPricing />

        {/* ── Common questions ─────────────────────────────────────────── */}
        <section className="eah-section" style={{ padding: '120px 0', background: '#fff' }}>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
          <div className="eah-container">
            <Reveal>
              <h2 style={{ ...H2_STYLE, marginBottom: '48px' }}>Common questions</h2>
            </Reveal>
            <dl style={{ margin: 0, borderTop: `1px solid ${DIVIDER}` }}>
              {FAQS.map((f, i) => (
                <Reveal key={f.q} delay={i * 40} className="studio-faq-row" style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '32px', padding: '28px 0', borderBottom: `1px solid ${DIVIDER}` }}>
                  <dt style={{ fontSize: '20px', fontWeight: 400, letterSpacing: '-0.015em', lineHeight: 1.3, margin: 0 }}>{f.q}</dt>
                  <dd style={{ ...BODY_STYLE, fontSize: '16px', margin: 0, maxWidth: '62ch' }}>{f.a}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Inquiry ──────────────────────────────────────────────────── */}
        <section id="inquire" className="eah-section" style={{ padding: '120px 0', background: CREAM, scrollMarginTop: '80px' }}>
          <div className="eah-container studio-form-grid" style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '64px', alignItems: 'start' }}>
            <Reveal>
              <h2 style={{ ...H2_STYLE, marginBottom: '20px', maxWidth: '12ch' }}>Schedule a consultation</h2>
              <p style={{ ...BODY_STYLE, marginBottom: '40px', maxWidth: '40ch' }}>
                Tell us where you need help. We reply personally with a recommendation. No obligation.
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
        @media (max-width: 800px) {
          .studio-faq-row { grid-template-columns: 1fr !important; gap: 10px !important; padding: 22px 0 !important; }
        }
      `}</style>
    </div>
  )
}
