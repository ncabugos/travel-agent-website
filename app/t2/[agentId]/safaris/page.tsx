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
    title: 'Safaris & Guided Journeys',
    description:
      'Privately guided safaris and expedition journeys with Abercrombie & Kent and Micato Safaris — the operators with their own guides, vehicles and camps on the ground.',
    path: 'safaris',
  })
}

export default async function SafarisPage({ params }: PageProps) {
  const { agentId } = await params
  const journeys = await getPrivateJourneys('safari')

  return (
    <>
      <T2JourneyIndex
        journeys={journeys}
        agentId={agentId}
        segment="safaris"
        eyebrow="Safari & Expedition"
        heading="The guide matters more than the lodge."
        intro="Both operators here own their ground: their own guides, their own vehicles, and in A&K's case their own camps and riverboats. That is the difference between a safari that is booked well and one where somebody is already waiting at the airstrip when the light is right."
      />
      <T2LeadForm
        agentId={agentId}
        heading="Plan a safari"
        subheading="Timing is most of the outcome — which weeks, which camps, which direction the crossing runs. Tell us the year and we'll work backwards from the herds."
      />
    </>
  )
}
