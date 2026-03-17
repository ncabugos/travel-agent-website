import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import type { ReactNode } from 'react'
import { getAgentProfile } from '@/lib/suppliers'
import { TopBar } from '@/components/layout/TopBar'
import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'

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
  const agent = await getAgentProfile(agentId)

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
      <TopBar
        phone={agent?.phone ?? '+1 (562) 856-8603'}
        instagram={social.instagram}
        facebook={social.facebook}
        youtube={social.youtube}
      />
      <SiteNav
        agentId={agentId}
        agencyName={agent?.agency_name ?? 'Luxury Travel'}
      />
      <div>
        {children}
      </div>
      <SiteFooter
        agentId={agentId}
        agencyName={agent?.agency_name ?? 'Luxury Travel'}
        phone={agent?.phone ?? '+1 (562) 856-8603'}
        email={agent?.email ?? ''}
        address={agent?.address}
        cstNumber={agent?.cst_number}
        instagram={social.instagram}
        facebook={social.facebook}
        youtube={social.youtube}
      />
    </div>
  )
}
