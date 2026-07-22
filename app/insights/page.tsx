import Link from 'next/link'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { InsightsCard } from '@/components/marketing/InsightsCard'
import { JsonLd } from '@/components/seo/JsonLd'
import { blogGraph } from '@/lib/insights-schema'
import { getPublishedPosts, getFeaturedPost, getCategories } from '@/lib/marketing-blog'

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
  // Featured shows in the hero; don't repeat it in the grid.
  const rest = posts.filter(p => p.id !== featured?.id)

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#111', background: '#fff' }}>
      <JsonLd data={blogGraph()} />
      <MarketingNav />

      {/* Masthead */}
      <section style={{ padding: '128px 24px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <span style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7c3aed', marginBottom: 16 }}>
          Insights
        </span>
        <h1 style={{ fontSize: 'clamp(34px, 5vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 16px', maxWidth: 820 }}>
          The work behind the websites.
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.65, color: '#52525b', margin: 0, maxWidth: 640 }}>
          On luxury-travel advising, advisor websites, SEO and AI search, and building a practice that earns the
          top 1%. Written by people who do the work.
        </p>

        {/* Pillar filters */}
        {categories.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 32 }}>
            <span style={pillActive}>All</span>
            {categories.map(c => (
              <Link key={c.id} href={`/insights/category/${c.slug}`} style={pill}>{c.label}</Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured hero */}
      {featured && (
        <section style={{ padding: '0 24px 8px', maxWidth: 1200, margin: '0 auto' }}>
          <Link href={`/insights/${featured.slug}`} className="eah-insights-feature" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 0, borderRadius: 20, overflow: 'hidden', border: '1px solid #ececec', textDecoration: 'none', color: '#0a0a0a', background: '#fff' }}>
            <div style={{ position: 'relative', minHeight: 360, background: '#f4f4f4' }}>
              {featured.cover_image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={featured.cover_image_url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
            <div style={{ padding: '40px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7c3aed' }}>
                Featured{featured.category?.label ? ` · ${featured.category.label}` : ''}
              </span>
              <h2 style={{ margin: 0, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{featured.title}</h2>
              {featured.excerpt && <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: '#52525b' }}>{featured.excerpt}</p>}
              <span style={{ fontSize: 14, color: '#7c3aed', fontWeight: 600 }}>Read the article →</span>
            </div>
          </Link>
        </section>
      )}

      {/* Grid */}
      <section style={{ padding: '48px 24px 100px', maxWidth: 1200, margin: '0 auto' }}>
        {rest.length === 0 && !featured ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#71717a' }}>
            <p style={{ fontSize: 18, margin: 0 }}>The first Insights articles are on the way.</p>
            <Link href="/#pricing" style={{ display: 'inline-block', marginTop: 16, color: '#7c3aed', fontWeight: 600, textDecoration: 'none' }}>
              Explore Elite Advisor Hub →
            </Link>
          </div>
        ) : (
          <div className="eah-insights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {rest.map(p => <InsightsCard key={p.id} post={p} />)}
          </div>
        )}
      </section>

      <MarketingFooter />

      <style>{`
        .eah-insights-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px -12px rgba(0,0,0,0.15); border-color: rgba(124,58,237,0.25) !important; }
        .eah-insights-feature:hover { box-shadow: 0 16px 40px -16px rgba(0,0,0,0.18); }
        @media (max-width: 900px) {
          .eah-insights-grid { grid-template-columns: 1fr 1fr !important; }
          .eah-insights-feature { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .eah-insights-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

const pill: React.CSSProperties = { padding: '7px 16px', borderRadius: 999, border: '1px solid #e5e7eb', fontSize: 13, fontWeight: 500, color: '#374151', textDecoration: 'none', background: '#fff' }
const pillActive: React.CSSProperties = { ...pill, background: '#1a1a1a', color: '#fff', borderColor: '#1a1a1a' }
