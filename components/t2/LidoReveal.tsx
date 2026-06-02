'use client'

import { useEffect } from 'react'

/**
 * Lightweight scroll-reveal driver for the Lido Collective home page.
 *
 * Renders nothing. On mount it flags the page root with `.lido-anim-ready`
 * (which is what gates the reveal CSS in globals-t2.css — so without JS the
 * content is simply visible) and then watches every `[data-reveal]` element,
 * adding `.is-revealed` as each scrolls into view. Elements only reveal once.
 *
 * Respects `prefers-reduced-motion`: the CSS short-circuits the animation, and
 * here we reveal everything immediately so nothing depends on the observer.
 */
export function LidoReveal() {
  useEffect(() => {
    const root = document.querySelector('.lido-page') ?? document.body
    root.classList.add('lido-anim-ready')

    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('is-revealed'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )

    nodes.forEach((n) => {
      // Anything already in view on load reveals on the next frame (no jump).
      observer.observe(n)
    })

    return () => observer.disconnect()
  }, [])

  return null
}
