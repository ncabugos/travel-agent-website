import Image from 'next/image'
import { getAgentProfile } from '@/lib/suppliers'
import { notFound } from 'next/navigation'
import { ContactForm } from '@/components/contact/ContactForm'

interface PageProps {
  params: Promise<{ agentId: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)
  return { title: `Contact — ${agent?.agency_name ?? 'Luxury Travel'}` }
}

const serif = 'var(--font-serif)'
const sans  = 'var(--font-sans)'

export default async function ContactPage({ params }: PageProps) {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)
  if (!agent) notFound()

  const phone   = agent.phone ?? '+1 (562) 856-8603'
  const email   = agent.email ?? 'info@edenfyw.com'
  const address = agent.address ?? '5318 E. 2nd St. #520, Long Beach, CA 90803'

  return (
    <main style={{ background: 'var(--cream)' }}>

      {/* Page Banner */}
      <div style={{ position: 'relative', height: '50vh', minHeight: '340px', overflow: 'hidden' }}>
        <Image src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=2000&q=80" alt="Travel planning" fill priority sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center 50%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,18,16,0.6)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 300, color: '#FFFFFF', lineHeight: 1.1 }}>Plan Your Journey</h1>
        </div>
      </div>

      {/* Two-column layout */}
      <section style={{ padding: '100px 24px 120px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '80px', alignItems: 'start' }}>

          {/* Contact Info */}
          <div>
            <p style={{ fontFamily: sans, fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>Reach Us</p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1.25, marginBottom: '36px' }}>
              We&apos;d love to hear<br />about your dream trip.
            </h2>
            <div style={{ width: '32px', height: '1px', background: 'var(--gold)', marginBottom: '36px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <InfoItem label="Phone">
                <a href={`tel:${phone.replace(/\D/g, '')}`} style={{ fontFamily: sans, fontSize: '15px', color: 'var(--charcoal)', textDecoration: 'none' }}>{phone}</a>
              </InfoItem>
              <InfoItem label="Email">
                <a href={`mailto:${email}`} style={{ fontFamily: sans, fontSize: '15px', color: 'var(--charcoal)', textDecoration: 'none' }}>{email}</a>
              </InfoItem>
              <InfoItem label="Mailing Address">
                <p style={{ fontFamily: sans, fontSize: '14px', color: 'var(--charcoal)', lineHeight: '1.6', margin: 0 }}>{address}</p>
              </InfoItem>
              <InfoItem label="Hours">
                <p style={{ fontFamily: sans, fontSize: '14px', color: 'var(--charcoal)', lineHeight: '1.6', margin: 0 }}>
                  Monday – Friday: 9am – 6pm PT<br />By appointment on weekends
                </p>
              </InfoItem>
            </div>
          </div>

          {/* Form */}
          <ContactForm agentId={agentId} />
        </div>
      </section>

    </main>
  )
}

function InfoItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '6px' }}>{label}</p>
      {children}
    </div>
  )
}
