import Link from 'next/link'

export interface T3JournalPost {
  slug: string
  title: string
  excerpt?: string | null
  cover_image_url?: string | null
  published_at?: string | null
  category?: string | null
}

interface T3JournalTeaserProps {
  agentId: string
  posts: T3JournalPost[]
  eyebrow?: string
  heading?: string
  subheading?: string
  limit?: number
  allPostsHref?: string
}

/**
 * Three-up journal teaser for Meridian (T3). Editorial grid with one large
 * lead card + two smaller secondary cards. Falls back to placeholder
 * content for demo agents. Companion to T2JournalTeaser.
 */
export function T3JournalTeaser({
  agentId,
  posts,
  eyebrow = 'Journal',
  heading = 'Dispatches from the road.',
  subheading = 'Hand-picked destinations, recent openings, and the stories our advisors think worth your time.',
  limit = 3,
  allPostsHref,
}: T3JournalTeaserProps) {
  const base = `/t3/${agentId}`
  const items = posts.slice(0, limit)
  const displayItems: T3JournalPost[] =
    items.length > 0 ? items : DEMO_PLACEHOLDER_POSTS.slice(0, limit)

  const [lead, ...secondary] = displayItems

  return (
    <section className="t3-section">
      {/* Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 32,
          alignItems: 'end',
          marginBottom: 56,
        }}
        className="t3-journal-header"
      >
        <div style={{ maxWidth: 680 }}>
          <span className="t3-eyebrow">{eyebrow}</span>
          <h2 className="t3-headline-xl" style={{ marginTop: 28 }}>
            {heading}
          </h2>
          {subheading && (
            <p className="t3-body t3-body-lg" style={{ marginTop: 24 }}>
              {subheading}
            </p>
          )}
        </div>
        <Link
          href={allPostsHref ?? `${base}/journal`}
          className="t3-link-arrow"
        >
          All Posts
          <span className="arrow">→</span>
        </Link>
      </div>

      {/* Editorial grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: 48,
        }}
        className="t3-journal-grid"
      >
        {/* Lead card */}
        <JournalCard post={lead} base={base} size="lead" />

        {/* Stacked secondary cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {secondary.map((p) => (
            <JournalCard key={p.slug} post={p} base={base} size="secondary" />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .t3-journal-header { grid-template-columns: 1fr !important; gap: 24px !important; }
          .t3-journal-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

function JournalCard({
  post,
  base,
  size,
}: {
  post: T3JournalPost
  base: string
  size: 'lead' | 'secondary'
}) {
  const href = `${base}/journal/${post.slug}`

  if (size === 'lead') {
    return (
      <Link
        href={href}
        className="t3-journal-card"
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
            background: 'var(--t3-bg-alt)',
            marginBottom: 28,
          }}
        >
          {post.cover_image_url && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="t3-journal-img"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.9s var(--t3-ease-out)',
              }}
            />
          )}
        </div>
        <CardMeta category={post.category} date={post.published_at} />
        <h3
          className="t3-headline-lg"
          style={{ marginTop: 12, marginBottom: 16, fontSize: 'clamp(24px, 2.4vw, 32px)' }}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="t3-body" style={{ margin: 0 }}>
            {post.excerpt}
          </p>
        )}
      </Link>
    )
  }

  // secondary
  return (
    <Link
      href={href}
      className="t3-journal-card"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        gap: 20,
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
      <div
        style={{
          position: 'relative',
          aspectRatio: '4 / 3',
          overflow: 'hidden',
          background: 'var(--t3-bg-alt)',
        }}
      >
        {post.cover_image_url && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="t3-journal-img"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.9s var(--t3-ease-out)',
            }}
          />
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <CardMeta category={post.category} date={post.published_at} />
        <h3
          className="t3-headline-md"
          style={{ marginTop: 10, marginBottom: 8, fontSize: 'clamp(17px, 1.5vw, 20px)' }}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="t3-body" style={{ fontSize: 13.5, lineHeight: 1.55, margin: 0 }}>
            {post.excerpt.length > 120 ? post.excerpt.slice(0, 117).trimEnd() + '…' : post.excerpt}
          </p>
        )}
      </div>
    </Link>
  )
}

function CardMeta({ category, date }: { category?: string | null; date?: string | null }) {
  const parts = [category, formatDate(date)].filter(Boolean)
  if (parts.length === 0) return null
  return (
    <div
      style={{
        fontFamily: 'var(--t3-font-body)',
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'var(--t3-accent)',
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

const DEMO_PLACEHOLDER_POSTS: T3JournalPost[] = [
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
      'The coastline is busier than ever, but the rooms worth booking are quieter than you think.',
    cover_image_url: '/media/hero images/four-seasons-taormina-suite-hero.jpg',
    published_at: new Date().toISOString(),
    category: 'Destination',
  },
  {
    slug: 'why-we-only-recommend-three-cruise-lines',
    title: 'Why we only recommend three cruise lines',
    excerpt:
      'Not every fare is created equal. A candid read on the lines we book and the ones we do not.',
    cover_image_url: '/media/cruises/regent-seven-seas/splendor_suite-1500.jpg',
    published_at: new Date().toISOString(),
    category: 'Advisor Notes',
  },
]
