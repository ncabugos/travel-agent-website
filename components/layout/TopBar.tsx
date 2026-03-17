'use client'

interface TopBarProps {
  phone?: string
  instagram?: string
  facebook?: string
  youtube?: string
}

export function TopBar({ phone, instagram, facebook, youtube }: TopBarProps) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6"
      style={{
        height: '36px',
        background: 'var(--charcoal)',
        fontFamily: 'var(--font-sans)',
        fontSize: '10px',
        letterSpacing: '0.2em',
      }}
    >
      {/* Social icons */}
      <div className="flex items-center gap-4">
        {instagram && (
          <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
            style={{ color: 'var(--warm-gray)', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--warm-gray)')}
          >
            <SocialIcon type="instagram" />
          </a>
        )}
        {!instagram && (
          <a href="#" aria-label="Instagram"
            style={{ color: 'var(--warm-gray)', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--warm-gray)')}
          >
            <SocialIcon type="instagram" />
          </a>
        )}
        {facebook ? (
          <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
            style={{ color: 'var(--warm-gray)', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--warm-gray)')}
          >
            <SocialIcon type="facebook" />
          </a>
        ) : (
          <a href="#" aria-label="Facebook"
            style={{ color: 'var(--warm-gray)', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--warm-gray)')}
          >
            <SocialIcon type="facebook" />
          </a>
        )}
        {youtube ? (
          <a href={youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"
            style={{ color: 'var(--warm-gray)', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--warm-gray)')}
          >
            <SocialIcon type="youtube" />
          </a>
        ) : (
          <a href="#" aria-label="YouTube"
            style={{ color: 'var(--warm-gray)', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--warm-gray)')}
          >
            <SocialIcon type="youtube" />
          </a>
        )}
      </div>

      {/* Right side */}
      {phone && (
        <div className="flex items-center gap-3" style={{ color: 'var(--warm-gray)' }}>
          <span style={{ textTransform: 'uppercase' }}>Speak to an expert</span>
          <span style={{ color: 'var(--divider)', fontSize: '10px' }}>·</span>
          <a
            href={`tel:${phone.replace(/\D/g, '')}`}
            style={{ color: 'var(--gold)', letterSpacing: '0.1em', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold-light)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--gold)')}
          >
            {phone}
          </a>
        </div>
      )}
    </div>
  )
}

function SocialIcon({ type }: { type: 'instagram' | 'facebook' | 'youtube' }) {
  if (type === 'instagram') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    )
  }
  if (type === 'facebook') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    )
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
    </svg>
  )
}
