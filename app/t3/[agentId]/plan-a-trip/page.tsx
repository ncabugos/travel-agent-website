import { getAgentProfile } from '@/lib/suppliers'
import { getExclusiveExperiences } from '@/lib/collections'
import { T3PageHero } from '@/components/t3/T3PageHero'
import { T3ContactSection } from '@/components/t3/T3ContactSection'
import { T3ExperienceEditorial } from '@/components/t3/T3ExperienceEditorial'

interface PageProps {
  params: Promise<{ agentId: string }>
}

const PROCESS = [
  {
    num: '01',
    label: 'The First Call',
    body: 'A 30-minute conversation — usually by phone. We ask about where you have been, where you have not, and what you are in the mood for this year. No questionnaires, no brief templates.',
  },
  {
    num: '02',
    label: 'The Proposal',
    body: 'Within a week, you receive a considered written proposal: a shortlist of options with a clear rationale for each. Not a glossy brochure — a document written by someone who has been to the places they are recommending.',
  },
  {
    num: '03',
    label: 'Refinement',
    body: 'We iterate. This is where most advisors stop; for us it is where the real work begins. Details, preferences, and small asks are incorporated until the itinerary feels inevitable.',
  },
  {
    num: '04',
    label: 'The Journey',
    body: 'You travel. We are on call throughout — in every time zone, through every flight delay, from the first transfer to the final turn-down. One advisor, from first call to the night you land home.',
  },
]

export default async function T3PlanATripPage({ params }: PageProps) {
  const { agentId } = await params
  const [agent, experiences] = await Promise.all([
    getAgentProfile(agentId),
    getExclusiveExperiences(),
  ])

  return (
    <>
      <T3PageHero
        image="/media/hero images/four-seasons-sayan-hero.jpg"
        imageAlt="Plan a Trip"
        eyebrow="Begin"
        title="Let&apos;s start with a conversation."
        body="Every journey we build starts with a 30-minute call — no questionnaire, no pressure. We will listen, ask a few questions, and tell you honestly whether we are the right studio for what you have in mind."
        imageCaption="Four Seasons Resort Bali at Sayan"
      />

      {/* Process */}
      <section className="t3-section">
        <div style={{ maxWidth: 'var(--t3-content-narrow)', marginBottom: 'var(--t3-gap-loose)' }}>
          <span className="t3-eyebrow t3-eyebrow-plain">How It Works</span>
          <h2 className="t3-headline-xl" style={{ marginTop: 28 }}>
            Four steps, one advisor, quietly.
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'var(--t3-gap-loose)',
          }}
          className="t3-process-grid"
        >
          {PROCESS.map((p) => (
            <div key={p.num}>
              <div
                style={{
                  fontFamily: 'var(--t3-font-display)',
                  fontSize: 56,
                  fontWeight: 400,
                  color: 'var(--t3-accent)',
                  marginBottom: 16,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                {p.num}
              </div>
              <h3 className="t3-headline-md" style={{ marginBottom: 16 }}>
                {p.label}
              </h3>
              <p className="t3-body">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Proof block (client testimonial) ───────────────────────────── */}
      <section
        style={{
          position: 'relative',
          minHeight: 'clamp(380px, 48vh, 480px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--t3-section-pad-sm) 24px',
          overflow: 'hidden',
          background: 'var(--t3-dark-bg)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/hotel-programs/four-seasons/fs-Golden_pool-1500.jpg"
          alt=""
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.38,
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: 'var(--t3-content-prose)',
            textAlign: 'center',
            color: '#fff',
          }}
        >
          <span
            className="t3-eyebrow t3-eyebrow-plain"
            style={{ color: 'rgba(255,255,255,0.72)', justifyContent: 'center', marginBottom: 32 }}
          >
            From a recent client
          </span>
          <p
            className="t3-headline-lg"
            style={{
              fontStyle: 'italic',
              color: '#fff',
              lineHeight: 1.3,
              fontSize: 'clamp(1.4rem, 2.6vw, 2.2rem)',
            }}
          >
            &ldquo;The proposal arrived on a Tuesday. By Friday we were rebooked into a suite at a property we hadn&apos;t even considered, and it was the best week of the year.&rdquo;
          </p>
          <p
            style={{
              marginTop: 32,
              fontSize: 'clamp(10px, 0.85vw, 11px)',
              fontWeight: 500,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.72)',
            }}
          >
            M. K. — Returning client, eight years
          </p>
        </div>
      </section>

      {/* Contact form (reuses T3ContactSection) */}
      <T3ContactSection
        eyebrow="Start Here"
        headline="Tell us about your trip."
        body="Share a few details below and we will respond personally — usually within a few hours, never more than one business day."
        phone={agent?.phone}
        email={agent?.email}
        address={agent?.address}
      />

      {/* Experience inspiration */}
      <T3ExperienceEditorial
        agentId={agentId}
        eyebrow="Need inspiration?"
        headline="A few of our most-requested itineraries."
        subheading="Not as a menu — as a starting point. Every journey we arrange is built from scratch, but these are the templates our clients often want shaped around them."
        experiences={experiences}
      />

      <style>{`
        @media (max-width: 768px) {
          .t3-process-grid { grid-template-columns: 1fr !important; gap: var(--t3-gap) !important; }
        }
      `}</style>
    </>
  )
}
