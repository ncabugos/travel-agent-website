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

const PRESS_ITEMS = [
  { outlet: 'Condé Nast Traveler', logo: 'CNT', headline: 'Top Travel Specialists 2025', excerpt: 'Named among the world\'s leading luxury travel advisors for the second consecutive year.', date: 'October 2025', href: '#' },
  { outlet: 'Travel + Leisure', logo: 'T+L', headline: 'Best Luxury Travel Agencies in America', excerpt: 'Recognised for exceptional client service and access to the world\'s finest properties.', date: 'June 2025', href: '#' },
  { outlet: 'Forbes Travel Guide', logo: 'FTG', headline: 'Virtuoso Partner of the Year', excerpt: 'Selected from over 1,700 Virtuoso member agencies for outstanding expertise and client satisfaction.', date: 'March 2025', href: '#' },
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
          <p style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '24px' }}>Featured Recognition</p>
          <div style={{ border: '1px solid var(--divider)', padding: '60px 48px', marginBottom: '40px' }}>
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

      {/* Press List */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>Press</p>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '56px' }}>As Featured In</h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {PRESS_ITEMS.map(item => (
              <Link key={item.outlet} href={item.href} target="_blank" rel="noopener noreferrer" className="hover-gold"
                style={{ textDecoration: 'none', display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: '40px', alignItems: 'center', padding: '40px 0', borderTop: '1px solid var(--divider)', color: 'inherit' }}>
                <span style={{ fontFamily: serif, fontSize: '22px', fontStyle: 'italic', fontWeight: 300, color: 'var(--warm-gray)', letterSpacing: '0.04em' }}>{item.logo}</span>
                <div>
                  <h3 style={{ fontFamily: serif, fontSize: '20px', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '6px' }}>{item.headline}</h3>
                  <p style={{ fontFamily: sans, fontSize: '13px', color: 'var(--warm-gray)', lineHeight: '1.6' }}>{item.excerpt}</p>
                </div>
                <p style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', whiteSpace: 'nowrap' }}>{item.date}</p>
              </Link>
            ))}
            <div style={{ borderTop: '1px solid var(--divider)' }} />
          </div>
        </div>
      </section>

    </main>
  )
}
