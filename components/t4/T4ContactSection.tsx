import Link from 'next/link'

interface T4ContactSectionProps {
  agentId: string
  eyebrow?: string
  heading?: string
  body?: string
  phone?: string | null
  email?: string | null
  address?: string | null
}

/**
 * T4 contact block — editorial split with a quiet invite on one side and
 * contact particulars on the other. Used on the homepage as a final CTA.
 */
export function T4ContactSection({
  agentId,
  eyebrow = 'Begin',
  heading = 'Every journey begins in conversation.',
  body = "Tell us where you are dreaming of — we will reach out within a business day, by phone or email, to discuss what's possible.",
  phone,
  email,
  address,
}: T4ContactSectionProps) {
  const base = `/t4/${agentId}`

  return (
    <section
      style={{
        padding: 'var(--t4-section-pad) 48px',
        background: 'var(--t4-bg-deeper)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--t4-content-max)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 96,
          alignItems: 'start',
        }}
        className="t4-contact-grid"
      >
        <div>
          <span className="t4-eyebrow">{eyebrow}</span>
          <h2 className="t4-headline-xl" style={{ marginTop: 28, marginBottom: 28 }}>
            {heading}
          </h2>
          <p className="t4-body t4-body-lg" style={{ marginBottom: 40, maxWidth: 520 }}>
            {body}
          </p>
          <Link href={`${base}/contact`} className="t4-btn t4-btn-solid">
            Start a Conversation
          </Link>
        </div>

        <div>
          <div style={{ borderTop: '1px solid var(--t4-divider)', paddingTop: 28 }}>
            <DetailRow label="By Phone" value={phone ?? '+1 (415) 555 0134'} />
            <DetailRow label="By Email" value={email ?? 'hello@casasolis.com'} />
            <DetailRow label="Our Studio" value={address ?? 'Via Roma 28 · Solferino · Italy'} last />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .t4-contact-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  )
}

function DetailRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr',
        gap: 24,
        padding: '20px 0',
        borderBottom: last ? 'none' : '1px solid var(--t4-divider)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--t4-font-body)',
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.26em',
          textTransform: 'uppercase',
          color: 'var(--t4-accent)',
          paddingTop: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--t4-font-display)',
          fontSize: 19,
          fontWeight: 400,
          color: 'var(--t4-text)',
          lineHeight: 1.45,
        }}
      >
        {value}
      </div>
    </div>
  )
}
