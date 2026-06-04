import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { JsonLd } from '@/components/seo/JsonLd'
import { articleGraph } from '@/lib/insights-schema'
import { getPostBySlug, getPublishedPosts, autop, estimateReadMinutes } from '@/lib/marketing-blog'
import { withUtm } from '@/lib/analytics'

interface PageProps { params: Promise<{ slug: string }> }

export const revalidate = 3600

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  const title = post.seo_title?.trim() || post.title
  const description = post.seo_description?.trim() || post.excerpt || undefined
  const image = post.og_image_url || post.cover_image_url || undefined
  return {
    title,
    description,
    alternates: { canonical: `/insights/${slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/insights/${slug}`,
      images: image ? [{ url: image, alt: post.title }] : undefined,
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: [post.author_name],
    },
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : undefined },
  }
}

export default async function InsightsPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const all = await getPublishedPosts()
  const related = all
    .filter(p => p.id !== post.id && (!post.category_id || p.category_id === post.category_id))
    .slice(0, 3)
  const fallback = all.filter(p => p.id !== post.id).slice(0, 3)
  const recommended = (related.length ? related : fallback)

  const body = autop(post.body_html)
  const readMin = post.read_minutes || estimateReadMinutes(post.body_html)
  const published = new Date(post.published_at)
  const updated = new Date(post.updated_at)
  const wasUpdated = updated.getTime() - published.getTime() > 1000 * 60 * 60 * 24

  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const fmtShort = (d: Date) => d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#111', background: '#fff' }}>
      <JsonLd data={articleGraph(post)} />
      <MarketingNav />

      {/* Header */}
      <article style={{ maxWidth: 760, margin: '0 auto', padding: '120px 24px 0' }}>
        <Link href="/insights" style={{ fontSize: 13, color: '#7c3aed', textDecoration: 'none', fontWeight: 600 }}>← Insights</Link>
        {post.category?.label && (
          <div style={{ marginTop: 24 }}>
            <Link href={`/insights/category/${post.category.slug}`} style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7c3aed', textDecoration: 'none' }}>
              {post.category.label}
            </Link>
          </div>
        )}
        <h1 style={{ fontSize: 'clamp(30px, 4.5vw, 46px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.12, margin: '14px 0 20px' }}>
          {post.title}
        </h1>

        {/* Byline */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 14px', fontSize: 14, color: '#52525b', paddingBottom: 28, borderBottom: '1px solid #ececec' }}>
          <Link href="/insights/author/nick" style={{ fontWeight: 600, color: '#0a0a0a', textDecoration: 'none' }}>{post.author_name}</Link>
          <span style={{ color: '#9ca3af' }}>{post.author_credentials}</span>
          <span style={{ color: '#d4d4d8' }}>·</span>
          <span>{fmt(published)}</span>
          <span style={{ color: '#d4d4d8' }}>·</span>
          <span>{readMin} min read</span>
          {wasUpdated && <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Updated {fmtShort(updated)}</span>}
        </div>
      </article>

      {/* Cover */}
      {post.cover_image_url && (
        <div style={{ maxWidth: 980, margin: '36px auto 0', padding: '0 24px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover_image_url} alt={post.title} style={{ width: '100%', borderRadius: 16, display: 'block' }} />
        </div>
      )}

      {/* Body */}
      <div className="insights-body" style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 0' }}
        dangerouslySetInnerHTML={{ __html: body }} />

      {/* FAQ */}
      {post.faq.length > 0 && (
        <section style={{ maxWidth: 760, margin: '56px auto 0', padding: '0 24px' }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 24px' }}>Frequently asked questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {post.faq.map((f, i) => (
              <details key={i} style={{ borderTop: '1px solid #ececec', padding: '18px 0' }}>
                <summary style={{ fontSize: 17, fontWeight: 600, cursor: 'pointer', listStyle: 'none', color: '#0a0a0a' }}>{f.q}</summary>
                <p style={{ margin: '12px 0 0', fontSize: 16, lineHeight: 1.7, color: '#3f3f46' }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ maxWidth: 760, margin: '64px auto 0', padding: '0 24px' }}>
        <div style={{ background: 'linear-gradient(135deg, #faf5ff, #f5f3ff)', border: '1px solid #ede9fe', borderRadius: 20, padding: '40px 36px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 10px' }}>A website built for the top 1%.</h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: '#52525b', margin: '0 auto 24px', maxWidth: 480 }}>
            Elite Advisor Hub gives independent luxury advisors a Virtuoso-grade site in days — supplier catalog, curated editorial, and zero tech burden.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={withUtm('/beta', { source: 'insights', medium: 'blog', campaign: 'post_cta', content: post.slug })}
              data-event="insights_cta_click" data-prop-target="beta" data-prop-slug={post.slug}
              style={{ padding: '13px 28px', background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', color: '#fff', borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}
            >
              Join the waitlist
            </a>
            <a
              href={withUtm('/schedule-consultation', { source: 'insights', medium: 'blog', campaign: 'post_cta', content: post.slug })}
              data-event="insights_cta_click" data-prop-target="consultation" data-prop-slug={post.slug}
              style={{ padding: '13px 28px', background: '#fff', color: '#111', border: '1px solid #d1d5db', borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}
            >
              Schedule a consultation
            </a>
          </div>
        </div>
      </section>

      {/* Related */}
      {recommended.length > 0 && (
        <section style={{ maxWidth: 1200, margin: '80px auto 0', padding: '0 24px 100px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 24px' }}>More from Insights</h2>
          <div className="eah-insights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {recommended.map(p => (
              <Link key={p.id} href={`/insights/${p.slug}`} className="eah-insights-card" style={{ display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #ececec', textDecoration: 'none', color: '#0a0a0a', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
                <div style={{ position: 'relative', aspectRatio: '16 / 10', background: '#f4f4f4' }}>
                  {p.cover_image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.cover_image_url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
                <div style={{ padding: '18px 20px 22px' }}>
                  {p.category?.label && <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7c3aed' }}>{p.category.label}</span>}
                  <h3 style={{ margin: '8px 0 0', fontSize: 17, fontWeight: 600, lineHeight: 1.3 }}>{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <MarketingFooter />

      <style>{`
        .insights-body { font-size: 18px; line-height: 1.8; color: #27272a; }
        .insights-body p { margin: 0 0 22px; }
        .insights-body h2 { font-size: 28px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.25; margin: 44px 0 16px; color: #0a0a0a; }
        .insights-body h3 { font-size: 22px; font-weight: 600; line-height: 1.3; margin: 32px 0 12px; color: #0a0a0a; }
        .insights-body h4 { font-size: 18px; font-weight: 600; margin: 24px 0 10px; color: #0a0a0a; }
        .insights-body ul, .insights-body ol { padding-left: 24px; margin: 0 0 22px; }
        .insights-body li { margin-bottom: 8px; }
        .insights-body a { color: #7c3aed; text-decoration: underline; }
        .insights-body img { max-width: 100%; height: auto; border-radius: 12px; margin: 28px 0; }
        .insights-body blockquote { border-left: 3px solid #7c3aed; padding: 4px 0 4px 22px; margin: 28px 0; font-style: italic; color: #3f3f46; font-size: 20px; }
        .insights-body table { width: 100%; border-collapse: collapse; margin: 28px 0; font-size: 15px; }
        .insights-body th, .insights-body td { border: 1px solid #e5e7eb; padding: 10px 14px; text-align: left; }
        .insights-body th { background: #faf5ff; font-weight: 600; }
        .insights-body iframe { width: 100%; aspect-ratio: 16 / 9; height: auto; border: 0; border-radius: 12px; margin: 28px 0; }
        .eah-insights-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px -12px rgba(0,0,0,0.15); }
        details > summary::-webkit-details-marker { display: none; }
        @media (max-width: 900px) { .eah-insights-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .eah-insights-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
