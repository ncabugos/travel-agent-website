# HubSpot Setup Checklist — EAH Intro Campaign

The connector here is read-only, so these steps are done in the HubSpot UI. About 15 minutes total.
Contacts are already in your portal (298 imported June 18), so there is nothing to re-upload.

## 1. Build the audience list
- Contacts → Lists → Create list → **Active list**, object: Contacts.
- Name: `EAH Intro — Cold Advisors (Jun 2026)`.
- Filter to the imported batch. Simplest reliable filter: **Create date is on June 18, 2026**
  (that is when all 298 were imported). Confirm the count reads ~298.
- Decision already made: SmartFlyer contacts are **included** (no suppression filter needed).
- Optional safety filters to add: Marketing contact status = Marketing, and
  Unsubscribed from all email = No. HubSpot also auto-skips non-marketable and unsubscribed.

## 2. Set the merge-field fallbacks (do this before sending)
- `{{ contact.firstname }}` → default value **there** (1 contact has no first name).
- Do **not** use a `{{ company }}` subject line. No contact has a company value, so it renders
  blank. Use subject **B**: "Your website should sell the way you do."

## 3. Create the email
- Marketing → Email → Create → **Regular** → **Code your own** (custom HTML).
- Paste the contents of `email.html`.
- From name / address: Nick Cabugos, on an authenticated eliteadvisorhub.com sender.
- Subject: B (primary). Set up A/B test on subject B vs C if you want.
- Preview text: "A custom-branded site, supplier catalog, and curated journal, without the agency price tag."
- The footer in the HTML has placeholder tokens. Either delete that footer row and let HubSpot
  insert its own CAN-SPAM footer, or swap in HubSpot's real tokens
  (`{{ site_settings.company_street_address_1 }}`, `{{ unsubscribe_link }}`).

## 4. Test before send
- Send yourself a test. Check first-name personalization, the fallback, both CTA buttons
  (Book a walkthrough → /schedule-consultation, See a live demo → eliteadvisorhub.com).
- Open on mobile. Confirm the two buttons stack cleanly.
- Run HubSpot's spam/link check.

## 5. Send / schedule
- Recipient list: `EAH Intro — Cold Advisors (Jun 2026)`.
- Best windows for B2B: Tue–Thu, 8–10am in the recipient's time zone.

## 6. Follow-ups (already drafted)
- `email-2.html` — supplier catalog + hotel directory. Send +4 days to non-openers/non-clickers.
- `email-3.html` — founding offer. Send +9 days. Suppress anyone who replied or booked.
- Build these as two more emails, or wire all three into a simple sequence/workflow.

## 7. Deliverability notes
- Confirm SPF + DKIM are set for the sending domain before the first send.
- This is a cold B2B send; keep volume reasonable and watch the first batch's bounce/spam rate
  before sending the full list.
