'use client'
import { useState, FormEvent, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { GoogleButton } from '@/components/auth/GoogleButton'

const REMEMBER_KEY = 'eah_admin_remembered_email'

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  )
}

function AdminLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const authError = searchParams.get('error')

  // Prefill remembered email
  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_KEY)
      if (saved) {
        setEmail(saved)
        setRemember(true)
      }
    } catch { /* ignore */ }
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    // Persist remember-me preference (email only — never the password)
    try {
      if (remember) localStorage.setItem(REMEMBER_KEY, email)
      else localStorage.removeItem(REMEMBER_KEY)
    } catch { /* ignore */ }

    const from = searchParams.get('from') || '/admin'
    router.push(from)
    router.refresh()
  }

  return (
    <AuthLayout
      headline="Websites for Elite Travel Advisors"
      subline="A website platform for independent travel advisors and boutique agencies."
    >
      {/* Heading */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2 style={{
          margin: 0,
          fontSize: '30px',
          fontWeight: 700,
          color: '#111',
          letterSpacing: '-0.02em',
        }}>
          Welcome Back
        </h2>
        <p style={{
          margin: '8px 0 0',
          fontSize: '14px',
          color: '#6b7280',
        }}>
          Enter your email and password to access your account.
        </p>
      </div>

      {/* Errors */}
      {(error || authError) && (
        <div style={{
          padding: '12px 14px', backgroundColor: '#fef2f2', color: '#991b1b',
          borderRadius: '8px', fontSize: '13px', marginBottom: '18px',
          border: '1px solid #fee2e2',
        }}>
          {error || (authError === 'unauthorized' ? 'You do not have admin access.' : 'Authentication error.')}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="user@company.com"
            required
            autoFocus
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = '#7c3aed')}
            onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
          />
        </div>

        <div>
          <label style={labelStyle}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              style={{ ...inputStyle, paddingRight: '40px' }}
              onFocus={e => (e.target.style.borderColor = '#7c3aed')}
              onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{
                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                color: '#9ca3af', display: 'flex', alignItems: 'center',
              }}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        {/* Remember + Forgot */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '-4px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              style={{ accentColor: '#7c3aed', width: '15px', height: '15px', cursor: 'pointer' }}
            />
            Remember Me
          </label>
          <a href="/admin/forgot-password" style={{ fontSize: '13px', color: '#7c3aed', textDecoration: 'none', fontWeight: 500 }}>
            Forgot Your Password?
          </a>
        </div>

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
            transition: 'opacity 0.15s, transform 0.05s',
            marginTop: '4px',
            boxShadow: '0 1px 2px rgba(124,58,237,0.25)',
          }}
        >
          {loading ? 'Signing in…' : 'Log In'}
        </button>
      </form>

      {/* Divider */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        margin: '22px 0 16px',
      }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
        <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Or login with
        </span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
      </div>

      <GoogleButton redirectPath="/api/admin/auth-callback" label="Google" />
    </AuthLayout>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '13px', fontWeight: 600, color: '#111', marginBottom: '8px',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb',
  borderRadius: '10px', fontSize: '14px', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.15s',
  backgroundColor: '#fff',
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}
