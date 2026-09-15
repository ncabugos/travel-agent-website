import Link from 'next/link'
import { InsightsCard } from '@/components/marketing/InsightsCard'
import { getPublishedPosts } from '@/lib/marketing-blog'
import { Reveal } from './Reveal'
import { CHARCOAL, CREAM, H2_STYLE, LABEL_STYLE } from './tokens'

/**
 * Latest three Insights posts. Renders nothing until posts exist.
 */
export async function MarketingInsightsTeaser() {
  const posts = await getPublishedPosts(3)
  if (posts.length === 0) return null

  return (
    <section className="eah-section" style={{ background: CREAM, color: CHARCOAL, padding: '120px 0' }}>
      <div className="eah-container">
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap', marginBottom: '48px' }}>
            <div>
              <p style={{ ...LABEL_STYLE, marginBottom: '20px' }}>Insights</p>
              <h2 style={H2_STYLE}>The work behind the websites.</h2>
            </div>
            <Link href="/insights" className="eah-link" style={{ fontSize: '15px', whiteSpace: 'nowrap' }}>All Insights</Link>
          </div>
        </Reveal>
        <div className="eah-insights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
          {posts.map((p, i) => (
            <Reveal key={p.id} delay={i * 60}><InsightsCard post={p} /></Reveal>
          ))}
        </div>
      </div>
      <style>{`
        .eah-insights-card img { transition: opacity 0.3s ease; }
        .eah-insights-card:hover img { opacity: 0.88; }
        @media (max-width: 900px) { .eah-insights-grid { grid-template-columns: 1fr 1fr !important; gap: 28px !important; } }
        @media (max-width: 600px) { .eah-insights-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
