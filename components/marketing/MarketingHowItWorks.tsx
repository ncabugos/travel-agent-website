import { CHARCOAL, DIVIDER, GOLD, INK, WARM_GRAY_DARK } from './tokens'

/**
 * Homepage §2 — Problem → Plan.
 *
 * PAS in three short paragraphs (problem, agitate, bridge) followed by a
 * StoryBrand-style three-step plan so a visitor knows exactly what happens
 * after they click. Left-aligned, ≤75ch measure, 16px+ body throughout.
 */
const STEPS = [
  {
    n: '01',
    title: 'Begin your 30 days',
    body: 'Card on file, two minutes. Nothing is billed until day 31, and you can cancel from the portal at any point before then.',
  },
  {
    n: '02',
    title: 'We build and brand it',
    body: 'Your name, your palette, your suppliers. Hotel programs, journal, lead inbox, and custom domain are set up for you — live within days.',
  },
  {
    n: '03',
    title: 'You stay in front of clients',
    body: 'Hosting, updates, supplier data, and SEO are maintained on our side. Edit requests are turned around within 24 hours.',
  },
]

export function MarketingHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="eah-section"
      style={{ padding: '100px 24px', backgroundColor: '#fff', color: INK }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div className="eah-hiw-grid" style={{ display: 'grid', gridTemplateColumns: '5fr 6fr', gap: '64px' }}>
          {/* Problem */}
          <div>
            <div style={{
              fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: GOLD, marginBottom: '18px',
            }}>
              The problem
            </div>
            <h2 style={{
              fontSize: 'clamp(30px, 3.4vw, 42px)', fontWeight: 700,
              letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 22px',
            }}>
              Your website is the one part of the client experience you don&rsquo;t control.
            </h2>
            <p style={{ fontSize: '17px', lineHeight: 1.65, color: WARM_GRAY_DARK, margin: '0 0 16px', maxWidth: '52ch' }}>
              A client you placed at Aman before the season opened will look you up before they
              refer you. Too often what they find is a template from a general-purpose builder, hotel
              perks that expired last year, and a journal last updated when you had a quiet week.
            </p>
            <p style={{ fontSize: '17px', lineHeight: 1.65, color: WARM_GRAY_DARK, margin: 0, maxWidth: '52ch' }}>
              Fixing it has meant a developer retainer, a hosting bill, and a second job keeping it
              current. Elite Advisor Hub removes all three.
            </p>
          </div>

          {/* Plan */}
          <div>
            <div style={{
              fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: GOLD, marginBottom: '18px',
            }}>
              How it works
            </div>
            <ol role="list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {STEPS.map((s, i) => (
                <li
                  key={s.n}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '48px 1fr',
                    gap: '20px',
                    padding: '24px 0',
                    borderTop: `1px solid ${DIVIDER}`,
                    borderBottom: i === STEPS.length - 1 ? `1px solid ${DIVIDER}` : undefined,
                  }}
                >
                  <div style={{
                    fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em',
                    color: GOLD, paddingTop: '4px',
                  }}>
                    {s.n}
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 8px', fontSize: '19px', fontWeight: 600, letterSpacing: '-0.01em', color: CHARCOAL }}>
                      {s.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.6, color: WARM_GRAY_DARK }}>
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .eah-hiw-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  )
}
