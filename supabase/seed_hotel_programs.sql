-- =============================================================================
-- Seed: seed_hotel_programs.sql
-- Description: Seeds all 19 Exclusive Hotel Programs from edenforyourworld.com.
--              Run AFTER migration 002_hotel_programs.sql.
--              Safe to re-run: uses ON CONFLICT DO UPDATE.
-- =============================================================================

insert into public.hotel_programs
  (slug, name, tagline, description, category, property_count, benefits, eligibility_notes, booking_notes, sort_order)
values

-- 1. Belmond Bellini Club
(
  'belmond-bellini-club',
  'Belmond Bellini Club',
  'An invitation-only club for the world''s finest travel advisors.',
  'Regarded as one of the finest travel agent recognition programmes, the Belmond Bellini Club develops closer relationships between Belmond and a handpicked selection of agencies worldwide. Membership is by invitation only and grants access to exclusive benefits not available through any other booking channel.',
  'invitation_only',
  NULL,
  '[
    {"title": "Complimentary Room Upgrade", "description": "Upgrade upon arrival, subject to availability."},
    {"title": "Complimentary Internet", "description": "High-speed Wi-Fi throughout the stay."},
    {"title": "Daily Breakfast for Two", "description": "Buffet or full breakfast for two guests, daily."},
    {"title": "Flexible Hotel Credit", "description": "Up to $200 (USD) fully flexible hotel or resort credit per stay."},
    {"title": "$500 Gift Voucher", "description": "Gift voucher for future Belmond travel when purchasing an experience valued at $5,000 or more."},
    {"title": "VIP Recognition", "description": "Personal welcome by property management and dedicated staff recognition throughout the stay."},
    {"title": "In-Room Welcome Amenity", "description": "A special welcome gift awaiting on arrival."},
    {"title": "Top-of-Waitlist Priority", "description": "Priority placement on waitlists for high-demand properties and experiences."}
  ]'::jsonb,
  'Available exclusively to guests who book through Eden for Your World. Benefits cannot be combined with other promotional offers.',
  'Mention your booking through Eden for Your World at check-in to ensure all Bellini Club benefits are applied.',
  1
),

-- 2. Diamond Club – Dorchester Collection
(
  'dorchester-diamond-club',
  'Diamond Club — Dorchester Collection',
  'Unrivalled privileges at the world''s most iconic Dorchester hotels.',
  'The Diamond Club provides value-added benefits and priority upgrades at any hotel within the Dorchester Collection, including The Dorchester London, Hotel Plaza Athénée Paris, and Hotel Bel-Air Los Angeles. Access is available exclusively when booking through a participating preferred travel agency.',
  'invitation_only',
  10,
  '[
    {"title": "Complimentary Room Upgrade", "description": "Upgrade upon arrival, subject to availability."},
    {"title": "Unlimited Wi-Fi", "description": "Complimentary high-speed internet throughout the stay."},
    {"title": "Daily Breakfast for Two", "description": "Buffet or full breakfast for two guests, daily."},
    {"title": "Local Currency Credit", "description": "100 units in local currency per stay for rooms and junior suites; per day for suites."},
    {"title": "VIP Recognition", "description": "Personal welcome by property management and VIP treatment from all staff."},
    {"title": "In-Room Welcome Amenity", "description": "A curated welcome gift upon arrival."}
  ]'::jsonb,
  'Must be booked through Eden for Your World to unlock Diamond Club benefits.',
  'Quote your advisor''s name and agency when reserving to ensure benefits are registered.',
  2
),

