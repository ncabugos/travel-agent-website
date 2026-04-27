import Link from 'next/link'

interface T3FooterProps {
  agentId: string
  agencyName: string
  phone: string
  email: string
  address?: string
  cstNumber?: string
  tagline?: string
  instagramUrl?: string
  facebookUrl?: string
  youtubeUrl?: string
}

export function T3Footer({
  agentId,
  agencyName,
  phone,
  email,
  address,
  cstNumber,
  tagline,
  instagramUrl,
  facebookUrl,
  youtubeUrl,
}: T3FooterProps) {
  const base = `/t3/${agentId}`

  return (
    <footer
      className="t3-section-dark"
      style={{
        paddingTop: 120,
        paddingBottom: 48,
        background: 'var(--t3-dark-bg)',
        color: 'var(--t3-dark-text)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--t3-content-wide)',
          margin: '0 auto',
          padding: '0 48px',
        }}
      >
        {/* Top: Agency word-mark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: 96,
            flexWrap: 'wrap',
            gap: 32,
          }}
        >
          <div style={{ maxWidth: 640 }}>
            <h2 className="t3-display" style={{ color: 'var(--t3-dark-text)', fontSize: 'clamp(2.4rem, 5vw, 4.2rem)' }}>
              {agencyName}
            </h2>
            {tagline && (
              <p
                className="t3-body t3-body-dark"
                style={{ marginTop: 24, maxWidth: 520 }}
              >
                {tagline}
              </p>
            )}
          </div>
          <Link
            href={`${base}/contact`}
            className="t3-btn t3-btn-ghost-light"
          >
            Begin the Conversation
          </Link>
        </div>

        {/* Middle: 4 columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 48,
            paddingTop: 48,
            paddingBottom: 48,
            borderTop: '1px solid rgba(247, 245, 240, 0.12)',
            borderBottom: '1px solid rgba(247, 245, 240, 0.12)',
          }}
          className="t3-footer-cols"
        >
          <FooterCol title="Explore">
            <FooterLink href={`${base}/about`} label="About" />
            <FooterLink href={`${base}/book-hotel`} label="Hotels" />
            <FooterLink href={`${base}/find-cruise`} label="Cruises" />
          </FooterCol>

          <FooterCol title="Services">
            <FooterLink href={`${base}/plan-a-trip`} label="Plan a Trip" />
            <FooterLink href={`${base}/contact`} label="Consultation" />
            <FooterLink href={`${base}/#partners`} label="Our Partners" />
            <FooterLink href={`${base}/#journal`} label="Journal" />
          </FooterCol>

          <FooterCol title="Contact">
            <FooterText>{phone}</FooterText>
            <FooterText>{email}</FooterText>
            {address && <FooterText>{address}</FooterText>}
          </FooterCol>

          <FooterCol title="Follow">
            {instagramUrl && instagramUrl !== '#' && <FooterLink href={instagramUrl} label="Instagram" external />}
            {facebookUrl && facebookUrl !== '#' && <FooterLink href={facebookUrl} label="Facebook" external />}
            {youtubeUrl && <FooterLink href={youtubeUrl} label="YouTube" external />}
            {(!instagramUrl || instagramUrl === '#') && <FooterText>@meridianandco</FooterText>}
          </FooterCol>
        </div>

        {/* Bottom: copyright */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 32,
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--t3-dark-muted)',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <span>© {new Date().getFullYear()} {agencyName}. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {cstNumber && <span>CST #{cstNumber}</span>}
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .t3-footer-cols { grid-template-columns: repeat(2, 1fr) !important; gap: 40px !important; }
        }
        @media (max-width: 560px) {
          .t3-footer-cols { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4
        style={{
          margin: '0 0 20px',
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--t3-accent)',
        }}
      >
        {title}
      </h4>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {children}
      </ul>
    </div>
  )
}

function FooterLink({ href, label, external }: { href: string; label: string; external?: boolean }) {
  return (
    <li>
      <Link
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        style={{
          color: 'var(--t3-dark-text)',
          textDecoration: 'none',
          fontSize: 14,
          opacity: 0.82,
          transition: 'opacity 0.2s ease, color 0.2s ease',
        }}
      >
        {label}
      </Link>
    </li>
  )
}

function FooterText({ children }: { children: React.ReactNode }) {
  return (
    <li style={{ color: 'var(--t3-dark-muted)', fontSize: 14, lineHeight: 1.6 }}>
      {children}
    </li>
  )
}
