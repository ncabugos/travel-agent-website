'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Studio "Capabilities" showcase — a dark, animated section that demonstrates
 * the marketing services (social, content/GEO, AI visibility, email, design) as
 * live device mockups. Reuses the animation approach from MarketingAdvisorPortal
 * (IntersectionObserver + rAF loop + ramp/ease helpers), restyled to the Studio
 * gold/charcoal identity and laid out as alternating feature rows.
 */

const GOLD = '#B49A5A'
const GOLD_LIGHT = '#D8C28A'

// ── Animation primitives ─────────────────────────────────────────────────────

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
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold })
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

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const ramp = (t: number, a: number, b: number) => (t <= a ? 0 : t >= b ? 1 : (t - a) / (b - a))
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const typeSlice = (text: string, p: number) => text.slice(0, Math.ceil(text.length * clamp01(p)))
const fmt = (n: number) => new Intl.NumberFormat('en-US').format(Math.round(n))

// Frame used by the browser / editor mocks — three traffic-light dots + a URL.
function Chrome({ url }: { url: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderBottom: '1px solid #efece6' }}>
      <span style={{ display: 'flex', gap: '5px' }}>
        <i style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ff5f57' }} />
        <i style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#febc2e' }} />
        <i style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#28c840' }} />
      </span>
      <span style={{ flex: 1, textAlign: 'center', fontSize: '10.5px', color: '#9a948b', fontWeight: 500 }}>{url}</span>
      <span style={{ width: '30px' }} />
    </div>
  )
}

// ── Social media — phone feed ────────────────────────────────────────────────