-- 3. Four Seasons Preferred Partner
(
  'four-seasons-preferred-partner',
  'Four Seasons Preferred Partner',
  'The exclusive network connecting the world''s finest hotels with the world''s finest travel consultants.',
  'The Four Seasons Preferred Partner programme is an exclusive, invitation-only network of high-end travel consultants from around the world. It enables extraordinary guests to experience Four Seasons properties with a suite of value-added benefits available only when booked through a participating preferred agency.',
  'invitation_only',
  130,
  '[
    {"title": "Daily Breakfast for Two", "description": "Full breakfast served daily for two guests, either in the restaurant or in-room."},
    {"title": "Hotel Credit (Rooms)", "description": "USD $100 flexible hotel or resort credit per stay for guest room bookings."},
    {"title": "Hotel Credit (Suites)", "description": "USD $200 hotel or resort credit per stay for suites and specialty suites."},
    {"title": "Hotel Credit (Private Retreats)", "description": "USD $200 hotel or resort credit per bedroom per stay for private retreat bookings."},
    {"title": "Room Category Upgrade", "description": "One category room upgrade, subject to availability at time of check-in."}
  ]'::jsonb,
  'Must be booked via a Four Seasons Preferred Partner agency. Not available on direct bookings or third-party sites.',
  'Rate must be booked through Eden for Your World. Present the Preferred Partner confirmation at check-in.',
  3
),

-- 4. STARS – The Ritz-Carlton
(
  'ritz-carlton-stars',
  'STARS — The Ritz-Carlton',
  'A special recognition programme that transforms Ritz-Carlton stays into legendary memories.',
  'STARS represents a curated relationship between The Ritz-Carlton Hotel Company and a select group of elite travel agencies worldwide. The programme elevates the guest experience through thoughtful, personalised touches that begin before arrival and continue throughout the stay.',
  'invitation_only',
  100,
  '[
    {"title": "Personal Management Welcome", "description": "Welcomed personally by hotel management upon arrival, plus a welcome card signed by the General Manager."},
    {"title": "Pre-Registration & Express Check-In", "description": "Guests are pre-registered before arrival for a seamless, expedited check-in experience."},
    {"title": "4:00 PM Late Check-Out", "description": "Complimentary late check-out until 4:00 PM, upon request and subject to availability."},
    {"title": "Breakfast for Two", "description": "Continental or full breakfast for two guests, daily."},
    {"title": "In-Room Welcome Amenity", "description": "Complimentary in-room amenity selected by the property to delight the guest."},
    {"title": "Room or Suite Upgrade", "description": "Priority upgrade to a superior room or suite upon arrival, subject to availability."}
  ]'::jsonb,
  'Exclusive to bookings placed through an authorised STARS travel agency.',
  'Book through Eden for Your World and reference the STARS programme. Benefits are confirmed at time of reservation.',
  4
),

-- 5. Rosewood Elite
(
  'rosewood-elite',
  'Rosewood Elite',
  'Where ultra-luxury becomes truly personal.',
  'Rosewood Elite addresses the desire to embrace and recognise elite clientele at Rosewood''s most extraordinary hotels and resorts worldwide. Guests who book through a Rosewood Elite agency enjoy a collection of exclusive privileges, curated for those who expect the very best.',
  'invitation_only',
  35,
  '[
    {"title": "Daily Breakfast for Two", "description": "Full breakfast for two guests served daily at the hotel restaurant or in-room."},
    {"title": "Complimentary Room Upgrade", "description": "Free room upgrade upon arrival, subject to availability."},
    {"title": "Managing Director Welcome", "description": "Personalised welcome from the property''s Managing Director."},
    {"title": "Pre-Registration", "description": "Express pre-registration arranged prior to arrival."},
    {"title": "No Relocation Policy", "description": "Guaranteed no-relocation policy for Elite clients — your reserved room will not be reassigned."},
    {"title": "Property-Specific Amenity", "description": "Additional property-specific amenities such as a $100 resort or spa credit (varies by location)."}
  ]'::jsonb,
  'Benefits apply at participating Rosewood properties when booked through a Rosewood Elite agency.',
  'Reservation must be placed through Eden for Your World with the Rosewood Elite programme code.',
  5
),

