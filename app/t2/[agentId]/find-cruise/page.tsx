import { getCruiseLines } from '@/lib/cruise-lines'
import { FindCruiseClient } from '@/components/t2/FindCruiseClient'
import { T2CruisePartnersGrid } from '@/components/t2/T2CruisePartnersGrid'
import { T2LeadForm } from '@/components/t2/T2LeadForm'
import { getAgentProfile } from '@/lib/suppliers'
import Image from 'next/image'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export default async function FindCruisePage({ params }: PageProps) {
  const { agentId } = await params

  // ── The Lido Collective — bespoke white-theme cruise ("Voyages") page ──────
  if (agentId === 'lido-collective') {
    const allCruises = await getCruiseLines()
    const base = `/t2/${agentId}`
    return (
      <div style={{ background: 'var(--lido-bg)', color: 'var(--lido-text)' }}>
        {/* Hero — full-bleed, traditional */}
        <section style={{ position: 'relative', minHeight: '76svh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 32px' }}>
          <Image src="/media/cruises/orient-express-sailing-yacht/Orient-Express-Sailing-Yachts-Corinthian-Exterior-Wind-Luxigon.jpg" alt="Voyages by sea" fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,16,30,0.34), rgba(6,16,30,0.54))' }} />
          <div style={{ position: 'relative', zIndex: 2, maxWidth: 880 }}>
            <p className="lido-eyebrow" style={{ color: 'rgba(255,255,255,0.78)', marginBottom: 22 }}>Ocean · Expedition · Yacht</p>
            <h1 className="lido-display" style={{ fontSize: 'clamp(56px, 8vw, 120px)', lineHeight: 0.96, fontWeight: 400, margin: 0, color: '#FFFFFF' }}>
              Voyages by sea.
            </h1>
            <p className="lido-body" style={{ fontSize: 17, color: 'rgba(255,255,255,0.82)', maxWidth: 620, margin: '30px auto 0' }}>
              Aman at sea. The Orient Express sailing yachts. The great expedition vessels. The ships worth boarding — and
              the cabins held back from inventory.
            </p>
          </div>
        </section>

        {/* Searchable directory */}
        <section className="lido-section">
          <div className="lido-header"><span className="lido-eyebrow">The Fleet</span></div>
          <div style={{ maxWidth: 680, marginBottom: 'clamp(40px, 5vw, 64px)' }}>
            <h2 className="lido-display" style={{ fontSize: 'clamp(32px, 4vw, 52px)', margin: '0 0 18px' }}>The lines we sail.</h2>
            <p className="lido-body" style={{ fontSize: 16, maxWidth: 560 }}>
              Every line below carries Virtuoso-preferred status — shipboard credit, complimentary shore events, and
              priority embarkation when booked through the collective.
            </p>
          </div>
          <FindCruiseClient agentId={agentId} allCruises={allCruises} />
        </section>

        {/* CTA — light */}
        <section className="lido-band-grey" style={{ padding: 'clamp(100px, 14vw, 180px) 48px', textAlign: 'center' }}>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <h2 className="lido-display" style={{ fontSize: 'clamp(36px, 5vw, 56px)', marginBottom: 22 }}>Planning a voyage?</h2>
            <p className="lido-body" style={{ fontSize: 17, margin: '0 auto 36px', maxWidth: 520 }}>
              Tell us where you&apos;d like to sail. We&apos;ll match the ship and the week, and stack every perk available to you.
            </p>
            <Link href={`${base}/contact`} className="lido-btn-fill">Begin a Conversation <span aria-hidden>→</span></Link>
          </div>
        </section>
      </div>
    )
  }

  const [allCruises, agent] = await Promise.all([
    getCruiseLines(),
    getAgentProfile(agentId),
  ])

  // Tier-aware split:
  //   Starter → curated T2CruisePartnersGrid (non-searchable list of preferred
  //             lines, each linking to a brand-detail page).
  //   Growth+ → full searchable directory via FindCruiseClient.
  const isStarter = agent?.tier === 'starter'

  if (isStarter) {
    return (
      <>
        {/* Hero */}
        <section style={{ position: 'relative', height: 650, overflow: 'hidden' }}>
          <Image
            src="/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg"
            alt="Our Cruise Partners"
            fill
            priority
            style={{ objectFit: 'cover' }}
            sizes="100vw"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))' }} />
          <div
            style={{
              position: 'relative', zIndex: 2, height: '100%',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              textAlign: 'center', padding: '0 24px',
            }}
          >
            <p className="t2-label" style={{ marginBottom: 12, color: 'var(--t2-accent)' }}>Ocean · River · Yacht</p>
            <h1 className="t2-heading t2-heading-xl" style={{ color: '#FFFFFF' }}>Our Cruise Partners</h1>
            <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 16, color: 'rgba(255,255,255,0.8)', maxWidth: 520, marginTop: 16 }}>
              A curated set of Virtuoso-preferred cruise lines — each with meaningful onboard perks for our clients.
            </p>
          </div>
        </section>

        {/* Curated cruise partners */}
        <T2CruisePartnersGrid
          agentId={agentId}
          lines={allCruises}
          eyebrow="Preferred Cruise Partners"
          heading="The cruise lines we book."
          subheading="Every line below carries Virtuoso-preferred status — which unlocks shipboard credit, complimentary shore events, and priority embarkation when booked through us."
        />

        {/* Lead Form */}
        <T2LeadForm
          heading="Plan Your Next Cruise"
          subheading="Tell us where and when you'd like to sail — we'll match the line and itinerary and stack every perk available to you."
        />
      </>
    )
  }

  // Growth / Custom / Agency — searchable directory.
  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', height: 650, overflow: 'hidden' }}>
        <Image
          src="/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg"
          alt="Find a Cruise"
          fill
          priority
          style={{ objectFit: 'cover' }}
          sizes="100vw"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))' }} />
        <div
          style={{
            position: 'relative', zIndex: 2, height: '100%',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            textAlign: 'center', padding: '0 24px',
          }}
        >
          <p className="t2-label" style={{ marginBottom: 12, color: 'var(--t2-accent)' }}>Ocean · River · Yacht</p>
          <h1 className="t2-heading t2-heading-xl" style={{ color: '#FFFFFF' }}>Find a Cruise</h1>
          <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 16, color: 'rgba(255,255,255,0.8)', maxWidth: 520, marginTop: 16 }}>
            From intimate river barges to grand ocean liners and ultra-luxury yachts — discover the world by sea.
          </p>
        </div>
      </section>

      {/* Cruise browser */}
      <section className="t2-section">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 className="t2-heading t2-heading-lg">Our Luxury Cruise Partners</h2>
          <p className="t2-body t2-body-center" style={{ marginTop: 12 }}>
            We partner with the world&apos;s finest cruise lines to bring you exclusive Virtuoso perks, onboard credits, and VIP experiences.
          </p>
        </div>
        <FindCruiseClient agentId={agentId} allCruises={allCruises} />
      </section>
    </>
  )
}
