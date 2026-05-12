---
name: User role — operator + advisor
description: User builds this travel-advisor platform AND is themselves the travel advisor behind Wine & Wellness Travel (wineandwellnesstravel.com)
type: user
---

The user owns and operates this EliteAdvisorHub platform and is also a travel advisor on it. Their own agency is **Wine & Wellness Travel** (wineandwellnesstravel.com), affiliated with Montecito Village Travel / Virtuoso.

**Real DB row:** `14385e4b-7dbe-4642-88b8-1a1a0279f5d2` — `super_admin` role, `t2` template, `custom_domain = wineandwellnesstravel.com`. Tier is currently set to `starter` but the operator account isn't a paying customer; treat the tier field as cosmetic for super_admin rows.

**Retired handles (do NOT reference):** @lesbourgeoistravel (Instagram) and "Bourgeois Traveler" (Facebook) have been deprecated. All social presence has consolidated under Wine & Wellness Travel.

**How to apply:** When the user says "add me" / "my site" / "my information" — they mean Wine & Wellness Travel, and the work should be treated as building their real client record (not fabricated demo data). Ask them for missing personal details (legal name, email, phone, address, bio, photo, CST) rather than inventing them. Safe to use what's public on wineandwellnesstravel.com without asking.

**Demo slug confusion:** There is a `wwt-demo` mock slug in `lib/demo-agents.ts` labeled "Wine & Wellness (T2)". This is the demo, NOT the real account. The real account lives in the `agents` table.
