'use client'

import Image from 'next/image'
import Link from 'next/link'
import { EDEN } from '@/lib/media-library'
import { ObfuscatedContact } from '@/components/ui/ObfuscatedContact'

interface ContactSectionProps {
  /**
   * Phone / email from encodeContact(), encoded by the server. This component
   * used to take the whole agent profile object, which put the advisor's real
   * email and phone straight into the RSC flight payload embedded in the HTML —
   * scrapable without running any JavaScript. Only encoded values cross the
   * client boundary now.
   */
  phoneEncoded?: string | null
  emailEncoded?: string | null
  address?: string | null
  agentId: string
  /** Tenant link base — empty on vanity domain, `/frontend/{agentId}` on platform. */
  base?: string
  /** Hero image for the left column */
  imageSrc?: string
  imageAlt?: string
}

export function ContactSection({
  phoneEncoded,
  emailEncoded,
  address,
  agentId,
  base,
  imageSrc = EDEN.collageFooter,
  imageAlt = 'Eden For Your World',
}: ContactSectionProps) {
  const linkBase = base ?? `/frontend/${agentId}`
  const serif = 'var(--font-serif)'
  const sans = 'var(--font-sans)'

  // `encoded` items render through ObfuscatedContact; `value` items are plain
  // text that was never sensitive (the mailing address is already public).
  const contactItems = [
    phoneEncoded && { label: 'Phone', encoded: phoneEncoded, kind: 'tel' as const },
    emailEncoded && { label: 'Email', encoded: emailEncoded, kind: 'email' as const },
    address && { label: 'Location', value: address },
  ].filter(Boolean) as Array<{
    label: string
    encoded?: string
    kind?: 'email' | 'tel'
    value?: string
  }>

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '620px',
        background: '#FFFFFF',
      }}
      className="contact-section-grid"
    >
      {/* Left — padded image column, no overlay, no badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px',
          background: '#FFFFFF',
        }}
      >
        <div style={{ position: 'relative', width: '100%', maxWidth: '640px', aspectRatio: '4/3' }}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="50vw"
            style={{ objectFit: 'contain', objectPosition: 'center' }}
          />
        </div>
      </div>


      {/* Right — white panel with contact info */}
      <div
        style={{
          background: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 72px',
        }}
        className="contact-copy-panel"
      >
        {/* Overline */}
        <p
          style={{
            fontFamily: sans,
            fontSize: '9px',
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: '#B5945A',
            marginBottom: '24px',
          }}
        >
          Get In Touch
        </p>

        {/* Headline */}
        <h2
          style={{
            fontFamily: serif,
            fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
            fontWeight: 300,
            color: 'var(--charcoal)',
            lineHeight: 1.2,
            marginBottom: '24px',
          }}
        >
          Plan your next trip<br />with us
        </h2>

        {/* Gold rule */}
        <div
          style={{
            width: '36px',
            height: '1px',
            background: '#B5945A',
            marginBottom: '36px',
          }}
        />

        {/* Contact details */}
        {contactItems.length > 0 && (
          <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {contactItems.map(({ label, value, encoded, kind }) => (
              <div key={label}>
                <p
                  style={{
                    fontFamily: sans,
                    fontSize: '9px',
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: '#B5945A',
                    marginBottom: '4px',
                  }}
                >
                  {label}
                </p>
                {encoded && kind ? (
                  <ObfuscatedContact
                    encoded={encoded}
                    kind={kind}
                    fallbackHref={`${linkBase}/contact`}
                    fallbackLabel={kind === 'email' ? 'Email us' : 'Call us'}
                    style={{
                      fontFamily: sans,
                      fontSize: '15px',
                      color: 'var(--charcoal)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#B5945A' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--charcoal)' }}
                  />
                ) : (
                  <p style={{ fontFamily: sans, fontSize: '15px', color: 'var(--charcoal)' }}>{value}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA button */}
        <Link
          href={`${linkBase}/contact`}
          style={{
            display: 'inline-block',
            alignSelf: 'flex-start',
            fontFamily: sans,
            fontSize: '10px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            background: '#B5945A',
            border: '1px solid #B5945A',
            padding: '16px 44px',
            textDecoration: 'none',
            transition: 'background 0.3s ease, color 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#B5945A'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#B5945A'
            e.currentTarget.style.color = '#FFFFFF'
          }}
        >
          Start Planning
        </Link>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-section-grid {
            grid-template-columns: 1fr !important;
          }
          .contact-copy-panel {
            padding: 64px 24px !important;
          }
        }
      `}</style>
    </section>
  )
}