-- 6. Accor Preferred by HERA
(
  'hera-accor-hotels',
  'Accor Preferred by HERA',
  'Preferred access to 5,000+ luxury properties worldwide under the Accor umbrella.',
  'Accor Preferred by HERA provides privileged access to Accor''s vast global portfolio of luxury and lifestyle hotels, including iconic brands such as Raffles, Fairmont, Sofitel, and Orient Express. The programme unlocks exclusive benefits for guests who choose to book through a participating preferred advisor.',
  'global_network',
  5000,
  '[
    {"title": "Daily Breakfast for Two", "description": "Complimentary full breakfast for two guests, served daily."},
    {"title": "$100 Property Credit", "description": "USD $100 flexible credit applicable towards dining, spa, or other on-property expenses, per stay."},
    {"title": "VIP Welcome", "description": "A personalised VIP welcome experience upon arrival."},
    {"title": "Early Check-In & Late Check-Out", "description": "Priority early check-in and late check-out, subject to availability."},
    {"title": "Room Upgrade", "description": "One category room upgrade at check-in, subject to availability."}
  ]'::jsonb,
  'Available across Accor''s luxury portfolio — Raffles, Fairmont, Sofitel, Orient Express, Rixos, and more.',
  'Book through Eden for Your World and reference the HERA programme to activate benefits.',
  6
),

-- 7. Mandarin Oriental Fan Club
(
  'mandarin-oriental-fan-club',
  'Mandarin Oriental Fan Club',
  'Invitation-only access to Mandarin Oriental''s legendary hospitality.',
  'The Mandarin Oriental Fan Club is an invitation-only programme that provides unique services and exclusive privileges at Mandarin Oriental''s prestigious collection of hotels, resorts, and residences worldwide. Members of the Fan Club receive a personalised, elevated experience that reflects the brand''s commitment to exceptional service.',
  'invitation_only',
  35,
  '[
    {"title": "Food & Beverage or Spa Credit", "description": "USD $100 credit applicable to food and beverage or spa services, per stay."},
    {"title": "Daily Continental Breakfast", "description": "Complimentary continental breakfast for two guests, daily."},
    {"title": "Complimentary High-Speed Internet", "description": "Complimentary high-speed Wi-Fi for the duration of the stay."},
    {"title": "Personalised Welcome Amenity", "description": "A curated in-room gift and a personalised welcome note from senior management."},
    {"title": "Room Category Upgrade", "description": "One category room upgrade, subject to availability at time of check-in."}
  ]'::jsonb,
  'Fan Club benefits must be requested through your Eden for Your World advisor at the time of booking.',
  'Quote the Mandarin Oriental Fan Club programme when booking through Eden for Your World.',
  7
),

-- 8. Shangri-La The Luxury Circle
(
  'shangri-la-hotels-the-luxury-circle',
  'Shangri-La — The Luxury Circle',
  'Hospitality from the Heart, perfected at every Shangri-La property.',
  'The Luxury Circle represents the pinnacle of Shangri-La''s commitment to personalised, heartfelt hospitality. Exclusively available through a select group of preferred travel agencies, The Luxury Circle delivers an elevated experience across Shangri-La, Kerry, and JEN hotels worldwide.',
  'invitation_only',
  100,
  '[
    {"title": "Guaranteed Room Upgrade", "description": "Upgrade to the next room category confirmed at time of booking, subject to availability."},
    {"title": "Hotel Credit", "description": "USD $50, USD $100 or 10% of Average Daily Rate (whichever is higher) as a flexible hotel credit."},
    {"title": "Full Breakfast for Two", "description": "Complimentary full breakfast for two guests daily, including in-room dining."},
    {"title": "VIP Welcome Amenity", "description": "In-room welcome gift plus a joint welcome letter from the General Manager and your travel advisor."},
    {"title": "Early Check-In & Late Check-Out", "description": "Priority early check-in and late check-out privileges, subject to availability."},
    {"title": "No-Walk Policy", "description": "Strict no-walk policy and priority waitlist clearance to guarantee the reserved accommodation."},
    {"title": "Dedicated Concierge", "description": "Access to a dedicated concierge for personalised service throughout the stay."}
  ]'::jsonb,
  'Bookings must be made via an authorised Luxury Circle travel agency with the programme code applied.',
  'Book through Eden for Your World and mention The Luxury Circle programme at time of reservation.',
  8
),

