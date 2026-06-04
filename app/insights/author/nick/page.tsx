import Link from 'next/link'
import type { Metadata } from 'next'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { InsightsCard } from '@/components/marketing/InsightsCard'
import { JsonLd } from '@/components/seo/JsonLd'
import { organizationNode, SITE_URL } from '@/lib/insights-schema'
import { getPublishedPosts } from '@/lib/marketing-blog'

const LINKEDIN = process.env.NEXT_PUBLIC_FOUNDER_LINKEDIN // optional, e.g. https://linkedin.com/in/...

export const metadata: Metadata = {
  title: 'Nick Cabugos — Founder, Elite Advisor Hub',
  description:
    'Nick Cabugos is the founder of Elite Advisor Hub and a working luxury travel advisor. He writes Insights on advisor websites, SEO/AEO, and building a top-tier practice.',
  alternates: { canonical: '/insights/author/nick' },
}

export const revalidate = 3600

export default async function AuthorPage() {
  const posts = (await getPublishedPosts()).filter(p => p.author_name.toLowerCase().includes('nick')).slice(0, 6)

  const personGraph = [
    organizationNode(),
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/insights/author/nick#person`,
      name: 'Nick Cabugos',
      jobTitle: 'Founder',
      description: 'Founder of Elite Advisor Hub and a working luxury travel advisor.',
      url: `${SITE_URL}/insights/author/nick`,
      worksFor: { '@id': `${SITE_URL}/#organization` },
      ...(LINKEDIN ? { sameAs: [LINKEDIN] } : {}),
    },
  ]

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#111', background: '#fff' }}>
      <JsonLd data={personGraph} />
      <MarketingNav />

      <section style={{ padding: '128px 24px 48px', maxWidth: 760, margin: '0 auto' }}>
        <Link href="/insights" style={{ fontSize: 13, color: '#7c3aed', textDecoration: 'none', fontWeight: 600 }}>← Insights</Link>
        <span style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7c3aed', margin: '24px 0 12px' }}>Author</span>
        <h1 style={{ fontSize: 'clamp(30px, 4.5vw, 44px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 12px' }}>Nick Cabugos</h1>
        <p style={{ fontSize: 16, fontWeight: 600, color: '#7c3aed', margin: '0 0 20px' }}>Founder of Elite Advisor Hub · Working luxury travel advisor</p>
        <p style={{ fontSize: 18, lineHeight: 1.7, color: '#3f3f46', margin: '0 0 16px' }}>
          Nick founded Elite Advisor Hub to give independent luxury advisors the website infrastructure the
          top 1% of the industry expects — without the developer retainers, hosting headaches, or year-long builds.
        </p>
        <p style={{ fontSize: 18, lineHeight: 1.7, color: '#3f3f46', margin: 0 }}>
          He is a working luxury travel advisor, which means every article here is written by someone who does
          the work — the kind of first-hand expertise Google and AI answer engines now reward.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
          {LINKEDIN && (
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" style={chipLink}>LinkedIn ↗</a>
          )}
          <Link href="/beta" style={chipLink}>Join the waitlist →</Link>
        </div>
      </section>

      {posts.length > 0 && (
        <section style={{ padding: '0 24px 100px', maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 24px' }}>Recent articles by Nick</h2>
          <div className="eah-insights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {posts.map(p => <InsightsCard key={p.id} post={p} />)}
          </div>
        </section>
      )}

      <MarketingFooter />
      <style>{`
        .eah-insights-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px -12px rgba(0,0,0,0.15); border-color: rgba(124,58,237,0.25) !important; }
        @media (max-width: 900px) { .eah-insights-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .eah-insights-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}

const chipLink: React.CSSProperties = { padding: '10px 20px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: 14, fontWeight: 600, color: '#111', textDecoration: 'none', background: '#fff' }
