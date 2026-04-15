import { Space_Grotesk, Inter } from 'next/font/google'
import type { ReactNode } from 'react'
import { getAgentProfile } from '@/lib/suppliers'
import { T3Nav } from '@/components/t3/T3Nav'
import { T3Footer } from '@/components/t3/T3Footer'
import '@/app/t3/globals-t3.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

interface LayoutProps {
  children: ReactNode
  params: Promise<{ agentId: string }>
}

export default async function T3Layout({ children, params }: LayoutProps) {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)

  return (
    <div className={`${spaceGrotesk.variable} ${inter.variable} t3-page`}>
      <T3Nav
        agentId={agentId}
        agencyName={agent?.agency_name ?? 'Meridian & Company'}
        tagline={agent?.tagline ?? undefined}
        logoUrl={agent?.logo_url ?? undefined}
        navLinks={agent?.nav_links}
      />
      <main>{children}</main>
      <T3Footer
        agentId={agentId}
        agencyName={agent?.agency_name ?? 'Meridian & Company'}
        tagline={agent?.tagline ?? undefined}
        phone={agent?.phone ?? '+1 (800) 555-0103'}
        email={agent?.email ?? 'hello@meridianandco.com'}
        address={agent?.address}
        cstNumber={agent?.cst_number}
        instagramUrl={agent?.instagram_url}
        facebookUrl={agent?.facebook_url}
        youtubeUrl={agent?.youtube_url}
      />
    </div>
  )
}
