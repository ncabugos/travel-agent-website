# Resend Broadcast Setup (warm / opt-in segment)

Use Resend Broadcasts for the **warm and opt-in** part of the list only: your `/beta` waitlist, past `consultation_requests`, and inbound contacts. Keep true cold prospects in a dedicated cold-outreach tool, and send everything from a separate subdomain so your magic-link login email is never at risk. See the campaign plan, section 2, for why.

## Prerequisites

1. A verified sending domain in Resend, ideally a subdomain like `outreach.eliteadvisorhub.com` (Resend dashboard → Domains → Add Domain, then publish the SPF/DKIM/DMARC records it gives you).
2. A Resend API key with access to that domain. **Do not reuse the production `RESEND_API_KEY` that sends auth email.** Create a separate key.
3. Node 18+ and the SDK: `npm install resend`.
4. Your warm contacts in a CSV with headers `email,firstName,brandName`.

## Dashboard path (no code)

1. Audiences → create an audience, e.g. "Launch — warm advisors". Import the CSV.
2. Broadcasts → create a broadcast → pick that audience.
3. Paste the email from `EAH_Launch_Email_Sequence.md`, set the from name to **Nick Cabugos** and reply-to to **nick@eliteadvisorhub.com**.
4. Send a test to yourself, then send now or schedule.
5. Resend adds the required unsubscribe automatically. Add your physical address in the footer.

Note: Broadcasts are individual sends, not a drip engine. For the multi-step automated sequence with branching, drive it from the script below on a schedule, or use a cold-outreach tool for the cold segment.

## Script path (audience + import + broadcast)

Save the file below as `send-launch-broadcast.mjs` in this folder, set the env vars, and run it. It creates the audience, imports the CSV, creates email 1 as a broadcast, and either sends now or schedules it. It does a dry run unless you pass `--send`.

```js
// send-launch-broadcast.mjs
// Usage:
//   RESEND_API_KEY=re_xxx node send-launch-broadcast.mjs            # dry run (creates audience + imports, no send)
//   RESEND_API_KEY=re_xxx node send-launch-broadcast.mjs --send     # also sends broadcast now
//   RESEND_API_KEY=re_xxx SCHEDULE="in 1 hour" node send-launch-broadcast.mjs --send   # schedule instead
import { Resend } from 'resend'
import { readFileSync } from 'node:fs'

const apiKey = process.env.RESEND_API_KEY
if (!apiKey) throw new Error('Set RESEND_API_KEY (use a key that is NOT your auth-email key)')
const resend = new Resend(apiKey)

const FROM = process.env.FROM || 'Nick Cabugos <nick@outreach.eliteadvisorhub.com>'
const REPLY_TO = process.env.REPLY_TO || 'nick@eliteadvisorhub.com'
const CSV = process.env.CSV || './warm-contacts.csv' // headers: email,firstName,brandName
const DO_SEND = process.argv.includes('--send')
const SCHEDULE = process.env.SCHEDULE // e.g. "in 1 hour" or an ISO timestamp; omit to send now

// 1. Create (or reuse) the audience
const { data: audience, error: aErr } = await resend.audiences.create({
  name: 'Launch — warm advisors',
})
if (aErr) throw aErr
console.log('Audience:', audience.id)

// 2. Import contacts from CSV
const rows = readFileSync(CSV, 'utf8').trim().split('\n').slice(1)
let imported = 0
for (const line of rows) {
  const [email, firstName = '', brandName = ''] = line.split(',').map((s) => s.trim())
  if (!email) continue
  const { error } = await resend.contacts.create({
    audienceId: audience.id,
    email,
    firstName,
    unsubscribed: false,
  })
  if (error) { console.warn('skip', email, error.message); continue }
  imported++
}
console.log(`Imported ${imported} contacts`)

// 3. Create the broadcast (Email 1). Paste the real HTML/text from the sequence doc.
const { data: broadcast, error: bErr } = await resend.broadcasts.create({
  audienceId: audience.id,
  from: FROM,
  replyTo: REPLY_TO,
  subject: 'An invitation for your agency',
  html: `
    <p>Hi {{{FIRST_NAME|there}}},</p>
    <p>I came across your agency and the way you've built your client base is exactly the kind of work I built this for, so I wanted to reach out directly.</p>
    <p>I'm a travel advisor too, and I kept running into the same frustration: the best advisors sell extraordinary trips on websites that don't come close to matching them. So I built Elite Advisor Hub, a Virtuoso-grade website for independent advisors, live in days rather than months.</p>
    <p><a href="https://eliteadvisorhub.com?utm_source=launch&utm_medium=email&utm_campaign=warm&utm_content=email1">See the homepage</a></p>
    <p><a href="https://eliteadvisorhub.com/schedule-consultation?utm_source=launch&utm_medium=email&utm_campaign=warm&utm_content=email1">Book a conversation</a></p>
    <p>Warmly,<br/>Nick Cabugos<br/>Founder, Elite Advisor Hub</p>
    <p style="font-size:12px;color:#9ca3af">Elite Advisor Hub · [your physical address]<br/><a href="{{{RESEND_UNSUBSCRIBE_URL}}}">Unsubscribe</a></p>
  `,
})
if (bErr) throw bErr
console.log('Broadcast created:', broadcast.id)

// 4. Send or schedule
if (DO_SEND) {
  const { data, error } = await resend.broadcasts.send(
    broadcast.id,
    SCHEDULE ? { scheduledAt: SCHEDULE } : undefined,
  )
  if (error) throw error
  console.log(SCHEDULE ? `Scheduled (${SCHEDULE}):` : 'Sent:', data)
} else {
  console.log('Dry run complete. Re-run with --send to send the broadcast.')
}
```

### Notes

- `{{{FIRST_NAME|there}}}` and `{{{RESEND_UNSUBSCRIBE_URL}}}` are Resend's broadcast merge tags. The unsubscribe tag is required.
- `scheduledAt` accepts natural language ("in 1 hour", "tomorrow at 9am") or an ISO 8601 timestamp.
- To run the full 5-email sequence, duplicate the broadcast step per email with the copy from the sequence doc, and schedule each with the day offsets in the plan (0, 3, 6, 10, 14). Resend Broadcasts will not auto-branch on behavior; for the click-nudge and open-based branching, use a cold-outreach platform or wire your own logic against the Resend events webhook.
- Always send a test to yourself first.
