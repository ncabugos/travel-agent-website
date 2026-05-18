'use client'
import { useState, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AuthLayout } from '@/components/auth/AuthLayout'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/admin/reset-password`,
    })
    if (resetError) {
      setError(resetError.message)
      setLoading(false)
      return
    }
    setSent(true)
    setLoading(false)
  }

  return (
    <AuthLayout
      headline="Websites for Elite Travel Advisors"
      subline="A website platform for independent travel advisors and boutique agencies."
    >
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2 style={{ margin: 0, fontSize: '30px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>
          Reset Your Password
        </h2>
        <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#6b7280' }}>
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      {sent ? (
        <div style={{
          padding: '16px', backgroundColor: '#f0fdf4', color: '#166534',
          borderRadius: '10px', fontSize: '14px', fontWeight: 500,
          border: '1px solid #bbf7d0', textAlign: 'center',
        }}>
          ✓ Check your email for the reset link.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#111', marginBottom: '8px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="user@company.com"
              required
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
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>
      )}

      <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#6b7280' }}>
        Remembered it?{' '}
        <a href="/admin/login" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: 500 }}>
          Back to sign in
        </a>
      </p>
    </AuthLayout>
  )
}