-- 9. Sir Rocco's Knights – Rocco Forte Hotels
(
  'rocco-forte-hotels',
  'Sir Rocco''s Knights — Rocco Forte Hotels',
  'An exclusive fraternity honouring the world''s most distinguished travel advisors.',
  'Sir Rocco''s Knights is Rocco Forte Hotels'' invitation-only preferred partner programme, named in honour of the company''s founder. It recognises a handpicked selection of elite travel agencies globally and rewards their discerning clients with a spectacular range of privileges across Rocco Forte''s European portfolio of prestige properties.',
  'invitation_only',
  14,
  '[
    {"title": "Daily Full Breakfast", "description": "Complimentary full breakfast for two guests, served daily."},
    {"title": "Food & Beverage Credit", "description": "€85 / £75 / $100 USD food and beverage credit in local currency, per stay."},
    {"title": "Spa Discount", "description": "15% discount on spa services at most Rocco Forte properties."},
    {"title": "Priority Room Upgrade", "description": "Priority upgrade upon arrival, subject to availability."},
    {"title": "Priority Early Check-In & Late Check-Out", "description": "Early check-in and late check-out prioritised, subject to availability."},
    {"title": "Seasonal Welcome Amenity", "description": "A seasonal, curated welcome amenity and a personalised note from the General Manager."}
  ]'::jsonb,
  'Available at all Rocco Forte Hotels when booked through an authorised Sir Rocco''s Knights agency.',
  'Book through Eden for Your World and reference the Sir Rocco''s Knights programme.',
  9
),

-- 10. One&Only
(
  'one-and-only-hotels-and-resorts',
  'One&Only',
  'The most exclusive places on earth — now more personal than ever.',
  'One&Only Resorts occupies the world''s most breathtaking destinations with properties that redefine ultra-luxury. Booking through a preferred agency unlocks a curated set of exclusive benefits that reflect the brand''s philosophy of personalised, unapologetic luxury.',
  'brand_programme',
  15,
  '[
    {"title": "Daily Breakfast for Two", "description": "Complimentary full breakfast for two guests, served daily."},
    {"title": "Resort or Spa Credit", "description": "A daily resort or spa credit for use towards on-property experiences."},
    {"title": "Complimentary Room Upgrade", "description": "Upgrade to a superior room category, based on availability at check-in."},
    {"title": "Early Check-In & Late Check-Out", "description": "Priority early check-in and late check-out, subject to availability."},
    {"title": "Complimentary Wi-Fi", "description": "High-speed Wi-Fi complimentary throughout the stay."},
    {"title": "Access to Best Room Inventory", "description": "Priority access to the best guest room inventory within the booked category."},
    {"title": "Personalised Recognition", "description": "Staff-wide recognition and personalised service throughout the stay."}
  ]'::jsonb,
  'Benefits apply at all One&Only Resorts when reservation is placed through a preferred partner agency.',
  'Contact Eden for Your World to book and activate your exclusive One&Only benefits.',
  10
),

-- 11. Auberge Resorts Collection
(
  'auberge-resorts-collection',
  'Auberge Resorts Collection',
  'Hand-crafted luxury in the world''s most inspiring places.',
  'Auberge Resorts Collection is a portfolio of exceptional hotels and resorts in iconic destinations. Each property is a one-of-a-kind experience delivered with remarkable hospitality. Booking through a preferred partner agency ensures the fullest expression of Auberge''s warm, personal service.',
  'brand_programme',
  25,
  '[
    {"title": "Daily Breakfast for Two", "description": "Complimentary full breakfast for two guests, served daily."},
    {"title": "Resort or Spa Credit", "description": "A resort or spa credit per stay for on-property indulgences."},
    {"title": "Complimentary Room Upgrade", "description": "Room upgrade based on availability at the time of check-in."},
    {"title": "Early Check-In & Late Check-Out", "description": "Priority early check-in and late check-out, subject to availability."},
    {"title": "Complimentary Wi-Fi", "description": "Complimentary high-speed internet access throughout the stay."},
    {"title": "Personalised Recognition", "description": "VIP treatment and personalised welcome from the property team."}
  ]'::jsonb,
  'Benefits apply at all Auberge Resorts Collection properties when booked through Eden for Your World.',
  'Book through Eden for Your World and mention the preferred partner programme at reservation.',
  11
),

