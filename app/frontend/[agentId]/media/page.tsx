import Image from 'next/image'
import Link from 'next/link'
import { getAgentProfile } from '@/lib/suppliers'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)
  return { title: `Media — ${agent?.agency_name ?? 'Luxury Travel'}` }
}

const ACCOLADES: { source: string; title: string; detail: string; href?: string }[] = [
  {
    source: 'Virtuoso',
    title: 'Most Innovative Advisor Award',
    detail: 'John Oberacker of Eden For Your World recognised by Virtuoso for outstanding innovation in luxury travel advising.',
    href: 'https://edenforyourworld.com/2018/08/john-oberacker-of-eden-for-your-world-wins-virtuoso-2018-most-innovative-advisor-award/',
  },
  {
    source: 'Luxury Travel Advisor Magazine',
    title: 'Featured Advisor',
    detail: 'Recognised by one of the industry\'s leading trade publications for excellence in luxury travel.',
  },
  {
    source: 'Montecito Village Travel',
    title: 'Overall Top Producer 2025',
    detail: 'Awarded the top producer distinction across all advisors for outstanding sales performance.',
  },
  {
    source: 'Montecito Village Travel',
    title: 'President\'s Club Ultra — 2024, 2025 & 2026',
    detail: 'Three consecutive years at the highest tier of achievement within the Montecito Village Travel network.',
  },
  {
    source: 'Hawai\'i Visitors & Convention Bureau',
    title: 'Certified Hawaiian Destination Specialist',
    detail: 'Advanced certification demonstrating deep expertise in Hawaiian travel, culture, and logistics.',
  },
  {
    source: 'Tahiti Tourisme',
    title: 'Certified Tahiti Specialist',
    detail: 'Specialist certification for expert knowledge of French Polynesia, its islands, resorts, and over-water experiences.',
  },
]

const serif = 'var(--font-serif)'
const sans  = 'var(--font-sans)'

export default async function MediaPage({ params }: PageProps) {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)
  if (!agent) notFound()

  return (
    <main style={{ background: 'var(--cream)' }}>

      {/* Page Banner */}
      <div style={{ position: 'relative', height: '50vh', minHeight: '340px', overflow: 'hidden' }}>
        <Image src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=2000&q=80" alt="Press and media" fill priority sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center 30%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,18,16,0.6)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 300, color: '#FFFFFF', lineHeight: 1.1 }}>In The Press</h1>
        </div>
      </div>

      {/* Featured Award */}
      <section style={{ padding: '100px 24px', textAlign: 'center', borderBottom: '1px solid var(--divider)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ border: '1px solid var(--divider)', padding: '60px 48px', marginBottom: '40px' }}>
            <Image
              src="/assets/eden/2025-2026_CONDE-NAST_CONDE-NAST-TRAVELER_TOP-TRAVEL-SPECIALISTS_LOGO_RGB.png"
              alt="Condé Nast Traveler Top Travel Specialists 2025–2026"
              width={220}
              height={120}
              style={{ objectFit: 'contain', margin: '0 auto 28px', display: 'block' }}
            />
            <p style={{ fontFamily: serif, fontSize: '13px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '24px' }}>Condé Nast Traveler</p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 300, fontStyle: 'italic', color: 'var(--charcoal)', lineHeight: 1.2, marginBottom: '20px' }}>
              Top Travel Specialists 2025
            </h2>
            <div style={{ width: '32px', height: '1px', background: 'var(--gold)', margin: '0 auto 20px' }} />
            <p style={{ fontFamily: sans, fontSize: '14px', color: 'var(--warm-gray)', lineHeight: '1.8' }}>
              Recognised by the world&apos;s most trusted travel publication for demonstrated expertise, insider access, and an unwavering commitment to exceptional client experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Accolades & Certifications */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>Recognition</p>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '56px' }}>Accolades &amp; Certifications</h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {ACCOLADES.map((item, i) => {
              const inner = (
                <>
                  <span style={{ fontFamily: serif, fontSize: '13px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 400, color: 'var(--warm-gray)' }}>{item.source}</span>
                  <div>
                    <h3 style={{ fontFamily: serif, fontSize: '20px', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '6px' }}>{item.title}</h3>
                    <p style={{ fontFamily: sans, fontSize: '13px', color: 'var(--warm-gray)', lineHeight: '1.6' }}>{item.detail}</p>
                  </div>
                  {item.href && (
                    <p style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', whiteSpace: 'nowrap', alignSelf: 'center' }}>Read →</p>
                  )}
                </>
              )
              const gridStyle: React.CSSProperties = {
                textDecoration: 'none',
                display: 'grid',
                gridTemplateColumns: item.href ? '180px 1fr auto' : '180px 1fr',
                gap: '40px',
                alignItems: 'start',
                padding: '40px 0',
                borderTop: '1px solid var(--divider)',
                color: 'inherit',
              }
              return item.href ? (
                <Link key={`${item.source}-${i}`} href={item.href} target="_blank" rel="noopener noreferrer" className="hover-gold" style={gridStyle}>
                  {inner}
                </Link>
              ) : (
                <div key={`${item.source}-${i}`} style={gridStyle}>
                  {inner}
                </div>
              )
            })}
            <div style={{ borderTop: '1px solid var(--divider)' }} />
          </div>
        </div>
      </section>

    </main>
  )
}
