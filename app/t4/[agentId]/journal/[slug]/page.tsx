import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getBlogPost, getBlogPosts, renderShortcodes } from '@/lib/blog'
import { getAgentProfile } from '@/lib/suppliers'
import type { GalleryImage } from '@/types/index'

interface PageProps {
  params: Promise<{ agentId: string; slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, agentId } = await params
  const post = await getBlogPost(slug, agentId)
  return post ? { title: post.title, description: post.excerpt } : {}
}

export default async function T4JournalPostPage({ params }: PageProps) {
  const { agentId, slug } = await params
  const [post, recentPosts, agent] = await Promise.all([
    getBlogPost(slug, agentId),
    getBlogPosts(agentId),
    getAgentProfile(agentId),
  ])

  if (!post) notFound()

  const base = `/t4/${agentId}`
  const otherPosts = recentPosts.filter(p => p.id !== post.id).slice(0, 4)

  const rawBody = agent ? renderShortcodes(post.body_html, agent) : post.body_html
  const renderedBody = autop(rawBody)
  const gallery: GalleryImage[] = post.gallery_images ?? []

  return (
    <main style={{ background: 'var(--t4-bg)' }}>
      {post.cover_image_url && (
        <div style={{ position: 'relative', height: '65vh', minHeight: 420, overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover_image_url}
            alt={post.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 70%, var(--t4-bg) 100%)' }} />
        </div>
      )}

      <div
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '72px 24px 120px',
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: 80,
          alignItems: 'start',
        }}
        className="t4-journal-layout"
      >
        <article>
          <Link
            href={`${base}/journal`}
            className="t4-eyebrow"
            style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 32 }}
          >
            ← Journal
          </Link>

          {post.categories.length > 0 && (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
              {post.categories.map(cat => (
                <span
                  key={cat}
                  style={{
                    fontFamily: 'var(--t4-font-body)',
                    fontSize: 9,
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: 'var(--t4-accent)',
                    background: 'rgba(0,0,0,0.04)',
                    padding: '4px 10px',
                  }}
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

          <p
            style={{
              fontFamily: 'var(--t4-font-body)',
              fontSize: 10,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--t4-accent)',
              marginBottom: 16,
            }}
          >
            {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <h1 className="t4-headline-xl" style={{ marginBottom: 28 }}>
            {post.title}
          </h1>
          <div style={{ width: 40, height: 1, background: 'var(--t4-accent)', marginBottom: 40 }} />

          <div
            className="t4-blog-body"
            style={{ fontFamily: 'var(--t4-font-body)', fontSize: 17, color: 'var(--t4-text)', lineHeight: 1.9 }}
            dangerouslySetInnerHTML={{ __html: renderedBody }}
          />

          {gallery.length > 0 && (
            <div style={{ marginTop: 64 }}>
              <div style={{ width: 40, height: 1, background: 'var(--t4-accent)', marginBottom: 32 }} />
              <p
                style={{
                  fontFamily: 'var(--t4-font-body)',
                  fontSize: 10,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'var(--t4-accent)',
                  marginBottom: 24,
                }}
              >
                Gallery
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: gallery.length === 1 ? '1fr' : gallery.length === 2 ? '1fr 1fr' : 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: 16,
                }}
              >
                {gallery.map((img, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ position: 'relative', paddingBottom: gallery.length === 1 ? '50%' : '70%', overflow: 'hidden' }}>
                      <Image
                        src={img.url}
                        alt={img.caption ?? `Gallery image ${i + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: 'cover' }}
                        unoptimized
                      />
                    </div>
                    {img.caption && (
                      <p style={{ fontFamily: 'var(--t4-font-body)', fontSize: 12, color: 'var(--t4-text-muted)', fontStyle: 'italic', margin: 0 }}>
                        {img.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        <aside style={{ position: 'sticky', top: 120 }}>
          <p
            style={{
              fontFamily: 'var(--t4-font-body)',
              fontSize: 9,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--t4-accent)',
              marginBottom: 20,
            }}
          >
            Recent
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {otherPosts.map(p => (
              <Link
                key={p.id}
                href={`${base}/journal/${p.slug}`}
                style={{ textDecoration: 'none', display: 'flex', gap: 14, alignItems: 'flex-start' }}
              >
                {p.cover_image_url && (
                  <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0, overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.cover_image_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div>
                  <p
                    style={{
                      fontFamily: 'var(--t4-font-body)',
                      fontSize: 9,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'var(--t4-accent)',
                      marginBottom: 4,
                    }}
                  >
                    {new Date(p.published_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                  <p className="t4-headline-sm" style={{ lineHeight: 1.3 }}>
                    {p.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>

      <style>{`
        .t4-blog-body p { margin-bottom: 22px; }
        .t4-blog-body ul { list-style-type: disc; padding-left: 28px; margin-bottom: 22px; }
        .t4-blog-body ol { list-style-type: decimal; padding-left: 28px; margin-bottom: 22px; }
        .t4-blog-body li { margin-bottom: 4px; line-height: 1.6; }
        .t4-blog-body img { max-width: 100%; height: auto; margin: 28px 0; }
        .t4-blog-body h2, .t4-blog-body h3 { margin-top: 36px; margin-bottom: 16px; color: var(--t4-text); font-family: var(--t4-font-display); }
        .t4-blog-body a { color: var(--t4-accent); text-decoration: underline; }
        .t4-blog-body blockquote { padding: 36px 0; margin: 44px 0; font-family: var(--t4-font-display); font-style: italic; font-size: 1.4em; line-height: 1.55; color: var(--t4-text); text-align: center; }
        @media (max-width: 900px) {
          .t4-journal-layout { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </main>
  )
}

function autop(html: string): string {
  if (!html) return ''
  if (/<p[\s>]/i.test(html)) return html
  return html
    .split(/\n{2,}/)
    .map(block => block.trim())
    .filter(Boolean)
    .map(block => `<p>${block.replace(/\n/g, '<br />')}</p>`)
    .join('\n')
}
