import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { InsightsCard } from '@/components/marketing/InsightsCard'
import { getCategoryBySlug, getPostsByCategory, getCategories } from '@/lib/marketing-blog'

interface PageProps { params: Promise<{ slug: string }> }

export const revalidate = 3600

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const cat = await getCategoryBySlug(slug)
  if (!cat) return {}
  return {
    title: `${cat.label} — Insights — Elite Advisor Hub`,
    description: cat.description ?? `Articles on ${cat.label} from Elite Advisor Hub.`,
    alternates: { canonical: `/insights/category/${slug}` },
  }
}

export default async function InsightsCategoryPage({ params }: PageProps) {
  const { slug } = await params
  const [cat, posts, categories] = await Promise.all([
    getCategoryBySlug(slug),
    getPostsByCategory(slug),
    getCategories(),
  ])
  if (!cat) notFound()

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#111', background: '#fff' }}>
      <MarketingNav />

      <section style={{ padding: '128px 24px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <Link href="/insights" style={{ fontSize: 13, color: '#7c3aed', textDecoration: 'none', fontWeight: 600 }}>← Insights</Link>
        <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 46px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '20px 0 14px', maxWidth: 820 }}>
          {cat.label}
        </h1>
        {cat.description && <p style={{ fontSize: 18, lineHeight: 1.65, color: '#52525b', margin: 0, maxWidth: 680 }}>{cat.description}</p>}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 32 }}>
          <Link href="/insights" style={pill}>All</Link>
          {categories.map(c => (
            <span key={c.id} style={c.slug === slug ? pillActive : pill}>
              {c.slug === slug ? c.label : <Link href={`/insights/category/${c.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>{c.label}</Link>}
            </span>
          ))}
        </div>
      </section>

      <section style={{ padding: '24px 24px 100px', maxWidth: 1200, margin: '0 auto' }}>
        {posts.length === 0 ? (
          <p style={{ color: '#71717a', fontSize: 16, padding: '40px 0' }}>No articles in this pillar yet — check back soon.</p>
        ) : (
          <div className="eah-insights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {posts.map(p => <InsightsCard key={p.id} post={p} />)}
          </div>
        )}
      </section>

      <MarketingFooter />
      <style>{`
        .eah-insights-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px -12px rgba(0,0,0,0.15); border-color: rgba(124,58,237,0.25) !important; }
        @media (max-width: 900px) { .eah-insights-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .eah-insights-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}

const pill: React.CSSProperties = { padding: '7px 16px', borderRadius: 999, border: '1px solid #e5e7eb', fontSize: 13, fontWeight: 500, color: '#374151', textDecoration: 'none', background: '#fff' }
const pillActive: React.CSSProperties = { ...pill, background: '#1a1a1a', color: '#fff', borderColor: '#1a1a1a' }
