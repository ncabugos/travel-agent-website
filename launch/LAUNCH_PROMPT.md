# Claude Code launch prompt — paste the block below

---

You are working in the Elite Advisor Hub repo (Next.js 16, Vercel, Supabase, Stripe, Resend). I need to push this working tree live and be ready to launch a warm email campaign tomorrow (Wed June 3) at 6 AM Pacific. Work through the steps in order, report the result of each, and STOP and ask me if anything fails.

## Context — changes already in the working tree (do not redo, just ship)
- `lib/email.ts`: a warm launch sequence — Email 1 (invitation, reworked in my voice) plus follow-ups 2–5. Email 1 has a hero banner, my headshot in the signature, and an "Eden For Your World was first on board" line. The founding offer changed from "3 months free" to "first month free / 30-day trial".
- Offer change propagated to: `app/beta/page.tsx`, `app/templates/page.tsx`, `components/admin/FoundingCheckoutPanel.tsx`, the Stripe trial in `app/api/stripe/checkout/route.ts` (`trial_period_days` 90 → 30), related comments in `app/api/stripe/webhook/route.ts` and `lib/stripe.ts`, and the `launch/*.md` docs.
- New email assets that MUST deploy so inboxes can load them: `public/assets/email/email-1-hero.jpg` and `public/assets/email/nick-headshot.jpg`.
- New scripts: `scripts/send-warm-sequence.ts` (1:1 sender; defaults to `scripts/warm-contacts-rd1.csv`, 13 advisors) and `scripts/preview-warm-sequence.ts`.

## Steps
1. Run `npx tsc --noEmit` and `npm run lint`. Fix only NEW errors caused by the files above. Leave the pre-existing `@typescript-eslint/no-explicit-any` warnings in the Stripe routes alone.
2. Run `npm run build` and confirm it succeeds (catches RSC issues tsc misses).
3. Confirm `public/assets/email/email-1-hero.jpg` and `public/assets/email/nick-headshot.jpg` exist and are tracked by git.
4. Commit everything with a clear message (e.g. `Warm launch sequence + 30-day trial offer + email hero/headshot`) and push to the production branch.
5. Confirm the Vercel production deploy succeeds.
6. Verify both URLs return HTTP 200 and serve an image:
   - https://eliteadvisorhub.com/assets/email/email-1-hero.jpg
   - https://eliteadvisorhub.com/assets/email/nick-headshot.jpg
7. Send a test of Email 1 to my inbox: `npx tsx scripts/send-test-email.ts cabugosb3@gmail.com` (needs `RESEND_API_KEY` in `.env.local`). Confirm it sends without error, and tell me to check that the hero banner and headshot render in the received email.
8. Pre-flight the campaign WITHOUT sending: `npx tsx scripts/send-warm-sequence.ts 1` (dry run, no `--send`). Confirm it lists 13 recipients read from `scripts/warm-contacts-rd1.csv`.

## Guardrails
- DO NOT send the real campaign. I send Step 1 myself tomorrow at 6 AM with `npx tsx scripts/send-warm-sequence.ts 1 --send` (I have a reminder set; the runner emails each contact individually).
- The founding Stripe prices are LIVE-MODE only, so the 30-day trial cannot be exercised with a Stripe test clock. Do not attempt a live founding checkout. I'll verify the 30-day trial on the first real signup.
- If `npm run build` or the asset URLs fail, stop and tell me — those block the launch.

---
