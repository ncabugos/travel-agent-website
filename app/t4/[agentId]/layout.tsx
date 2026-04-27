import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import type { ReactNode } from 'react'
import { getAgentProfile } from '@/lib/suppliers'
import { T4Nav } from '@/components/t4/T4Nav'
import { T4Footer } from '@/components/t4/T4Footer'
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

export default async function T4Layout({ children, params }: LayoutProps) {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)

  const agencyName = agent?.agency_name ?? 'Casa Solis'
  const tagline = agent?.tagline ?? 'Slow travel, quietly arranged.'

  return (
    <div className={`${cormorant.variable} ${dmSans.variable} t4-page`}>
      <T4Nav agentId={agentId} agencyName={agencyName} />
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
