import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogPost, getBlogPosts, renderShortcodes } from '@/lib/blog'
import { getAgentProfile } from '@/lib/suppliers'
import type { GalleryImage } from '@/types/index'
import { JsonLd, articleSchema, breadcrumbSchema } from '@/components/seo/JsonLd'
import { tenantBase } from '@/lib/tenant-paths'

interface PageProps {
  params: Promise<{ agentId: string; slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, agentId } = await params
  const [post, agent] = await Promise.all([
    getBlogPost(slug, agentId),
    getAgentProfile(agentId),
  ])
  if (!post || !agent) return {}
  const { buildMetadata } = await import('@/lib/seo')
  // SEO overrides win over the post's own title/excerpt.
  const title = post.seo_title?.trim() || post.title
  const description =
    post.seo_description?.trim() ||
    post.excerpt ||
    `Insight from ${agent.agency_name}, a luxury travel agency.`
  return buildMetadata({
    agent,
    title,
    description,
    path: `blog/${slug}`,
    image: post.cover_image_url ?? undefined,
    imageAlt: post.title,
    ogType: 'article',
  })
}

const serif = 'var(--font-serif)'
const sans  = 'var(--font-sans)'

export default async function BlogPostPage({ params }: PageProps) {
  const { agentId, slug } = await params
  const [post, recentPosts, agent] = await Promise.all([
    getBlogPost(slug, agentId),
    getBlogPosts(agentId),
    getAgentProfile(agentId),
  ])

  if (!post) notFound()

  const base = await tenantBase(agentId)
  const otherPosts = recentPosts.filter(p => p.id !== post.id).slice(0, 4)

  // ── Auto-paragraph: convert \n\n → <p> blocks (like WP's wpautop) ────────
  function autop(html: string): string {
    if (!html) return ''
    // If content already has <p> tags, don't double-wrap
    if (/<p[\s>]/i.test(html)) return html
    // Split on double-newlines to get paragraphs
    return html
      .split(/\n{2,}/)
      .map(block => block.trim())
      .filter(Boolean)
      .map(block => `<p>${block.replace(/\n/g, '<br />')}</p>`)
      .join('\n')
  }

  // Render shortcodes — replace {{tokens}} with real agent data
  const rawBody = agent
    ? renderShortcodes(post.body_html, agent)
    : post.body_html
  const renderedBody = autop(rawBody)

  const gallery: GalleryImage[] = post.gallery_images ?? []

  const articleSchemas = agent
    ? [
        articleSchema(agent, {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          cover_image_url: post.cover_image_url,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          created_at: (post as any).created_at ?? null,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          updated_at: (post as any).updated_at ?? null,
        }),
        breadcrumbSchema(agent, [
          { name: 'Home', path: '' },
          { name: 'Journal', path: 'blog' },
          { name: post.title, path: `blog/${post.slug}` },
        ]),
      ]
    : []

  return (
    <main style={{ background: 'var(--cream)' }}>
      {articleSchemas.length > 0 && <JsonLd data={articleSchemas} />}

      {/* Featured image */}
      {post.cover_image_url && (
        <div style={{ position: 'relative', height: '65vh', minHeight: '400px', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover_image_url}
            alt={post.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 70%, rgba(250,250,245,1) 100%)' }} />
        </div>
      )}

      {/* Article + Sidebar */}
      <div className="post-layout" style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Article */}
        <article>
          <Link
            href={`${base}/blog`}
            style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', textDecoration: 'none', display: 'inline-block', marginBottom: '32px' }}
          >
            ← Back to Journal
          </Link>

          {/* Categories */}
          {post.categories.length > 0 && (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {post.categories.map(cat => (
                <span key={cat} style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', background: 'rgba(181,148,90,0.08)', padding: '4px 10px', borderRadius: '2px' }}>
                  {cat}
                </span>
              ))}
            </div>
          )}

          <p style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px' }}>
            {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1.2, marginBottom: '32px' }}>
            {post.title}
          </h1>
          <div style={{ width: '40px', height: '1px', background: 'var(--gold)', marginBottom: '36px' }} />

          {/* Body HTML with shortcodes rendered */}
          <div
            className="blog-body"
            style={{ fontFamily: sans, fontSize: '16px', color: '#4A4540', lineHeight: '1.95' }}
            dangerouslySetInnerHTML={{ __html: renderedBody }}
          />

          {/* ── Image Gallery ── */}
          {gallery.length > 0 && (
            <div style={{ marginTop: '56px' }}>
              <div style={{ width: '40px', height: '1px', background: 'var(--gold)', marginBottom: '32px' }} />
              <p style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '24px' }}>
                Gallery
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: gallery.length === 1 ? '1fr' : gallery.length === 2 ? '1fr 1fr' : 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '16px',
              }}>
                {gallery.map((img, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ position: 'relative', paddingBottom: gallery.length === 1 ? '50%' : '70%', overflow: 'hidden' }}>
                      <Image
                        src={img.url}
                        alt={img.caption ?? `Gallery image ${i + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
                        className="gallery-img"
                      />
                    </div>
                    {img.caption && (
                      <p style={{ fontFamily: sans, fontSize: '12px', color: 'var(--warm-gray)', fontStyle: 'italic', margin: 0 }}>
                        {img.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <style>{`.gallery-img:hover { transform: scale(1.03); }`}</style>
            </div>
          )}

        </article>

        {/* Sidebar */}
        <aside className="post-sidebar">
          <div>
            <p style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>
              Recent Articles
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {otherPosts.map(p => (
                <Link
                  key={p.id}
                  href={`${base}/blog/${p.slug}`}
                  style={{ textDecoration: 'none', display: 'flex', gap: '14px', alignItems: 'flex-start' }}
                >
                  {p.cover_image_url && (
                    <div style={{ position: 'relative', width: '72px', height: '72px', flexShrink: 0, overflow: 'hidden' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.cover_image_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div>
                    <p style={{ fontFamily: sans, fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '4px' }}>
                      {new Date(p.published_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                    <p style={{ fontFamily: serif, fontSize: '15px', color: 'var(--charcoal)', lineHeight: 1.3 }}>
                      {p.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>

      </div>

      <style>{`
        .post-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 80px;
          align-items: start;
          padding: 60px 24px 100px;
        }
        .post-sidebar { position: sticky; top: 120px; }

        @media (max-width: 900px) {
          .post-layout {
            grid-template-columns: minmax(0, 1fr);
            gap: 56px;
            padding: 40px 20px 64px;
          }
          .post-sidebar { position: static; top: auto; }
        }

        .post-layout article { min-width: 0; }
        .post-layout h1 { overflow-wrap: anywhere; }

        .blog-body p { margin-bottom: 20px; }
        .blog-body ul { list-style-type: disc; padding-left: 28px; margin-bottom: 20px; }
        .blog-body ol { list-style-type: decimal; padding-left: 28px; margin-bottom: 20px; }
        .blog-body li { margin-bottom: 2px; line-height: 1.5; }
        .blog-body img { max-width: 100%; height: auto; margin: 24px 0; }
        .blog-body h2, .blog-body h3 { margin-top: 32px; margin-bottom: 16px; font-family: ${serif}; color: var(--charcoal); }
        .blog-body a { color: var(--gold); text-decoration: underline; }
        .blog-body blockquote { border-left: none; padding: 32px 0; margin: 40px 0; font-family: ${serif}; font-style: italic; font-size: 1.35em; line-height: 1.6; color: var(--charcoal); text-align: center; }
      `}</style>
    </main>
  )
}
