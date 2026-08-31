import { notFound } from 'next/navigation'
import { getPrivateJourney, getPrivateJourneySlugs } from '@/lib/private-journeys'
import { getAgentProfile } from '@/lib/suppliers'
import { T2JourneyDetail } from '@/components/t2/T2JourneyDetail'
import { buildMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ agentId: string; journeySlug: string }>
}

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getPrivateJourneySlugs('safari')
  return slugs.map((journeySlug) => ({ journeySlug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { agentId, journeySlug } = await params
  const [agent, journey] = await Promise.all([
    getAgentProfile(agentId),
    getPrivateJourney(journeySlug),
  ])
  if (!agent || !journey) return {}
  return buildMetadata({
    agent,
    title: journey.name,
    description:
      journey.tagline ??
      journey.description ??
      `Safari and guided journey planning with ${agent.agency_name}.`,
    path: `safaris/${journeySlug}`,
  })
}

export default async function SafariDetailPage({ params }: PageProps) {
  const { agentId, journeySlug } = await params
  const journey = await getPrivateJourney(journeySlug)
  if (!journey || journey.journey_type !== 'safari') notFound()

  return (
    <T2JourneyDetail
      journey={journey}
      agentId={agentId}
      indexHref="/safaris"
      indexLabel="All safaris & guided journeys"
    />
  )
}
