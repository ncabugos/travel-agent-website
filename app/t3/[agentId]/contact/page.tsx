import { getAgentProfile } from '@/lib/suppliers'
import { T3ContactSection } from '@/components/t3/T3ContactSection'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export default async function T3ContactPage({ params }: PageProps) {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)

  return (
    <>
      {/* Spacer to clear fixed nav */}
      <div style={{ height: 140, background: 'var(--t3-bg)' }} />

      <section className="t3-section" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div style={{ maxWidth: 720 }}>
          <span className="t3-eyebrow">Contact</span>
          <h1 className="t3-display" style={{ marginTop: 32, fontSize: 'clamp(2.8rem, 6vw, 5.5rem)' }}>
            Let&apos;s talk about where you&apos;re going.
          </h1>
          <p className="t3-body t3-body-lg" style={{ marginTop: 32 }}>
            Share a few details about your trip and we&apos;ll respond personally within 24 hours. Every inquiry is read by an advisor — never a form handler.
          </p>
        </div>
      </section>

      <T3ContactSection
        eyebrow="Begin"
        headline="Tell us about your journey."
        phone={agent?.phone}
        email={agent?.email}
        address={agent?.address}
      />
    </>
  )
}
