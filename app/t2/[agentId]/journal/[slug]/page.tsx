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

export default async function T2JournalPostPage({ params }: PageProps) {
  const { agentId, slug } = await params
  const [post, recentPosts, agent] = await Promise.all([
    getBlogPost(slug, agentId),
    getBlogPosts(agentId),
    getAgentProfile(agentId),
  ])

  if (!post) notFound()

  const base = `/t2/${agentId}`
  const otherPosts = recentPosts.filter(p => p.id !== post.id).slice(0, 4)

  const rawBody = agent ? renderShortcodes(post.body_html, agent) : post.body_html
  const renderedBody = autop(rawBody)
  const gallery: GalleryImage[] = post.gallery_images ?? []

  return (
    <main style={{ background: 'var(--t2-bg)' }}>
      {post.cover_image_url && (
        <div style={{ position: 'relative', height: '60vh', minHeight: 360, overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover_image_url}
            alt={post.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 70%, var(--t2-bg) 100%)' }} />
        </div>
      )}

      <div
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '60px 24px 100px',
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: 72,
          alignItems: 'start',
        }}
        className="t2-journal-layout"
      >
        <article>
          <Link
            href={`${base}/journal`}
            className="t2-label"
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
                    fontFamily: 'var(--t2-font-sans)',
                    fontSize: 9,
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: 'var(--t2-accent)',
                    background: 'rgba(154,133,96,0.1)',
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
              fontFamily: 'var(--t2-font-sans)',
              fontSize: 10,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--t2-accent)',
              marginBottom: 16,
            }}
          >
            {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <h1
            style={{
              fontFamily: 'var(--t2-font-serif)',
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 400,
              color: 'var(--t2-text)',
              lineHeight: 1.2,
              marginBottom: 32,
            }}
          >
            {post.title}
          </h1>
          <div style={{ width: 40, height: 1, background: 'var(--t2-accent)', marginBottom: 36 }} />

          <div
            className="t2-blog-body"
            style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 16, color: 'var(--t2-text)', lineHeight: 1.9 }}
            dangerouslySetInnerHTML={{ __html: renderedBody }}
          />

          {gallery.length > 0 && (
            <div style={{ marginTop: 56 }}>
              <div style={{ width: 40, height: 1, background: 'var(--t2-accent)', marginBottom: 32 }} />
              <p
                style={{
                  fontFamily: 'var(--t2-font-sans)',
                  fontSize: 10,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'var(--t2-accent)',
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
                      <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 12, color: 'var(--t2-text-muted)', fontStyle: 'italic', margin: 0 }}>
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
              fontFamily: 'var(--t2-font-sans)',
              fontSize: 9,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--t2-accent)',
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
                      fontFamily: 'var(--t2-font-sans)',
                      fontSize: 9,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'var(--t2-accent)',
                      marginBottom: 4,
                    }}
                  >
                    {new Date(p.published_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                  <p style={{ fontFamily: 'var(--t2-font-serif)', fontSize: 15, color: 'var(--t2-text)', lineHeight: 1.3 }}>
                    {p.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>

      <style>{`
        .t2-blog-body p { margin-bottom: 20px; }
        .t2-blog-body ul { list-style-type: disc; padding-left: 28px; margin-bottom: 20px; }
        .t2-blog-body ol { list-style-type: decimal; padding-left: 28px; margin-bottom: 20px; }
        .t2-blog-body li { margin-bottom: 2px; line-height: 1.5; }
        .t2-blog-body img { max-width: 100%; height: auto; margin: 24px 0; }
        .t2-blog-body h2, .t2-blog-body h3 { margin-top: 32px; margin-bottom: 16px; font-family: var(--t2-font-serif); color: var(--t2-text); }
        .t2-blog-body a { color: var(--t2-accent); text-decoration: underline; }
        .t2-blog-body blockquote { padding: 32px 0; margin: 40px 0; font-family: var(--t2-font-serif); font-style: italic; font-size: 1.35em; line-height: 1.6; color: var(--t2-text); text-align: center; }
        @media (max-width: 900px) {
          .t2-journal-layout { grid-template-columns: 1fr !important; gap: 48px !important; }
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
