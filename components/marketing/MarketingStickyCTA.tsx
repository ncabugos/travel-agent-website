'use client'

import { useEffect, useState } from 'react'
import { CheckoutButton } from '@/components/stripe/CheckoutButton'
import { PRIMARY_CTA_LABEL, PRIMARY_CTA_STYLE, WARM_GRAY_DARK } from './tokens'

/**
 * Mobile-only sticky bottom CTA (≤768px).
 *
 * Appears once the visitor has scrolled past the hero (so it never competes
 * with the hero's own button) and hides again over the pricing block, the
 * closing CTA, and the footer, where it would cover their own controls.
 * Bottom-center placement is
 * the thumb-zone sweet spot; sticky-bottom CTAs lift mobile conversion
 * 12–27% in the meta-analyses behind the redesign.
 */
export function MarketingStickyCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return
    // Sections whose own CTA / links the bar must never cover.
    const blockers = [document.getElementById('pricing'), document.getElementById('closing-cta'), document.querySelector('footer')]
      .filter((el): el is HTMLElement => el instanceof HTMLElement)

    let pastHero = false
    const covering = new Set<Element>()
    const update = () => setVisible(pastHero && covering.size === 0)

    const heroObs = new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting && e.boundingClientRect.bottom < 0; update() }, { threshold: 0 })
    heroObs.observe(hero)

    const blockObs = new IntersectionObserver((entries) => {
      for (const e of entries) { if (e.isIntersecting) covering.add(e.target); else covering.delete(e.target) }
      update()
    }, { threshold: 0.05 })
    blockers.forEach((el) => blockObs.observe(el))

    return () => { heroObs.disconnect(); blockObs.disconnect() }
  }, [])

  return (
    <div
      className="eah-sticky-cta"
      // `inert` removes the hidden bar from the tab order and the a11y tree
      // (aria-hidden alone would leave a focusable button behind it).
      inert={!visible}
      style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 900,
        padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
        background: 'rgba(255,255,255,0.94)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(26,23,21,0.08)',
        transform: visible ? 'translateY(0)' : 'translateY(110%)',
        visibility: visible ? 'visible' : 'hidden',
        transition: 'transform 0.3s ease, visibility 0s linear ' + (visible ? '0s' : '0.3s'),
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <CheckoutButton
        tier="starter"
        popular
        style={{ ...PRIMARY_CTA_STYLE, width: '100%', minHeight: '52px', padding: '14px 20px' }}
      >
        {PRIMARY_CTA_LABEL}
      </CheckoutButton>
      <p style={{ margin: '6px 0 0', textAlign: 'center', fontSize: '12px', color: WARM_GRAY_DARK }}>
        With our compliments · $59/mo from day 31 · cancel anytime
      </p>

      <style>{`
        @media (min-width: 769px) { .eah-sticky-cta { display: none !important; } }
        @media (prefers-reduced-motion: reduce) { .eah-sticky-cta { transition: none !important; } }
      `}</style>
    </div>
  )
}
