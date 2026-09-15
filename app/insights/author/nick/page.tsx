import Link from 'next/link'
import type { Metadata } from 'next'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { InsightsCard } from '@/components/marketing/InsightsCard'
import { JsonLd } from '@/components/seo/JsonLd'
import { organizationNode, SITE_URL } from '@/lib/insights-schema'
import { getPublishedPosts } from '@/lib/marketing-blog'
import { BODY_FONT, BODY_STYLE, CHARCOAL, DISPLAY_FONT, LABEL_STYLE, WARM_GRAY } from '@/components/marketing/tokens'

const LINKEDIN = process.env.NEXT_PUBLIC_FOUNDER_LINKEDIN

export const metadata: Metadata = {
  title: 'Nick Cabugos — Founder, Elite Advisor Hub',
  description:
    'Nick Cabugos is the founder of Elite Advisor Hub and a working luxury travel advisor. He writes Insights on advisor websites, SEO and AI search, and building a top-tier practice.',
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
    <div className="eah-marketing" style={{ fontFamily: BODY_FONT, color: CHARCOAL, background: '#fff' }}>
      <JsonLd data={personGraph} />
      <MarketingNav />
      <main>
        <section style={{ padding: '176px 0 72px' }}>
          <div className="eah-container">
            <Link href="/insights" className="eah-link" style={{ fontSize: '14px', color: CHARCOAL }}>Insights</Link>
            <p style={{ ...LABEL_STYLE, margin: '32px 0 24px' }}>Author</p>
            <h1 style={{ fontFamily: DISPLAY_FONT, fontSize: 'clamp(40px, 5.6vw, 80px)', fontWeight: 300, letterSpacing: '-0.035em', lineHeight: 1.0, margin: '0 0 16px' }}>Nick Cabugos</h1>
            <p style={{ fontSize: '15px', color: WARM_GRAY, margin: '0 0 32px' }}>Founder of Elite Advisor Hub. Working luxury travel advisor.</p>
            <p style={{ ...BODY_STYLE, fontSize: '18px', maxWidth: '58ch', marginBottom: '16px' }}>
              Nick founded Elite Advisor Hub to give independent luxury advisors the website infrastructure the top 1% of the industry expects, without the developer retainers, hosting headaches, or year-long builds.
            </p>
            <p style={{ ...BODY_STYLE, fontSize: '18px', maxWidth: '58ch', marginBottom: '32px' }}>
              He is a working luxury travel advisor, which means every article here is written by someone who does the work: the kind of first-hand expertise Google and AI answer engines now reward.
            </p>
            <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
              {LINKEDIN && <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="eah-link" style={{ fontSize: '15px', color: CHARCOAL }}>LinkedIn</a>}
              <Link href="/schedule-consultation" className="eah-link" style={{ fontSize: '15px', color: CHARCOAL }}>Schedule a consultation</Link>
            </div>
          </div>
        </section>

        {posts.length > 0 && (
          <section style={{ padding: '0 0 120px' }}>
            <div className="eah-container">
              <p style={{ ...LABEL_STYLE, marginBottom: '32px' }}>Recent articles by Nick</p>
              <div className="eah-insights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px 40px' }}>
                {posts.map(p => <InsightsCard key={p.id} post={p} />)}
              </div>
            </div>
          </section>
        )}
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
