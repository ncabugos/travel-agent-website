import { T2LeadForm } from '@/components/t2/T2LeadForm'
import { T2ExperienceGrid } from '@/components/t2/T2ExperienceGrid'
import { LidoContact, type LidoLocation } from '@/components/t2/LidoContact'
import { getExclusiveExperiences } from '@/lib/collections'
import { getAgentProfile } from '@/lib/suppliers'
import { buildMetadata } from '@/lib/seo'
import { encodeContact } from '@/lib/obfuscate'
import type { Metadata } from 'next'
import Image from 'next/image'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)
  if (!agent) return {}
  return buildMetadata({
    agent,
    title: 'Plan a Trip',
    description:
      'Tell us where you want to go. We’ll match you with the right hotels, cruises, and itineraries, and unlock Virtuoso perks on every booking.',
    path: 'plan-a-trip',
  })
}

// The Lido Collective treats "Plan a Trip" as a proper agency contact page:
// a light enquiry surface with full contact channels and studio locations.
const LIDO_LOCATIONS: LidoLocation[] = [
  { city: 'New York', detail: '11 Howard Street, Soho · by appointment' },
  { city: 'London', detail: '5 Savile Row, Mayfair · by appointment' },
]

export default async function PlanATripPage({ params }: PageProps) {
  const { agentId } = await params
  const isLido = agentId === 'lido-collective'

  if (isLido) {
    const agent = await getAgentProfile(agentId)
    return (
      <>
        <section className="lido-pat-hero">
          <Image
            src="/media/hero images/four-seasons-CapFerrat_garden-hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
          <div className="lido-pat-hero-scrim" />
          <div className="lido-pat-hero-copy">
            <h1 className="lido-display" style={{ fontSize: 'clamp(40px, 6vw, 78px)', color: '#EDEAE4', lineHeight: 1.02, margin: 0 }}>
              Let&apos;s begin the conversation.
            </h1>
          </div>
          <style>{`
            .lido-pat-hero { position: relative; height: clamp(420px, 60vh, 560px); overflow: hidden; }
            .lido-pat-hero-scrim {
              position: absolute; inset: 0;
              background: linear-gradient(to bottom, rgba(6,16,30,0.35), rgba(6,16,30,0.62));
            }
            .lido-pat-hero-copy {
              position: relative; z-index: 2; height: 100%;
              display: flex; flex-direction: column; justify-content: center; align-items: center;
              text-align: center; padding: 0 24px; max-width: 18ch; margin: 0 auto;
            }
          `}</style>
        </section>

        <LidoContact
          emailEncoded={encodeContact(agent?.email ?? 'hello@lidocollective.com')}
          phoneEncoded={encodeContact('+1 (212) 555-0117')}
          locations={LIDO_LOCATIONS}
          instagramUrl={agent?.instagram_url ?? 'https://www.instagram.com/lidocollective'}
        />
      </>
    )
  }

  const experiences = await getExclusiveExperiences()

  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', height: 650, overflow: 'hidden' }}>
        <Image
          src="/media/hero images/four-seasons-sayan-hero.jpg"
          alt="Plan a trip"
          fill
          priority
          style={{ objectFit: 'cover' }}
          sizes="100vw"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))' }} />
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '0 24px',
          }}
        >
          <p className="t2-label" style={{ marginBottom: 12, color: 'var(--t2-accent)' }}>Start Your Journey</p>
          <h1 className="t2-heading t2-heading-xl" style={{ color: '#FFFFFF' }}>
            Plan a Trip
          </h1>
        </div>
      </section>

      {/* Lead Form */}
      <T2LeadForm
        heading="Let's Design Your Trip"
        subheading="Share your travel dreams with us. Our advisors will craft a bespoke itinerary tailored to your style, schedule, and budget."
      />

      {/* Experiences */}
      <T2ExperienceGrid experiences={experiences} />
    </>
  )
}
