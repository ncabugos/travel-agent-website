'use client'
/**
 * Agent self-registration.
 * Calls supabase.auth.signUp() — the public.handle_new_user trigger
 * (migration 019) creates the matching public.agents row from
 * raw_user_meta_data { full_name, agency_name }.
 */
import { useState, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { GoogleButton } from '@/components/auth/GoogleButton'

export default function AgentRegisterPage() {
  const [fullName, setFullName] = useState('')
  const [agencyName, setAgencyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, agency_name: agencyName },
        emailRedirectTo: `${location.origin}/api/agent-portal/auth-callback`,
      },
    })
    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <AuthLayout
      headline="Launch Your Travel Practice Online"
      subline="Create your Elite Advisor Hub account and get a polished website built for independent travel advisors."
    >
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2 style={{ margin: 0, fontSize: '30px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>
          Create Your Account
        </h2>
        <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#6b7280' }}>
          A few details to get you started.
        </p>
      </div>

      {submitted ? (
        <div style={{
          padding: '16px', backgroundColor: '#f0fdf4', color: '#166534',
          borderRadius: '10px', fontSize: '14px', fontWeight: 500,
          border: '1px solid #bbf7d0', textAlign: 'center',
        }}>
          ✓ Check your email to confirm your account.
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Jane Smith"
                required
                autoFocus
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#7c3aed')}
                onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
              />
            </div>

            <div>
              <label style={labelStyle}>Agency Name</label>
              <input
                type="text"
                value={agencyName}
                onChange={e => setAgencyName(e.target.value)}
                placeholder="Smith Travel Co."
                required
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#7c3aed')}
                onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
              />
            </div>

            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="jane@smithtravel.com"
                required
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#7c3aed')}
                onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                minLength={8}
                style={inputStyle}
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
                marginTop: '6px',
                boxShadow: '0 1px 2px rgba(124,58,237,0.25)',
              }}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0 16px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
            <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Or sign up with
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
          </div>

          <GoogleButton redirectPath="/api/agent-portal/auth-callback" label="Google" />
        </>
      )}

      <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#6b7280' }}>
        Already have an account?{' '}
        <a href="/agent-portal/login" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: 600 }}>
          Sign in
        </a>
      </p>
    </AuthLayout>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '13px', fontWeight: 600, color: '#111', marginBottom: '6px',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb',
  borderRadius: '10px', fontSize: '14px', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.15s',
  backgroundColor: '#fff',
}
