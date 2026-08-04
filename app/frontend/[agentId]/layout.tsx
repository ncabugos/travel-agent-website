import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import type { ReactNode } from 'react'
import { getAgentProfile } from '@/lib/suppliers'
import { getAgentGaMeasurementId } from '@/lib/agent-ga'
import TenantAnalyticsConfig from '@/components/analytics/TenantAnalyticsConfig'
import { TopBar } from '@/components/layout/TopBar'
import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { DemoSignupBanner } from '@/components/ui/DemoSignupBanner'
import { isDemoSlug } from '@/lib/demo-agents'
import { tenantBase } from '@/lib/tenant-paths'
import { encodeContact } from '@/lib/obfuscate'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
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

export default async function AgentFrontendLayout({ children, params }: LayoutProps) {
  const { agentId } = await params
  const [agent, gaMeasurementId] = await Promise.all([
    getAgentProfile(agentId),
    getAgentGaMeasurementId(agentId),
  ])
  const base = agent ? tenantBase(agent) : `/frontend/${agentId}`

  const social = {
    instagram: agent?.instagram_url,
    facebook:  agent?.facebook_url,
    youtube:   agent?.youtube_url,
  }

  return (
    <div
      className={`${cormorant.variable} ${dmSans.variable}`}
      style={{ background: 'var(--cream)', minHeight: '100vh' }}
    >
      {gaMeasurementId && <TenantAnalyticsConfig measurementId={gaMeasurementId} />}
      {isDemoSlug(agentId) && <DemoSignupBanner />}
      <TopBar
        phoneEncoded={encodeContact(agent?.phone ?? '+1 (562) 856-8603')}
        contactHref={`${base}/contact`}
        instagram={social.instagram}
        facebook={social.facebook}
        youtube={social.youtube}
      />
      <SiteNav
        agentId={agentId}
        agencyName={agent?.agency_name ?? 'Luxury Travel'}
        base={base}
      />
      <div>
        {children}
      </div>
      <SiteFooter
        agentId={agentId}
        agencyName={agent?.agency_name ?? 'Luxury Travel'}
        base={base}
        phoneEncoded={encodeContact(agent?.phone ?? '+1 (562) 856-8603')}
        emailEncoded={encodeContact(agent?.email ?? 'info@edenfyw.com')}
        address={agent?.address}
        cstNumber={agent?.cst_number}
        instagram={social.instagram}
        facebook={social.facebook}
        youtube={social.youtube}
      />
    </div>
  )
}
