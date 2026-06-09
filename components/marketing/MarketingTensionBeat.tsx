/**
 * Homepage "Tension beat" — sits between the Hero and the feature grid.
 * Names the problem the platform solves, then pivots into the value proposition,
 * leading the eye down into "What 'maintained for you' actually means." No CTA by
 * design. Mirrors the eyebrow/headline/body tokens of the surrounding sections
 * (Curated Editorial / Network) rather than introducing a new visual style.
 */
export function MarketingTensionBeat() {
  return (
    <section className="eah-section" style={{ padding: '100px 24px', background: '#fafafa' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
        <span
          style={{
            display: 'inline-block',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#7c3aed',
            marginBottom: '20px',
          }}
        >
          The problem with most advisor websites
        </span>
        <h2
          style={{
            fontSize: 'clamp(32px, 4vw, 44px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            margin: '0 0 24px',
            color: '#0a0a0a',
          }}
        >
          Your website is the one part of the experience you don&rsquo;t control.
        </h2>
        <p
          style={{
            fontSize: '17px',
            lineHeight: 1.7,
            color: '#52525b',
            margin: '0 auto 36px',
            maxWidth: '640px',
          }}
        >
          You curate every hotel, every transfer, every dinner reservation. Then a client searches
          your name and lands on a host-agency subdomain building someone else&rsquo;s ranking — or a
          template you haven&rsquo;t touched since launch. The supplier grids go stale. The journal
          stops in March. The page that&rsquo;s meant to introduce you quietly undersells you.
        </p>
        <p
          style={{
            fontSize: 'clamp(20px, 2.4vw, 26px)',
            fontWeight: 600,
            letterSpacing: '-0.015em',
            lineHeight: 1.4,
            color: '#0a0a0a',
            margin: '0 auto',
            maxWidth: '620px',
          }}
        >
          It shouldn&rsquo;t be a project you maintain. It should be infrastructure that&rsquo;s
          maintained for you.
        </p>
      </div>
    </section>
  )
}
