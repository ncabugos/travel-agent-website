# EAH Intro Campaign — Brief (HubSpot)

## Objective
Introduce Elite Advisor Hub to cold independent luxury travel advisors and book demo
walkthroughs. Secondary goal: drive live-demo site visits to warm the list for follow-up.

## Audience
Independent luxury / Virtuoso-network travel advisors and boutique agency owners. Solo
practitioners and 2–10 advisor agencies. HubSpot audience: the 298 imported contacts (June 18).
Per owner decision, the 67 SmartFlyer-domain contacts are **included** despite prior outreach.
Note: 0 contacts have a company value (no `{{company}}` subject); 1 has no first name (fallback
"there"); 0 opt-outs / bounces / existing customers.

## Core message
Your website should be as elevated as the trips you sell, and it should maintain itself. EAH
ships a custom-branded, Virtuoso-grade site with the supplier catalog, hotel directory, and
curated content already built in. Live in days, not months.

## Messaging pillars (lead with features, suppliers, hotel directory)
1. **Custom-branded, Virtuoso-grade site** — fast, SEO-ready, built to the advisor's identity.
2. **Living supplier catalog** — Virtuoso hotels, cruise partners, preferred programs (Belmond,
   etc.), kept current centrally. No manual hotel-grid upkeep.
3. **Searchable hotel directory** — preferred hotels with the exact client perks, on-brand.
4. **Curated journal** — ghost-written luxury articles on a cadence + a clean editor for own posts.
5. **Portal + lead inbox** — one place for content, suppliers, and inquiries.
6. **Founding offer** — 30 days free, then a locked founding rate.

## Offer & CTAs
- Primary CTA: **Book a walkthrough** → https://eliteadvisorhub.com/schedule-consultation
- Secondary CTA: **See a live demo** → https://eliteadvisorhub.com
- Proof point: Eden For Your World (first advisor) → https://edenforyourworld.com

## Suggested sequence (3 touches)
| # | Day | Angle | Subject (primary) |
|---|-----|-------|-------------------|
| 1 | 0 | Introduction + features | A Virtuoso-grade website for {{company}}, live in days |
| 2 | +4 | Supplier catalog & hotel directory focus | The hotel directory that updates itself |
| 3 | +9 | Founding offer / scarcity + demo nudge | 30 days free for founding advisors |

Suppress on reply or meeting booked. Email 1 is built and ready (`email.html`).

## A/B tests
- Subject A vs B vs C (see copy.md).
- CTA layout: dual button (current) vs single "Book a walkthrough."
- Preview text variants.

## Success metrics
- Open rate target 45%+ (warm, founder-from cold luxury niche).
- Click rate target 6–9% across the two CTAs.
- Primary KPI: walkthroughs booked. Secondary: live-demo sessions.
- Track unsubscribes < 0.5%; reply sentiment.

## Build notes (HubSpot)
- Email type: Marketing email, custom HTML (paste `email.html`).
- Merge fields used: `{{ contact.firstname }}`, `{{ contact.company }}`. Set firstname fallback
  to "there" and company fallback to "your agency".
- From name/address: Nick Cabugos, founder address on eliteadvisorhub.com domain.
- Confirm domain authentication (SPF/DKIM) before send. Plain-text alt in copy.md.
- CAN-SPAM: physical address + unsubscribe token are in the footer placeholders.

## Compliance
Cold B2B send — confirm the list source supports outreach and honors opt-out. The footer
includes unsubscribe + address tokens that HubSpot populates automatically.
