import { getPrivateJourneys } from '@/lib/private-journeys'
import { getAgentProfile } from '@/lib/suppliers'
import { T2JourneyIndex } from '@/components/t2/T2JourneyIndex'
import { T2LeadForm } from '@/components/t2/T2LeadForm'
import { T2Faq, type Faq } from '@/components/t2/T2Faq'
import { T2HowItWorks } from '@/components/t2/T2HowItWorks'
import {
  JsonLd, faqSchema, categoryServiceSchema, itemListSchema, breadcrumbSchema,
} from '@/components/seo/JsonLd'
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
    title: 'Private Jet Journeys Around the World',
    description:
      'Book the Four Seasons Private Jet: nine itineraries on a customised Airbus A321, staying in Four Seasons hotels throughout, with a journey physician, executive chef and 24/7 concierge on board.',
    path: 'private-jets',
  })
}

const JET_FAQS: Faq[] = [
  {
    q: 'How much does a private jet journey cost?',
    a: 'Four Seasons publishes its rates. The 2027 and 2028 departures run from USD 167,000 per person for the 16-day Asia Unveiled routing to USD 252,000 for the 23-day Grand Horizons circumnavigation, double occupancy, with a solo traveller supplement of roughly ten percent. That price is all-inclusive: flights on the private jet, hotels, meals, excursions, ground transport, luggage handling and gratuities.',
  },
  {
    q: 'How many guests travel on the Four Seasons Private Jet?',
    a: 'The aircraft is a customised Airbus A321 configured for a fraction of the passengers it would normally carry, so the group stays small enough to move through airports and hotels together. A dedicated journey team travels with the group throughout.',
  },
  {
    q: 'What is included in a private jet journey?',
    a: 'Everything between the first and last day: all flights on the private aircraft, accommodation in Four Seasons hotels and resorts, meals, excursions, ground transfers, luggage handling, visas and gratuities. A 24/7 concierge, an on-board executive chef, and a journey physician travel with the group.',
  },
  {
    q: 'Who operates the Four Seasons Private Jet?',
    a: 'The journeys are sold and operated by TCS World Travel, and the aircraft is operated by Titan Airways. Four Seasons provides the hotels, the service standard, and the branded cabin crew training.',
  },
  {
    q: 'How far ahead do private jet journeys sell out?',
    a: 'Departures routinely sell out within days of being announced, often twelve to eighteen months ahead. We register interest before the public on-sale date so you are contacted when a routing you want opens.',
  },
]

const JET_STEPS = [
  {
    title: 'Tell us the year and the region',
    body: 'Nothing more specific is needed. Nine itineraries run each year and they do not all repeat.',
  },
  {
    title: 'We confirm what is still open',
    body: 'Current departures, remaining space, exact pricing, and what each routing actually covers.',
  },
  {
    title: 'We register you before public release',
    body: 'For sold-out years, you are on the list before the next season is announced.',
  },
]

export default async function PrivateJetsPage({ params }: PageProps) {
  const { agentId } = await params
  const [journeys, agent] = await Promise.all([
    getPrivateJourneys('jet'),
    getAgentProfile(agentId),
  ])
  const base = `/t2/${agentId}`

  return (
    <>
      {agent && (
        <JsonLd
          data={[
            categoryServiceSchema(agent, {
              name: `Private Jet Journey Booking — ${agent.agency_name}`,
              description:
                'Booking for around-the-world private jet journeys including the Four Seasons Private Jet, operated on a customised Airbus A321 with Four Seasons hotels throughout.',
              path: 'private-jets',
              serviceType: 'Private Jet Journey Booking',
            }),
            itemListSchema(agent, {
              name: 'Private jet programmes',
              path: 'private-jets',
              items: journeys.map((j) => ({
                name: j.name,
                description: j.description,
                path: `private-jets/${j.slug}`,
                priceFromUsd: j.price_from_usd,
              })),
            }),
            faqSchema(JET_FAQS.map((f) => ({ q: f.q, a: f.a }))),
            breadcrumbSchema(agent, [
              { name: 'Home', path: '' },
              { name: 'Private Jets', path: 'private-jets' },
            ]),
          ]}
        />
      )}
      <T2JourneyIndex
        journeys={journeys}
        agentId={agentId}
        segment="private-jets"
        eyebrow="Private Aviation"
        heading="Private jet journeys around the world."
        intro="The Four Seasons Private Jet flies nine itineraries a year on a customised Airbus A321, staying in Four Seasons hotels throughout. All flights, hotels, meals, excursions and ground handling are included, and a concierge, executive chef and physician travel with the group."
        ctaHref={`${base}/contact`}
        ctaLabel="Request current departures"
        trustLine="Virtuoso member · Departures sell out 12–18 months ahead · Reply within one business day"
      />
      <T2HowItWorks
        steps={JET_STEPS}
        heading="How booking a private jet journey works"
        ctaHref={`${base}/contact`}
        ctaLabel="Request current departures"
      />

      <T2Faq
        faqs={JET_FAQS}
        heading="Private jet journey questions"
        contactHref={`${base}/contact`}
      />

      <T2LeadForm
        agentId={agentId}
        heading="Request current departures"
        subheading="Departures sell out on announcement. Tell us the year and the region, and we'll come back within one business day with what is still open and what it costs."
      />
    </>
  )
}
