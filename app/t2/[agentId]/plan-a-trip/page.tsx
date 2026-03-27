import { T2LeadForm } from '@/components/t2/T2LeadForm'
import { T2ExperienceGrid } from '@/components/t2/T2ExperienceGrid'
import { getExclusiveExperiences } from '@/lib/collections'
import Image from 'next/image'

export default async function PlanATripPage() {
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