function SocialMock() {
  const reduced = usePrefersReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>()
  const t = useLoop(7000, inView, reduced)

  const postIn = easeOut(ramp(t, 700, 1300))
  const likes = Math.round(1284 * easeOut(ramp(t, 1500, 3000)))
  const heartPop = t > 1500 && t < 1800
  const captionOp = ramp(t, 1700, 2100)
  const chip = easeOut(ramp(t, 3300, 3900))

  return (
    <div ref={ref} style={{ width: '248px', borderRadius: '34px', padding: '10px', background: '#0d0b09', boxShadow: '0 30px 60px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(180,154,90,0.18)' }}>
      <div style={{ borderRadius: '26px', overflow: 'hidden', background: '#fff', position: 'relative' }}>
        {/* app bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px 8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#0a0a0a' }}>wine.wellness.travel</span>
          <span style={{ fontSize: '13px', color: GOLD }}>◆</span>
        </div>
        {/* stories */}
        <div style={{ display: 'flex', gap: '10px', padding: '2px 14px 12px' }}>
          {[0, 1, 2, 3, 4].map((i) => {
            const s = easeOut(ramp(t, 200 + i * 120, 600 + i * 120))
            return (
              <span key={i} style={{ width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0, transform: `scale(${s})`, background: `conic-gradient(from 210deg, ${GOLD}, #e9c98a, ${GOLD})`, padding: '2px' }}>
                <span style={{ display: 'block', width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg,#efe8db,#d8c9ad)', border: '2px solid #fff' }} />
              </span>
            )
          })}
        </div>
        {/* post */}
        <div style={{ opacity: postIn, transform: `translateY(${(1 - postIn) * 12}px)` }}>
          <div
            style={{
              height: '150px',
              background:
                "linear-gradient(180deg, rgba(13,11,9,0) 45%, rgba(13,11,9,0.6) 100%), url('/media/cruises/ama-waterways/amawaterways-amamagna-winery-1500.jpg') center 65% / cover",
              position: 'relative',
            }}
          >
            <span style={{ position: 'absolute', left: '12px', bottom: '10px', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.92)', textTransform: 'uppercase' }}>Harvest season · Napa</span>
          </div>
          <div style={{ padding: '10px 14px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '16px' }}>
              <span style={{ display: 'inline-block', transform: heartPop ? 'scale(1.35)' : 'scale(1)', transition: 'transform 180ms ease-out', color: '#e0245e' }}>♥</span>
              <span style={{ color: '#333' }}>💬</span>
              <span style={{ color: '#333' }}>➤</span>
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0a0a0a', marginTop: '8px', fontVariantNumeric: 'tabular-nums' }}>{fmt(likes)} likes</div>
            <div style={{ fontSize: '11px', color: '#52525b', marginTop: '3px', lineHeight: 1.4, opacity: captionOp }}>
              <b style={{ color: '#0a0a0a' }}>wine.wellness.travel</b> The vines are turning gold. Three suites left for harvest week…
            </div>
          </div>
        </div>
        {/* scheduled chip */}
        <div style={{ position: 'absolute', left: '50%', bottom: '14px', transform: `translateX(-50%) translateY(${(1 - chip) * 16}px)`, opacity: chip, display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 14px', borderRadius: '999px', background: 'rgba(13,11,9,0.92)', backdropFilter: 'blur(6px)', boxShadow: '0 8px 20px -6px rgba(0,0,0,0.5)' }}>
          <span style={{ fontSize: '11px', color: GOLD_LIGHT }}>✓</span>
          <span style={{ fontSize: '11px', color: '#fff', fontWeight: 600, whiteSpace: 'nowrap' }}>12 posts scheduled this week</span>
        </div>
      </div>
    </div>
  )
}

// ── Content & GEO — editor → published cadence ───────────────────────────────

const ART_TITLE = 'The Napa Harvest, Timed to the Hour'
const PUBS = ['Where to Taste in Piedmont', 'A Slow Week on Lake Como', 'Bordeaux, En Primeur']

function ContentMock() {
  const reduced = usePrefersReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>()
  const t = useLoop(9000, inView, reduced)

  const title = typeSlice(ART_TITLE, ramp(t, 400, 1900))
  const titleTyping = ramp(t, 400, 1900) > 0 && ramp(t, 400, 1900) < 1
  const caret = Math.floor(t / 450) % 2 === 0
  const lines = [ramp(t, 2000, 2500), ramp(t, 2400, 2900), ramp(t, 2800, 3300)]
  const geoBadge = ramp(t, 3300, 3700)
  const press = t > 3900 && t < 4200
  const editorOp = 1 - ramp(t, 4400, 4800)
  const feedOp = ramp(t, 4700, 5100)

  return (
    <div ref={ref} style={{ width: '330px', borderRadius: '16px', overflow: 'hidden', background: '#fff', position: 'relative', minHeight: '286px', boxShadow: '0 30px 60px -24px rgba(0,0,0,0.55), 0 0 0 1px rgba(180,154,90,0.16)' }}>
      <Chrome url="portal.eliteadvisorhub.com / journal" />
      {/* editor */}
      <div style={{ padding: '16px 18px', opacity: editorOp }}>
        <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', color: GOLD, textTransform: 'uppercase' }}>New article</div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#0a0a0a', margin: '8px 0 12px', minHeight: '20px' }}>
          {title}
          {titleTyping && <span style={{ display: 'inline-block', width: '2px', height: '14px', background: GOLD, marginLeft: '2px', verticalAlign: 'middle', opacity: caret ? 1 : 0 }} />}
        </div>
        {lines.map((w, i) => (
          <div key={i} style={{ height: '8px', borderRadius: '4px', background: '#efece6', marginBottom: '9px', width: `${w * (i === 2 ? 66 : 100)}%`, transition: 'width 120ms linear' }} />
        ))}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, color: '#0f7a3d', opacity: geoBadge, padding: '4px 9px', background: '#eafaf0', borderRadius: '999px' }}>✓ GEO-optimized</span>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#fff', background: GOLD, padding: '7px 14px', borderRadius: '8px', transform: press ? 'scale(0.94)' : 'scale(1)', boxShadow: press ? `0 0 0 5px rgba(180,154,90,0.22)` : 'none', transition: 'transform 140ms, box-shadow 200ms' }}>Publish</span>
        </div>
      </div>
      {/* published feed */}
      <div aria-hidden style={{ position: 'absolute', inset: '41px 0 0', opacity: feedOp, background: '#fff', padding: '16px 18px' }}>
        <div style={{ fontSize: '11px', color: '#71717a', fontWeight: 600, marginBottom: '12px' }}>This month · <span style={{ color: GOLD }}>4 published</span></div>
        {[ART_TITLE, ...PUBS].map((title2, i) => {
          const inn = easeOut(ramp(t, 5000 + i * 260, 5400 + i * 260))
          return (
            <div key={title2} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 0', borderTop: i ? '1px solid #f2f0ea' : 'none', opacity: inn, transform: `translateY(${(1 - inn) * 8}px)` }}>
              <span style={{ width: '30px', height: '30px', borderRadius: '7px', flexShrink: 0, background: 'linear-gradient(135deg,#c9b78f,#7d6842)' }} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#0a0a0a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title2}</span>
                <span style={{ fontSize: '10px', color: '#9a948b' }}>GEO ✓ · 5 min read</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── AI visibility — multi-engine chat ────────────────────────────────────────

const ENGINES = ['ChatGPT', 'Perplexity', 'Google AI']
const Q = 'Best advisor for a Bordeaux wine trip?'
const A_PRE = 'For a Bordeaux wine journey, '
const A_NAME = 'Wine & Wellness Travel'
const A_POST = ' is a standout — a Virtuoso advisor specializing in slow-paced wine and wellness trips with VIP perks.'

function AiMock() {
  const reduced = usePrefersReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>()
  const t = useLoop(9000, inView, reduced)

  const active = Math.floor(t / 1400) % ENGINES.length
  const qText = typeSlice(Q, ramp(t, 300, 1300))
  const showDots = t > 1400 && t < 2300
  const aProg = ramp(t, 2300, 5200)
  const total = A_PRE.length + A_NAME.length + A_POST.length
  const n = Math.ceil(total * clamp01(aProg))
  const pre = A_PRE.slice(0, n)
  const nm = A_NAME.slice(0, Math.max(0, n - A_PRE.length))
  const post = A_POST.slice(0, Math.max(0, n - A_PRE.length - A_NAME.length))
  const source = ramp(t, 5200, 5600)
  const verified = easeOut(ramp(t, 5600, 6100))

  return (
    <div ref={ref} style={{ width: '340px', borderRadius: '16px', overflow: 'hidden', background: '#fff', boxShadow: '0 30px 60px -24px rgba(0,0,0,0.55), 0 0 0 1px rgba(180,154,90,0.16)' }}>
      {/* engine tabs */}
      <div style={{ display: 'flex', gap: '4px', padding: '10px 12px 0', borderBottom: '1px solid #efece6' }}>
        {ENGINES.map((e, i) => (
          <span key={e} style={{ position: 'relative', fontSize: '11px', fontWeight: 600, padding: '6px 10px 10px', color: i === active ? '#0a0a0a' : '#a8a29a' }}>
            {e}
            <span style={{ position: 'absolute', left: '6px', right: '6px', bottom: 0, height: '2px', borderRadius: '2px', background: GOLD, opacity: i === active ? 1 : 0, transition: 'opacity 220ms' }} />
          </span>
        ))}
      </div>
      <div style={{ padding: '16px', minHeight: '210px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* user */}
        <div style={{ alignSelf: 'flex-end', maxWidth: '82%', background: '#1A1715', color: '#fff', fontSize: '12px', lineHeight: 1.4, padding: '9px 12px', borderRadius: '13px 13px 3px 13px' }}>
          {qText || ' '}
        </div>
        {/* assistant */}
        {(showDots || aProg > 0) && (
          <div style={{ alignSelf: 'flex-start', maxWidth: '90%', background: '#f6f3ec', border: '1px solid #ece6da', fontSize: '12px', lineHeight: 1.5, padding: '10px 12px', borderRadius: '13px 13px 13px 3px', color: '#3f3a33' }}>
            {showDots ? (
              <span style={{ display: 'inline-flex', gap: '4px' }}>
                {[0, 1, 2].map((d) => {
                  const b = Math.sin((t / 130) + d * 1.1) > 0.4
                  return <i key={d} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c3bcae', transform: b ? 'translateY(-3px)' : 'none', transition: 'transform 120ms' }} />
                })}
              </span>
            ) : (
              <>
                {pre}
                <b style={{ color: '#8a6f2e' }}>{nm}</b>
                {post}
                {source > 0 && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginLeft: '6px', opacity: source, fontSize: '10px', fontWeight: 600, color: '#8a6f2e', background: '#f2e9d4', padding: '2px 7px', borderRadius: '999px', verticalAlign: 'middle' }}>
                    ◆ wineandwellnesstravel.com
                  </span>
                )}
              </>
            )}
          </div>
        )}
        {/* verified */}
        <div style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '6px', opacity: verified, transform: `scale(${0.9 + 0.1 * verified})`, fontSize: '10.5px', fontWeight: 700, color: '#0f7a3d', background: '#eafaf0', padding: '5px 10px', borderRadius: '999px' }}>
          ✓ Accuracy verified across engines
        </div>
      </div>
    </div>
  )
}

// ── Email — campaign send + open rate ────────────────────────────────────────

function EmailMock() {
  const reduced = usePrefersReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>()
  const t = useLoop(6500, inView, reduced)

  const press = t > 900 && t < 1200
  const progress = easeOut(ramp(t, 1200, 2600))
  const sent = t >= 2600
  const open = Math.round(42 * easeOut(ramp(t, 2900, 4400)))
  const click = Math.round(8 * easeOut(ramp(t, 3200, 4700)))
  const statsOp = ramp(t, 2800, 3200)

  return (
    <div ref={ref} style={{ width: '330px', borderRadius: '16px', overflow: 'hidden', background: '#fff', boxShadow: '0 30px 60px -24px rgba(0,0,0,0.55), 0 0 0 1px rgba(180,154,90,0.16)' }}>
      <Chrome url="Campaign · This month in slow travel" />
      <div style={{ padding: '16px 18px' }}>
        <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', color: GOLD, textTransform: 'uppercase' }}>Newsletter</div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0a0a0a', margin: '6px 0 4px' }}>This month in slow travel</div>
        <div style={{ fontSize: '11px', color: '#71717a', lineHeight: 1.45 }}>Harvest weeks, a new villa in Puglia, and where to go before the crowds…</div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
          <span style={{ fontSize: '11px', color: '#9a948b' }}>To 1,240 subscribers</span>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#fff', background: sent ? '#0f7a3d' : GOLD, padding: '7px 14px', borderRadius: '8px', transform: press ? 'scale(0.94)' : 'scale(1)', transition: 'transform 140ms, background 240ms' }}>
            {sent ? 'Sent ✓' : 'Send'}
          </span>
        </div>

        <div style={{ height: '5px', borderRadius: '3px', background: '#efece6', marginTop: '14px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress * 100}%`, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`, transition: 'width 100ms linear' }} />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '16px', opacity: statsOp }}>
          {[{ k: 'Open rate', v: `${open}%` }, { k: 'Click rate', v: `${click}%` }, { k: 'Delivered', v: '1,240' }].map((s) => (
            <div key={s.k} style={{ flex: 1, background: '#faf8f3', borderRadius: '10px', padding: '10px 12px', border: '1px solid #f0ece3' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{s.v}</div>
              <div style={{ fontSize: '10px', color: '#9a948b', marginTop: '2px' }}>{s.k}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Design — assets rendering in ─────────────────────────────────────────────

const TILES = [
  { label: 'IG post', g: 'linear-gradient(135deg,#c9b78f,#7d6842)' },
  { label: 'Story', g: 'linear-gradient(135deg,#b7c2c9,#556069)' },
  { label: 'Pitch deck', g: 'linear-gradient(135deg,#d8c9ad,#a2865a)' },
  { label: 'Logo', g: 'linear-gradient(135deg,#e6ddcb,#c2b088)' },
]

function DesignMock() {
  const reduced = usePrefersReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>()
  const t = useLoop(6000, inView, reduced)
  const chip = easeOut(ramp(t, 2000, 2500))

  return (
    <div ref={ref} style={{ width: '330px', borderRadius: '16px', overflow: 'hidden', background: '#fff', boxShadow: '0 30px 60px -24px rgba(0,0,0,0.55), 0 0 0 1px rgba(180,154,90,0.16)' }}>
      <Chrome url="Studio · Brand assets" />
      <div style={{ padding: '18px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {TILES.map((tile, i) => {
            const s = easeOut(ramp(t, 250 + i * 300, 750 + i * 300))
            return (
              <div key={tile.label} style={{ borderRadius: '12px', overflow: 'hidden', opacity: s, transform: `scale(${0.86 + 0.14 * s}) translateY(${(1 - s) * 10}px)` }}>
                <div style={{ height: '74px', background: tile.g, position: 'relative' }}>
                  <span style={{ position: 'absolute', inset: 0, background: `linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.35) ${(((t / 30) % 200))}%, transparent 70%)` }} />
                </div>
                <div style={{ padding: '8px 10px', fontSize: '11px', fontWeight: 600, color: '#0a0a0a', background: '#faf8f3' }}>{tile.label}</div>
              </div>
            )
          })}
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', marginTop: '16px', opacity: chip, padding: '7px 12px', borderRadius: '999px', background: '#faf8f3', border: '1px solid #f0ece3' }}>
          <span style={{ color: GOLD }}>✓</span>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#3f3a33' }}>Requested Monday · delivered Wednesday</span>
        </div>
      </div>
    </div>
  )
}

// ── Section ──────────────────────────────────────────────────────────────────

interface Service {
  eyebrow: string
  title: string
  desc: string
  bullets: string[]
  visual: React.ReactNode
}

const SERVICES: Service[] = [
  {
    eyebrow: 'Social media',
    title: 'A feed that never goes quiet',
    desc: 'We plan, design, and schedule your social — so the grid stays alive whether you are at your desk or on a site inspection in Sicily.',
    bullets: ['1–2 to all platforms, on a calendar you approve', 'Stories, reels, and short-form video', 'Posted and scheduled for you — nothing to remember'],
    visual: <SocialMock />,
  },
  {
    eyebrow: 'Blog & GEO content',
    title: 'Journals written to be quoted',
    desc: 'Original articles on your specialty, structured so AI search engines cite you by name — not just indexed, but recommended.',
    bullets: ['1 to 4+ journal articles a month', 'Written for AI Overviews, ChatGPT & Perplexity', 'Full editorial calendar on Full Service'],
    visual: <ContentMock />,
  },
  {
    eyebrow: 'AI visibility',
    title: 'Be the answer, and be right',
    desc: 'We track what ChatGPT, Perplexity, and Google AI say about you across engines — and correct the record when they get it wrong.',
    bullets: ['See how every major engine describes you', 'Fix outdated or inaccurate answers', 'Monthly multi-engine tracking on Full Service'],
    visual: <AiMock />,
  },
  {
    eyebrow: 'Email marketing',
    title: 'Stay in the inbox, not just the feed',
    desc: 'Newsletters, campaigns, and automated sequences that keep past clients booking and new leads warming — measured, not guessed.',
    bullets: ['Monthly newsletter your clients open', 'Campaigns for launches and offers', 'Automated welcome & re-engagement sequences'],
    visual: <EmailMock />,
  },
  {
    eyebrow: 'Design & creative',
    title: 'Everything on-brand, on demand',
    desc: 'Submit a request, get it back fast — social graphics, proposal decks, light motion, and brand work, all in your visual language.',
    bullets: ['Graphics, motion, proposal & pitch decks', 'Brand work and richer motion on Full Service', 'Unlimited revisions until it is right'],
    visual: <DesignMock />,
  },
]

export function StudioServices() {
  return (
    <section
      id="capabilities"
      className="eah-section"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '112px 24px',
        background: 'radial-gradient(1200px 620px at 50% -12%, #241f18 0%, #17130f 55%, #120f0a 100%)',
        scrollMarginTop: '80px',
      }}
    >
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(560px 300px at 82% 12%, rgba(180,154,90,0.12), transparent 70%), radial-gradient(620px 340px at 12% 88%, rgba(124,58,237,0.10), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', maxWidth: '1140px', margin: '0 auto' }}>
        <div style={{ maxWidth: '680px', marginBottom: '24px' }}>
          <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD_LIGHT, marginBottom: '18px' }}>
            What we handle
          </span>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.08, margin: '0 0 18px', color: '#fff' }}>
            Your whole marketing engine, run for you.
          </h2>
          <p style={{ fontSize: '17px', lineHeight: 1.65, color: 'rgba(255,255,255,0.72)', margin: 0 }}>
            Not templates and a login. Real work, delivered — social, content, email, design, and the AI-search
            visibility that decides whether a client ever finds you. Here is what that looks like.
          </p>
        </div>

        {SERVICES.map((s, i) => (
          <div key={s.eyebrow} className={`studio-svc-row${i % 2 === 1 ? ' reverse' : ''}`}>
            <div className="svc-text">
              <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: GOLD, marginBottom: '14px' }}>
                {s.eyebrow}
              </span>
              <h3 style={{ fontSize: 'clamp(24px, 2.6vw, 32px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.14, margin: '0 0 14px', color: '#fff' }}>
                {s.title}
              </h3>
              <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'rgba(255,255,255,0.72)', margin: '0 0 20px' }}>
                {s.desc}
              </p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {s.bullets.map((b) => (
                  <li key={b} style={{ display: 'flex', gap: '10px', fontSize: '14.5px', color: 'rgba(255,255,255,0.86)', lineHeight: 1.5 }}>
                    <span style={{ color: GOLD_LIGHT, flexShrink: 0, fontWeight: 700 }}>✓</span> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="svc-visual">{s.visual}</div>
          </div>
        ))}

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <a
            href="#plans"
            style={{ display: 'inline-block', padding: '14px 32px', borderRadius: '10px', background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', color: '#fff', fontSize: '15px', fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 24px rgba(124,58,237,0.35)' }}
          >
            See the plans
          </a>
        </div>
      </div>

      <style>{`
        .studio-svc-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: center;
          padding: 46px 0;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .studio-svc-row.reverse .svc-text { order: 2; }
        .studio-svc-row.reverse .svc-visual { order: 1; }
        .svc-visual { display: flex; justify-content: center; }
        @media (max-width: 860px) {
          .studio-svc-row { grid-template-columns: 1fr; gap: 34px; padding: 40px 0; }
          .studio-svc-row .svc-text, .studio-svc-row.reverse .svc-text { order: 1; }
          .studio-svc-row .svc-visual, .studio-svc-row.reverse .svc-visual { order: 2; }
        }
      `}</style>
    </section>
  )
}
