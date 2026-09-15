import { Reveal } from './Reveal'
import { BODY_STYLE, CHARCOAL, DIVIDER, H2_STYLE, LABEL_STYLE, WARM_GRAY_DARK } from './tokens'

/**
 * Homepage §3: what every site includes. A specification list, not a card
 * grid. Heading stays put on the left while the rows scroll on the right.
 */
const ROWS = [
  {
    title: 'Custom-branded site on your domain',
    body: 'Your name, palette, and typography. Three editorial templates underneath, or a build designed from scratch.',
  },
  {
    title: '24 preferred-partner hotel programs',
    body: 'Aman, Belmond Bellini Club, Four Seasons Preferred Partner, Rosewood Elite, Mandarin Oriental Fan Club, Dorchester Diamond Club, and 18 more. Benefits stay current without you touching them.',
  },
  {
    title: '28 cruise lines',
    body: 'Regent Seven Seas, Silversea, Seabourn, Explora Journeys, Ponant, Four Seasons Yachts, and the rest of the luxury fleet, each with a live partner page.',
  },
  {
    title: 'Journal and curated editorial',
    body: 'Publish your own pieces from the portal, or add a weekly editorial stream in the categories that match your practice.',
  },
  {
    title: 'Lead inbox and advisor portal',
    body: 'Inquiries, edit requests, supplier selections, and journal posts in one place.',
  },
  {
    title: 'Hosting, updates, and SEO',
    body: 'Handled on our side. No developer retainer, no plugin updates, no hosting bill.',
  },
]

export function PlatformSpecList() {
  return (
    <section id="platform" className="eah-section" style={{ background: '#fff', color: CHARCOAL, padding: '120px 0' }}>
      <div className="eah-container eah-spec-grid" style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '64px' }}>
        <div>
          <div style={{ position: 'sticky', top: '120px' }}>
            <Reveal>
              <p style={{ ...LABEL_STYLE, marginBottom: '20px' }}>The platform</p>
              <h2 style={{ ...H2_STYLE, marginBottom: '20px', maxWidth: '14ch' }}>What every site includes.</h2>
              <p style={{ ...BODY_STYLE, maxWidth: '40ch' }}>
                Everything below is on every site from day one. Modules and studio services are added from the portal only when the practice calls for them.
              </p>
            </Reveal>
          </div>
        </div>
        <div>
          <ol role="list" style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: `1px solid ${DIVIDER}` }}>
            {ROWS.map((row, i) => (
              <li key={row.title} style={{ borderBottom: `1px solid ${DIVIDER}` }}>
                <Reveal delay={i * 40} className="eah-spec-row" style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: '24px', padding: '28px 0' }}>
                  <span style={{ fontSize: '12px', color: WARM_GRAY_DARK, paddingTop: '6px', fontVariantNumeric: 'tabular-nums' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.25 }}>{row.title}</h3>
                    <p style={{ ...BODY_STYLE, fontSize: '16px', maxWidth: '58ch' }}>{row.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .eah-spec-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .eah-spec-grid > div > div { position: static !important; }
        }
        @media (max-width: 640px) {
          .eah-spec-row { grid-template-columns: 1fr !important; gap: 8px !important; padding: 22px 0 !important; }
        }
      `}</style>
    </section>
  )
}
