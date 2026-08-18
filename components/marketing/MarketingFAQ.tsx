import { CHARCOAL, DIVIDER, GOLD, INK, WARM_GRAY_DARK } from './tokens'

/**
 * Homepage §FAQ — objection handling just before the closing CTA.
 *
 * Addressing buyer fears on-page is one of the higher-leverage moves in the
 * research (~80% lift in aggregate); these six are the questions that come
 * up in consultations. Native <details> keeps it dependency-free and
 * accessible; FAQPage JSON-LD mirrors the Insights pattern so the answers
 * are eligible for rich results.
 */
const FAQS: { q: string; a: string }[] = [
  {
    q: 'What happens after the first 30 days?',
    a: 'Your card is billed $59 on day 31 and monthly after that. There is no setup fee and no contract — cancel from the portal at any point during the 30 days and nothing is charged.',
  },
  {
    q: 'Do I need to be a Virtuoso advisor?',
    a: 'No. Elite Advisor Hub is open to advisors in every consortium — Virtuoso, Signature, Ensemble, Travel Leaders, Serandipians, and independents. You choose which supplier programs appear on your site.',
  },
  {
    q: 'How quickly is the site live?',
    a: 'Within days of your card going on file. We build and brand it — palette, typography, suppliers, journal categories, custom domain — and hand you a live site with a portal for edits.',
  },
  {
    q: 'Can I use my own domain?',
    a: 'Yes. Your site runs on your own domain, under your name and branding — we connect it during the build. Every site is a custom-branded build; the template underneath is an implementation detail.',
  },
  {
    q: 'Who writes the journal?',
    a: 'You can publish your own pieces from the portal editor on every plan. The operator-produced curated stream — weekly articles across destinations, hotels, wellness, and wine — is an optional editorial module.',
  },
  {
    q: 'What is the difference between this and Squarespace or Wix?',
    a: 'A maintained luxury supplier catalog (1,795+ hotel programs, 30+ cruise lines) that a general-purpose builder does not have, an editorial pipeline, a lead inbox built for advisor inquiries, and someone on our side keeping it all current. You never touch hosting, plugins, or updates.',
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
    <section
      id="faq"
      className="eah-section"
      style={{ padding: '100px 24px', backgroundColor: '#fff', color: INK }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div style={{
          fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: GOLD, marginBottom: '18px',
        }}>
          Questions advisors ask
        </div>
        <h2 style={{
          fontSize: 'clamp(30px, 3.4vw, 42px)', fontWeight: 700,
          letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 40px',
        }}>
          Before you begin.
        </h2>

        <div style={{ borderTop: `1px solid ${DIVIDER}` }}>
          {FAQS.map((f) => (
            <details key={f.q} className="eah-faq-item" style={{ borderBottom: `1px solid ${DIVIDER}` }}>
              <summary className="eah-faq-summary eah-focus-ring-dark" style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px',
                padding: '22px 0', cursor: 'pointer', listStyle: 'none',
                fontSize: '18px', fontWeight: 600, letterSpacing: '-0.01em', color: CHARCOAL,
              }}>
                <span>{f.q}</span>
                <span className="eah-faq-icon" aria-hidden style={{
                  flexShrink: 0, width: '28px', height: '28px', borderRadius: '50%',
                  border: `1px solid ${DIVIDER}`, display: 'inline-flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', lineHeight: 1, color: GOLD,
                  transition: 'transform 0.2s ease',
                }}>+</span>
              </summary>
              <p style={{ margin: '0 0 24px', fontSize: '16px', lineHeight: 1.65, color: WARM_GRAY_DARK, maxWidth: '68ch' }}>
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>

      <style>{`
        .eah-faq-item summary::-webkit-details-marker { display: none; }
        .eah-faq-summary:hover span:first-child { color: #B49A5A; }
        .eah-faq-summary { transition: color 0.15s ease; }
        .eah-faq-item[open] .eah-faq-icon { transform: rotate(45deg); }
      `}</style>
    </section>
  )
}
