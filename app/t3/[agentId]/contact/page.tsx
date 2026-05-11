import { getAgentProfile } from '@/lib/suppliers'
import { T3ContactSection } from '@/components/t3/T3ContactSection'

interface PageProps {
  params: Promise<{ agentId: string }>
  searchParams?: Promise<{ hotel?: string }>
}

export default async function T3ContactPage({ params, searchParams }: PageProps) {
  const { agentId } = await params
  const { hotel } = (await searchParams) ?? {}
  const agent = await getAgentProfile(agentId)

  return (
    <>
      {/* Spacer to clear fixed nav */}
      <div style={{ height: 'clamp(96px, 14vw, 140px)', background: 'var(--t3-bg)' }} />

      <section className="t3-section" style={{ paddingTop: 'var(--t3-gap)', paddingBottom: 'var(--t3-gap)' }}>
        <div style={{ maxWidth: 'var(--t3-content-narrow)' }}>
          <span className="t3-eyebrow t3-eyebrow-plain">Contact</span>
          <h1 className="t3-display" style={{ marginTop: 32, fontSize: 'clamp(2.8rem, 6vw, 5.5rem)' }}>
            Let&apos;s talk about where you&apos;re going.
          </h1>
          <p className="t3-body t3-body-lg" style={{ marginTop: 32 }}>
            Share a few details about your trip and we&apos;ll respond personally within 24 hours. Every inquiry is read by an advisor — never a form handler.
          </p>
        </div>
      </section>

      {/* ── What to expect ──────────────────────────────────────────────── */}
      <section className="t3-section" style={{ paddingTop: 0 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--t3-gap)',
            borderTop: '1px solid var(--t3-divider)',
            paddingTop: 'var(--t3-gap)',
          }}
          className="t3-contact-expect"
        >
          {[
            { num: '01', label: 'You write', body: 'Tell us as much or as little as you want — a region, a date, a mood. There is no wrong way to start.' },
            { num: '02', label: 'We reply', body: 'An advisor reads every note personally. Expect a thoughtful response within one business day, often within hours.' },
            { num: '03', label: 'We talk', body: 'A 30-minute call follows. By the end, you will know whether we are the right fit — and we will know whether we can help.' },
          ].map((s) => (
            <div key={s.num}>
              <div
                style={{
                  fontFamily: 'var(--t3-font-display)',
                  fontSize: 'clamp(28px, 3vw, 40px)',
                  fontWeight: 400,
                  color: 'var(--t3-accent)',
                  marginBottom: 14,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                {s.num}
              </div>
              <h3 className="t3-headline-md" style={{ marginBottom: 10, fontSize: 'clamp(17px, 1.5vw, 20px)' }}>
                {s.label}
              </h3>
              <p className="t3-body" style={{ fontSize: 'clamp(13.5px, 1vw, 14.5px)', margin: 0 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <T3ContactSection
        agentId={agentId}
        eyebrow="Begin"
        headline="Tell us about your journey."
        phone={agent?.phone}
        email={agent?.email}
        address={agent?.address}
        hotel={hotel}
      />

      <style>{`
        @media (max-width: 1024px) {
          .t3-contact-expect { gap: var(--t3-gap) !important; }
        }
        @media (max-width: 768px) {
          .t3-contact-expect { grid-template-columns: 1fr !important; gap: var(--t3-gap-tight) !important; }
        }
      `}</style>
    </>
  )
}
