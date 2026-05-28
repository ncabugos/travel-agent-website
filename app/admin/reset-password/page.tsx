'use client'
/**
 * Reset password landing page. User arrives via the email link Supabase sent.
 * Supabase auto-creates a recovery session from the URL hash params before
 * this page mounts, so updateUser({ password }) works without explicit token
 * handling here.
 */
import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AuthLayout } from '@/components/auth/AuthLayout'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [hasRecovery, setHasRecovery] = useState<boolean | null>(null)

  // Verify Supabase processed the recovery token in the URL.
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasRecovery(!!session)
    })
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }
    setDone(true)
    setLoading(false)
    setTimeout(() => router.push('/admin'), 1500)
  }

  return (
    <AuthLayout
      headline="Websites for Elite Travel Advisors"
      subline="A website platform for independent travel advisors and boutique agencies."
    >
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2 style={{ margin: 0, fontSize: '30px', fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>
          Set a New Password
        </h2>
        <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#6b7280' }}>
          Choose a strong password — at least 8 characters.
        </p>
      </div>

      {hasRecovery === false && (
        <div style={{
          padding: '12px 14px', backgroundColor: '#fef2f2', color: '#991b1b',
          borderRadius: '8px', fontSize: '13px', border: '1px solid #fee2e2', marginBottom: '18px',
        }}>
          This reset link is invalid or expired. <a href="/admin/forgot-password" style={{ color: '#991b1b', fontWeight: 600 }}>Request a new one.</a>
        </div>
      )}

      {done ? (
        <div style={{
          padding: '16px', backgroundColor: '#f0fdf4', color: '#166534',
          borderRadius: '10px', fontSize: '14px', fontWeight: 500,
          border: '1px solid #bbf7d0', textAlign: 'center',
        }}>
          ✓ Password updated. Redirecting…
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#111', marginBottom: '8px' }}>
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoFocus
              minLength={8}
              style={{
                width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb',
                borderRadius: '10px', fontSize: '14px', outline: 'none',
                boxSizing: 'border-box', transition: 'border-color 0.15s',
              }}
              onFocus={e => (e.target.style.borderColor = '#7c3aed')}
              onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#111', marginBottom: '8px' }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              minLength={8}
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
            disabled={loading || hasRecovery === false}
            style={{
              width: '100%', padding: '13px', border: 'none', borderRadius: '10px',
              background: (loading || hasRecovery === false)
                ? 'linear-gradient(135deg, #a78bfa, #c4b5fd)'
                : 'linear-gradient(135deg, #7c3aed, #a78bfa)',
              color: '#fff', fontSize: '14px', fontWeight: 600,
              cursor: (loading || hasRecovery === false) ? 'not-allowed' : 'pointer',
              marginTop: '4px',
              boxShadow: '0 1px 2px rgba(124,58,237,0.25)',
            }}
          >
            {loading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      )}
    </AuthLayout>
  )
}
