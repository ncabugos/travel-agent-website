-- 055_yacht_benefits_and_suites.sql
--
-- The four yacht lines carry rich intro/destinations/experiences/journeys
-- content already (049_cruise_lines_yacht_content), but three of them shipped
-- with an empty `benefits` array and two with empty `suites`. The detail page
-- skips those sections entirely when empty, so Ritz-Carlton, Four Seasons and
-- Orient Express were rendering visibly thinner than Aman at Sea.
--
-- Benefit copy mirrors the Virtuoso Voyages structure already stored on
-- aman-at-sea, including its "participating sailings" hedging — the amenity
-- set is programme-wide, but what applies varies by departure.
--
-- Suite names are only those confirmed by the assets and ship copy already in
-- the repo (Four Seasons Loft + Yacht Residential; Orient Express Zephyr).
-- No category is invented to pad the section out.

-- ── The Ritz-Carlton Yacht Collection ───────────────────────────────────────
update cruise_lines set
  benefits = $j$[
    {"title":"Dedicated Onboard Host","description":"A Virtuoso host sails with the group, on hand through the voyage so questions are answered before they become problems."},
    {"title":"Private Welcome Reception","description":"A reception at the start of each sailing held solely for Virtuoso Voyages guests."},
    {"title":"Shipboard Credit","description":"$100 per suite on voyages under 14 nights; $200 per suite on voyages of 14 nights or more, to spend across dining, spa, or excursions."},
    {"title":"Exclusive Shore Experience","description":"A private excursion or car and driver shaped around your pace rather than a group timetable."},
    {"title":"Suite Priority Before Release","description":"Owner's and Loft suites are held for our clients ahead of general sale on participating sailings."},
    {"title":"Marina Access","description":"The retractable marina opens straight onto the water for swimming, kayaks, and tenders whenever the yacht is at anchor."}
  ]$j$::jsonb,
  updated_at = now()
where slug = 'ritz-carlton-yacht';

-- ── Four Seasons Yachts ─────────────────────────────────────────────────────
update cruise_lines set
  benefits = $j$[
    {"title":"Dedicated Onboard Host","description":"A Virtuoso host sails with the group and stays reachable for the length of the voyage."},
    {"title":"Private Welcome Reception","description":"An opening reception arranged solely for Virtuoso Voyages guests."},
    {"title":"Shipboard Credit","description":"$100 per suite on voyages under 14 nights; $200 per suite on voyages of 14 nights or more."},
    {"title":"Exclusive Shore Experience","description":"A private shore excursion or car and driver, planned around your interests instead of a fixed group route."},
    {"title":"Four Seasons Recognition","description":"Guests known to Four Seasons on land carry that recognition aboard, noted on the reservation before you sail."},
    {"title":"Specialty Dining Reservations","description":"Signature restaurant tables and chef's tastings reserved ahead of embarkation on participating sailings."}
  ]$j$::jsonb,
  suites = $s$[
    {
      "name": "Loft Suite",
      "blurb": "Two storeys of living space with a double-height window wall onto the sea, and a terrace that runs the width of the suite.",
      "image_url": "/media/cruises/four_seasons_yacht/04LEzxMLQmGtbmeDC8fS3Q-hHai7GvkTA-I4XxHg74DHQ-FSY_Loft-Suite_Livingroom-2-copy.webp"
    },
    {
      "name": "Yacht Residential Suite",
      "blurb": "The largest suites at sea — up to four bedrooms, a full kitchen, and terraces sized for entertaining rather than for standing on.",
      "image_url": "/media/cruises/four_seasons_yacht/YCT_209_aspect4x5.jpg"
    }
  ]$s$::jsonb,
  updated_at = now()
where slug = 'four-seasons-yachts';

-- ── Orient Express Sailing Yachts ───────────────────────────────────────────
update cruise_lines set
  benefits = $j$[
    {"title":"Dedicated Onboard Host","description":"A Virtuoso host sails with the group for the duration of the voyage."},
    {"title":"Private Welcome Reception","description":"An opening reception held solely for Virtuoso Voyages guests."},
    {"title":"Shipboard Credit","description":"$100 per suite on voyages under 14 nights; $200 per suite on voyages of 14 nights or more."},
    {"title":"Exclusive Shore Experience","description":"A private excursion or car and driver in port, built around your interests."},
    {"title":"Suite Priority on Maiden Seasons","description":"Corinthian's first seasons sell out on announcement. We hold the category while the dates are still being settled."},
    {"title":"La Table and Le Spa Reservations","description":"Signature dining and spa reservations placed before embarkation on participating sailings."}
  ]$j$::jsonb,
  suites = $s$[
    {
      "name": "Zephyr Suite",
      "blurb": "The signature suite aboard Corinthian — a full living room opening to the sea, finished in the Art Deco language the name has carried since the 1920s.",
      "image_url": "/media/cruises/orient-express-sailing-yacht/corinthian-suite-zephyr.webp"
    }
  ]$s$::jsonb,
  updated_at = now()
where slug = 'orient-express-sailing-yachts';
