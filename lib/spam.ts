/**
 * Spam screening for public form server actions (contact, support,
 * consultation). The client half is components/ui/SpamFields.tsx, which
 * renders the honeypot, the fill-time field, and the Turnstile widget.
 *
 * Turnstile is enforced only when both NEXT_PUBLIC_TURNSTILE_SITE_KEY and
 * TURNSTILE_SECRET_KEY are set. Every hostname that serves a form (including
 * each advisor custom domain) must be listed on the Turnstile widget in the
 * Cloudflare dashboard, or the widget will not issue tokens there.
 */

import { headers } from 'next/headers'

const MIN_FILL_MS = 2000
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/**
 * - `ok`: looks human, continue.
 * - `drop`: honeypot or fill-time trap. Return success without doing anything
 *   so the bot has nothing to learn from.
 * - `challenge_failed`: Turnstile rejected or missing. Show the visitor an
 *   error; a real person can retry.
 */
export type BotCheck = 'ok' | 'drop' | 'challenge_failed'

export async function checkForBot(formData: FormData, label: string): Promise<BotCheck> {
  const get = (key: string) => String(formData.get(key) ?? '').trim()

  if (get('website_url')) {
    console.warn(`[${label}] honeypot tripped, dropping submission`)
    return 'drop'
  }

  // Missing counts as a bot: SpamFields always sends it, so a submission
  // without it did not come from our page.
  const fillMs = Number(get('_fill_ms'))
  if (!fillMs || fillMs < MIN_FILL_MS) {
    console.warn(`[${label}] fill time ${fillMs ? `${fillMs}ms` : 'missing'}, dropping submission`)
    return 'drop'
  }

  if (!(await verifyTurnstile(get('cf-turnstile-response'), label))) {
    return 'challenge_failed'
  }

  return 'ok'
}

async function verifyTurnstile(token: string, label: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret || !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) return true
  if (!token) {
    console.warn(`[${label}] turnstile token missing`)
    return false
  }

  const body = new URLSearchParams({ secret, response: token })
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim()
  if (ip) body.set('remoteip', ip)

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body })
    const data = (await res.json()) as { success: boolean; 'error-codes'?: string[] }
    if (!data.success) console.warn(`[${label}] turnstile rejected`, data['error-codes'])
    return data.success
  } catch (e) {
    // Fail open: losing a real lead to a Cloudflare outage is worse than
    // letting a few messages past. The other checks still apply.
    console.error(`[${label}] turnstile verify unavailable`, e)
    return true
  }
}

// Sales pitches that do not belong in a travel enquiry or a support request.
const PITCH_PHRASES = [
  'instagram growth',
  'more followers',
  'followers per month',
  'real followers',
  'seo services',
  'seo expert',
  'backlinks',
  'guest post',
  'first page of google',
  'rank higher on google',
  'website traffic',
  'daily traffic',
  'targeted traffic',
  'ready-to-buy customers',
  'lead generation service',
  'web design services',
  'redesign your website',
  'virtual assistant services',
  'just ignore this email',
  'if you are not interested',
  'unsubscribe',
]

// Travel enquiries almost never contain links; pitches almost always do.
const LINK_RE = /https?:\/\/|www\./i

/**
 * Returns why the text looks like a pitch, or null. `allowLinks` is for forms
 * where legitimate messages contain URLs (advisors pasting their own site into
 * a support request).
 */
export function spamContentReason(text: string, { allowLinks = false } = {}): string | null {
  const lower = text.toLowerCase()
  const phrase = PITCH_PHRASES.find(p => lower.includes(p))
  if (phrase) return `phrase "${phrase}"`
  if (!allowLinks && LINK_RE.test(text)) return 'contains a link'
  return null
}
