import Link from 'next/link'
import { InsightsCard } from '@/components/marketing/InsightsCard'
import { getPublishedPosts } from '@/lib/marketing-blog'

/**
 * Homepage "Insights" module — latest 3 published posts from the EAH company blog.
 * Distinct from MarketingCuratedEditorial (which sells the advisor-content PRODUCT);
 * this is EAH's own thought leadership. Renders nothing until posts exist, so the
 * homepage never shows an empty section pre-launch.
 */
export async function MarketingInsightsTeaser() {
  const posts = await getPublishedPosts(3)
  if (posts.length === 0) return null

  return (
    <section style={{ padding: '100px 24px', background: '#fafafa', borderTop: '1px solid #f0f0f0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', marginBottom: 48 }}>
          <div style={{ maxWidth: 640 }}>
            <span style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7c3aed', marginBottom: 16 }}>
              Insights
            </span>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 16px', color: '#0a0a0a' }}>
              The work behind the websites.
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: '#52525b', margin: 0 }}>
              On luxury-travel advising, advisor websites, and building a practice that earns the top 1% —
              written by people who do the work.
            </p>
          </div>
          <Link href="/insights" style={{ fontSize: 15, fontWeight: 600, color: '#7c3aed', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Read all Insights →
          </Link>
        </div>

        <div className="eah-insights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
          {posts.map(p => <InsightsCard key={p.id} post={p} />)}
        </div>
      </div>

      <style>{`
        .eah-insights-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px -12px rgba(0,0,0,0.15); border-color: rgba(124,58,237,0.25) !important; }
        @media (max-width: 900px) { .eah-insights-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .eah-insights-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
