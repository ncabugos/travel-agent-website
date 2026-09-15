import { Reveal } from './Reveal'
import { BODY_STYLE, CHARCOAL, DIVIDER, H2_STYLE, LABEL_STYLE, WARM_GRAY_DARK } from './tokens'

/**
 * Homepage §7: three steps, so the visitor knows what happens after the
 * consultation request.
 */
const STEPS = [
  {
    n: '01',
    title: 'Request a consultation',
    body: 'A short call to confirm scope and timeline. Then you send your logo, photos, bio, and the suppliers you work with.',
  },
  {
    n: '02',
    title: 'We build and brand it',
    body: 'Your palette, your suppliers, your domain. Live within days.',
  },
  {
    n: '03',
    title: 'You stay in front of clients',
    body: 'Hosting, updates, supplier data, and SEO are maintained on our side. Edit requests are turned around within 24 hours.',
  },
]

export function MarketingHowItWorks() {
  return (
    <section id="how-it-works" className="eah-section" style={{ background: '#fff', color: CHARCOAL, padding: '120px 0' }}>
      <div className="eah-container eah-hiw-grid" style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '64px' }}>
        <Reveal>
          <p style={{ ...LABEL_STYLE, marginBottom: '20px' }}>How it works</p>
          <h2 style={{ ...H2_STYLE, maxWidth: '12ch' }}>From call to live site in days.</h2>
        </Reveal>
        <ol role="list" style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: `1px solid ${DIVIDER}` }}>
          {STEPS.map((s, i) => (
            <li key={s.n} style={{ borderBottom: `1px solid ${DIVIDER}` }}>
              <Reveal delay={i * 60} className="eah-hiw-row" style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: '24px', padding: '28px 0' }}>
                <span style={{ fontSize: '12px', color: WARM_GRAY_DARK, paddingTop: '6px', fontVariantNumeric: 'tabular-nums' }}>{s.n}</span>
                <div>
                  <h3 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.25 }}>{s.title}</h3>
                  <p style={{ ...BODY_STYLE, fontSize: '16px', maxWidth: '56ch' }}>{s.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
      <style>{`
        @media (max-width: 900px) { .eah-hiw-grid { grid-template-columns: 1fr !important; gap: 40px !important; } }
        @media (max-width: 640px) { .eah-hiw-row { grid-template-columns: 1fr !important; gap: 8px !important; padding: 22px 0 !important; } }
      `}</style>
    </section>
  )
}
