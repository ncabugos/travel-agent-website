'use client'
import { useState, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AgentLoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    
    if (!email) {
      setError('Please enter your email.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/api/agent-portal/auth-callback`,
      },
    })

    if (authError) {
      setError(authError.message)
    } else {
      setMessage('Check your email for the login link!')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fafafa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        border: '1px solid #eaeaea',
        padding: '48px 40px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            backgroundColor: '#111', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <span style={{ color: '#fff', fontSize: '20px', fontWeight: 700 }}>E</span>
          </div>
          <h1 style={{
            margin: 0, fontSize: '22px', fontWeight: 700, color: '#111',
            letterSpacing: '-0.02em',
          }}>
            EliteAdvisorHub
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#6b7280' }}>
            Advisor Portal — Sign in to manage your website
          </p>
        </div>

        {message ? (
          <div style={{
            padding: '16px', backgroundColor: '#f0fdf4', color: '#166534',
            borderRadius: '8px', fontSize: '14px', fontWeight: 500,
            border: '1px solid #bbf7d0', textAlign: 'center',
          }}>
            ✓ {message}
          </div>
        ) : (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                Email Address
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="agent@example.com" 
                autoFocus
                style={{
                  width: '100%', padding: '10px 14px', border: '1px solid #d1d5db',
                  borderRadius: '8px', fontSize: '14px', outline: 'none',
                  boxSizing: 'border-box', transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.target.style.borderColor = '#111')}
                onBlur={e => (e.target.style.borderColor = '#d1d5db')}
              />
            </div>
            
            {error && (
              <div style={{
                padding: '10px 12px', backgroundColor: '#fef2f2', color: '#991b1b',
                borderRadius: '8px', fontSize: '13px', border: '1px solid #fee2e2',
              }}>
                {error}
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%', padding: '12px', backgroundColor: '#111',
                color: '#fff', border: 'none', borderRadius: '8px',
                fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1, transition: 'background-color 0.15s',
                marginTop: '4px',
              }}
            >
              {loading ? 'Sending link…' : 'Send Magic Link'}
            </button>
          </form>
        )}

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          margin: '24px 0', color: '#d1d5db',
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
          <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
        </div>

        {/* Google OAuth — Phase 2 */}
        <button
          disabled
          title="Google login coming in Phase 2"
          style={{
            width: '100%', padding: '10px', backgroundColor: '#fff',
            color: '#9ca3af', border: '1px solid #e5e7eb', borderRadius: '8px',
            fontSize: '13px', fontWeight: 500, cursor: 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            opacity: 0.6,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
          <span style={{ fontSize: '10px', opacity: 0.7 }}>(Coming Soon)</span>
        </button>
      </div>
    </div>
  )
}
