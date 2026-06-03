# Warm sequence runbook (20 known advisors)

For a small list of advisors you personally know. Sends the 5-email founding sequence as individual, personal "from Nick" emails through your existing Resend domain. This is warm, permissioned outreach, so the account-suspension risk that applies to cold blasts does not apply here.

## Why this is safe at 20 known contacts

Suspensions come from spam complaints on unsolicited bulk mail. People who know you and expect your note will not report you. You are not importing a purchased list. So you can send from your existing verified domain with no subdomain or warm-up needed. The guardrails below are simple hygiene, not heavy lifting.

## One-time setup

1. Confirm `RESEND_API_KEY` is in `.env.local` (the same key the app already uses is fine at this volume).
2. Fill in `scripts/warm-contacts.csv`. One row per advisor:
   ```
   email,firstName,brandName
   jane@example.com,Jane,Wanderlust Travel Co
   ```
3. Optional: create `scripts/warm-suppress.txt`, one email per line. Add anyone who replies, books, or asks to stop. The script skips these on every step. (Lines starting with `#` are ignored.)

## Running the sequence

Send one step per day on this cadence: step 1 on day 0, step 2 on day 3, step 3 on day 6, step 4 on day 10, step 5 on day 14.

Always dry-run first to see exactly who would receive:

```
npx tsx scripts/send-warm-sequence.ts 1
```

Then send for real:

```
npx tsx scripts/send-warm-sequence.ts 1 --send
```

Repeat with `2`, `3`, `4`, `5` on the later days. The script emails each person individually with a 6 to 14 second random gap, so it reads as personal mail rather than a blast.

| Step | Email | Suggested day |
|---|---|---|
| 1 | Invitation (reuses your existing founding invite) | Day 0 |
| 2 | How it works | Day 3 |
| 3 | Proof (Eden's live site) | Day 6 |
| 4 | The founding window | Day 10 |
| 5 | Last call | Day 14 |

## Between steps, keep the list clean

- Someone replies → add them to `warm-suppress.txt` and answer personally. A reply is a conversation, not a step to automate.
- Someone books a consultation → add them to `warm-suppress.txt`.
- Someone says no → add them to `warm-suppress.txt`.

## Good-hygiene checklist (applies even to warm mail)

- Each email goes to one recipient only. The script handles this; never paste 20 addresses into one To/CC.
- Keep a real physical mailing address and an unsubscribe path. Your branded template footer should carry both; reply-based opt-out is acceptable for a known list, but an unsubscribe link is cleaner.
- Send Tuesday to Thursday mornings for the best response.

## Where the copy lives

- Email 1: `sendBetaInvitationEmail` in `lib/email.ts` (your existing founding invite).
- Emails 2 to 5: `sendWarmHowItWorksEmail`, `sendWarmProofEmail`, `sendWarmFoundingWindowEmail`, `sendWarmLastCallEmail` in `lib/email.ts`.
- Plain-text reference copy: `EAH_Launch_Email_Sequence.md` in this folder. Edit the wording in `lib/email.ts` if you want to change what sends.

## Optional: automate the cadence

If you would rather not run a command on five different days, the steps can be scheduled to fire automatically on the day offsets above. Say the word and I will set that up.
