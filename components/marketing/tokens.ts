/**
 * Marketing-surface design tokens (eliteadvisorhub.com pages only).
 *
 * Near-monochrome system: white, cream, charcoal, near-black. Purple appears
 * once per screen, on the primary button. Gold is reserved for hairlines and
 * small labels. No gradients, no glow shadows, corners are 0 or 2px.
 */
import type { CSSProperties } from 'react'

export const GOLD = '#B49A5A'
export const CHARCOAL = '#1A1715'
export const INK = '#111111'
export const NEAR_BLACK = '#0B0A09'
export const WARM_GRAY = '#8A8279'
export const WARM_GRAY_DARK = '#5F5850'
export const DIVIDER = '#E8E4DC'
export const DIVIDER_DARK = 'rgba(255,255,255,0.14)'
export const CREAM = '#FAFAF5'
export const PURPLE = '#7C3AED'
export const PURPLE_HOVER = '#6D31D6'

export const DISPLAY_FONT = 'var(--font-inter-tight), var(--font-inter), system-ui, sans-serif'
export const BODY_FONT = 'var(--font-inter), system-ui, -apple-system, sans-serif'

/** Primary CTA: flat purple, square, the one purple element per viewport. */
export const PRIMARY_CTA_STYLE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '52px',
  padding: '0 28px',
  background: PURPLE,
  color: '#fff',
  borderRadius: '2px',
  fontSize: '15px',
  fontWeight: 500,
  letterSpacing: '0',
  textDecoration: 'none',
  border: '1px solid transparent',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'background-color 0.2s ease',
}

/** Secondary CTA: 1px outline in the current text color. */
export const SECONDARY_CTA_STYLE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '52px',
  padding: '0 28px',
  background: 'transparent',
  color: 'inherit',
  borderRadius: '2px',
  fontSize: '15px',
  fontWeight: 500,
  textDecoration: 'none',
  border: '1px solid currentColor',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'background-color 0.2s ease',
}

/** Small section label. Use sparingly. */
export const LABEL_STYLE: CSSProperties = {
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: WARM_GRAY,
  margin: 0,
}

/** Section heading. */
export const H2_STYLE: CSSProperties = {
  fontFamily: DISPLAY_FONT,
  fontSize: 'clamp(32px, 4vw, 56px)',
  fontWeight: 400,
  letterSpacing: '-0.03em',
  lineHeight: 1.05,
  margin: 0,
}

/** Body paragraph on light surfaces. */
export const BODY_STYLE: CSSProperties = {
  fontSize: '17px',
  lineHeight: 1.6,
  color: WARM_GRAY_DARK,
  margin: 0,
}

/** House CTA copy, one phrase everywhere. */
export const PRIMARY_CTA_LABEL = 'Request a consultation'
