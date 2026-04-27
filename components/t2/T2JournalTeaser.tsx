import Link from 'next/link'

export interface T2JournalPost {
  slug: string
  title: string
  excerpt?: string | null
  cover_image_url?: string | null
  published_at?: string | null
  category?: string | null
}

interface T2JournalTeaserProps {
  agentId: string
  posts: T2JournalPost[]
  eyebrow?: string
  heading?: string
  subheading?: string
  /** Number of posts to render. Defaults to 3. */
  limit?: number
  /** Where the "All posts" CTA leads. Defaults to `/t2/[agentId]/journal`. */
  allPostsHref?: string
}

/**
 * Three-up journal/blog teaser for Vista (T2). Designed for the homepage —
 * shows the most recent editorial posts with cover image, date, and
 * excerpt. Links each card and a footer "All posts" CTA into the journal
 * index. If fewer than `limit` posts are available the teaser collapses
 * gracefully or renders placeholders when `posts` is empty (e.g. demo mode).
 */
export function T2JournalTeaser({
  agentId,
  posts,
  eyebrow = 'Journal',
  heading = 'Dispatches from the road.',
  subheading = 'Hand-picked destinations, recent openings, and the stories our advisors think worth your time.',
  limit = 3,
  allPostsHref,
}: T2JournalTeaserProps) {
  const base = `/t2/${agentId}`
  const items = posts.slice(0, limit)

  // Fall back to a small set of placeholder cards so demo pages stay visually
  // balanced even with no real posts in the database.
  const displayItems: T2JournalPost[] =
    items.length > 0 ? items : DEMO_PLACEHOLDER_POSTS.slice(0, limit)

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
            marginBottom: 48,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ maxWidth: 620 }}>
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
          <Link
            href={allPostsHref ?? `${base}/journal`}
            className="t2-btn t2-btn-ghost-dark"
            style={{ alignSelf: 'flex-end' }}
          >
            All Posts
          </Link>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${displayItems.length}, 1fr)`,
            gap: 24,
          }}
          className="t2-journal-grid"
        >
          {displayItems.map((p) => (
            <Link
              key={p.slug}
              href={`${base}/journal/${p.slug}`}
              className="t2-journal-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '4 / 3',
                  overflow: 'hidden',
                  background: 'var(--t2-bg-alt, #f3efe7)',
                  marginBottom: 20,
                }}
              >
                {p.cover_image_url && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={p.cover_image_url}
                    alt={p.title}
                    className="t2-journal-img"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.9s ease',
                    }}
                  />
                )}
              </div>

              <div
                style={{
                  fontFamily: 'var(--t2-font-sans)',
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--t2-accent)',
                  marginBottom: 10,
                }}
              >
                {[p.category, formatDate(p.published_at)].filter(Boolean).join(' · ') || 'Journal'}
              </div>

              <h3
                style={{
                  fontFamily: 'var(--t2-font-serif)',
                  fontSize: 'clamp(18px, 1.6vw, 22px)',
                  fontWeight: 400,
                  lineHeight: 1.25,
                  marginBottom: 10,
                  color: 'var(--t2-text)',
                }}
              >
                {p.title}
              </h3>

              {p.excerpt && (
                <p
                  className="t2-body"
                  style={{ fontSize: 14, lineHeight: 1.65, margin: 0 }}
                >
                  {p.excerpt}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .t2-journal-card:hover .t2-journal-img { transform: scale(1.04); }
        @media (max-width: 900px) {
          .t2-journal-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .t2-journal-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

function formatDate(iso?: string | null): string | undefined {
  if (!iso) return undefined
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return undefined
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

// Demo placeholders used when no real posts are returned (e.g. demo agent id).
const DEMO_PLACEHOLDER_POSTS: T2JournalPost[] = [
  {
    slug: 'where-were-sending-clients-now',
    title: 'Where we are sending clients this season',
    excerpt:
      'A short round-up of the destinations our advisors are actively booking — and the lesser-known addresses worth flagging now.',
    cover_image_url: '/media/hotel-programs/belmond-bellini-club/belmond-slider-1-1500.jpg',
    published_at: new Date().toISOString(),
    category: 'Dispatch',
  },
  {
    slug: 'quiet-luxury-on-the-amalfi-coast',
    title: 'Quiet luxury on the Amalfi Coast',
    excerpt:
      'The coastline is busier than ever, but the rooms worth booking are quieter than you think. Here is where we place our clients.',
    cover_image_url: '/media/hero images/four-seasons-taormina-suite-hero.jpg',
    published_at: new Date().toISOString(),
    category: 'Destination',
  },
  {
    slug: 'why-we-only-recommend-three-cruise-lines',
    title: 'Why we only recommend three cruise lines',
    excerpt:
      'Not every fare is created equal. A candid read on the lines we book and, more tellingly, the ones we do not.',
    cover_image_url: '/media/cruises/regent-seven-seas/splendor_suite-1500.jpg',
    published_at: new Date().toISOString(),
    category: 'Advisor Notes',
  },
]
