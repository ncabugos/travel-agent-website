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
    title: 'Luxury Safaris in Africa',
    description:
      'Book privately guided safaris with Abercrombie & Kent and Micato Safaris across Kenya, Tanzania, Botswana and South Africa. Micato itineraries run 10 to 17 days from $20,700 per person. Same price as booking direct.',
    path: 'safaris',
  })
}

const SAFARI_FAQS: Faq[] = [
  {
    q: 'How much does a luxury safari cost?',
    a: 'Micato publishes its rates: 10 to 17-day itineraries run from $20,700 to $45,100 per person, including camps, privately guided game drives, internal flights and most meals. Abercrombie & Kent prices each journey individually on request. Both figures assume double occupancy.',
  },
  {
    q: 'When is the best time to see the Great Migration?',
    a: 'July through October for the Mara River crossings in Kenya, and January through March for the calving season on the southern Serengeti plains in Tanzania. The herds move continuously, so the right camp depends on the week you travel — which is the single decision that most affects what you see.',
  },
  {
    q: 'Abercrombie & Kent or Micato — which should I choose?',
    a: 'Micato is the specialist: family-run, Africa and India only, privately guided throughout, and a ten-time winner of Travel+Leisure\u2019s award for the world\u2019s best safari outfitter. Abercrombie & Kent is broader, operating on all seven continents with its own lodges and riverboats under A&K Sanctuary, and is the better choice if the safari is one leg of a longer journey.',
  },
  {
    q: 'How far in advance should I book a safari?',
    a: 'Twelve to eighteen months for migration season. The best camps are small — often under twenty tents — and the prime weeks are held a year out, so late enquiries usually mean compromising on camp rather than on date.',
  },
  {
    q: 'Does booking a safari through a travel advisor cost more?',
    a: 'No. You pay the operator\u2019s own published rate and we are paid by them. What you gain is the timing and camp selection, partner recognition on the booking, and one point of contact for deposits, visas, flights and changes.',
  },
]

const SAFARI_STEPS = [
  {
    title: 'Tell us the year and roughly how long',
    body: 'Ten days or seventeen, first safari or fifth. That is enough to narrow it.',
  },
  {
    title: 'We work backwards from the herds',
    body: 'Which weeks, which camps, which direction the crossing runs — then two or three itineraries with real pricing.',
  },
  {
    title: 'We hold the camps while you decide',
    body: 'Space is held with the operator, and we handle deposits, visas, internal flights and documents.',
  },
]

export default async function SafarisPage({ params }: PageProps) {
  const { agentId } = await params
  const [journeys, agent] = await Promise.all([
    getPrivateJourneys('safari'),
    getAgentProfile(agentId),
  ])
  const base = `/t2/${agentId}`
  // Flatten every published itinerary into the ItemList so an answer engine
  // asked "luxury safari prices" has the actual figures, not just brand names.
  const itineraries = journeys.flatMap((j) =>
    j.sample_journeys
      .filter((it) => it.price_from_usd)
      .map((it) => ({
        name: `${it.name} — ${j.name}`,
        description: it.blurb ?? undefined,
        path: `safaris/${j.slug}`,
        priceFromUsd: it.price_from_usd,
      })),
  )

  return (
    <>
      {agent && (
        <JsonLd
          data={[
            categoryServiceSchema(agent, {
              name: `Luxury Safari Booking — ${agent.agency_name}`,
              description:
                'Privately guided luxury safari booking with Abercrombie & Kent and Micato Safaris across Kenya, Tanzania, Botswana, South Africa, Rwanda and Namibia.',
              path: 'safaris',
              serviceType: 'Luxury Safari Booking',
            }),
            itemListSchema(agent, {
              name: 'Published safari itineraries',
              path: 'safaris',
              items: itineraries.length ? itineraries : journeys.map((j) => ({
                name: j.name,
                description: j.description,
                path: `safaris/${j.slug}`,
              })),
            }),
            faqSchema(SAFARI_FAQS.map((f) => ({ q: f.q, a: f.a }))),
            breadcrumbSchema(agent, [
              { name: 'Home', path: '' },
              { name: 'Safaris', path: 'safaris' },
            ]),
          ]}
        />
      )}
      <T2JourneyIndex
        journeys={journeys}
        agentId={agentId}
        segment="safaris"
        eyebrow="Safari"
        heading="Luxury safaris, privately guided."
        intro="Abercrombie & Kent and Micato Safaris across Kenya, Tanzania, Botswana and South Africa. Your own guide and vehicle throughout, not a shared game drive. Micato's published itineraries run 10 to 17 days from $20,700 per person."
        ctaHref={`${base}/contact`}
        ctaLabel="Plan my safari"
        trustLine="Virtuoso member · Same price as booking direct · Reply within one business day"
      />
      <T2HowItWorks
        steps={SAFARI_STEPS}
        heading="How planning a safari works"
        ctaHref={`${base}/contact`}
        ctaLabel="Plan my safari"
      />

      <T2Faq
        faqs={SAFARI_FAQS}
        heading="Luxury safari questions"
        contactHref={`${base}/contact`}
      />

      <T2LeadForm
        agentId={agentId}
        heading="Plan my safari"
        subheading="Timing decides what you see. Tell us the year and roughly how long, and we'll come back within one business day with itineraries, camps, and real pricing."
      />
    </>
  )
}
