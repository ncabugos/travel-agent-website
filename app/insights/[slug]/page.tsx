import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { InsightsCard } from '@/components/marketing/InsightsCard'
import { JsonLd } from '@/components/seo/JsonLd'
import { articleGraph } from '@/lib/insights-schema'
import { getPostBySlug, getPublishedPosts, autop, wrapTables, estimateReadMinutes } from '@/lib/marketing-blog'
import { sanitizeRichText } from '@/lib/sanitize-html'
import { withUtm } from '@/lib/analytics'
import {
  BODY_FONT, BODY_STYLE, CHARCOAL, CREAM, DISPLAY_FONT, DIVIDER, GOLD, LABEL_STYLE,
  PRIMARY_CTA_STYLE, SECONDARY_CTA_STYLE, WARM_GRAY, WARM_GRAY_DARK,
} from '@/components/marketing/tokens'

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
  const recommended = related.length ? related : fallback

  const body = wrapTables(autop(sanitizeRichText(post.body_html)))
  const readMin = post.read_minutes || estimateReadMinutes(post.body_html)
  const published = new Date(post.published_at)
  const updated = new Date(post.updated_at)
  const wasUpdated = updated.getTime() - published.getTime() > 1000 * 60 * 60 * 24

  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const fmtShort = (d: Date) => d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const prose: React.CSSProperties = { maxWidth: '760px', margin: '0 auto' }

  return (
    <div className="eah-marketing" style={{ fontFamily: BODY_FONT, color: CHARCOAL, background: '#fff' }}>
      <JsonLd data={articleGraph(post)} />
      <MarketingNav />
      <main>
        <article>
          <header className="eah-container" style={{ padding: '152px 40px 0' }}>
            <div style={prose}>
              <Link href="/insights" className="eah-link" style={{ fontSize: '14px', color: CHARCOAL }}>Insights</Link>
              {post.category?.label && (
                <p style={{ ...LABEL_STYLE, margin: '32px 0 20px' }}>
                  <Link href={`/insights/category/${post.category.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>{post.category.label}</Link>
                </p>
              )}
              <h1 style={{ fontFamily: DISPLAY_FONT, fontSize: 'clamp(34px, 4.5vw, 60px)', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 28px' }}>
                {post.title}
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '6px 16px', fontSize: '14px', color: WARM_GRAY_DARK, paddingBottom: '24px', borderBottom: `1px solid ${DIVIDER}` }}>
                <Link href="/insights/author/nick" style={{ color: CHARCOAL, textDecoration: 'none', fontWeight: 500 }}>{post.author_name}</Link>
                <span style={{ color: WARM_GRAY }}>{post.author_credentials}</span>
                <span>{fmt(published)}</span>
                <span>{readMin} min read</span>
                {wasUpdated && <span style={{ color: WARM_GRAY }}>Updated {fmtShort(updated)}</span>}
              </div>
            </div>
          </header>

          {post.cover_image_url && (
            <div className="eah-container" style={{ padding: '40px 40px 0' }}>
              <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.cover_image_url} alt={post.title} style={{ width: '100%', display: 'block' }} />
              </div>
            </div>
          )}

          <div className="eah-container" style={{ padding: '48px 40px 0' }}>
            <div className="insights-body" style={prose} dangerouslySetInnerHTML={{ __html: body }} />
          </div>

          {post.faq.length > 0 && (
            <section className="eah-container" style={{ padding: '64px 40px 0' }}>
              <div style={prose}>
                <p style={{ ...LABEL_STYLE, marginBottom: '24px' }}>Questions</p>
                <dl style={{ margin: 0, borderTop: `1px solid ${DIVIDER}` }}>
                  {post.faq.map((f, i) => (
                    <div key={i} style={{ padding: '22px 0', borderBottom: `1px solid ${DIVIDER}` }}>
                      <dt style={{ fontSize: '19px', fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1.3, margin: '0 0 10px' }}>{f.q}</dt>
                      <dd style={{ ...BODY_STYLE, fontSize: '16px', margin: 0 }}>{f.a}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>
          )}

          <section className="eah-container" style={{ padding: '72px 40px 0' }}>
            <div style={{ ...prose, background: CREAM, border: `1px solid ${DIVIDER}`, padding: '40px' }}>
              <div aria-hidden style={{ width: '40px', height: '1px', background: GOLD, marginBottom: '24px' }} />
              <h2 style={{ fontFamily: DISPLAY_FONT, fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 12px' }}>A website built for the top 1%.</h2>
              <p style={{ ...BODY_STYLE, marginBottom: '28px', maxWidth: '48ch' }}>
                A custom-branded advisor site on your own domain, with the supplier catalog and curated editorial kept current for you. Live within days.
              </p>
              <div className="eah-post-cta" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href={withUtm('/schedule-consultation', { source: 'insights', medium: 'blog', campaign: 'post_cta', content: post.slug })}
                  data-event="insights_cta_click" data-prop-target="consultation" data-prop-slug={post.slug}
                  className="eah-cta-primary" style={PRIMARY_CTA_STYLE}
                >
                  Request a consultation
                </a>
                <a
                  href={withUtm('/agent-portal/register', { source: 'insights', medium: 'blog', campaign: 'post_cta', content: post.slug })}
                  data-event="insights_cta_click" data-prop-target="register" data-prop-slug={post.slug}
                  className="eah-cta-secondary on-light" style={{ ...SECONDARY_CTA_STYLE, color: CHARCOAL }}
                >
                  Create an advisor account
                </a>
              </div>
            </div>
          </section>
        </article>

        {recommended.length > 0 && (
          <section className="eah-container" style={{ padding: '96px 40px 120px' }}>
            <p style={{ ...LABEL_STYLE, marginBottom: '32px' }}>More from Insights</p>
            <div className="eah-insights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px 40px' }}>
              {recommended.map(p => <InsightsCard key={p.id} post={p} />)}
            </div>
          </section>
        )}
      </main>
      <MarketingFooter />

      <style>{`
        .insights-body { font-size: 18px; line-height: 1.75; color: ${WARM_GRAY_DARK}; }
        .insights-body p { margin: 0 0 22px; }
        .insights-body h2 { font-family: ${DISPLAY_FONT}; font-size: 32px; font-weight: 400; letter-spacing: -0.03em; line-height: 1.15; margin: 48px 0 16px; color: ${CHARCOAL}; }
        .insights-body h3 { font-family: ${DISPLAY_FONT}; font-size: 24px; font-weight: 400; letter-spacing: -0.02em; line-height: 1.25; margin: 36px 0 12px; color: ${CHARCOAL}; }
        .insights-body h4 { font-size: 18px; font-weight: 500; margin: 24px 0 10px; color: ${CHARCOAL}; }
        .insights-body ul, .insights-body ol { padding-left: 24px; margin: 0 0 22px; }
        .insights-body li { margin-bottom: 8px; }
        .insights-body strong { color: ${CHARCOAL}; font-weight: 500; }
        .insights-body a { color: ${CHARCOAL}; text-decoration: underline; text-underline-offset: 4px; text-decoration-color: rgba(26,23,21,0.35); }
        .insights-body a:hover { text-decoration-color: currentColor; }
        .insights-body img { max-width: 100%; height: auto; display: block; margin: 32px 0; }
        .insights-body blockquote { border-left: 1px solid ${GOLD}; padding: 4px 0 4px 24px; margin: 32px 0; color: ${CHARCOAL}; font-size: 20px; line-height: 1.5; }
        .insights-body blockquote.insights-cta { font-size: 16px; line-height: 1.6; color: ${WARM_GRAY_DARK}; background: ${CREAM}; border: 1px solid ${DIVIDER}; border-left: 1px solid ${DIVIDER}; padding: 24px 28px; margin: 36px 0; }
        .insights-body blockquote.insights-cta p { margin: 0 0 10px; }
        .insights-body blockquote.insights-cta p:first-child { font-size: 19px; color: ${CHARCOAL}; }
        .insights-body blockquote.insights-cta p:last-child { margin: 14px 0 0; }
        .insights-body .insights-table-wrap { overflow-x: auto; margin: 32px 0; -webkit-overflow-scrolling: touch; }
        .insights-body table { width: 100%; border-collapse: collapse; margin: 0; font-size: 15px; line-height: 1.5; }
        .insights-body th, .insights-body td { padding: 12px 16px; text-align: left; vertical-align: top; }
        .insights-body td p, .insights-body th p { margin: 0; }
        .insights-body th { background: ${CHARCOAL}; color: #fff; font-weight: 500; }
        .insights-body tbody td { border-bottom: 1px solid ${DIVIDER}; }
        .insights-body tbody tr:nth-child(even) { background: ${CREAM}; }
        .insights-body tbody tr:last-child { background: ${CREAM}; }
        .insights-body tbody tr:last-child td { border-bottom: 1px solid ${CHARCOAL}; color: ${CHARCOAL}; }
        .insights-body tbody tr:last-child td:first-child { font-weight: 500; }
        .insights-body iframe { width: 100%; aspect-ratio: 16 / 9; height: auto; border: 0; margin: 32px 0; }
        .eah-insights-card img { transition: opacity 0.3s ease; }
        .eah-insights-card:hover img { opacity: 0.88; }
        @media (max-width: 900px) { .eah-insights-grid { grid-template-columns: 1fr 1fr !important; gap: 32px 24px !important; } }
        @media (max-width: 640px) {
          .eah-insights-grid { grid-template-columns: 1fr !important; }
          .eah-post-cta a { width: 100%; }
        }
      `}</style>
    </div>
  )
}
