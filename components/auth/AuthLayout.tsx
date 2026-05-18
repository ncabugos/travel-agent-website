'use client'
/**
 * Two-panel auth layout: purple gradient brand panel on the left,
 * white form panel on the right. Brand panel collapses on small screens.
 * Used by /admin/login, /admin/forgot-password, /admin/reset-password,
 * /agent-portal/login, /agent-portal/register.
 */
import { ReactNode } from 'react'

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
          background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
          padding: '48px 56px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: '#fff',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/elite-advisor-hub-logos/elite-advisor-hub-logo-white.png"
          alt="EliteAdvisorHub"
          style={{ height: '36px', width: 'auto', display: 'block', alignSelf: 'flex-start' }}
        />

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
        }}>
          <span>© {new Date().getFullYear()} EliteAdvisorHub</span>
          <a href="/legal/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>
            Privacy Policy
          </a>
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
