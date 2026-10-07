import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import type { ReactNode } from 'react'
import { getAgentProfile } from '@/lib/suppliers'
import { getAgentGaMeasurementId } from '@/lib/agent-ga'
import TenantAnalyticsConfig from '@/components/analytics/TenantAnalyticsConfig'
import { T4Nav } from '@/components/t4/T4Nav'
import { T4Footer } from '@/components/t4/T4Footer'
import { DemoSignupBanner } from '@/components/ui/DemoSignupBanner'
import { isDemoSlug, isIndexableTenantSlug } from '@/lib/demo-agents'
import '@/app/t4/globals-t4.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

interface LayoutProps {
  children: ReactNode
  params: Promise<{ agentId: string }>
}

// Cache each advisor's pages (ISR). The empty list means nothing is built at
// deploy: a page renders on its first request, then serves from cache. Saves
// clear it through lib/revalidate-tenant-sites.ts; the hour is a fallback for
// edits made outside the app (scripts, Supabase dashboard).
export const revalidate = 3600

export function generateStaticParams() {
  return []
}

// Showcase demos are fixtures, not real businesses. Emit a noindex directive
// for them at the layout level so it cascades to every page in this template
// (the home route's own generateMetadata sets no robots, so it inherits this).
// Real tenant sites get no robots override here and stay indexable.
export async function generateMetadata({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params
  return isIndexableTenantSlug(agentId) ? {} : { robots: { index: false, follow: false } }
}

export default async function T4Layout({ children, params }: LayoutProps) {
  const { agentId } = await params
  const [agent, gaMeasurementId] = await Promise.all([
    getAgentProfile(agentId),
    getAgentGaMeasurementId(agentId),
  ])

  const agencyName = agent?.agency_name ?? 'Casa Solis'
  const tagline = agent?.tagline ?? 'Slow travel, quietly arranged.'

  return (
    <div className={`${cormorant.variable} ${dmSans.variable} t4-page`}>
      {gaMeasurementId && <TenantAnalyticsConfig measurementId={gaMeasurementId} />}
      {isDemoSlug(agentId) && <DemoSignupBanner />}
      <T4Nav agentId={agentId} agencyName={agencyName} tier={agent?.tier ?? null} />
      <main>{children}</main>
      <T4Footer
        agentId={agentId}
        agencyName={agencyName}
        tagline={tagline}
        phone={agent?.phone ?? '+1 (415) 555 0134'}
        email={agent?.email ?? 'hello@casasolis.com'}
        address={agent?.address ?? 'Via Roma 28 · Solferino · Italy'}
        cstNumber={agent?.cst_number ?? '2108712-40'}
        instagramUrl={agent?.instagram_url ?? 'https://instagram.com/casasolis'}
        facebookUrl={agent?.facebook_url}
        youtubeUrl={agent?.youtube_url}
      />
    </div>
  )
}
