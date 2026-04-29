import Image from 'next/image' // used for hero banner only
import Link from 'next/link'
import { getBlogPosts } from '@/lib/blog'
import { getAgentProfile } from '@/lib/suppliers'
import { getChannelVideos } from '@/lib/youtube'
import { notFound } from 'next/navigation'
import { VideoGrid } from '@/components/journal/VideoGrid'
import { JsonLd, blogSchema, breadcrumbSchema } from '@/components/seo/JsonLd'
import { tenantBase } from '@/lib/tenant-paths'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)
  if (!agent) return { title: 'Journal' }
  const { buildMetadata, getSeoFacts } = await import('@/lib/seo')
  const facts = getSeoFacts(agent)
  const isVirtuoso = (facts.memberOf ?? []).some((m) => m.name === 'Virtuoso')
  return buildMetadata({
    agent,
    title: 'Luxury Travel Journal',
    description: isVirtuoso
      ? `Destination guides, hotel reviews and insider tips from Virtuoso advisors. Curated stories from ${agent.agency_name}.`
      : `Destination guides and travel stories from ${agent.agency_name}.`,
    path: 'blog',
    ogTitle: `The ${agent.agency_name} Journal — Luxury Travel Stories`,
    ogDescription: isVirtuoso
      ? 'First-hand luxury travel insight from Virtuoso advisors: hotel reviews, destination guides, and bespoke itinerary inspiration.'
      : undefined,
  })
}

const serif = 'var(--font-serif)'
const sans  = 'var(--font-sans)'

export default async function BlogPage({ params }: PageProps) {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)
  if (!agent) notFound()

  const [posts, videos] = await Promise.all([
    getBlogPosts(agentId),
    getChannelVideos('edenforyourworld', 9),
  ])

  const base = await tenantBase(agentId)
  const blogJsonLd = [
    blogSchema(agent),
    breadcrumbSchema(agent, [
      { name: 'Home', path: '' },
      { name: 'Journal', path: 'blog' },
    ]),
  ]

  return (
    <main style={{ background: 'var(--cream)' }}>
      <JsonLd data={blogJsonLd} />

      {/* Page Banner */}
      <div style={{ position: 'relative', height: '50vh', minHeight: '340px', overflow: 'hidden' }}>
        <Image
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=2000&q=80"
          alt="Travel journal"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 60%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,18,16,0.6)' }} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px',
        }}>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 300, color: '#FFFFFF', lineHeight: 1.1 }}>
            The Journal
          </h1>
        </div>
      </div>

      {/* ── Video Section ── */}
      <VideoGrid videos={videos} />

      {/* ── Posts Grid ── */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Section header */}
          <div style={{ marginBottom: '56px' }}>
            <p style={{
              fontFamily: sans,
              fontSize: '10px',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: '14px',
            }}>
              Stories &amp; Inspiration
            </p>
            <h2 style={{
              fontFamily: serif,
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              fontWeight: 300,
              color: 'var(--charcoal)',
              marginBottom: '20px',
            }}>
              Latest Posts
            </h2>
            <div style={{ width: '40px', height: '1px', background: 'var(--gold)' }} />
          </div>

          {posts.length === 0 ? (
            <p style={{ fontFamily: sans, fontSize: '16px', color: 'var(--warm-gray)', textAlign: 'center' }}>
              No posts yet — check back soon.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '56px 40px' }}>
              {posts.map(post => (
                <Link
                  key={post.id}
                  href={`${base}/blog/${post.slug}`}
                  className="journal-card"
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <article>
                    {post.cover_image_url && (
                      <div className="journal-card-img" style={{ position: 'relative', paddingBottom: '65%', overflow: 'hidden', marginBottom: '24px' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <p style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '10px' }}>
                      {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <h2 style={{ fontFamily: serif, fontSize: '22px', fontWeight: 400, color: 'var(--charcoal)', lineHeight: 1.3, marginBottom: '12px' }}>
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p style={{ fontFamily: sans, fontSize: '14px', color: 'var(--warm-gray)', lineHeight: '1.7', marginBottom: '16px' }}>
                        {post.excerpt}
                      </p>
                    )}
                    <span style={{
                      fontFamily: sans, fontSize: '10px', letterSpacing: '0.2em',
                      textTransform: 'uppercase', color: 'var(--gold)',
                      borderBottom: '1px solid var(--gold)', paddingBottom: '2px',
                    }}>
                      Read More →
                    </span>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .journal-card-img img {
          transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform;
        }
        .journal-card:hover .journal-card-img img {
          transform: scale(1.05);
        }
      `}</style>

    </main>
  )
}
