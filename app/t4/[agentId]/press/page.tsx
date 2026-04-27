import Image from 'next/image'
import Link from 'next/link'
import { T4PageHero } from '@/components/t4/T4PageHero'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export const metadata = {
  title: 'Press | Casa Solis',
  description:
    "A selection of what's been written about Casa Solis, and the recognitions we have quietly accepted.",
}

const PRESS_ITEMS = [
  {
    publication: 'Condé Nast Traveler',
    headline: "Top Travel Specialists — Italy & the Mediterranean",
    date: 'March 2026',
    excerpt: "On the short list for the fifth consecutive year for our work in Italy, Croatia, and the southern Mediterranean.",
    href: '#',
  },
  {
    publication: 'Travel + Leisure',
    headline: "A-List Travel Advisors — Umbria & Tuscany",
    date: 'January 2026',
    excerpt: "Named to the A-List for the third time; specifically cited for multi-generational trips and private-villa arrangements.",
    href: '#',
  },
  {
    publication: 'Financial Times — How To Spend It',
    headline: "The advisors who know the places that are \u2018not on the internet\u2019",
    date: 'October 2025',
    excerpt: "Long-form profile of the house, the studio in Solferino, and the particular advisors-as-writers tradition we maintain.",
    href: '#',
  },
  {
    publication: 'The World of Interiors',
    headline: "A letter from the Umbrian farmhouse",
    date: 'Summer 2025',
    excerpt: "Alessandra's essay on a farmhouse outside Solferino, and why it remains the anchoring address of the Casa Solis book.",
    href: '#',
  },
  {
    publication: 'Robb Report',
    headline: "The best luxury travel advisors, 2025",
    date: 'April 2025',
    excerpt: "Named among the top ten for ultra-luxury European travel, with specific mention of access to private gardens and chef's tables.",
    href: '#',
  },
  {
    publication: 'Monocle',
    headline: "Slow travel, quietly arranged",
    date: 'February 2025',
    excerpt: "A short feature on the house's \u2018letters before departure\u2019 tradition and why it remains central to how we work.",
    href: '#',
  },
]

const ACCOLADES = [
  { year: '2026', label: 'Virtuoso Travel Advisor of the Year — Finalist' },
  { year: '2025', label: 'Condé Nast Traveler Top Travel Specialist' },
  { year: '2025', label: 'Travel + Leisure A-List' },
  { year: '2024', label: 'Robb Report Top 100 Travel Advisors' },
  { year: '2024', label: 'Virtuoso Rising Star — European Hotels' },
  { year: '2023', label: 'Condé Nast Traveler Top Travel Specialist' },
]

