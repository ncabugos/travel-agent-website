import { getPrivateJourneys } from '@/lib/private-journeys'
import { getAgentProfile } from '@/lib/suppliers'
import { T2JourneyIndex } from '@/components/t2/T2JourneyIndex'
import { T2LeadForm } from '@/components/t2/T2LeadForm'
import { buildMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export const revalidate = 3600

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)
  if (!agent) return {}
  return buildMetadata({
    agent,
    title: 'Private Jet Journeys',
    description:
      'Around-the-world private jet journeys on a privately configured aircraft, with the hotels, the ground handling, and the days either side arranged as one booking.',
    path: 'private-jets',
  })
}

export default async function PrivateJetsPage({ params }: PageProps) {
  const { agentId } = await params
  const journeys = await getPrivateJourneys('jet')

  return (
    <>
      <T2JourneyIndex
        journeys={journeys}
        agentId={agentId}
        segment="private-jets"
        eyebrow="Private Aviation"
        heading="No connections. No terminals. No re-packing."
        intro="A private jet journey removes the part of long-haul travel that costs you days rather than money. One aircraft, one crew, one bag you unpack at the start and repack at the end — across as many countries as the routing takes in."
      />
      <T2LeadForm
        agentId={agentId}
        heading="Plan a private jet journey"
        subheading="Departures are limited and sell on announcement. Tell us the year and the region, and we'll tell you what is still open."
      />
    </>
  )
}
