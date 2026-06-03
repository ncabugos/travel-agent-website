# Elite Advisor Hub: Cold Advisor Recruitment Launch Campaign

**Owner:** Nick Cabugos, Founder
**Goal:** Recruit independent luxury travel advisors into Elite Advisor Hub.
**Primary action:** Visit the homepage and book a consultation.
**Audience:** Cold list of independent advisors and boutique agencies (no prior relationship).
**Format:** 5-email automated sequence over ~14 days, plus branching follow-ups.
**Status:** Draft for review. Nothing is scheduled or sent. See the setup doc for execution.

---

## 1. The one thing this campaign has to do

Get the right advisors to look at eliteadvisorhub.com and book a consultation. Everything else (open rates, clicks) is a means to that end. The single conversion event we optimize for is a row in `consultation_requests`.

Secondary conversion, for advisors who are interested but not ready to talk: a `/beta` waitlist signup. That keeps a warm lead instead of losing them.

---

## 2. Read this first: cold email is a compliance and deliverability problem

You asked specifically about cold recruitment to a wide list. That is legal in the US under CAN-SPAM for B2B outreach, but it carries two real risks that shape every decision below.

**Risk 1: your Resend account.** Resend's acceptable use policy, like nearly every email provider, prohibits unsolicited cold email and purchased or scraped lists. If a cold blast generates spam complaints, Resend can suspend the account. That same account sends your magic-link logins. A suspension would lock advisors out of the portal. **Do not send true cold outreach from the Resend account that powers authentication.**

**Risk 2: domain reputation.** Spam complaints against eliteadvisorhub.com hurt the deliverability of every email from that domain, including login links and client-facing transactional mail.

### How we de-risk it

- **Separate sending identity.** Send the campaign from a dedicated subdomain, for example `outreach.eliteadvisorhub.com`, with its own SPF, DKIM, and DMARC records. Keep transactional and auth mail on the root domain or `mail.eliteadvisorhub.com`. The two reputations stay isolated.
- **Right tool for the channel.** If the list is genuinely cold and not opt-in, the safest execution path is a dedicated cold-outreach platform (Instantly, Smartlead, lemlist, or Apollo sequences) that is built for this and won't jeopardize your transactional sending. Use Resend Broadcasts for the warm and opt-in portion of the list (the `/beta` waitlist, past consultation requests, anyone who has raised a hand). The strategy, sequence, and copy in this plan work identically in either tool.
- **CAN-SPAM essentials, baked into every email:** a truthful "from" name and subject, a real physical mailing address in the footer, a one-click unsubscribe that is honored within 10 days, and no misleading headers. Resend handles unsubscribe automatically for Broadcasts; a cold-outreach tool gives you an opt-out link.
- **Warm-up and throttle.** A brand-new sending subdomain should ramp slowly: roughly 20 to 50 sends a day for the first week, building over two to three weeks before any large volume. Cold-outreach tools automate this.
- **List hygiene before send.** Verify every address (NeverBounce, ZeroBounce, or similar) to strip invalid and risky addresses. Bounces above ~3 percent will tank a young domain.

> **Recommendation:** Run the cold portion through a dedicated outreach tool on `outreach.eliteadvisorhub.com`, and run the warm/opt-in portion through Resend Broadcasts. This protects your login email and gives each segment the right engine.

---

## 3. Audience and segmentation

| Segment | Source | Channel | Consent |
|---|---|---|---|
| Warm / opted-in | `/beta` waitlist, past `consultation_requests`, inbound contacts | Resend Broadcasts | Yes |
| Cold prospects | Built list of independent advisors (LinkedIn, Virtuoso/host-agency directories, association rosters) | Dedicated cold-outreach tool | No (B2B, CAN-SPAM applies) |

Within cold prospects, prioritize by fit so the best leads see the most personal touch:

1. **Tier A: established independents** with a weak or dated website. Highest fit for the Founding Advisor offer.
2. **Tier B: boutique multi-advisor agencies.** Route toward the Agency tier and a directory conversation.
3. **Tier C: newer advisors.** Real prospects for Starter and Growth, lighter personalization.

Personalize the first email's opening line by tier. Tier A gets a genuine, specific compliment referencing their brand; Tiers B and C can use a lighter merge.

---

## 4. Positioning and message (matches your existing voice)

The campaign carries the same voice as your onboarding sequence in `lib/email.ts`: first person, warm, signed by Nick, with the **Founding Advisor** framing.

**Core promise:** The best advisors sell extraordinary trips on websites that don't come close to matching them. EAH gives independent advisors a Virtuoso-grade website, live in days not months, with a built-in journal and curated supplier content.

**Founding Advisor offer (the hook):**
- Setup fee waived
- First month free (a 30-day trial)
- A locked founding rate after that, held for as long as they stay
- A site built with Nick's direct, hands-on attention

**Proof:** Eden For Your World (edenforyourworld.com), the first paying client and brand ambassador, is the live example to show rather than tell.

