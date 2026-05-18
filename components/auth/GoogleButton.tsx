'use client'
/**
 * Sign in / Sign up with Google. Initiates Supabase OAuth and redirects to
 * the given callback path (which must call exchangeCodeForSession on the
 * `code` query param Supabase appends).
 */
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  /** Path on this origin to send Supabase's OAuth redirect to (must handle code exchange). */
  redirectPath: string
  /** Button label. Default: "Continue with Google" */
  label?: string
}

export function GoogleButton({ redirectPath, label = 'Continue with Google' }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleClick() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}${redirectPath}`,
      },
    })
    if (oauthError) {
      setError(oauthError.message)
      setLoading(false)
    }
    // On success, Supabase navigates the browser to Google's consent screen,
    // so we don't reach a "done" state here.
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        style={{
          width: '100%', padding: '11px', backgroundColor: '#fff',
          color: '#111', border: '1px solid #e5e7eb', borderRadius: '10px',
          fontSize: '14px', fontWeight: 500,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          transition: 'background-color 0.15s, border-color 0.15s',
        }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#fafafa' }}
        onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#fff' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {loading ? 'Redirecting…' : label}
      </button>
      {error && (
        <p style={{ fontSize: '12px', color: '#dc2626', margin: '8px 0 0', textAlign: 'center' }}>
          {error}
        </p>
      )}
    </>
  )
}
