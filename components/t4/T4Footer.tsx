import Link from 'next/link'

interface T4FooterProps {
  agentId: string
  agencyName: string
  tagline?: string
  phone?: string | null
  email?: string | null
  address?: string | null
  cstNumber?: string | null
  instagramUrl?: string | null
  facebookUrl?: string | null
  youtubeUrl?: string | null
}

/**
 * T4 footer — deep espresso background, editorial column layout,
 * thin serif wordmark at top, social + address + fine-print below.
 */
export function T4Footer({
  agentId,
  agencyName,
  tagline,
  phone,
  email,
  address,
  cstNumber,
  instagramUrl,
  facebookUrl,
  youtubeUrl,
}: T4FooterProps) {
  const base = `/t4/${agentId}`

  return (
    <footer
      style={{
        background: 'var(--t4-dark-bg)',
        color: 'var(--t4-dark-text)',
        padding: '100px 48px 40px',
      }}
    >
      <div style={{ maxWidth: 'var(--t4-content-wide)', margin: '0 auto' }}>
        {/* Top band — wordmark + tagline */}
        <div
          style={{
            textAlign: 'center',
            paddingBottom: 64,
            borderBottom: '1px solid rgba(251, 248, 241, 0.14)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--t4-font-display)',
              fontSize: 'clamp(36px, 4vw, 52px)',
              fontWeight: 300,
              letterSpacing: '0.01em',
              marginBottom: 18,
              lineHeight: 1,
            }}
          >
            {agencyName}
          </div>
          {tagline && (
            <p
              style={{
                fontFamily: 'var(--t4-font-display)',
                fontStyle: 'italic',
                fontSize: 17,
                color: 'var(--t4-accent-soft)',
                maxWidth: 520,
                margin: '0 auto',
              }}
            >
              {tagline}
            </p>
          )}
        </div>

        {/* Middle band — columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
            gap: 48,
            paddingTop: 64,
            paddingBottom: 56,
          }}
          className="t4-footer-cols"
        >
          <FooterCol title="Contact">
            {phone && <FooterText>{phone}</FooterText>}
            {email && <FooterText>{email}</FooterText>}
            {address && <FooterText>{address}</FooterText>}
            {cstNumber && <FooterText>CST {cstNumber}</FooterText>}
          </FooterCol>

          <FooterCol title="The House">
            <FooterLink href={`${base}/atelier`} label="Atelier" />
            <FooterLink href={`${base}/press`} label="Press" />
            <FooterLink href={`${base}/journal`} label="Journal" />
          </FooterCol>

          <FooterCol title="Explore">
            <FooterLink href={`${base}/book-hotel`} label="Hotels" />
            <FooterLink href={`${base}/find-cruise`} label="Voyages" />
          </FooterCol>

          <FooterCol title="Follow">
            {instagramUrl && <FooterLink href={instagramUrl} label="Instagram" external />}
            {facebookUrl && <FooterLink href={facebookUrl} label="Facebook" external />}
            {youtubeUrl && <FooterLink href={youtubeUrl} label="YouTube" external />}
            <FooterLink href={`${base}/contact`} label="Contact" />
          </FooterCol>
        </div>

        {/* Fine print */}
        <div
          style={{
            paddingTop: 28,
            borderTop: '1px solid rgba(251, 248, 241, 0.14)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(251, 248, 241, 0.48)',
            fontWeight: 500,
          }}
        >
          <span>© {new Date().getFullYear()} {agencyName}. All rights reserved.</span>
          <span>A member of Virtuoso.</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .t4-footer-cols {
            grid-template-columns: 1fr 1fr !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 560px) {
          .t4-footer-cols {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--t4-font-body)',
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.26em',
          textTransform: 'uppercase',
          color: 'var(--t4-accent-soft)',
          marginBottom: 24,
        }}
      >
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {children}
      </div>
    </div>
  )
}

function FooterLink({ href, label, external }: { href: string; label: string; external?: boolean }) {
  const props = external
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}
  return (
    <Link
      href={href}
      {...props}
      style={{
        fontFamily: 'var(--t4-font-body)',
        fontSize: 14,
        color: 'rgba(251, 248, 241, 0.78)',
        textDecoration: 'none',
        transition: 'color 0.25s var(--t4-ease)',
      }}
    >
      {label}
    </Link>
  )
}

function FooterText({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: 'var(--t4-font-body)',
        fontSize: 14,
        color: 'rgba(251, 248, 241, 0.78)',
      }}
    >
      {children}
    </span>
  )
}
