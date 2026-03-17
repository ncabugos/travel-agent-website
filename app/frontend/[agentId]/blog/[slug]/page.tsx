import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogPost, getBlogPosts } from '@/lib/blog'

interface PageProps {
  params: Promise<{ agentId: string; slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, agentId } = await params
  const post = await getBlogPost(slug, agentId)
  return post
    ? { title: post.title, description: post.excerpt }
    : {}
}

const serif = 'var(--font-serif)'
const sans  = 'var(--font-sans)'

export default async function BlogPostPage({ params }: PageProps) {
  const { agentId, slug } = await params
  const [post, recentPosts] = await Promise.all([
    getBlogPost(slug, agentId),
    getBlogPosts(agentId),
  ])

  if (!post) notFound()

  const base = `/frontend/${agentId}`
  const otherPosts = recentPosts.filter(p => p.id !== post.id).slice(0, 4)

  return (
    <main style={{ background: 'var(--cream)' }}>

      {/* Featured image */}
      {post.cover_image_url && (
        <div style={{ position: 'relative', height: '65vh', minHeight: '400px', overflow: 'hidden' }}>
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(250,250,245,1) 100%)' }} />
        </div>
      )}

      {/* Article + Sidebar */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px 100px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '80px', alignItems: 'start' }}>

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

          {/* Body HTML */}
          <div
            className="blog-body"
            style={{ fontFamily: sans, fontSize: '16px', color: '#4A4540', lineHeight: '1.95' }}
            dangerouslySetInnerHTML={{ __html: post.body_html }}
          />
        </article>

        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: '120px' }}>
          {/* Recent Posts */}
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
                      <Image src={p.cover_image_url} alt={p.title} fill sizes="72px" style={{ objectFit: 'cover' }} />
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
        .blog-body p { margin-bottom: 20px; }
        .blog-body img { max-width: 100%; height: auto; margin: 24px 0; }
        .blog-body h2, .blog-body h3 { margin-top: 32px; margin-bottom: 16px; font-family: ${serif}; color: var(--charcoal); }
        .blog-body a { color: var(--gold); text-decoration: underline; }
        .blog-body blockquote { border-left: 3px solid var(--gold); padding-left: 20px; margin: 24px 0; font-style: italic; color: var(--warm-gray); }
      `}</style>
    </main>
  )
}
