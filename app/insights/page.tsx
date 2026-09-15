import Link from 'next/link'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { InsightsCard } from '@/components/marketing/InsightsCard'
import { InsightsFilters } from '@/components/marketing/InsightsFilters'
import { JsonLd } from '@/components/seo/JsonLd'
import { blogGraph } from '@/lib/insights-schema'
import { getPublishedPosts, getFeaturedPost, getCategories } from '@/lib/marketing-blog'
import { BODY_FONT, BODY_STYLE, CHARCOAL, DISPLAY_FONT, DIVIDER, LABEL_STYLE, WARM_GRAY } from '@/components/marketing/tokens'

export const metadata = {
  title: 'Insights — Elite Advisor Hub',
  description:
    'On luxury-travel advising, advisor websites, and building a practice that earns the top 1%. Written by a working advisor and the founder of Elite Advisor Hub.',
  alternates: { canonical: '/insights', types: { 'application/rss+xml': '/insights/rss.xml' } },
}

export const revalidate = 3600

export default async function InsightsIndexPage() {
  const [featured, posts, categories] = await Promise.all([
    getFeaturedPost(),
    getPublishedPosts(),
    getCategories(),
  ])
  const rest = posts.filter(p => p.id !== featured?.id)

  return (
    <div className="eah-marketing" style={{ fontFamily: BODY_FONT, color: CHARCOAL, background: '#fff' }}>
      <JsonLd data={blogGraph()} />
      <MarketingNav />
      <main>
        <section style={{ padding: '176px 0 48px' }}>
          <div className="eah-container">
            <p style={{ ...LABEL_STYLE, marginBottom: '24px' }}>Insights</p>
            <h1 style={{ fontFamily: DISPLAY_FONT, fontSize: 'clamp(40px, 5.6vw, 80px)', fontWeight: 300, letterSpacing: '-0.035em', lineHeight: 1.0, margin: '0 0 24px', maxWidth: '14ch' }}>
              The work behind the websites.
            </h1>
            <p style={{ ...BODY_STYLE, fontSize: '19px', maxWidth: '52ch' }}>
              On luxury-travel advising, advisor websites, SEO and AI search, and building a practice that earns the top 1%. Written by people who do the work.
            </p>
            <InsightsFilters categories={categories} />
          </div>
        </section>

        {featured && (
          <section style={{ padding: '0 0 24px' }}>
            <div className="eah-container">
              <Link href={`/insights/${featured.slug}`} className="eah-insights-feature" style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '48px', alignItems: 'center', padding: '48px 0', borderBottom: `1px solid ${DIVIDER}`, textDecoration: 'none', color: CHARCOAL }}>
                <div style={{ position: 'relative', aspectRatio: '16 / 10', background: DIVIDER, overflow: 'hidden' }}>
                  {featured.cover_image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={featured.cover_image_url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
                <div>
                  <p style={{ ...LABEL_STYLE, marginBottom: '16px' }}>
                    Featured{featured.category?.label ? ` · ${featured.category.label}` : ''}
                  </p>
                  <h2 style={{ fontFamily: DISPLAY_FONT, fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 16px' }}>{featured.title}</h2>
                  {featured.excerpt && <p style={{ ...BODY_STYLE, marginBottom: '20px', maxWidth: '48ch' }}>{featured.excerpt}</p>}
                  <span className="eah-link" style={{ fontSize: '15px' }}>Read the article</span>
                </div>
              </Link>
            </div>
          </section>
        )}

        <section style={{ padding: '24px 0 120px' }}>
          <div className="eah-container">
            {rest.length === 0 && !featured ? (
              <p style={{ ...BODY_STYLE, padding: '40px 0' }}>
                The first Insights articles are on the way.{' '}
                <Link href="/schedule-consultation" className="eah-link" style={{ color: CHARCOAL }}>Schedule a consultation</Link>
              </p>
            ) : (
              <div className="eah-insights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px 40px' }}>
                {rest.map(p => <InsightsCard key={p.id} post={p} />)}
              </div>
            )}
            {rest.length === 0 && featured && <p style={{ fontSize: '14px', color: WARM_GRAY, margin: 0 }}>More articles are on the way.</p>}
          </div>
        </section>
      </main>
      <MarketingFooter />

      <style>{`
        .eah-insights-feature img { transition: opacity 0.3s ease; }
        .eah-insights-feature:hover img { opacity: 0.9; }
        .eah-insights-card img { transition: opacity 0.3s ease; }
        .eah-insights-card:hover img { opacity: 0.88; }
        @media (max-width: 900px) {
          .eah-insights-grid { grid-template-columns: 1fr 1fr !important; gap: 32px 24px !important; }
          .eah-insights-feature { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
        @media (max-width: 600px) { .eah-insights-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