-- 12. World of Hyatt Privé
(
  'hyatt-prive',
  'World of Hyatt Privé',
  'Strictly limited to a small collection of Hyatt''s most exceptional global agencies.',
  'World of Hyatt Privé is an exclusive travel advisor programme that provides preferred benefits at Hyatt''s most prestigious properties, including Park Hyatt, Alila, Andaz, Hyatt Regency, and Grand Hyatt. Membership is strictly limited, ensuring the highest level of service and recognition for participating guests.',
  'invitation_only',
  1000,
  '[
    {"title": "Property Credit", "description": "Up to USD $100 credit per room per stay for use towards dining, spa, and other hotel services."},
    {"title": "Room Category Upgrade", "description": "One category room upgrade, excluding non-suite to suite, subject to availability at check-in."},
    {"title": "Daily Full Breakfast", "description": "Complimentary full breakfast served daily for two guests."},
    {"title": "VIP Welcome Amenity", "description": "A personalised welcome amenity awaiting on arrival."},
    {"title": "Early Check-In & Late Check-Out", "description": "Priority early check-in and late check-out privileges, subject to availability."},
    {"title": "Complimentary Wi-Fi", "description": "Complimentary high-speed Wi-Fi throughout the stay."}
  ]'::jsonb,
  'Available at participating Hyatt properties when booked through an authorised Privé travel advisor.',
  'Book through Eden for Your World and reference the Hyatt Privé programme at time of reservation.',
  12
),

-- 13. Club 1897 – Kempinski
(
  'kempinski-club-1897',
  'Club 1897 — Kempinski',
  'A passport to a world of curated privileges at Europe''s oldest luxury hotel group.',
  'Club 1897 is Kempinski Hotels'' preferred partner programme, named after the year the brand was founded. It grants access to a passport of curated privileges across Kempinski''s extraordinary portfolio of palace hotels, city icons, and resort retreats spanning over 35 countries.',
  'invitation_only',
  75,
  '[
    {"title": "Complimentary Room Upgrade", "description": "Upgrade upon arrival, subject to availability."},
    {"title": "Complimentary Internet", "description": "High-speed Wi-Fi complimentary throughout the stay."},
    {"title": "Daily Breakfast for Two", "description": "Buffet or full breakfast for two guests, daily."},
    {"title": "Hotel or Resort Credit", "description": "Daily hotel or resort credit for use towards dining, spa, or leisure."},
    {"title": "VIP Recognition", "description": "Staff-wide VIP recognition and a personal welcome upon arrival."},
    {"title": "In-Room Welcome Amenity", "description": "A special in-room welcome gift."},
    {"title": "Top-of-Waitlist Priority", "description": "Priority placement on the waitlist for high-demand dates and properties."}
  ]'::jsonb,
  'Available at all Kempinski properties worldwide when booked through a Club 1897 preferred agency.',
  'Book through Eden for Your World and reference Club 1897 to activate all programme benefits.',
  13
),

-- 14. The Peninsula PenClub
(
  'peninsula-pen-club',
  'The Peninsula PenClub',
  'A select and personalised programme with membership by invitation only.',
  'The Peninsula PenClub is The Peninsula Hotels'' invitation-only preferred partner programme. It reflects the brand''s dedication to bespoke service and delivers a highly curated set of exclusive privileges across The Peninsula''s iconic properties in Hong Kong, New York, Paris, Tokyo, and beyond.',
  'invitation_only',
  14,
  '[
    {"title": "Exclusive Hotel Amenities", "description": "Property-specific amenities which differ per hotel, curated for PenClub guests."},
    {"title": "Daily Full Breakfast", "description": "Complimentary full breakfast for up to two guests, served daily."},
    {"title": "Peninsula Time", "description": "Flexible check-in and check-out times — The Peninsula''s signature farewell to rigid schedules."},
    {"title": "Room Upgrade", "description": "Upgrade upon arrival to a superior room, subject to availability."},
    {"title": "Upgraded Welcome Amenity", "description": "An elevated in-room welcome gift, exclusive to PenClub guests."},
    {"title": "Complimentary VOIP Calls", "description": "Complimentary long-distance calls via VOIP at select global city properties."}
  ]'::jsonb,
  'PenClub benefits apply at all Peninsula Hotels when the reservation is placed through an authorised agency.',
  'Book through Eden for Your World and request PenClub benefits to be noted on the reservation.',
  14
),

