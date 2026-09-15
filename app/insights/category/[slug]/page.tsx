import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { InsightsCard } from '@/components/marketing/InsightsCard'
import { InsightsFilters } from '@/components/marketing/InsightsFilters'
import { getCategoryBySlug, getPostsByCategory, getCategories } from '@/lib/marketing-blog'
import { BODY_FONT, BODY_STYLE, CHARCOAL, DISPLAY_FONT, LABEL_STYLE } from '@/components/marketing/tokens'

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
    <div className="eah-marketing" style={{ fontFamily: BODY_FONT, color: CHARCOAL, background: '#fff' }}>
      <MarketingNav />
      <main>
        <section style={{ padding: '176px 0 48px' }}>
          <div className="eah-container">
            <Link href="/insights" className="eah-link" style={{ fontSize: '14px', color: CHARCOAL }}>Insights</Link>
            <p style={{ ...LABEL_STYLE, margin: '32px 0 24px' }}>Category</p>
            <h1 style={{ fontFamily: DISPLAY_FONT, fontSize: 'clamp(40px, 5.6vw, 80px)', fontWeight: 300, letterSpacing: '-0.035em', lineHeight: 1.0, margin: '0 0 24px', maxWidth: '14ch' }}>
              {cat.label}
            </h1>
            {cat.description && <p style={{ ...BODY_STYLE, fontSize: '19px', maxWidth: '52ch' }}>{cat.description}</p>}
            <InsightsFilters categories={categories} activeSlug={slug} />
          </div>
        </section>

        <section style={{ padding: '24px 0 120px' }}>
          <div className="eah-container">
            {posts.length === 0 ? (
              <p style={{ ...BODY_STYLE, padding: '24px 0' }}>No articles in this category yet.</p>
            ) : (
              <div className="eah-insights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px 40px' }}>
                {posts.map(p => <InsightsCard key={p.id} post={p} />)}
              </div>
            )}
          </div>
        </section>
      </main>
      <MarketingFooter />
      <style>{`
        .eah-insights-card img { transition: opacity 0.3s ease; }
        .eah-insights-card:hover img { opacity: 0.88; }
        @media (max-width: 900px) { .eah-insights-grid { grid-template-columns: 1fr 1fr !important; gap: 32px 24px !important; } }
        @media (max-width: 600px) { .eah-insights-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
