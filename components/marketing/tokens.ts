/**
 * Marketing-surface design tokens (eliteadvisorhub.com pages only).
 *
 * Purple is reserved for the primary action — nothing else on the page may
 * use it (Von Restorff / isolation: the CTA must be the only purple thing).
 * Gold carries editorial accents; neutrals are warm, never Tailwind slate.
 */
import type { CSSProperties } from 'react'

export const GOLD = '#B49A5A'
export const CHARCOAL = '#1A1715'
export const INK = '#111111'
export const WARM_GRAY = '#8A8279'
export const WARM_GRAY_DARK = '#5F5850'
export const DIVIDER = '#E8E4DC'
export const CREAM = '#FAFAF5'

/** Primary CTA — the one purple element per viewport. */
export const PRIMARY_CTA_STYLE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '56px',
  padding: '16px 36px',
  background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
  color: '#fff',
  borderRadius: '10px',
  fontSize: '16px',
  fontWeight: 600,
  letterSpacing: '-0.005em',
  textDecoration: 'none',
  border: 'none',
  boxShadow: '0 4px 24px rgba(124, 58, 237, 0.35)',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}

/** House CTA copy — first person, benefit-led, one phrase everywhere. */
export const PRIMARY_CTA_LABEL = 'Begin my 30 days'

/** Click-trigger line that sits under every primary CTA. */
export const CTA_MICROCOPY = 'With our compliments · $59/mo from day 31 · no setup fee · cancel anytime'
