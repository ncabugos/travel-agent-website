'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/dashboard/Card'
import { Badge } from '@/components/dashboard/Badge'
import type {
  SubscriptionSummary,
  InvoiceSummary,
} from '@/lib/stripe-queries'
import { formatMoney, formatDate } from '@/lib/stripe-queries'

interface Props {
  agentId: string
  subscription: SubscriptionSummary | null
  invoices: InvoiceSummary[]
  errors: { subscription: string | null; invoices: string | null }
  stripeCustomerId: string | null
}

const TIER_OPTIONS = [
  { value: 'starter', label: 'Starter — $79/mo' },
  { value: 'growth', label: 'Growth — $149/mo' },
  { value: 'custom', label: 'Custom — $299/mo' },
] as const

export function AgentSubscriptionPanel({
  agentId,
  subscription,
  invoices,
  errors,
  stripeCustomerId,
}: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState<'cancel' | 'change' | null>(null)
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)
  const [pendingTier, setPendingTier] = useState<string>(subscription?.tier ?? 'starter')

  const stripeCustomerUrl = stripeCustomerId
    ? `https://dashboard.stripe.com/customers/${stripeCustomerId}`
    : null

  const subscriptionUrl = subscription?.id
    ? `https://dashboard.stripe.com/subscriptions/${subscription.id}`
    : null

  async function changeTier() {
    if (!subscription) return
    if (pendingTier === subscription.tier) {
      setMessage({ kind: 'error', text: 'Already on this tier.' })
      return
    }
    if (
      !confirm(
        `Change this agent's plan to ${pendingTier}? Stripe will pro-rate the difference for the remainder of the current period.`
      )
    ) return

    setBusy('change')
    setMessage(null)
    const res = await fetch(`/api/admin/agents/${agentId}/subscription`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier: pendingTier }),
    })
    setBusy(null)
    if (res.ok) {
      setMessage({ kind: 'ok', text: `Plan changed to ${pendingTier}.` })
      router.refresh()
    } else {
      const err = await res.json().catch(() => ({}))
      setMessage({ kind: 'error', text: err.error ?? 'Failed to change plan.' })
    }
  }

  async function cancelSubscription(immediate: boolean) {
    if (!subscription) return
    const verb = immediate
      ? 'CANCEL THIS SUBSCRIPTION IMMEDIATELY (no refund)'
      : 'cancel this subscription at the end of the current paid period'
    if (!confirm(`Are you sure you want to ${verb}?`)) return

    setBusy('cancel')
    setMessage(null)
    const res = await fetch(`/api/admin/agents/${agentId}/subscription`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: immediate ? 'immediate' : 'period_end' }),
    })
    setBusy(null)
    if (res.ok) {
      setMessage({
        kind: 'ok',
        text: immediate
          ? 'Subscription canceled immediately.'
          : 'Subscription will cancel at the end of the current period.',
      })
      router.refresh()
    } else {
      const err = await res.json().catch(() => ({}))
      setMessage({ kind: 'error', text: err.error ?? 'Failed to cancel.' })
    }
  }

  // ── Empty / error state ─────────────────────────────────────────────
  if (!subscription) {
    return (
      <Card title="Subscription">
        <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>
          {errors.subscription ?? 'No active subscription on file.'}
          {stripeCustomerUrl && (
            <div style={{ marginTop: 12 }}>
              <a
                href={stripeCustomerUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
              >
                Open customer in Stripe ↗
              </a>
            </div>
          )}
        </div>
      </Card>
    )
  }

  const statusVariant: 'success' | 'warning' | 'danger' | 'info' | 'default' =
    subscription.status === 'active'
      ? 'success'
      : subscription.status === 'past_due' || subscription.status === 'unpaid'
        ? 'warning'
        : subscription.status === 'canceled' || subscription.status === 'incomplete_expired'
          ? 'danger'
          : 'info'

  return (
    <Card title="Subscription">
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          paddingBottom: 16,
          borderBottom: '1px solid #f3f4f6',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 4, textTransform: 'capitalize' }}>
            {subscription.tier === 'unknown' ? 'Custom plan' : subscription.tier}
            {subscription.monthlyAmount !== null && (
              <span style={{ color: '#6b7280', fontWeight: 500, fontSize: 16, marginLeft: 8 }}>
                · {formatMoney(subscription.monthlyAmount, subscription.currency)}/mo
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Badge label={subscription.status.replace('_', ' ')} variant={statusVariant} size="md" />
            {subscription.cancelAtPeriodEnd && (
              <Badge label="Cancels at period end" variant="warning" size="md" />
            )}
          </div>
        </div>
        {subscriptionUrl && (
          <a
            href={subscriptionUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Open in Stripe ↗
          </a>
        )}
      </div>

      {/* Period info */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginBottom: 24,
          fontSize: 13,
        }}
      >
        <Field label="Started" value={formatDate(subscription.startedAt)} />
        <Field label="Current period" value={`${formatDate(subscription.currentPeriodStart)} → ${formatDate(subscription.currentPeriodEnd)}`} />
        <Field label="Next invoice" value={formatDate(subscription.currentPeriodEnd)} />
      </div>

      {/* Actions */}
      <div
        style={{
          padding: 16,
          background: '#fafafa',
          border: '1px solid #f3f4f6',
          borderRadius: 8,
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 12 }}>
          Admin Actions
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
          <select
            value={pendingTier}
            onChange={(e) => setPendingTier(e.target.value)}
            disabled={busy !== null}
            style={selectStyle}
          >
            {TIER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            onClick={changeTier}
            disabled={busy !== null}
            style={btn('primary', busy !== null)}
          >
            {busy === 'change' ? 'Changing…' : 'Change Tier'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={() => cancelSubscription(false)}
            disabled={busy !== null || subscription.cancelAtPeriodEnd}
            style={btn('warning', busy !== null || subscription.cancelAtPeriodEnd)}
          >
            {busy === 'cancel' ? 'Canceling…' : 'Cancel at Period End'}
          </button>
          <button
            onClick={() => cancelSubscription(true)}
            disabled={busy !== null}
            style={btn('danger', busy !== null)}
          >
            Cancel Immediately
          </button>
        </div>

        {message && (
          <div
            style={{
              marginTop: 12,
              padding: '8px 12px',
              borderRadius: 6,
              fontSize: 13,
              background: message.kind === 'ok' ? '#dcfce7' : '#fef2f2',
              color: message.kind === 'ok' ? '#166534' : '#991b1b',
              border: `1px solid ${message.kind === 'ok' ? '#bbf7d0' : '#fecaca'}`,
            }}
          >
            {message.text}
          </div>
        )}
      </div>

      {/* Invoices */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 12 }}>
          Recent Invoices
        </div>

        {errors.invoices && (
          <div style={{ fontSize: 13, color: '#991b1b' }}>{errors.invoices}</div>
        )}

        {!errors.invoices && invoices.length === 0 && (
          <div style={{ fontSize: 13, color: '#6b7280' }}>No invoices yet.</div>
        )}

        {invoices.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {invoices.map((inv) => (
              <div
                key={inv.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto auto',
                  gap: 16,
                  alignItems: 'center',
                  padding: '10px 12px',
                  background: '#fff',
                  border: '1px solid #f3f4f6',
                  borderRadius: 6,
                  fontSize: 13,
                }}
              >
                <span style={{ color: '#374151' }}>
                  {formatDate(inv.created)}
                  {inv.number && <span style={{ color: '#9ca3af', marginLeft: 8 }}>{inv.number}</span>}
                </span>
                <span style={{ fontWeight: 600, color: '#111', fontVariantNumeric: 'tabular-nums' }}>
                  {formatMoney(inv.amountPaid > 0 ? inv.amountPaid : inv.amountDue, inv.currency)}
                </span>
                <Badge
                  label={inv.status}
                  size="sm"
                  variant={
                    inv.status === 'paid' ? 'success'
                    : inv.status === 'open' ? 'warning'
                    : inv.status === 'uncollectible' || inv.status === 'void' ? 'danger'
                    : 'default'
                  }
                />
                {inv.invoicePdf ? (
                  <a
                    href={inv.invoicePdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...linkStyle, fontSize: 12 }}
                  >
                    PDF ↗
                  </a>
                ) : (
                  <span />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ color: '#9ca3af', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ color: '#111', fontWeight: 500 }}>{value}</div>
    </div>
  )
}

const linkStyle: React.CSSProperties = {
  color: '#111',
  fontSize: 13,
  fontWeight: 600,
  textDecoration: 'none',
  borderBottom: '1px solid #d1d5db',
  paddingBottom: 1,
}

const selectStyle: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: 6,
  fontSize: 13,
  background: '#fff',
  color: '#111',
  cursor: 'pointer',
  outline: 'none',
}

function btn(
  variant: 'primary' | 'warning' | 'danger',
  disabled: boolean
): React.CSSProperties {
  const palettes = {
    primary: { bg: '#111', border: '#111', color: '#fff' },
    warning: { bg: '#fff', border: '#d97706', color: '#92400e' },
    danger:  { bg: '#fff', border: '#dc2626', color: '#991b1b' },
  } as const
  const p = palettes[variant]
  return {
    padding: '8px 16px',
    background: p.bg,
    color: p.color,
    border: `1px solid ${p.border}`,
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.55 : 1,
    transition: 'opacity 0.15s ease',
  }
}
