import Link from 'next/link'

export interface T4JournalPost {
  slug: string
  title: string
  excerpt?: string | null
  cover_image_url?: string | null
  published_at?: string | null
  category?: string | null
}

interface T4JournalTeaserProps {
  agentId: string
  posts: T4JournalPost[]
  eyebrow?: string
  heading?: string
  body?: string
  limit?: number
}

/**
 * T4 journal teaser — magazine-style with one oversized lead post + a
 * stacked reading list of secondary posts. Falls back to curated demo
 * posts for demo agents whose backend returns no entries.
 */
export function T4JournalTeaser({
  agentId,
  posts,
  eyebrow = 'Journal',
  heading = 'Dispatches, notebooks, and quiet discoveries.',
  body,
  limit = 4,
}: T4JournalTeaserProps) {
  const base = `/t4/${agentId}`
  const items = (posts.length > 0 ? posts : DEMO_POSTS).slice(0, limit)
  const [lead, ...rest] = items

  return (
    <section style={{ padding: 'var(--t4-section-pad) 48px', background: 'var(--t4-bg)' }}>
      <div style={{ maxWidth: 'var(--t4-content-wide)', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 32,
            alignItems: 'end',
            marginBottom: 64,
          }}
          className="t4-journal-header"
        >
          <div style={{ maxWidth: 720 }}>
            <span className="t4-eyebrow">{eyebrow}</span>
            <h2 className="t4-headline-xl" style={{ marginTop: 28, marginBottom: body ? 24 : 0 }}>
              {heading}
            </h2>
            {body && <p className="t4-body t4-body-lg">{body}</p>}
          </div>
          <Link href={`${base}/journal`} className="t4-link">
            The Full Journal
            <span className="t4-arrow">→</span>
          </Link>
        </div>

        {/* Grid — lead + stacked list */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: 80,
            alignItems: 'start',
          }}
          className="t4-journal-grid"
        >
          {/* Lead */}
          <Link
            href={`${base}/journal/${lead.slug}`}
            className="t4-journal-lead"
            style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}
          >
            <div
              style={{
                position: 'relative',
                aspectRatio: '4 / 3',
                overflow: 'hidden',
                background: 'var(--t4-bg-alt)',
                marginBottom: 28,
              }}
            >
              {lead.cover_image_url && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={lead.cover_image_url}
                  alt={lead.title}
                  className="t4-journal-lead-img"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 1.1s var(--t4-ease-out)',
                  }}
                />
              )}
            </div>
            <CardMeta category={lead.category} date={lead.published_at} />
            <h3
              className="t4-headline-lg"
              style={{ marginTop: 12, marginBottom: 14, fontSize: 'clamp(24px, 2.4vw, 32px)' }}
            >
              {lead.title}
            </h3>
            {lead.excerpt && (
              <p className="t4-body" style={{ margin: 0, maxWidth: 560 }}>
                {lead.excerpt}
              </p>
            )}
          </Link>

          {/* Stacked list */}
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {rest.map((p, i) => (
              <li
                key={p.slug}
                style={{
                  padding: '24px 0',
                  borderTop: i === 0 ? '1px solid var(--t4-divider)' : 'none',
                  borderBottom: '1px solid var(--t4-divider)',
                }}
              >
                <Link
                  href={`${base}/journal/${p.slug}`}
                  className="t4-journal-list-item"
                  style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}
                >
                  <CardMeta category={p.category} date={p.published_at} />
                  <h4
                    className="t4-headline-md"
                    style={{ marginTop: 10, marginBottom: p.excerpt ? 8 : 0, fontSize: 'clamp(18px, 1.5vw, 22px)' }}
                  >
                    {p.title}
                  </h4>
                  {p.excerpt && (
                    <p className="t4-body" style={{ margin: 0, fontSize: 14 }}>
                      {p.excerpt.length > 120 ? p.excerpt.slice(0, 117).trimEnd() + '…' : p.excerpt}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        .t4-journal-lead:hover .t4-journal-lead-img { transform: scale(1.03); }
        @media (max-width: 900px) {
          .t4-journal-header { grid-template-columns: 1fr !important; gap: 24px !important; }
          .t4-journal-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  )
}

function CardMeta({ category, date }: { category?: string | null; date?: string | null }) {
  const parts = [category, formatDate(date)].filter(Boolean)
  if (parts.length === 0) return null
  return (
    <div
      style={{
        fontFamily: 'var(--t4-font-body)',
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        color: 'var(--t4-accent)',
      }}
    >
      {parts.join(' · ')}
    </div>
  )
}

function formatDate(iso?: string | null): string | undefined {
  if (!iso) return undefined
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return undefined
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

const DEMO_POSTS: T4JournalPost[] = [
  {
    slug: 'the-umbrian-house',
    title: 'The house in Umbria, and why we keep going back',
    excerpt:
      'A farmhouse at the edge of Solferino, thirteen rooms, a family that has been there for three generations — and why, every spring, we place clients there first.',
    cover_image_url: '/media/hotel-programs/belmond-bellini-club/belmond-slider-1-1500.jpg',
    published_at: new Date().toISOString(),
    category: 'Notebook',
  },
  {
    slug: 'kyoto-in-march',
    title: 'Kyoto in March — before the tourists, after the frost',
    excerpt: 'A short case for the three weeks of the year when the temples are empty, the plum trees have opened, and the inns have rooms to give.',
    cover_image_url: '/media/hero images/four-seasons-taormina-suite-hero.jpg',
    published_at: new Date().toISOString(),
    category: 'Dispatch',
  },
  {
    slug: 'the-case-against-cruise-convenience',
    title: 'The case against "cruise convenience"',
    excerpt: 'Why the busier the itinerary, the less you remember — and the three lines we recommend precisely because they do less, and do it well.',
    cover_image_url: '/media/cruises/regent-seven-seas/splendor_suite-1500.jpg',
    published_at: new Date().toISOString(),
    category: 'Advisor Notes',
  },
  {
    slug: 'an-afternoon-with-belmond',
    title: 'An afternoon with the Bellini Club',
    excerpt: 'Notes from a reconnaissance visit to the Cipriani — what has changed, what has stayed, and what we now book for every client.',
    cover_image_url: '/media/hotel-programs/belmond-bellini-club/belmond-cap-1500.jpg',
    published_at: new Date().toISOString(),
    category: 'Reconnaissance',
  },
]
