import type { FeaturedPartner } from '@/lib/collections'

interface T3PartnerMarqueeProps {
  eyebrow?: string
  headline: string
  body?: string
  partners: FeaturedPartner[]
}

export function T3PartnerMarquee({
  eyebrow = '05 — Our Network',
  headline,
  body,
  partners,
}: T3PartnerMarqueeProps) {
  const cruise = partners.filter(p => p.category === 'cruise')
  const hotel = partners.filter(p => p.category === 'hotel')

  return (
    <section
      id="partners"
      className="t3-section-dark t3-section-full"
      style={{ background: 'var(--t3-dark-bg)', color: 'var(--t3-dark-text)' }}
    >
      <div
        style={{
          maxWidth: 'var(--t3-content-max)',
          margin: '0 auto',
          padding: '0 48px',
          textAlign: 'center',
          marginBottom: 72,
        }}
      >
        <span className="t3-eyebrow t3-eyebrow-dark">{eyebrow}</span>
        <h2 className="t3-headline-xl" style={{ marginTop: 28, color: 'var(--t3-dark-text)' }}>
          {headline}
        </h2>
        {body && (
          <p
            className="t3-body t3-body-lg t3-body-dark"
            style={{ marginTop: 24, marginLeft: 'auto', marginRight: 'auto' }}
          >
            {body}
          </p>
        )}
      </div>

      {/* Cruise row */}
      {cruise.length > 0 && (
        <div style={{ padding: '40px 0', borderTop: '1px solid rgba(247,245,240,0.08)' }}>
          <RowLabel label="Cruise Partners" />
          <Marquee partners={cruise} duration={45} />
        </div>
      )}

      {/* Hotel row */}
      {hotel.length > 0 && (
        <div
          style={{
            padding: '40px 0',
            borderTop: '1px solid rgba(247,245,240,0.08)',
            borderBottom: '1px solid rgba(247,245,240,0.08)',
          }}
        >
          <RowLabel label="Hotel & Resort Partners" />
          <Marquee partners={hotel} duration={55} reverse />
        </div>
      )}
    </section>
  )
}

function RowLabel({ label }: { label: string }) {
  return (
    <div
      style={{
        textAlign: 'center',
        fontSize: 10,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'var(--t3-dark-muted)',
        marginBottom: 28,
        fontWeight: 500,
      }}
    >
      {label}
    </div>
  )
}

function Marquee({
  partners,
  duration,
  reverse,
}: {
  partners: FeaturedPartner[]
  duration: number
  reverse?: boolean
}) {
  // Duplicate the partners list so the marquee can loop seamlessly
  const items = [...partners, ...partners]

  return (
    <div className="t3-marquee">
      <div
        className="t3-marquee-track"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {items.map((p, i) => (
          <div
            key={`${p.id}-${i}`}
            className="t3-marquee-item"
            title={p.name}
          >
            {p.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.logo_url}
                alt={p.name}
                style={{ maxHeight: 44, maxWidth: 180, objectFit: 'contain' }}
              />
            ) : (
              <span
                style={{
                  fontFamily: 'var(--t3-font-display)',
                  fontSize: 18,
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  color: 'var(--t3-dark-text)',
                  whiteSpace: 'nowrap',
                }}
              >
                {p.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