**What we never do:** commodity language, "cheap," "website builder," generic SaaS speak. EAH is invitation-worthy and built for the top 1 percent. Per your house style, the copy avoids em dashes.

---

## 5. The sequence at a glance

Five emails over about two weeks. Full copy is in `EAH_Launch_Email_Sequence.md`. Workflow logic is in `EAH_Launch_Automation_Workflow.mermaid`.

| # | Day | Working title | Job | Primary CTA |
|---|---|---|---|---|
| 1 | 0 | The invitation | Name the problem, introduce EAH and the founding offer | See the homepage / book a conversation |
| 2 | +3 | How it actually works | Speed, quality, what they get | Book a consultation |
| 3 | +6 | Proof you can click | Show Eden's live site, build credibility | View the example, then book |
| 4 | +10 | The founding window | Make the offer and its scarcity concrete | Book a consultation |
| 5 | +14 | Last call | Soft close, low-pressure fallback | Book, or join the waitlist |

Cadence rationale: every 3 to 4 days is frequent enough to build momentum without fatiguing a cold audience. Day 10 and 14 widen slightly because the later emails lean on urgency, which needs a beat of silence to land.

---

## 6. Automation logic (branching)

The sequence is not a blind five-email blast. It branches on behavior. Full diagram in the `.mermaid` file; in words:

**Global exit and suppression: checked before every send:**
- **Booked a consultation** (`consultation_requests`): exit the campaign immediately, hand off to the sales/onboarding flow. Never send a recruitment email to someone already in conversation.
- **Replied:** exit and route to Nick's inbox. A reply is a conversation, not a metric.
- **Unsubscribed or marked spam:** suppress permanently.
- **Hard bounced:** suppress and remove from list.

**Engagement branches:**
- **Opened but did not click, two emails running:** the next send uses the alternate subject line (provided in the copy doc) to win a second look.
- **Clicked the site or example but did not book:** insert a short, single nudge email ("saw you took a look") between the scheduled sends. This is the highest-intent group and converts best.
- **No open across emails 1 and 2:** still send email 3 (proof) once, then if still no open, hold them out of 4 and place them in a low-frequency re-engagement list rather than burning the offer on a dead address.

**Fallback at the end:**
- Anyone who reaches email 5 without booking gets the waitlist CTA (`/beta`). A waitlist signup is a warm lead you keep; it also legitimizes future sends because they have now opted in.

---

## 7. Sending setup checklist

1. Add subdomain `outreach.eliteadvisorhub.com` (or your chosen cold-outreach platform's sending domain).
2. Publish SPF, DKIM, and DMARC for that subdomain. Set DMARC to `p=none` initially to monitor, then tighten.
3. Verify the domain in the sending tool. In Resend this is Domains → Add Domain.
4. Set the from name to **Nick Cabugos** and reply-to to **nick@eliteadvisorhub.com** so replies reach you.
5. Add a real physical mailing address for the footer (required by CAN-SPAM).
6. Verify the list (NeverBounce / ZeroBounce). Remove invalid and risky addresses.
7. Warm up: start at 20 to 50 sends per day, ramp over two to three weeks.
8. Load contacts and the sequence. For Resend Broadcasts, see `resend-broadcast-setup.md`.

---

## 8. Measurement

Track in this priority order. The first metric is the only one that matters for the business; the rest diagnose it.

| Metric | Target (cold B2B) | What it tells you |
|---|---|---|
| Consultations booked | The whole point | Campaign success |
| Reply rate | 3 to 8 percent | Message-to-audience fit |
| Click rate | 2 to 5 percent | Subject + offer pull |
| Open rate | 30 to 50 percent | Deliverability + subject line (unreliable post-Apple MPP, use as a trend only) |
| Bounce rate | Under 3 percent | List quality and domain health |
| Spam complaint rate | Under 0.1 percent | The number that protects your domain. Watch it daily. |
| Unsubscribe rate | Under 1 percent per send | Audience fit and frequency |

If the spam complaint rate approaches 0.1 percent or bounces exceed 3 percent, pause the campaign and fix the list before continuing. Protecting domain reputation outranks any single send.

**Suggested A/B tests, one variable at a time:** email 1 subject line (curiosity vs. direct), the day-10 offer framing (scarcity vs. value), and the CTA wording (book a conversation vs. see a 15-minute walkthrough).

---

## 9. What I can and cannot do for you here

- I built the plan, the branching workflow, all five emails, and a ready-to-run Resend setup script.
- I do not have a Resend connector and will not pull your API key out of the app to send live mail from this sandbox. You run the send with your own key, in the tool you choose, once you have reviewed the copy and stood up the sending subdomain.

---

## Files in this campaign

- `EAH_Launch_Campaign_Plan.md`: this document
- `EAH_Launch_Email_Sequence.md`: all five emails, copy-paste ready, with alternate subjects and the click-nudge email
- `EAH_Launch_Automation_Workflow.mermaid`: the branching automation diagram
- `resend-broadcast-setup.md`: step-by-step plus a Node script to create the audience, import contacts, and send/schedule a broadcast
