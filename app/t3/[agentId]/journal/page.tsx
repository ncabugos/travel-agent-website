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

  const [featured, ...rest] = posts

  return (
    <section className="t3-section">
      {/* Editor intro */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.4fr',
          gap: 'var(--t3-gap-loose)',
          marginBottom: 'var(--t3-gap-loose)',
          alignItems: 'end',
        }}
        className="t3-journal-header"
      >
        <div>
          <span className="t3-eyebrow t3-eyebrow-plain">Journal</span>
          <h1 className="t3-headline-xl" style={{ marginTop: 28, marginBottom: 0 }}>
            Dispatches from the road.
          </h1>
        </div>
        <div>
          <p className="t3-body t3-body-lg" style={{ maxWidth: 'var(--t3-content-narrow)', margin: 0 }}>
            Notes from recent journeys — opinionated, occasional, and quietly written for travelers who already know what they like.
          </p>
          <p className="t3-body" style={{ marginTop: 16, maxWidth: 'var(--t3-content-narrow)', fontSize: 'clamp(13.5px, 1vw, 14.5px)' }}>
            We publish a handful of pieces a year. Each one is a place we have been to recently, an address worth knowing, or a small observation our advisors think is worth your time.
          </p>
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="t3-body">
          No journal posts yet. Check back soon.
        </p>
      ) : (
        <>
          {/* Featured post — large lead */}
          {featured && (
            <Link
              href={`${base}/journal/${featured.slug}`}
              className="t3-journal-feature t3-journal-card"
              style={{
                display: 'grid',
                gridTemplateColumns: '1.3fr 1fr',
                gap: 'var(--t3-gap)',
                alignItems: 'center',
                color: 'inherit',
                textDecoration: 'none',
                marginBottom: 'var(--t3-gap-loose)',
                paddingBottom: 'var(--t3-gap-loose)',
                borderBottom: '1px solid var(--t3-divider)',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '16 / 11',
                  overflow: 'hidden',
                  background: 'var(--t3-bg-alt, #f3efe7)',
                }}
              >
                {featured.cover_image_url && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={featured.cover_image_url}
                    alt={featured.title}
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
              <div>
                <div
                  style={{
                    fontFamily: 'var(--t3-font-body)',
                    fontSize: 'clamp(10px, 0.85vw, 11px)',
                    fontWeight: 500,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'var(--t3-accent)',
                    marginBottom: 14,
                  }}
                >
                  Featured · {[featured.categories[0], formatDate(featured.published_at)].filter(Boolean).join(' · ')}
                </div>
                <h2 className="t3-headline-lg" style={{ marginBottom: 16, fontSize: 'clamp(28px, 3vw, 40px)' }}>
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="t3-body t3-body-lg" style={{ marginBottom: 24 }}>
                    {featured.excerpt}
                  </p>
                )}
                <span className="t3-link-arrow">
                  Read the dispatch
                  <span className="arrow">→</span>
                </span>
              </div>
            </Link>
          )}

          {/* Remaining posts grid */}
          {rest.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'var(--t3-gap)',
              }}
              className="t3-journal-index-grid"
            >
              {rest.map((p: BlogPost) => (
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
                      fontSize: 'clamp(10px, 0.85vw, 11px)',
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
                    <p className="t3-body" style={{ fontSize: 'clamp(13.5px, 1vw, 14.5px)', lineHeight: 1.65, margin: 0 }}>
                      {p.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      <style>{`
        .t3-journal-card:hover .t3-journal-img { transform: scale(1.04); }
        @media (max-width: 1024px) {
          .t3-journal-header { grid-template-columns: 1fr !important; gap: var(--t3-gap) !important; align-items: start !important; }
          .t3-journal-feature { grid-template-columns: 1fr !important; gap: var(--t3-gap) !important; }
          .t3-journal-index-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .t3-journal-index-grid { grid-template-columns: 1fr !important; gap: var(--t3-gap-tight) !important; }
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
