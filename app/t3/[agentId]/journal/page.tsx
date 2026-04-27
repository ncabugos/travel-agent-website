import Link from 'next/link'
import { getBlogPosts } from '@/lib/blog'
import type { BlogPost } from '@/types/index'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export const metadata = {
  title: 'Journal',
  description: 'Dispatches and field notes from our advisors.',
}

export default async function T3JournalIndexPage({ params }: PageProps) {
  const { agentId } = await params
  const posts = await getBlogPosts(agentId)
  const base = `/t3/${agentId}`

  return (
    <section className="t3-section">
      <div style={{ marginBottom: 56 }}>
        <span className="t3-eyebrow">Journal</span>
        <h1 className="t3-headline-xl" style={{ marginTop: 28, marginBottom: 16 }}>
          Dispatches from the road.
        </h1>
        <p className="t3-body t3-body-lg" style={{ maxWidth: 680 }}>
          Hand-picked destinations, recent openings, and the stories our advisors think worth your time.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="t3-body">
          No journal posts yet. Check back soon.
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 32,
            rowGap: 56,
          }}
          className="t3-journal-index-grid"
        >
          {posts.map((p: BlogPost) => (
            <Link
              key={p.id}
              href={`${base}/journal/${p.slug}`}
              className="t3-journal-card"
              style={{ display: 'flex', flexDirection: 'column', color: 'inherit', textDecoration: 'none' }}
            >
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '4 / 3',
                  overflow: 'hidden',
                  background: 'var(--t3-bg-alt, #f3efe7)',
                  marginBottom: 20,
                }}
              >
                {p.cover_image_url && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={p.cover_image_url}
                    alt={p.title}
                    className="t3-journal-img"
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
                  fontFamily: 'var(--t3-font-body)',
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--t3-accent)',
                  marginBottom: 10,
                }}
              >
                {[p.categories[0], formatDate(p.published_at)].filter(Boolean).join(' · ') || 'Journal'}
              </div>
              <h3 className="t3-headline-md" style={{ marginBottom: 10 }}>
                {p.title}
              </h3>
              {p.excerpt && (
                <p className="t3-body" style={{ fontSize: 14, lineHeight: 1.65, margin: 0 }}>
                  {p.excerpt}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .t3-journal-card:hover .t3-journal-img { transform: scale(1.04); }
        @media (max-width: 900px) { .t3-journal-index-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .t3-journal-index-grid { grid-template-columns: 1fr !important; } }
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
