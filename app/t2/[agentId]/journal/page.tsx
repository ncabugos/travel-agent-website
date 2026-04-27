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

export default async function T2JournalIndexPage({ params }: PageProps) {
  const { agentId } = await params
  const posts = await getBlogPosts(agentId)
  const base = `/t2/${agentId}`

  return (
    <section style={{ padding: 'var(--t2-section-pad) 48px', background: 'var(--t2-bg)' }}>
      <div style={{ maxWidth: 'var(--t2-content-max, 1280px)', margin: '0 auto' }}>
        <div style={{ marginBottom: 56 }}>
          <p className="t2-label" style={{ marginBottom: 16 }}>Journal</p>
          <h1 className="t2-heading t2-heading-xl" style={{ marginBottom: 16 }}>
            Dispatches from the road.
          </h1>
          <p className="t2-body" style={{ maxWidth: 640 }}>
            Hand-picked destinations, recent openings, and the stories our advisors think worth your time.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="t2-body" style={{ color: 'var(--t2-text-muted)' }}>
            No journal posts yet. Check back soon.
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
              rowGap: 56,
            }}
            className="t2-journal-index-grid"
          >
            {posts.map((p: BlogPost) => (
              <Link
                key={p.id}
                href={`${base}/journal/${p.slug}`}
                className="t2-journal-card"
                style={{ display: 'flex', flexDirection: 'column', color: 'inherit', textDecoration: 'none' }}
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
                  {[p.categories[0], formatDate(p.published_at)].filter(Boolean).join(' · ') || 'Journal'}
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
                  <p className="t2-body" style={{ fontSize: 14, lineHeight: 1.65, margin: 0 }}>
                    {p.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .t2-journal-card:hover .t2-journal-img { transform: scale(1.04); }
        @media (max-width: 900px) { .t2-journal-index-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .t2-journal-index-grid { grid-template-columns: 1fr !important; } }
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
