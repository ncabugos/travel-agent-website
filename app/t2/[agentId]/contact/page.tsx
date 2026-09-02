import { getAgentProfile } from '@/lib/suppliers'
import { buildMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import { T2ContactForm } from '@/components/t2/T2ContactForm'
import { JsonLd, contactPageSchema } from '@/components/seo/JsonLd'
import Image from 'next/image'

interface PageProps {
  params: Promise<{ agentId: string }>
  searchParams?: Promise<{ hotel?: string; intent?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { agentId } = await params
  const agent = await getAgentProfile(agentId)
  if (!agent) return {}
  return buildMetadata({
    agent,
    title: 'Contact',
    description:
      'Start planning your next luxury journey. Reach your travel advisor to design a bespoke trip with exclusive Virtuoso perks and white-glove service.',
    path: 'contact',
  })
}

export default async function ContactPage({ params, searchParams }: PageProps) {
  const { agentId } = await params
  const { hotel, intent } = (await searchParams) ?? {}
  const advisorIntent = intent === 'advisor'
  const agent = await getAgentProfile(agentId)

  return (
    <>
      {agent && <JsonLd data={contactPageSchema(agent)} />}

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
          <p className="t2-label" style={{ marginBottom: 12, color: 'var(--t2-accent)' }}>
            {advisorIntent ? 'Connect with an Advisor' : 'Get in Touch'}
          </p>
          <h1 className="t2-heading t2-heading-xl" style={{ color: '#FFFFFF' }}>
            {advisorIntent ? 'Connect with an Advisor' : 'Contact'}
          </h1>
        </div>
      </section>

      {/* Contact info + form layout */}
      <section className="t2-section" style={{ maxWidth: 1000 }}>
        <div className="t2-contact-grid">
          {/* Sidebar */}
          <div>
            <h3 className="t2-heading t2-heading-sm" style={{ marginBottom: 24 }}>
              {agent?.agency_name ?? 'Luxury Travel'}
            </h3>

            {/* No email or phone by design — enquiries route through the form
                so advisor contact details stay off the public site. */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <p className="t2-label" style={{ marginBottom: 6 }}>Enquiries</p>
                <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 14, color: 'var(--t2-text-muted)', margin: 0, lineHeight: 1.7 }}>
                  Send a note using the form and it comes straight to us. We reply
                  within 24 hours.
                </p>
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
              {advisorIntent ? 'Connect with an Advisor' : 'Send Us a Message'}
            </h3>
            <p style={{ fontFamily: 'var(--t2-font-sans)', fontSize: 14, color: 'var(--t2-text-muted)', marginBottom: 24 }}>
              {advisorIntent
                ? 'Tell us how you like to travel and we’ll match you with the right specialist. We respond within 24 hours.'
                : 'Tell us about your next dream trip and we’ll get back to you within 24 hours.'}
            </p>
            <T2ContactForm agentId={agentId} hotel={hotel} advisorIntent={advisorIntent} />
          </div>
        </div>
      </section>

    </>
  )
}
