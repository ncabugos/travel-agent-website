import { Reveal } from './Reveal'
import { BODY_STYLE, CHARCOAL, DIVIDER, H2_STYLE, LABEL_STYLE } from './tokens'

/**
 * Homepage §9: the questions that come up in consultations, answered in the
 * open. Two-column hairline rows, no accordion. FAQPage JSON-LD keeps the
 * answers eligible for rich results.
 */
const FAQS: { q: string; a: string }[] = [
  {
    q: 'How do I get started?',
    a: 'Request a consultation. We confirm scope and timeline on a short call, then build your site. Most sites are live within days of receiving your content.',
  },
  {
    q: 'Do I need to be a Virtuoso advisor?',
    a: 'No. Elite Advisor Hub is open to advisors in every consortium: Virtuoso, Signature, Ensemble, Travel Leaders, Serandipians, and independents. You choose which programs appear on your site.',
  },
  {
    q: 'How quickly is the site live?',
    a: 'Within days of receiving your content. We build and brand it, connect your domain, and hand you a live site with the portal ready.',
  },
  {
    q: 'Can I use my own domain?',
    a: 'Yes. Your site runs on your own domain under your name and branding. We connect it during the build.',
  },
  {
    q: 'Who writes the journal?',
    a: 'You can publish your own pieces from the portal editor on every site. The curated stream, weekly articles across destinations, hotels, and voyages, is written by our editorial team and published in the categories you select.',
  },
  {
    q: 'What is the difference between this and Squarespace or Wix?',
    a: 'A maintained luxury supplier catalog of 24 preferred-partner programs, 1,805 hotels, and 28 cruise lines that a general-purpose builder does not have, an editorial pipeline, a lead inbox built for advisor inquiries, and someone on our side keeping it all current. You never touch hosting, plugins, or updates.',
  },
]

export function MarketingFAQ() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <section id="faq" className="eah-section" style={{ background: '#fff', color: CHARCOAL, padding: '120px 0' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="eah-container">
        <Reveal>
          <p style={{ ...LABEL_STYLE, marginBottom: '20px' }}>Questions</p>
          <h2 style={{ ...H2_STYLE, marginBottom: '48px' }}>Before you begin.</h2>
        </Reveal>
        <dl style={{ margin: 0, borderTop: `1px solid ${DIVIDER}` }}>
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 40} className="eah-faq-row" style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '32px', padding: '28px 0', borderBottom: `1px solid ${DIVIDER}` }}>
              <dt style={{ fontSize: '20px', fontWeight: 400, letterSpacing: '-0.015em', lineHeight: 1.3, margin: 0 }}>{f.q}</dt>
              <dd style={{ ...BODY_STYLE, fontSize: '16px', margin: 0, maxWidth: '62ch' }}>{f.a}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
      <style>{`
        @media (max-width: 800px) { .eah-faq-row { grid-template-columns: 1fr !important; gap: 10px !important; padding: 22px 0 !important; } }
      `}</style>
    </section>
  )
}
