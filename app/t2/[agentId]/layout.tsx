import { Playfair_Display, Inter } from 'next/font/google'
import type { ReactNode } from 'react'
import { getAgentProfile } from '@/lib/suppliers'
import { T2Nav } from '@/components/t2/T2Nav'
import { T2Footer } from '@/components/t2/T2Footer'
import '@/app/t2/globals-t2.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
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

export default async function T2Layout({ children, params }: LayoutProps) {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)

  return (
    <div className={`${playfair.variable} ${inter.variable} t2-page`}>
      <T2Nav
        agentId={agentId}
        agencyName={agent?.agency_name ?? 'Luxury Travel Co'}
      />
      <main>{children}</main>
      <T2Footer
        agentId={agentId}
        agencyName={agent?.agency_name ?? 'Luxury Travel Co.'}
        phone={agent?.phone ?? '+1 (800) 555-0100'}
        email={agent?.email ?? 'hello@luxurytravelco.com'}
        address={agent?.address}
        cstNumber={agent?.cst_number}
      />
    </div>
  )
}
