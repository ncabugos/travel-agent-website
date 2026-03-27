import { getCruiseLines } from '@/lib/cruise-lines'
import { FindCruiseClient } from '@/components/t2/FindCruiseClient'
import Image from 'next/image'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export default async function FindCruisePage({ params }: PageProps) {
  const { agentId } = await params
  const allCruises = await getCruiseLines()

  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', height: 480, overflow: 'hidden' }}>
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
