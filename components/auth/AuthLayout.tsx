'use client'
/**
 * Two-panel auth layout: purple gradient brand panel on the left,
 * white form panel on the right. Brand panel collapses on small screens.
 * Used by /admin/login, /admin/forgot-password, /admin/reset-password,
 * /agent-portal/login, /agent-portal/register.
 */
import { ReactNode } from 'react'
import Link from 'next/link'
import { DotGlobe } from './DotGlobe'

interface Props {
  headline: string
  subline: string
  children: ReactNode
}

export function AuthLayout({ headline, subline, children }: Props) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#fff',
    }}>
      {/* Brand panel */}
      <div
        className="eah-auth-brand"
        style={{
          flex: 1,
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
          color: '#fff',
        }}
      >
        {/* Animated dot globe — slow rotation, depth-tapered dots, subtle
            pointer repulsion. Sits behind the foreground content. */}
        <DotGlobe
          variant="continents"
          continentSamples={18000}
          color="#ffffff"
          rotationSeconds={110}
          maxDotRadius={1.7}
          sphereScale={0.55}
          centerX={0.42}
          centerY={0.7}
        />

        {/* Foreground content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            height: '100%',
            minHeight: '100vh',
            padding: '48px 56px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            pointerEvents: 'none', // let pointermove pass through to brand panel
          }}
        >
          <Link href="/" style={{ alignSelf: 'flex-start', pointerEvents: 'auto' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/elite-advisor-hub-logos/elite-advisor-hub-logo-white.png"
              alt="Elite Advisor Hub"
              style={{ height: '36px', width: 'auto', display: 'block' }}
            />
          </Link>

          <div style={{ maxWidth: '560px' }}>
            <h1 style={{
              margin: 0,
              fontSize: 'clamp(32px, 4vw, 52px)',
              lineHeight: 1.1,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#fff',
            }}>
              {headline}
            </h1>
            <p style={{
              margin: '20px 0 0',
              fontSize: '17px',
              lineHeight: 1.55,
              color: 'rgba(255,255,255,0.85)',
              maxWidth: '480px',
            }}>
              {subline}
            </p>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.75)',
            pointerEvents: 'auto', // re-enable for the link
          }}>
            <span>© {new Date().getFullYear()} Elite Advisor Hub</span>
            <a href="/legal/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>
              Privacy Policy
            </a>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div style={{
        flex: 1,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {children}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .eah-auth-brand { display: none; }
        }
      `}</style>
    </div>
  )
}
