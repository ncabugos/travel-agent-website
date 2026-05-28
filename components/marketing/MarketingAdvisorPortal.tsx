'use client'

import { useEffect, useRef, useState } from 'react'

interface PortalFeature {
  label: string
  title: string
  description: string
  preview: React.ReactNode
}

// ────────────────────────────────────────────────────────────────────────────
// Animation primitives
// ────────────────────────────────────────────────────────────────────────────

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(m.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    m.addEventListener('change', handler)
    return () => m.removeEventListener('change', handler)
  }, [])
  return reduced
}

function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, inView] as const
}

function useLoop(totalMs: number, inView: boolean, freeze: boolean) {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    if (freeze) {
      setElapsed(totalMs - 1)
      return
    }
    if (!inView) return
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      setElapsed((now - start) % totalMs)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, totalMs, freeze])
  return elapsed
}

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v
}

function ramp(t: number, a: number, b: number) {
  if (t <= a) return 0
  if (t >= b) return 1
  return (t - a) / (b - a)
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function typeSlice(text: string, progress: number) {
  return text.slice(0, Math.ceil(text.length * clamp01(progress)))
}

// ────────────────────────────────────────────────────────────────────────────
// Blog: typewriter → publish → live on the advisor site
// ────────────────────────────────────────────────────────────────────────────

const TITLE_TEXT = 'New post — Tokyo in November'
const BODY_TEXT =
  "The autumn shoulder is the city's best-kept secret — clear skies, persimmon trees in the temple gardens, and the kaiseki menus shifting to matsutake and chestnut…"

function BlogPreview() {
  const reduced = usePrefersReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>()
  const elapsed = useLoop(8000, inView, reduced)

  const titleProgress = ramp(elapsed, 200, 1400)
  const titleVisible = typeSlice(TITLE_TEXT, titleProgress)

  const toolbarOpacity = ramp(elapsed, 1400, 1700)

  const bodyProgress = ramp(elapsed, 1700, 3300)
  const bodyVisible = typeSlice(BODY_TEXT, bodyProgress)

  const savedOpacity = ramp(elapsed, 3300, 3600)

  const publishPress = elapsed > 3800 && elapsed < 4100
  const publishGlow = elapsed > 3800 && elapsed < 4400

  const editorOpacity = 1 - ramp(elapsed, 4200, 4600)
  const liveOpacity = ramp(elapsed, 4400, 4800)
  const liveScale = 0.94 + 0.06 * easeOut(ramp(elapsed, 4400, 5200))

  const caret = Math.floor(elapsed / 500) % 2 === 0
  const titleTyping = titleProgress > 0 && titleProgress < 1
  const bodyTyping = bodyProgress > 0 && bodyProgress < 1

  return (
    <div ref={ref} style={{ position: 'relative', padding: '16px 18px', minHeight: '270px' }}>
      {/* PHASE 1 — editor */}
      <div style={{ opacity: editorOpacity, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f57' }} />
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#febc2e' }} />
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#28c840' }} />
        </div>
        <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>
          portal.eliteadvisorhub.com / journal
        </div>
        <div style={{ marginTop: '4px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', marginBottom: '6px', minHeight: '20px' }}>
            {titleVisible}
            {titleTyping && (
              <span
                style={{
                  display: 'inline-block',
                  width: '1.5px',
                  height: '12px',
                  background: '#7c3aed',
                  marginLeft: '2px',
                  verticalAlign: 'middle',
                  opacity: caret ? 1 : 0,
                }}
              />
            )}
          </div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', opacity: toolbarOpacity }}>
            {['B', 'I', 'H1', 'H2', '"', '🔗', '📷'].map((t) => (
              <span
                key={t}
                style={{
                  fontSize: '11px',
                  padding: '4px 8px',
                  background: '#f4f4f5',
                  borderRadius: '4px',
                  color: '#52525b',
                  fontWeight: 500,
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <div
            style={{
              background: '#fafafa',
              borderRadius: '6px',
              padding: '12px',
              minHeight: '70px',
              fontSize: '12px',
              color: '#71717a',
              lineHeight: 1.5,
            }}
          >
            {bodyVisible}
            {bodyTyping && (
              <span
                style={{
                  display: 'inline-block',
                  width: '1.5px',
                  height: '11px',
                  background: '#7c3aed',
                  marginLeft: '2px',
                  verticalAlign: 'middle',
                  opacity: caret ? 1 : 0,
                }}
              />
            )}
          </div>
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600, opacity: savedOpacity }}>
              ● Auto-saved
            </span>
            <span
              style={{
                fontSize: '11px',
                padding: '6px 12px',
                background: '#7c3aed',
                color: '#fff',
                borderRadius: '6px',
                fontWeight: 600,
                display: 'inline-block',
                transform: publishPress ? 'scale(0.94)' : 'scale(1)',
                boxShadow: publishGlow ? '0 0 0 5px rgba(124,58,237,0.18)' : '0 0 0 0 rgba(124,58,237,0)',
                transition: 'transform 140ms ease-out, box-shadow 220ms ease-out',
              }}
            >
              Publish
            </span>
          </div>
        </div>
      </div>

      {/* PHASE 2 — live on advisor site */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: '16px 18px',
          opacity: liveOpacity,
          pointerEvents: 'none',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          transform: `scale(${liveScale})`,
          transformOrigin: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f57' }} />
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#febc2e' }} />
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#28c840' }} />
        </div>
        <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>
          wineandwellnesstravel.com / journal
        </div>
        <div
          style={{
            marginTop: '4px',
            background: '#fafafa',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #f4f4f5',
          }}
        >
          <div
            style={{
              height: '64px',
              background: 'linear-gradient(135deg, #ddd6fe 0%, #fde68a 60%, #fca5a5 100%)',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                padding: '3px 8px',
                background: 'rgba(255,255,255,0.85)',
                color: '#16a34a',
                borderRadius: '999px',
              }}
            >
              ● LIVE
            </span>
          </div>
          <div style={{ padding: '12px 14px' }}>
            <div
              style={{
                fontSize: '9px',
                color: '#a78bfa',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              Journal · Japan
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', marginBottom: '4px' }}>
              {TITLE_TEXT}
            </div>
            <div style={{ fontSize: '11px', color: '#71717a', lineHeight: 1.45 }}>
              The autumn shoulder is the city's best-kept secret — clear skies, persimmon trees in the temple
              gardens…
            </div>
            <div style={{ fontSize: '10px', color: '#a1a1aa', marginTop: '8px' }}>
              5 min read · Just published
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Leads: enquiries sliding into the inbox
// ────────────────────────────────────────────────────────────────────────────

interface Lead {
  name: string
  subject: string
  entryMs: number
  replyMs?: number
}

const LEADS: Lead[] = [
  { name: 'Sarah Lin', subject: 'Honeymoon — Italian Lakes, September', entryMs: 300 },
  { name: 'David Park', subject: 'Family safari, Tanzania — 8 travelers', entryMs: 1100 },
  { name: 'Emma Chen', subject: 'Re: Aman Tokyo confirmation', entryMs: 1900, replyMs: 3200 },
]

function LeadsPreview() {
  const reduced = usePrefersReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>()
  const elapsed = useLoop(6000, inView, reduced)

  let newCount = 0
  for (const lead of LEADS) {
    if (elapsed >= lead.entryMs) newCount += 1
    if (lead.replyMs && elapsed >= lead.replyMs) newCount -= 1
  }

  return (
    <div ref={ref} style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '220px' }}>
      <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>
        Inbox · <span style={{ color: newCount > 0 ? '#7c3aed' : '#9ca3af', fontWeight: 600 }}>{newCount} new</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {LEADS.map((lead) => {
          const enter = easeOut(ramp(elapsed, lead.entryMs, lead.entryMs + 500))
          const replied = lead.replyMs ? elapsed >= lead.replyMs : false
          const replyHighlight = lead.replyMs ? ramp(elapsed, lead.replyMs, lead.replyMs + 400) > 0 && ramp(elapsed, lead.replyMs, lead.replyMs + 400) < 1 : false
          const tagLabel = replied ? 'Replied' : 'New'
          const tagBg = replied ? '#86efac' : '#a78bfa'
          return (
            <div
              key={lead.name}
              style={{
                padding: '12px',
                background: replyHighlight ? '#f0fdf4' : '#fafafa',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                opacity: enter,
                transform: `translateY(${(1 - enter) * 10}px)`,
                transition: 'background 280ms ease-out',
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#0a0a0a' }}>{lead.name}</div>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#71717a',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {lead.subject}
                </div>
              </div>
              <span
                style={{
                  fontSize: '9px',
                  padding: '3px 8px',
                  background: tagBg,
                  color: '#0a0a0a',
                  borderRadius: '4px',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  transition: 'background 220ms ease-out',
                }}
              >
                {tagLabel}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Suppliers: toggles flipping on in sequence
// ────────────────────────────────────────────────────────────────────────────

interface Supplier {
  name: string
  onAtMs: number | null
}

const SUPPLIERS: Supplier[] = [
  { name: 'Belmond Bellini Club', onAtMs: 300 },
  { name: 'Four Seasons Preferred', onAtMs: 600 },
  { name: 'Aman', onAtMs: 900 },
  { name: 'Rosewood Elite', onAtMs: null },
  { name: 'Mandarin Oriental Fan Club', onAtMs: 1500 },
]

function SupplierPreview() {
  const reduced = usePrefersReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>()
  const elapsed = useLoop(5000, inView, reduced)

  return (
    <div ref={ref} style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>Featured Supplier Programs</div>
      {SUPPLIERS.map((s) => {
        const on = s.onAtMs !== null && elapsed >= s.onAtMs
        const justFlipped = s.onAtMs !== null && elapsed >= s.onAtMs && elapsed < s.onAtMs + 400
        return (
          <div
            key={s.name}
            style={{
              padding: '10px 12px',
              background: justFlipped ? '#faf5ff' : '#fafafa',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'background 320ms ease-out',
            }}
          >
            <span style={{ fontSize: '12.5px', color: '#0a0a0a', fontWeight: 500 }}>{s.name}</span>
            <span
              style={{
                width: '32px',
                height: '18px',
                borderRadius: '10px',
                background: on ? '#7c3aed' : '#e4e4e7',
                position: 'relative',
                transition: 'background 280ms ease-out',
                display: 'inline-block',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  left: on ? '16px' : '2px',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: '#fff',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.18)',
                  transition: 'left 280ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              />
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Billing: counter-up + active badge pop
// ────────────────────────────────────────────────────────────────────────────

function BillingPreview() {
  const reduced = usePrefersReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>()
  const elapsed = useLoop(5000, inView, reduced)

  const counterProgress = easeOut(ramp(elapsed, 300, 1500))
  const price = Math.round(179 * counterProgress)

  const activeOpacity = ramp(elapsed, 1500, 1900)
  const activeScale = 0.85 + 0.15 * easeOut(ramp(elapsed, 1500, 2100))
  const activePulse = elapsed > 1500 && elapsed < 2100

  const invoiceOpacity = ramp(elapsed, 2000, 2400)
  const buttonsOpacity = ramp(elapsed, 2400, 2800)

  return (
    <div ref={ref} style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '180px' }}>
      <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>Subscription · Growth</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#0a0a0a',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          ${price}
        </span>
        <span style={{ fontSize: '13px', color: '#71717a' }}>/ month</span>
      </div>
      <div
        style={{
          marginTop: '4px',
          padding: '12px',
          background: '#f0fdf4',
          borderRadius: '8px',
          border: '1px solid #bbf7d0',
          opacity: activeOpacity,
          transform: `scale(${activeScale})`,
          transformOrigin: 'left center',
          boxShadow: activePulse ? '0 0 0 6px rgba(34,197,94,0.10)' : '0 0 0 0 rgba(34,197,94,0)',
          transition: 'box-shadow 600ms ease-out',
        }}
      >
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#166534' }}>● Active</div>
        <div style={{ fontSize: '11px', color: '#15803d', marginTop: '2px', opacity: invoiceOpacity }}>
          Next invoice 1 Jun · Visa •••• 4242
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '4px', opacity: buttonsOpacity }}>
        <span
          style={{
            flex: 1,
            padding: '8px',
            background: '#fafafa',
            borderRadius: '6px',
            fontSize: '11px',
            color: '#52525b',
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          Update card
        </span>
        <span
          style={{
            flex: 1,
            padding: '8px',
            background: '#fafafa',
            borderRadius: '6px',
            fontSize: '11px',
            color: '#52525b',
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          Invoices
        </span>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────

const FEATURES: PortalFeature[] = [
  {
    label: 'Publish',
    title: 'Write and publish in a clean editor',
    description:
      'A focused Tiptap composer for your own posts. Curated articles from our editorial team appear automatically — your portal shows everything in one feed.',
    preview: <BlogPreview />,
  },
  {
    label: 'Leads',
    title: 'Client enquiries, straight to you',
    description:
      'Every contact form submission lands in your portal inbox with the source page attached. Reply directly, mark replied, never lose a thread.',
    preview: <LeadsPreview />,
  },
  {
    label: 'Curate',
    title: 'Choose the suppliers that go on your site',
    description:
      'Toggle which supplier programs appear on your home page and book-hotel landing. Reorder them with a drag. The catalog stays maintained on our end.',
    preview: <SupplierPreview />,
  },
  {
    label: 'Billing',
    title: 'Self-serve billing, no calls required',
    description:
      'Update your card, download invoices, change tiers, or pause your subscription. All from the portal, all without emailing us.',
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
                <h3
                  style={{
                    margin: '0 0 8px',
                    fontSize: '20px',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    color: '#0a0a0a',
                  }}
                >
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
