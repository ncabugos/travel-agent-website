'use client'

import { useState, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/dashboard/Card'
import { FormField, inputStyles, buttonStyles } from '@/components/dashboard/FormField'

interface SettingsFormProps {
  initial: {
    full_name: string
    email: string
    notification_email: string
  }
}

type Status = { ok: string } | { error: string } | null

function StatusMessage({ status }: { status: Status }) {
  if (!status) return null
  const ok = 'ok' in status
  return (
    <div style={{
      marginBottom: '16px', padding: '10px 12px', borderRadius: '8px', fontSize: '13px',
      backgroundColor: ok ? '#f0fdf4' : '#fef2f2',
      border: `1px solid ${ok ? '#bbf7d0' : '#fee2e2'}`,
      color: ok ? '#166534' : '#991b1b',
    }}>
      {ok ? status.ok : status.error}
    </div>
  )
}

function SaveButton({ saving, label = 'Save' }: { saving: boolean; label?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <button type="submit" disabled={saving} style={{ ...buttonStyles.primary, opacity: saving ? 0.6 : 1 }}>
        {saving ? 'Saving…' : label}
      </button>
    </div>
  )
}

async function patchSettings(body: Record<string, string>): Promise<{ error?: string }> {
  const res = await fetch('/api/admin/settings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) return { error: data.error ?? 'Could not save.' }
  return {}
}

export function SettingsForm({ initial }: SettingsFormProps) {
  // Account
  const [fullName, setFullName] = useState(initial.full_name)
  const [savingAccount, setSavingAccount] = useState(false)
  const [accountStatus, setAccountStatus] = useState<Status>(null)

  // Security
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordStatus, setPasswordStatus] = useState<Status>(null)

  // Notifications
  const [notificationEmail, setNotificationEmail] = useState(initial.notification_email)
  const [savingNotifications, setSavingNotifications] = useState(false)
  const [notificationsStatus, setNotificationsStatus] = useState<Status>(null)

  async function saveAccount(e: FormEvent) {
    e.preventDefault()
    setAccountStatus(null)
    if (!fullName.trim()) {
      setAccountStatus({ error: 'Full name is required.' })
      return
    }
    setSavingAccount(true)
    const { error } = await patchSettings({ full_name: fullName.trim() })
    setSavingAccount(false)
    setAccountStatus(error ? { error } : { ok: 'Account updated.' })
  }

  async function savePassword(e: FormEvent) {
    e.preventDefault()
    setPasswordStatus(null)
    if (password.length < 8) {
      setPasswordStatus({ error: 'Password must be at least 8 characters.' })
      return
    }
    if (password !== confirm) {
      setPasswordStatus({ error: 'Passwords do not match.' })
      return
    }
    setSavingPassword(true)
    const { error } = await createClient().auth.updateUser({ password })
    setSavingPassword(false)
    if (error) {
      setPasswordStatus({ error: error.message })
      return
    }
    setPassword('')
    setConfirm('')
    setPasswordStatus({ ok: 'Password updated.' })
  }

  async function saveNotifications(e: FormEvent) {
    e.preventDefault()
    setNotificationsStatus(null)
    const value = notificationEmail.trim()
    if (!value.includes('@')) {
      setNotificationsStatus({ error: 'A valid alert email is required.' })
      return
    }
    setSavingNotifications(true)
    const { error } = await patchSettings({ notification_email: value })
    setSavingNotifications(false)
    setNotificationsStatus(error ? { error } : { ok: 'Alert email updated.' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Card title="Account">
        <form onSubmit={saveAccount}>
          <FormField label="Full name" htmlFor="settings-full-name" required>
            <input
              id="settings-full-name"
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              style={inputStyles}
            />
          </FormField>
          <FormField
            label="Email"
            htmlFor="settings-email"
            hint="Sign-in email changes are made in Supabase by the operator."
          >
            <input
              id="settings-email"
              type="email"
              value={initial.email}
              readOnly
              style={{ ...inputStyles, backgroundColor: '#f9fafb', color: '#6b7280' }}
            />
          </FormField>
          <StatusMessage status={accountStatus} />
          <SaveButton saving={savingAccount} />
        </form>
      </Card>

      <Card title="Security">
        <form onSubmit={savePassword}>
          <FormField label="New password" htmlFor="settings-password" required>
            <input
              id="settings-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              style={inputStyles}
            />
          </FormField>
          <FormField label="Confirm password" htmlFor="settings-confirm" required>
            <input
              id="settings-confirm"
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              style={inputStyles}
            />
          </FormField>
          <StatusMessage status={passwordStatus} />
          <SaveButton saving={savingPassword} label="Update password" />
        </form>
      </Card>

      <Card title="Notifications">
        <form onSubmit={saveNotifications}>
          <FormField
            label="Alert email"
            htmlFor="settings-notification-email"
            required
            hint="Receives new signup, onboarding, and inquiry alerts."
          >
            <input
              id="settings-notification-email"
              type="email"
              value={notificationEmail}
              onChange={e => setNotificationEmail(e.target.value)}
              required
              style={inputStyles}
            />
          </FormField>
          <StatusMessage status={notificationsStatus} />
          <SaveButton saving={savingNotifications} />
        </form>
      </Card>
    </div>
  )
}
