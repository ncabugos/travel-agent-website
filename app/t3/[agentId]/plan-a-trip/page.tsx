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
        <div style={{ maxWidth: 720, marginBottom: 80 }}>
          <span className="t3-eyebrow">How It Works</span>
          <h2 className="t3-headline-xl" style={{ marginTop: 28 }}>
            Four steps, one advisor, quietly.
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 64,
            rowGap: 72,
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
        @media (max-width: 900px) {
          .t3-process-grid { grid-template-columns: 1fr !important; gap: 56px !important; }
        }
      `}</style>
    </>
  )
}
