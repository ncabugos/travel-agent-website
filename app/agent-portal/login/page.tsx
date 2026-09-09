'use client'
import { useState, useEffect, FormEvent, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { GoogleButton } from '@/components/auth/GoogleButton'

export default function AgentLoginPage() {
  return (
    <Suspense>
      <AgentLoginForm />
    </Suspense>
  )
}

function AgentLoginForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  // Stripe sends new payers here with ?from=checkout while the webhook emails
  // their sign-in link.
  const fromCheckout = useSearchParams().get('from') === 'checkout'

  // Anyone already signed in goes straight to the portal.
  useEffect(() => {
    createClient().auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/agent-portal')
    })
  }, [router])

  async function handleLogin(e: FormEvent) {
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
    <AuthLayout
      headline="Manage Your Travel Practice"
      subline="Sign in to your Elite Advisor Hub website — update content, manage inquiries, and grow your business."
    >
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2 style={{ margin: 0, fontSize: '30px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>
          {fromCheckout ? 'Check Your Email' : 'Welcome Back'}
        </h2>
        <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#6b7280' }}>
          {fromCheckout
            ? 'Your sign-in link is on its way. Open it to set up your profile. If it has not arrived in a few minutes, enter your email below and we send another.'
            : 'Enter your email and we send you a secure sign-in link.'}
        </p>
      </div>

      {message ? (
        <div style={{
          padding: '16px', backgroundColor: '#f0fdf4', color: '#166534',
          borderRadius: '10px', fontSize: '14px', fontWeight: 500,
          border: '1px solid #bbf7d0', textAlign: 'center',
        }}>
          ✓ {message}
        </div>
      ) : (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#111', marginBottom: '8px' }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="agent@example.com"
              autoFocus
              style={{
                width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb',
                borderRadius: '10px', fontSize: '14px', outline: 'none',
                boxSizing: 'border-box', transition: 'border-color 0.15s',
              }}
              onFocus={e => (e.target.style.borderColor = '#7c3aed')}
              onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
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
              width: '100%', padding: '13px', border: 'none', borderRadius: '10px',
              background: loading
                ? 'linear-gradient(135deg, #a78bfa, #c4b5fd)'
                : 'linear-gradient(135deg, #7c3aed, #a78bfa)',
              color: '#fff', fontSize: '14px', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '4px',
              boxShadow: '0 1px 2px rgba(124,58,237,0.25)',
            }}
          >
            {loading ? 'Sending link…' : 'Send Magic Link'}
          </button>
        </form>
      )}

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0 16px' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
        <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Or continue with
        </span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
      </div>

      <GoogleButton redirectPath="/api/agent-portal/auth-callback" label="Google" />

      <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#6b7280' }}>
        Don&apos;t have an account?{' '}
        <a href="/agent-portal/register" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: 600 }}>
          Register Now.
        </a>
      </p>
    </AuthLayout>
  )
}