-- 15. COMO Hotels and Resorts
(
  'como-hotels',
  'COMO Hotels and Resorts',
  'Where holistic wellness meets breathtaking design.',
  'COMO Hotels and Resorts is a collection of intimate, design-led properties in the world''s most inspiring destinations. Each COMO property reflects a deep commitment to wellness, whole-food cuisine, and mindful luxury. Booking through a preferred agency ensures an elevated and deeply personal COMO experience.',
  'brand_programme',
  20,
  '[
    {"title": "Daily Breakfast for Two", "description": "Complimentary breakfast for two guests, served daily."},
    {"title": "Resort or Spa Credit", "description": "A resort or spa credit per stay for wellness treatments or on-property experiences."},
    {"title": "Complimentary Room Upgrade", "description": "Room upgrade based on availability at check-in."},
    {"title": "Early Check-In & Late Check-Out", "description": "Priority early check-in and late check-out, subject to availability."},
    {"title": "Complimentary Wi-Fi", "description": "Complimentary Wi-Fi throughout the stay."},
    {"title": "Personalised Recognition", "description": "Personalised VIP welcome and dedicated attention throughout the stay."}
  ]'::jsonb,
  'Benefits apply at all COMO Hotels and Resorts when booked through Eden for Your World.',
  'Contact Eden for Your World to book and ensure preferred partner benefits are applied.',
  15
),

-- 16. Pearl Partner – Oetker Collection
(
  'oetker-hotel-collection-pearl-partner',
  'Pearl Partner — Oetker Collection',
  '"Masterpiece Hotels" — true icons of elegance and individuality.',
  'The Oetker Collection Pearl Partner programme provides privileged access to the Oetker Collection''s extraordinary portfolio of "Masterpiece Hotels" — including Brenners Park-Hotel & Spa, Hôtel du Cap-Eden-Roc, and Le Bristol Paris. Each property is a testament to the art of fine hospitality, united by an uncompromising commitment to excellence.',
  'invitation_only',
  10,
  '[
    {"title": "Daily Full American Breakfast", "description": "Full American-style breakfast for two guests, served daily."},
    {"title": "Best Room in Category", "description": "Access to the best available room within the booked category."},
    {"title": "Guaranteed Room Upgrade", "description": "One category room upgrade confirmed at time of booking, subject to availability."},
    {"title": "Complimentary High-Speed Internet", "description": "Complimentary Wi-Fi throughout the stay."},
    {"title": "Priority Courtesy Car Access", "description": "Priority access to the hotel courtesy car, where applicable."},
    {"title": "Property Credit", "description": "€95 ($100 USD) credit per stay; increased to €190 ($200 USD) for stays of 2 or more nights."}
  ]'::jsonb,
  'Pearl Partner benefits apply at all Oetker Collection properties when booked through an authorised travel agency.',
  'Book through Eden for Your World and reference the Pearl Partner programme at time of reservation.',
  16
),

