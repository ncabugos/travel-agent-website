import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LIDO_DESTINATIONS } from '@/lib/lido-content'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export const metadata = {
  title: 'Destinations | The Lido Collective',
  description: 'Explore the world with The Lido Collective — the Mediterranean, Europe, the Indian Ocean, the Caribbean, and Asia Pacific.',
}

/**
 * Destination index — Lido-only. The /destinations route lives under the shared
 * [agentId] tree, so guard to the Lido Collective slug; any other T2 agent gets
 * a 404 rather than Lido content.
 */
export default async function DestinationsIndexPage({ params }: PageProps) {
  const { agentId } = await params
  if (agentId !== 'lido-collective') notFound()
  const base = `/t2/${agentId}`

  return (
    <div style={{ background: 'var(--lido-bg)', color: 'var(--lido-text)' }}>
      {/* Hero (white, traditional) */}
      <section
        style={{
          padding: 'clamp(160px, 22vh, 260px) 48px clamp(56px, 8vh, 100px)',
          maxWidth: 'var(--t2-content-max, 1280px)',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <p className="lido-eyebrow" style={{ marginBottom: 24 }}>The World, Edited</p>
        <h1 className="lido-display" style={{ fontSize: 'clamp(44px, 6.5vw, 96px)', lineHeight: 1.02, fontWeight: 400, maxWidth: '16ch', margin: '0 auto' }}>
          Explore the world with The Lido Collective.
        </h1>
        <p className="lido-body" style={{ fontSize: 17, maxWidth: 560, margin: '32px auto 0' }}>
          Five corners of the world, each owned by a specialist who travels it. Choose where you begin.
        </p>
      </section>

      {/* Asymmetric destination grid — wide rectangle feature + arch cards */}
      <section className="lido-section" style={{ paddingTop: 0 }}>
        <div className="lido-dest-index-grid">
          {LIDO_DESTINATIONS.map((d, i) => {
            const wide = i % 3 === 0
            return (
              <Link
                key={d.slug}
                href={`${base}/destinations/${d.slug}`}
                className={`lido-dest-index-card ${wide ? 'is-wide' : ''}`}
              >
                <div className={`lido-shape ${wide ? 'lido-rect' : 'lido-arch'}`} style={{ aspectRatio: wide ? '16 / 9' : '3 / 4' }}>
                  <Image src={d.heroImage} alt={d.label} fill sizes="(max-width: 900px) 100vw, 50vw" />
                </div>
                <div className="lido-dest-index-body">
                  <h2 className="lido-display" style={{ fontSize: 'clamp(26px, 3.2vw, 38px)', margin: '0 0 8px' }}>{d.label}</h2>
                  <p className="lido-body" style={{ fontSize: 14, marginBottom: 16, maxWidth: 440 }}>{d.hook}</p>
                  <span className="lido-arrow">Explore <span aria-hidden>→</span></span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <style>{`
        .lido-dest-index-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(36px, 5vw, 72px); }
        .lido-dest-index-card { text-decoration: none; color: var(--lido-text); display: block; }
        .lido-dest-index-card.is-wide { grid-column: span 2; }
        .lido-dest-index-card.is-wide .lido-dest-index-body { text-align: center; max-width: 560px; margin: 0 auto; }
        .lido-dest-index-card.is-wide .lido-dest-index-body p { margin-left: auto; margin-right: auto; }
        .lido-dest-index-body { padding: 22px 0 0; }
        @media (max-width: 900px) {
          .lido-dest-index-grid { grid-template-columns: 1fr; }
          .lido-dest-index-card.is-wide { grid-column: span 1; }
        }
      `}</style>
    </div>
  )
}
