import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAgencyAdvisors } from '@/lib/agency-advisors'
import { T2AdvisorsDirectory } from '@/components/t2/T2AdvisorsDirectory'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export const metadata = {
  title: 'Our Advisors | Your Travel Center',
  description:
    'Meet the YTC team — six specialist advisors covering Europe, Asia, the Americas, cruise, and celebration travel.',
}

export default async function T2AdvisorsPage({ params }: PageProps) {
  const { agentId } = await params
  const advisors = await getAgencyAdvisors(agentId)
  if (advisors.length === 0) notFound()

  const base = `/t2/${agentId}`

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          height: 'clamp(460px, 55vh, 600px)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--t2-dark-bg)',
        }}
      >
        <Image
          src="/media/hotel-programs/aman/aman-hero-2000.jpg"
          alt=""
          aria-hidden
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          sizes="100vw"
          unoptimized
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(20,18,16,0.5) 0%, rgba(20,18,16,0.72) 100%)',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            maxWidth: 820,
            padding: '0 24px',
            color: '#fff',
          }}
        >
          <p
            className="t2-label"
            style={{ color: 'rgba(255,255,255,0.78)', marginBottom: 18 }}
          >
            Our Advisors
          </p>
          <h1
            style={{
              fontFamily: 'var(--t2-font-serif)',
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 300,
              letterSpacing: '-0.01em',
              margin: '0 0 20px',
              lineHeight: 1.1,
              color: '#fff',
            }}
          >
            The people you&apos;ll be working with.
          </h1>
          <p
            style={{
              fontFamily: 'var(--t2-font-sans)',
              fontSize: 17,
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.82)',
              maxWidth: 620,
              margin: '0 auto',
              fontWeight: 300,
            }}
          >
            Every client at YTC is paired with the advisor whose specialty
            actually matches the trip — never a generalist, never a handover.
          </p>
        </div>
      </section>

      {/* ── Intro band ─────────────────────────────────────────────────── */}
      <section className="t2-section" style={{ textAlign: 'center', maxWidth: 820 }}>
        <p className="t2-label" style={{ marginBottom: 16 }}>How We Work</p>
        <h2 className="t2-heading t2-heading-lg" style={{ marginBottom: 24 }}>
          Specialists, not generalists.
        </h2>
        <p className="t2-body t2-body-center">
          YTC is a team of six — each an acknowledged specialist in a region,
          product, or kind of trip. When you reach out, we match you with the
          advisor whose book of contacts is most useful for what you want to
          do. From the first conversation through your return flight, you
          work with one person.
        </p>
      </section>

      {/* ── Directory ──────────────────────────────────────────────────── */}
      <T2AdvisorsDirectory
        agentId={agentId}
        advisors={advisors}
        eyebrow="The Team"
        heading="Meet the advisors."
        subheading="Click any profile to see their specialties, destinations they know personally, and to reach out directly."
      />

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: 'var(--t2-section-pad) 48px',
          background: 'var(--t2-bg-alt)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p className="t2-label" style={{ marginBottom: 16 }}>Not sure who to ask for?</p>
          <h2 className="t2-heading t2-heading-lg" style={{ marginBottom: 24 }}>
            Start with a note. We&apos;ll route you.
          </h2>
          <p className="t2-body t2-body-center" style={{ marginBottom: 32 }}>
            Send a short message about the trip you&apos;re imagining. We&apos;ll
            pair you with the right specialist and have them reach out directly,
            usually within one business day.
          </p>
          <Link href={`${base}/contact`} className="t2-btn t2-btn-accent">
            Start a Conversation
          </Link>
        </div>
      </section>
    </>
  )
}