export default async function T4PressPage({ params }: PageProps) {
  const { agentId } = await params
  const base = `/t4/${agentId}`

  return (
    <>
      <T4PageHero
        image="/media/hotel-programs/aman/aman-hero-2000.jpg"
        imageAlt="Press — Casa Solis"
        eyebrow="Press"
        title="What has been written."
        body="A short selection of the coverage and recognitions we have quietly accepted. We are not in the habit of courting attention, but we are grateful for each."
        imageCaption="The Studio · Solferino"
      />

      {/* ── Press items ─────────────────────────────────────────────────── */}
      <section className="t4-section-wide">
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <span className="t4-eyebrow">In Print</span>
          <h2 className="t4-headline-xl" style={{ marginTop: 28, marginBottom: 56 }}>
            Selected coverage.
          </h2>

          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              borderTop: '1px solid var(--t4-divider)',
            }}
          >
            {PRESS_ITEMS.map((item) => (
              <li
                key={item.headline}
                style={{
                  padding: '40px 0',
                  borderBottom: '1px solid var(--t4-divider)',
                }}
              >
                <a
                  href={item.href}
                  className="t4-press-item"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '200px 1fr auto',
                    gap: 48,
                    alignItems: 'start',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--t4-font-body)',
                        fontSize: 10,
                        fontWeight: 500,
                        letterSpacing: '0.26em',
                        textTransform: 'uppercase',
                        color: 'var(--t4-accent)',
                        marginBottom: 8,
                      }}
                    >
                      {item.publication}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--t4-font-body)',
                        fontSize: 12,
                        color: 'var(--t4-text-muted)',
                        fontWeight: 300,
                      }}
                    >
                      {item.date}
                    </div>
                  </div>
                  <div>
                    <h3 className="t4-headline-md" style={{ marginBottom: 10, fontSize: 'clamp(20px, 1.8vw, 26px)' }}>
                      {item.headline}
                    </h3>
                    <p className="t4-body" style={{ margin: 0, fontSize: 14.5 }}>
                      {item.excerpt}
                    </p>
                  </div>
                  <div
                    className="t4-press-arrow"
                    style={{
                      fontFamily: 'var(--t4-font-body)',
                      fontSize: 10,
                      letterSpacing: '0.26em',
                      textTransform: 'uppercase',
                      color: 'var(--t4-accent)',
                      fontWeight: 500,
                      paddingTop: 4,
                      whiteSpace: 'nowrap',
                      transition: 'transform 0.25s var(--t4-ease)',
                    }}
                  >
                    Read →
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Accolades ──────────────────────────────────────────────────── */}
      <section
        style={{
          padding: 'var(--t4-section-pad) 48px',
          background: 'var(--t4-bg-alt)',
        }}
      >
        <div style={{ maxWidth: 'var(--t4-content-max)', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.4fr',
              gap: 96,
              alignItems: 'start',
            }}
            className="t4-accolades-grid"
          >
            <div>
              <span className="t4-eyebrow">Accolades</span>
              <h2 className="t4-headline-xl" style={{ marginTop: 28, marginBottom: 32 }}>
                Recognitions.
              </h2>
              <p className="t4-body t4-body-lg" style={{ maxWidth: 440 }}>
                A short list. We accept these quietly and hang them, literally,
                in the upstairs reading room.
              </p>
            </div>

            <div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '96px 1fr',
                  borderTop: '1px solid var(--t4-divider)',
                }}
              >
                {ACCOLADES.map((a, i) => (
                  <div
                    key={`${a.year}-${a.label}-${i}`}
                    style={{ display: 'contents' }}
                  >
                    <div
                      style={{
                        padding: '24px 0',
                        borderBottom: i === ACCOLADES.length - 1 ? 'none' : '1px solid var(--t4-divider)',
                        fontFamily: 'var(--t4-font-display)',
                        fontSize: 22,
                        fontWeight: 400,
                        color: 'var(--t4-accent)',
                      }}
                    >
                      {a.year}
                    </div>
                    <div
                      style={{
                        padding: '24px 0',
                        borderBottom: i === ACCOLADES.length - 1 ? 'none' : '1px solid var(--t4-divider)',
                        fontFamily: 'var(--t4-font-display)',
                        fontSize: 18,
                        fontWeight: 400,
                        color: 'var(--t4-text)',
                        lineHeight: 1.45,
                      }}
                    >
                      {a.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .t4-accolades-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          }
          @media (max-width: 720px) {
            .t4-press-item { grid-template-columns: 1fr !important; gap: 12px !important; }
            .t4-press-arrow { display: none; }
          }
        `}</style>
      </section>

      {/* ── Contact CTA ────────────────────────────────────────────────── */}
      <section
        className="t4-section-dark"
        style={{ padding: 'var(--t4-section-pad) 48px', textAlign: 'center' }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <span
            className="t4-eyebrow t4-eyebrow-center"
            style={{ color: 'var(--t4-accent-soft)', justifyContent: 'center' }}
          >
            Press Enquiries
          </span>
          <h2
            className="t4-headline-xl"
            style={{ color: 'var(--t4-dark-text)', marginTop: 28, marginBottom: 28 }}
          >
            For journalists and editors.
          </h2>
          <p
            style={{
              color: 'rgba(251, 248, 241, 0.72)',
              fontFamily: 'var(--t4-font-body)',
              fontSize: 16,
              lineHeight: 1.78,
              maxWidth: 520,
              margin: '0 auto 40px',
              fontWeight: 300,
            }}
          >
            We answer press enquiries within two business days. Please write
            to <a href="mailto:press@casasolis.com" style={{ color: 'var(--t4-accent-soft)', textDecoration: 'underline' }}>press@casasolis.com</a> — or get in touch through the
            contact page below.
          </p>
          <Link href={`${base}/contact`} className="t4-btn t4-btn-ghost-light">
            Contact the Studio
          </Link>
        </div>
      </section>
    </>
  )
}
