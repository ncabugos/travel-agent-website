import { getAgentProfile } from '@/lib/suppliers'
import { T2ContactForm } from '@/components/t2/T2ContactForm'
import Image from 'next/image'

interface PageProps {
  params: Promise<{ agentId: string }>
  searchParams?: Promise<{ hotel?: string }>
}

export default async function ContactPage({ params, searchParams }: PageProps) {
  const { agentId } = await params
  const { hotel } = (await searchParams) ?? {}
  const agent = await getAgentProfile(agentId)

  const phone = agent?.phone ?? '+1 (800) 555-0100'
  const email = agent?.email ?? 'hello@luxurytravelco.com'

  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', height: 400, overflow: 'hidden' }}>
        <Image
          src="/media/hero images/four-seasons-CapFerrat_garden-hero.jpg"
          alt="Contact us"
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
          <p className="t2-label" style={{ marginBottom: 12, color: 'var(--t2-accent)' }}>Get in Touch</p>
          <h1 className="t2-heading t2-heading-xl" style={{ color: '#FFFFFF' }}>Contact</h1>
        </div>
      </section>

      {/* Contact info + form layout */}
      <section className="t2-section" style={{ maxWidth: 1000 }}>
        <div
          className="t2-grid-3"
          style={{
            gridTemplateColumns: '1fr 2fr',
            gap: 64,
          }}
        >
          {/* Sidebar */}
          <div>
            <h3 className="t2-heading t2-heading-sm" style={{ marginBottom: 24 }}>
              {agent?.agency_name ?? 'Luxury Travel'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <p className="t2-label" style={{ marginBottom: 6 }}>Email</p>
                <a
                  href={`mailto:${email}`}
                  style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 14, color: 'var(--t2-accent)', textDecoration: 'none' }}
                >
                  {email}
                </a>
              </div>

              <div>
                <p className="t2-label" style={{ marginBottom: 6 }}>Phone</p>
                <a
                  href={`tel:${phone.replace(/\s|\(|\)|-/g, '')}`}
                  style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 14, color: 'var(--t2-text)', textDecoration: 'none' }}
                >
                  {phone}
                </a>
              </div>

              {agent?.address && (
                <div>
                  <p className="t2-label" style={{ marginBottom: 6 }}>Mailing Address</p>
                  <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 14, color: 'var(--t2-text-muted)', margin: 0, lineHeight: 1.6 }}>
                    {agent.address}
                  </p>
                </div>
              )}
            </div>

            <hr className="t2-divider" style={{ margin: '32px 0' }} />

            <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 13, lineHeight: 1.7, color: 'var(--t2-text-muted)' }}>
              Proud member of Virtuoso, the world&apos;s leading luxury travel network. Our partnerships ensure you receive exclusive perks and white-glove service on every journey.
            </p>
          </div>

          {/* Form */}
          <div>
            <h3 className="t2-heading t2-heading-sm" style={{ marginBottom: 8 }}>
              Send Us a Message
            </h3>
            <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 14, color: 'var(--t2-text-muted)', marginBottom: 24 }}>
              Tell us about your next dream trip and we&apos;ll get back to you within 24 hours.
            </p>
            <T2ContactForm agentId={agentId} hotel={hotel} />
          </div>
        </div>
      </section>

    </>
  )
}
