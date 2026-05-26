interface PortalFeature {
  label: string
  title: string
  description: string
  preview: React.ReactNode
}

function BlogPreview() {
  return (
    <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'inherit' }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f57' }} />
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#febc2e' }} />
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#28c840' }} />
      </div>
      <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>portal.eliteadvisorhub.com / journal</div>
      <div style={{ marginTop: '4px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', marginBottom: '6px' }}>New post — Tokyo in November</div>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
          {['B', 'I', 'H1', 'H2', '"', '🔗', '📷'].map((t) => (
            <span key={t} style={{ fontSize: '11px', padding: '4px 8px', background: '#f4f4f5', borderRadius: '4px', color: '#52525b', fontWeight: 500 }}>{t}</span>
          ))}
        </div>
        <div style={{ background: '#fafafa', borderRadius: '6px', padding: '12px', minHeight: '70px', fontSize: '12px', color: '#71717a', lineHeight: 1.5 }}>
          The autumn shoulder is the city's best-kept secret — clear skies, persimmon trees in the temple gardens, and the kaiseki menus shifting to matsutake and chestnut…
        </div>
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>● Auto-saved</span>
          <span style={{ fontSize: '11px', padding: '6px 12px', background: '#7c3aed', color: '#fff', borderRadius: '6px', fontWeight: 600 }}>Publish</span>
        </div>
      </div>
    </div>
  )
}

function LeadsPreview() {
  return (
    <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>Inbox · 3 new</div>
      {[
        { name: 'Sarah Lin', subject: 'Honeymoon — Italian Lakes, September', tag: 'New', tagBg: '#a78bfa' },
        { name: 'David Park', subject: 'Family safari, Tanzania — 8 travelers', tag: 'New', tagBg: '#a78bfa' },
        { name: 'Emma Chen', subject: 'Re: Aman Tokyo confirmation', tag: 'Replied', tagBg: '#86efac' },
      ].map((lead) => (
        <div key={lead.name} style={{ padding: '12px', background: '#fafafa', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#0a0a0a' }}>{lead.name}</div>
            <div style={{ fontSize: '11px', color: '#71717a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.subject}</div>
          </div>
          <span style={{ fontSize: '9px', padding: '3px 8px', background: lead.tagBg, color: '#0a0a0a', borderRadius: '4px', fontWeight: 700, letterSpacing: '0.04em' }}>{lead.tag}</span>
        </div>
      ))}
    </div>
  )
}

function SupplierPreview() {
  return (
    <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>Featured Supplier Programs</div>
      {[
        { name: 'Belmond Bellini Club', on: true },
        { name: 'Four Seasons Preferred', on: true },
        { name: 'Aman', on: true },
        { name: 'Rosewood Elite', on: false },
        { name: 'Mandarin Oriental Fan Club', on: true },
      ].map((s) => (
        <div key={s.name} style={{ padding: '10px 12px', background: '#fafafa', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12.5px', color: '#0a0a0a', fontWeight: 500 }}>{s.name}</span>
          <span
            style={{
              width: '32px', height: '18px', borderRadius: '10px',
              background: s.on ? '#7c3aed' : '#e4e4e7',
              position: 'relative',
              transition: 'background 0.2s ease',
            }}
          >
            <span
              style={{
                position: 'absolute', top: '2px',
                left: s.on ? '16px' : '2px',
                width: '14px', height: '14px',
                borderRadius: '50%', background: '#fff',
                transition: 'left 0.2s ease',
              }}
            />
          </span>
        </div>
      ))}
    </div>
  )
}

function BillingPreview() {
  return (
    <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>Subscription · Growth</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '28px', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em' }}>$179</span>
        <span style={{ fontSize: '13px', color: '#71717a' }}>/ month</span>
      </div>
      <div style={{ marginTop: '4px', padding: '12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#166534' }}>● Active</div>
        <div style={{ fontSize: '11px', color: '#15803d', marginTop: '2px' }}>Next invoice 1 Jun · Visa •••• 4242</div>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        <span style={{ flex: 1, padding: '8px', background: '#fafafa', borderRadius: '6px', fontSize: '11px', color: '#52525b', textAlign: 'center', fontWeight: 500 }}>Update card</span>
        <span style={{ flex: 1, padding: '8px', background: '#fafafa', borderRadius: '6px', fontSize: '11px', color: '#52525b', textAlign: 'center', fontWeight: 500 }}>Invoices</span>
      </div>
    </div>
  )
}

const FEATURES: PortalFeature[] = [
  {
    label: 'Publish',
    title: 'Write and publish in a clean editor',
    description: 'A focused Tiptap composer for your own posts. Curated articles from our editorial team appear automatically — your portal shows everything in one feed.',
    preview: <BlogPreview />,
  },
  {
    label: 'Leads',
    title: 'Client enquiries, straight to you',
    description: 'Every contact form submission lands in your portal inbox with the source page attached. Reply directly, mark replied, never lose a thread.',
    preview: <LeadsPreview />,
  },
  {
    label: 'Curate',
    title: 'Choose the suppliers that go on your site',
    description: 'Toggle which supplier programs appear on your home page and book-hotel landing. Reorder them with a drag. The catalog stays maintained on our end.',
    preview: <SupplierPreview />,
  },
  {
    label: 'Billing',
    title: 'Self-serve billing, no calls required',
    description: 'Update your card, download invoices, change tiers, or pause your subscription. All from the portal, all without emailing us.',
    preview: <BillingPreview />,
  },
]

export function MarketingAdvisorPortal() {
  return (
    <section
      style={{
        padding: '120px 24px',
        background: '#ffffff',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ maxWidth: '720px', marginBottom: '64px' }}>
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
            Advisor Portal
          </span>
          <h2
            style={{
              fontSize: 'clamp(32px, 4vw, 44px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              margin: '0 0 20px',
              color: '#0a0a0a',
            }}
          >
            Everything you manage, in one quiet portal.
          </h2>
          <p
            style={{
              fontSize: '17px',
              lineHeight: 1.65,
              color: '#52525b',
              margin: 0,
              maxWidth: '640px',
            }}
          >
            One secure login (magic link — no passwords to lose) gives you the editor, the inbox, the
            supplier toggles, and the billing. Built for advisors, not engineers.
          </p>
        </div>

        <div
          className="eah-portal-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px',
          }}
        >
          {FEATURES.map((feature) => (
            <div
              key={feature.label}
              style={{
                background: '#fafafa',
                borderRadius: '20px',
                border: '1px solid #ececec',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ padding: '28px 32px 24px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#7c3aed',
                    marginBottom: '12px',
                  }}
                >
                  {feature.label}
                </span>
                <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 600, letterSpacing: '-0.01em', color: '#0a0a0a' }}>
                  {feature.title}
                </h3>
                <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.6, color: '#71717a' }}>
                  {feature.description}
                </p>
              </div>
              <div
                style={{
                  margin: '0 24px 24px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #ececec',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                  overflow: 'hidden',
                }}
              >
                {feature.preview}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .eah-portal-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
