import Link from 'next/link'
import type { AgencyAdvisor } from '@/lib/agency-advisors'

interface T2AdvisorsDirectoryProps {
  agentId: string
  advisors: AgencyAdvisor[]
  eyebrow?: string
  heading?: string
  subheading?: string
  /** If true, renders a homepage teaser (limits to first 4 and adds "View all advisors" CTA) */
  teaser?: boolean
  limit?: number
}

/**
 * Multi-advisor team directory for Agency-tier T2 sites. Renders a card
 * grid of advisors, each linking to `/advisors/[slug]` for their full
 * profile + lead form. When `teaser=true`, limits to 4 cards and adds a
 * "View all advisors" CTA — intended for homepage use.
 */
export function T2AdvisorsDirectory({
  agentId,
  advisors,
  eyebrow = 'Our Advisors',
  heading = 'A small team, intentionally.',
  subheading = 'Each of our advisors is a specialist in their region — because the best travel advice comes from someone who lives in the place they are sending you.',
  teaser = false,
  limit,
}: T2AdvisorsDirectoryProps) {
  if (!advisors.length) return null

  const base = `/t2/${agentId}`
  const effectiveLimit = teaser ? (limit ?? 4) : limit
  const items = typeof effectiveLimit === 'number' ? advisors.slice(0, effectiveLimit) : advisors

  return (
    <section style={{ padding: 'var(--t2-section-pad) 0', background: 'var(--t2-bg)' }}>
      <div
        style={{
          maxWidth: 'var(--t2-content-max, 1280px)',
          margin: '0 auto',
          padding: '0 48px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'space-between',
            gap: 32,
            marginBottom: 56,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ maxWidth: 680 }}>
            <p className="t2-label" style={{ marginBottom: 16 }}>{eyebrow}</p>
            <h2 className="t2-heading t2-heading-lg" style={{ marginBottom: subheading ? 16 : 0 }}>
              {heading}
            </h2>
            {subheading && (
              <p className="t2-body" style={{ margin: 0 }}>
                {subheading}
              </p>
            )}
          </div>
          {teaser && advisors.length > items.length && (
            <Link
              href={`${base}/advisors`}
              className="t2-btn t2-btn-ghost-dark"
              style={{ alignSelf: 'flex-end' }}
            >
              All Advisors
            </Link>
          )}
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: teaser ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
            gap: 24,
            rowGap: 48,
          }}
          className="t2-advisors-grid"
        >
          {items.map((advisor) => (
            <Link
              key={advisor.slug}
              href={`${base}/advisors/${advisor.slug}`}
              className="t2-advisor-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                color: 'inherit',
                textDecoration: 'none',
                background: '#fff',
                border: '1px solid var(--t2-divider)',
                overflow: 'hidden',
                transition: 'border-color 0.3s ease',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '3 / 4',
                  overflow: 'hidden',
                  background: 'var(--t2-bg-alt)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={advisor.photo}
                  alt={advisor.name}
                  className="t2-advisor-img"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    transition: 'transform 0.9s ease',
                  }}
                />
              </div>

              <div style={{ padding: '24px 24px 28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3
                  style={{
                    fontFamily: 'var(--t2-font-serif)',
                    fontSize: 'clamp(18px, 1.6vw, 22px)',
                    fontWeight: 400,
                    margin: '0 0 4px',
                    color: 'var(--t2-text)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {advisor.name}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--t2-font-sans)',
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'var(--t2-accent)',
                    margin: '0 0 16px',
                  }}
                >
                  {advisor.title}
                </p>
                {advisor.tagline && !teaser && (
                  <p
                    style={{
                      fontFamily: 'var(--t2-font-serif)',
                      fontStyle: 'italic',
                      fontSize: 14,
                      color: 'var(--t2-text-muted)',
                      lineHeight: 1.55,
                      margin: '0 0 16px',
                    }}
                  >
                    {advisor.tagline}
                  </p>
                )}
                {!teaser && advisor.specialties.length > 0 && (
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: '0 0 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                    }}
                  >
                    {advisor.specialties.slice(0, 3).map((s) => (
                      <li
                        key={s}
                        style={{
                          fontFamily: 'var(--t2-font-sans)',
                          fontSize: 12,
                          color: 'var(--t2-text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-block',
                            width: 5,
                            height: 5,
                            background: 'var(--t2-accent)',
                            flexShrink: 0,
                          }}
                        />
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: 14,
                    borderTop: '1px solid var(--t2-divider)',
                    fontSize: 10,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                    color: 'var(--t2-accent)',
                  }}
                >
                  View Profile →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .t2-advisor-card:hover { border-color: var(--t2-accent) !important; }
        .t2-advisor-card:hover .t2-advisor-img { transform: scale(1.04); }
        @media (max-width: 1100px) {
          .t2-advisors-grid { grid-template-columns: repeat(${teaser ? 2 : 2}, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .t2-advisors-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
