'use client'

/**
 * Prev/next buttons for a horizontal scroll rail. Gives the swipe/wheel-only
 * rail a click + keyboard alternative (Web Interface Guidelines: no
 * gesture-only interactions). Scrolls the element with `targetId` by one
 * card width per press.
 */
export function ScrollRailControls({ targetId, step = 380, label }: { targetId: string; step?: number; label: string }) {
  const scroll = (dir: 1 | -1) => {
    const el = document.getElementById(targetId)
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * step, behavior: reduce ? 'auto' : 'smooth' })
  }
  const btn: React.CSSProperties = {
    width: '40px', height: '40px', borderRadius: '50%',
    border: '1px solid #E8E4DC', background: '#fff', color: '#1A1715',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', fontSize: '18px', lineHeight: 1,
    transition: 'background-color 0.15s ease, border-color 0.15s ease',
  }
  return (
    <div style={{ display: 'flex', gap: '8px' }} aria-label={`${label} controls`} role="group">
      <button type="button" className="eah-rail-btn eah-focus-ring-dark" style={btn} onClick={() => scroll(-1)} aria-label={`Previous ${label}`}>
        <span aria-hidden="true">←</span>
      </button>
      <button type="button" className="eah-rail-btn eah-focus-ring-dark" style={btn} onClick={() => scroll(1)} aria-label={`Next ${label}`}>
        <span aria-hidden="true">→</span>
      </button>
      <style>{`.eah-rail-btn:hover { background: #FAFAF5 !important; border-color: #B49A5A !important; }`}</style>
    </div>
  )
}
