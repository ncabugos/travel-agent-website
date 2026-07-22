/**
 * Homepage closing CTA band — sits after the Insights section, before the footer.
 * Mirrors the dark Network-section treatment (navy gradient, white headline) and
 * reuses the hero CTA button styling so the page closes on a familiar, premium
 * note. Primary CTA → consultation; secondary → pricing.
 */
export function MarketingClosingCTA() {
  return (
    <section
      className="eah-section"
      style={{
        padding: '120px 24px',
        background: 'linear-gradient(180deg, #0a0b1e 0%, #14163a 100%)',
        color: '#fafafa',
      }}
    >
      <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
        <h2
          style={{
            fontSize: 'clamp(34px, 4.4vw, 52px)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.08,
            margin: '0 0 24px',
            color: '#ffffff',
          }}
        >
          Your next client will look you up before they call.
        </h2>
        <p
          style={{
            fontSize: '18px',
            lineHeight: 1.65,
            color: '#c4c4d0',
            margin: '0 auto 40px',
            maxWidth: '560px',
          }}
        >
          When they do, the site should do what you&rsquo;d do in the room — set the standard, then
          step out of the way. Your first 30 days are with our compliments; begin whenever
          you&rsquo;re ready.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="/schedule-consultation"
            className="eah-closing-primary eah-btn-lux"
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
              color: '#fff',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(124, 58, 237, 0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            Schedule a consultation
          </a>
          <a
            href="#pricing"
            style={{
              padding: '14px 32px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#fff',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 500,
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.25)',
              backdropFilter: 'blur(8px)',
              transition: 'background 0.2s',
            }}
          >
            Explore pricing
          </a>
        </div>
      </div>

      <style>{`
        .eah-closing-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 32px rgba(124,58,237,0.5) !important;
        }
      `}</style>
    </section>
  )
}