-- 17. AMAN
(
  'aman-hotels-and-resorts',
  'AMAN',
  'Sanctuary — redefined at the world''s most serene destinations.',
  'Aman is one of the world''s most exclusive hotel and resort groups, operating intimate sanctuaries in breathtaking settings across the globe. Aman properties are celebrated for their extraordinary architecture, minimalist design, and deeply immersive guest experiences. Preferred agency bookings unlock an additional layer of personal service and exclusive benefits.',
  'brand_programme',
  35,
  '[
    {"title": "Daily Breakfast for Two", "description": "Complimentary full breakfast for two guests, served daily."},
    {"title": "Resort or Spa Credit", "description": "A resort or spa credit per stay for Aman Spa treatments or on-property experiences."},
    {"title": "Complimentary Room Upgrade", "description": "Room upgrade based on availability at check-in."},
    {"title": "Early Check-In & Late Check-Out", "description": "Flexible check-in and check-out, subject to availability."},
    {"title": "Complimentary Wi-Fi", "description": "Complimentary high-speed internet access throughout the stay."},
    {"title": "Personalised Recognition", "description": "Personalised welcome and attentive service from the Aman team throughout the stay."}
  ]'::jsonb,
  'Benefits apply at all Aman properties when the reservation is made through Eden for Your World.',
  'Book through Eden for Your World to unlock exclusive Aman preferred partner privileges.',
  17
),

-- 18. Montage Hotels & Resorts
(
  'montage-hotels',
  'Montage Hotels & Resorts',
  'Gracious service, inspired design, and cherished memories.',
  'Montage Hotels & Resorts is a collection of ultra-luxury properties in iconic American destinations, including Laguna Beach, Deer Valley, and Los Cabos. The brand is celebrated for its gracious, individualised service and commitment to creating memories that last a lifetime. Preferred agency bookings add an exclusive layer of recognition and value.',
  'brand_programme',
  12,
  '[
    {"title": "Daily Breakfast for Two", "description": "Complimentary breakfast for two guests, served daily."},
    {"title": "Resort or Spa Credit", "description": "A resort or spa credit per stay for on-property experiences."},
    {"title": "Complimentary Room Upgrade", "description": "Room upgrade based on availability at check-in."},
    {"title": "Early Check-In & Late Check-Out", "description": "Priority early check-in and late check-out, subject to availability."},
    {"title": "Complimentary Wi-Fi", "description": "Complimentary high-speed internet access throughout the stay."},
    {"title": "Personalised Service", "description": "VIP recognition and deeply personalised service throughout the stay."}
  ]'::jsonb,
  'Benefits apply at all Montage Hotels & Resorts when booked through Eden for Your World.',
  'Book through Eden for Your World and reference the Montage preferred partner programme.',
  18
),

-- 19. Marriott Stars & Luminous
(
  'marriott-international-luminous',
  'Marriott International — Stars & Luminous',
  'Luxury privileges unlocked at over 250 of the world''s most prestigious Marriott properties.',
  'Marriott Stars & Luminous is Marriott International''s preferred partner programme covering the company''s most prestigious luxury brands, including The Ritz-Carlton, St. Regis, EDITION, The Luxury Collection, W Hotels, Bvlgari, and JW Marriott. The programme unlocks exclusive benefits at over 250 participating properties worldwide.',
  'global_network',
  250,
  '[
    {"title": "Daily Breakfast for Two", "description": "Complimentary daily breakfast for two guests."},
    {"title": "$100 Hotel Credit", "description": "USD $100 hotel credit per stay at select participating properties."},
    {"title": "Room Upgrade", "description": "Room upgrade upon availability at check-in."},
    {"title": "Early Check-In & Late Check-Out", "description": "Early check-in and late check-out upon availability."},
    {"title": "Welcome Amenity & VIP Status", "description": "In-room welcome amenity and VIP status recognition throughout the stay."},
    {"title": "Complimentary Wi-Fi", "description": "Complimentary Wi-Fi throughout the stay."}
  ]'::jsonb,
  'Benefits available at participating Marriott luxury brand properties when booked through a Stars & Luminous preferred agency.',
  'Book through Eden for Your World. Ensure the Stars & Luminous rate is confirmed on your reservation.',
  19
)

on conflict (slug) do update set
  name              = excluded.name,
  tagline           = excluded.tagline,
  description       = excluded.description,
  category          = excluded.category,
  property_count    = excluded.property_count,
  benefits          = excluded.benefits,
  eligibility_notes = excluded.eligibility_notes,
  booking_notes     = excluded.booking_notes,
  sort_order        = excluded.sort_order,
  updated_at        = now();
