import { createServiceClient } from '@/lib/supabase/service'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CruiseLine {
  id: string
  name: string
  slug: string
  logo_url: string | null
  logo_url_white: string | null   // transparent white version for dark backgrounds
  logo_url_black?: string | null  // transparent black version for light backgrounds
  hero_image_url: string | null
  description: string | null
  tagline: string | null
  cruise_types: string[]          // e.g. ['ocean'] or ['ocean', 'river'] for lines like Viking
  highlights: CruiseHighlight[]
  ships: CruiseShip[]
  slider_images: string[]
  sort_order: number
  // ── Rich yacht/cruise page content (DB-driven, optional per line) ──
  benefits?: CruiseBenefit[]            // Virtuoso Voyages perks; falls back to defaults when empty
  video_url?: string | null            // Vimeo URL for the cinematic film section
  video_poster_url?: string | null     // poster image behind the play button
  intro?: CruiseIntro | null           // overview section
  destinations?: CruiseDestination[]   // where the yacht sails
  experiences?: CruiseExperience[]     // onboard experiences
  suites?: CruiseSuite[]               // the yacht's accommodations
  sample_journeys?: CruiseJourney[]    // illustrative itineraries
}

export interface CruiseHighlight {
  title: string
  description: string
}

export interface CruiseShip {
  name: string
  description?: string
  image?: string
}

export interface CruiseBenefit {
  title: string
  description: string
}

export interface CruiseIntro {
  eyebrow: string
  heading: string
  body: string
}

export interface CruiseDestination {
  name: string
  blurb: string
  image_url: string
}

export interface CruiseExperience {
  title: string
  blurb: string
  image_url: string
}

export interface CruiseSuite {
  name: string
  blurb: string
  image_url: string
}

export interface CruiseJourney {
  name: string
  nights: string
  route: string
  blurb: string
  image_url?: string
}

export interface ProgramFeaturedProperty {
  id: string
  program_slug: string
  name: string
  location: string
  image_url: string | null
  description: string | null
  booking_link: string | null
  sort_order: number
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_CRUISE_LINES: CruiseLine[] = [
  // ── Private Yachts ──────────────────────────────────────────────────────────
  {
    id: 'aman-at-sea', name: 'Aman at Sea', slug: 'aman-at-sea',
    logo_url: '/media/cruises/aman-at-sea/aman_at_sea-black-600.png',
    logo_url_white: '/media/cruises/aman-at-sea/aman_at_sea-white-600.png',
    logo_url_black: '/media/cruises/aman-at-sea/aman_at_sea-black-600.png',
    hero_image_url: '/media/cruises/aman-at-sea/aman-hero.webp',
    tagline: 'A Philosophy in Motion',
    description: 'Amangati — "peaceful motion" in Sanskrit — is Aman\'s first yacht: 47 suites for 94 guests, drawn by Sinot and conceived as a private Aman carried across the world\'s most storied waters. Setting sail Spring 2027.',
    cruise_types: ['yacht'],
    highlights: [],
    video_url: 'https://vimeo.com/1130914645',
    video_poster_url: '/media/cruises/aman-at-sea/aman-hero.webp',
    intro: {
      eyebrow: 'Aman at Sea',
      heading: 'A sanctuary that moves with the sea',
      body: 'For five decades, Aman has been defined by space, seclusion, and an instinct for the world\'s most beautiful places. Amangati carries that philosophy onto the water — a yacht conceived not as a ship but as a private Aman in motion. Every one of its 47 suites opens onto a private terrace and floor-to-ceiling ocean views; the largest spa in luxury yachting unfolds across two storeys; and a discreet onboard team attends to every detail. The result is the rarest thing at sea: stillness.',
    },
    benefits: [
      { title: 'Dedicated Onboard Host', description: 'A personal Virtuoso host sails with your group, present throughout the voyage to ensure every detail runs exactly as planned.' },
      { title: 'Private Welcome Reception', description: 'An exclusive reception at the start of each sailing, arranged solely for Virtuoso Voyages guests with introductions facilitated by your host.' },
      { title: 'Shipboard Credit', description: '$100 per suite on voyages under 14 nights; $200 per suite on voyages of 14 nights or more, to spend freely on dining, spa, or excursions.' },
      { title: 'Exclusive Shore Experience', description: 'A private shore excursion or car and driver whose itinerary is shaped entirely around your interests and pace — never a group schedule.' },
      { title: 'Specialty Dining', description: 'Complimentary reservations at the yacht\'s signature restaurants, including chef\'s tastings and curated pairings on participating sailings.' },
      { title: 'Spa & Wellness Access', description: 'Select treatments and wellness credits at the Aman Spa, the largest afloat, included on participating voyages.' },
    ],
    destinations: [
      { name: 'The Mediterranean', blurb: 'Amangati\'s first seasons trace the sun-drenched shores of the Mediterranean — the French Riviera, the Greek Isles, and the shallow harbours and remote anchorages larger ships can never reach. Yachting, in its most elegant form.', image_url: '/media/cruises/aman-at-sea/dest-mediterranean.webp' },
      { name: 'The Marina & the Sea', blurb: 'A dedicated marina folds out from the hull, giving direct, seamless access to the water — shaded decks, alfresco spaces, and a fleet of watercraft that turn every anchorage into a private beach club.', image_url: '/media/cruises/aman-at-sea/dest-marina.webp' },
    ],
    experiences: [
      { title: 'The Aman Spa', blurb: 'The largest spa in luxury yachting — a two-storey wellness sanctuary with a Japanese serenity garden and ocean-facing treatment rooms, an Aman signature reimagined for the sea.', image_url: '/media/cruises/aman-at-sea/exp-spa.webp' },
      { title: 'The Jazz Club', blurb: 'A softly lit, open-air terrace where live bands and DJs play late into the night beneath the stars — an evening ritual in the unmistakable Aman key.', image_url: '/media/cruises/aman-at-sea/exp-jazz-club.webp' },
      { title: 'Aman Grill', blurb: 'Open-air, sea-facing dining built around the fire — the day\'s catch and the season\'s harvest, served on shaded alfresco decks at the water\'s edge.', image_url: '/media/cruises/aman-at-sea/exp-grill.webp' },
      { title: 'Enju & Hiori', blurb: 'Japanese dining drawn from Aman\'s deep roots in the cuisine — an intimate room where precision and seasonality meet the rhythm of the voyage.', image_url: '/media/cruises/aman-at-sea/exp-enju-hiori.webp' },
      { title: 'The Marina & Watersports', blurb: 'Direct access to the sea from a dedicated marina — paddleboards, dives, and quiet swims off the hull, each anchorage your own.', image_url: '/media/cruises/aman-at-sea/exp-watersports.webp' },
    ],
    suites: [
      { name: 'Aman Suite', blurb: 'The signature suite at sea — airy, light-filled living space opening onto a private terrace with floor-to-ceiling ocean views.', image_url: '/media/cruises/aman-at-sea/suite-aman.webp' },
      { name: 'Premier Suite', blurb: 'Generous proportions and a private terrace, finished in the natural materials and quiet palette that define every Aman.', image_url: '/media/cruises/aman-at-sea/suite-premier.webp' },
      { name: 'Signature Suite', blurb: 'Elevated living and dining space with sweeping sightlines to the horizon and a terrace made for slow mornings at anchor.', image_url: '/media/cruises/aman-at-sea/suite-signature.webp' },
      { name: 'Grand Suite', blurb: 'The pinnacle of the fleet — expansive interiors, a wraparound terrace, and uninterrupted ocean views from every room.', image_url: '/media/cruises/aman-at-sea/suite-grand.webp' },
    ],
    ships: [
      { name: 'Amangati', description: '47 suites for 94 guests · exterior and interior design by Sinot · registered in Malta · the largest spa in luxury yachting · launching Spring 2027.', image: '/media/cruises/aman-at-sea/aman-hero.webp' },
    ],
    sample_journeys: [
      { name: 'Riviera & the Ligurian Coast', nights: '7 nights', route: 'Monaco · Saint-Tropez · Portofino · Cinque Terre · Portovenere', blurb: 'A first taste of the Mediterranean in its most polished light — celebrated marinas by day, quiet anchorages by night, and the spa between.' },
      { name: 'The Greek Isles & the Aegean', nights: '10 nights', route: 'Athens · Hydra · Mykonos · Santorini · Patmos · the Dodecanese', blurb: 'Island-hopping through shallow harbours and remote coves, with private shore experiences shaped entirely around your pace.' },
      { name: 'The Tyrrhenian & Amalfi', nights: '8 nights', route: 'Naples · Capri · Positano · the Aeolian Islands · Taormina', blurb: 'Volcanic coastlines and storied islands, anchored each evening within reach of dinner ashore or under sail.' },
    ],
    slider_images: [
      '/media/cruises/aman-at-sea/aman-hero.webp',
      '/media/cruises/aman-at-sea/suite-grand.webp',
      '/media/cruises/aman-at-sea/exp-spa.webp',
      '/media/cruises/aman-at-sea/exp-jazz-club.webp',
      '/media/cruises/aman-at-sea/dest-marina.webp',
      '/media/cruises/aman-at-sea/exp-grill.webp',
    ],
    sort_order: 0,
  },
  {
    id: '26', name: 'The Ritz-Carlton Yacht Collection', slug: 'ritz-carlton-yacht',
    logo_url: '/assets/supplier logos/black transparent/cruise/ritzCarlton_yacht-black-600.png',
    logo_url_white: '/assets/supplier logos/white transparent/cruise/RitzCarlton_Yacht-white-600.png',
    logo_url_black: '/assets/supplier logos/black transparent/cruise/ritzCarlton_yacht-black-600.png',
    hero_image_url: '/media/cruises/ritz-carlton-yacht/preview-13.jpg',
    tagline: 'Yachting redefined',
    description: 'The Ritz-Carlton Yacht Collection brings the brand\'s legendary service to the sea aboard three intimate superyachts — Evrima, Ilma, and Luminara. Every accommodation is a suite with a private terrace; up to five restaurants and seven bars, The Ritz-Carlton Spa, and a signature marina that lowers straight into the ocean — with nearly one crew member per guest.',
    cruise_types: ['ocean', 'yacht'],
    highlights: [],
    intro: {
      eyebrow: 'The Ritz-Carlton Yacht Collection',
      heading: 'The legendary service, now at sea',
      body: 'A fleet of three superyachts — Evrima, Ilma, and Luminara — carries The Ritz-Carlton\'s legendary service onto the water. Intimate by design, with nearly one crew member per guest, each yacht is all-suite: every accommodation opens onto a private terrace, with a spa-like double-vanity bath and 24-hour in-suite dining. Up to five restaurants and seven bars, The Ritz-Carlton Spa, and a signature marina that lowers straight into the sea turn each voyage into yachting as only The Ritz-Carlton could imagine it.',
    },
    destinations: [
      { name: 'The Caribbean', blurb: 'St Barths, the Grenadines, and the Pitons of St Lucia — shallow harbours and private anchorages well beyond the reach of larger ships, reached at a yacht\'s unhurried pace.', image_url: '/media/cruises/ritz-carlton-yacht/preview-12.jpg' },
      { name: 'The Mediterranean & Adriatic', blurb: 'The Riviera, the Greek Isles, and tucked-away Adriatic ports like Kotor and Hvar — celebrated marinas by day, quiet coves by night.', image_url: '/media/cruises/ritz-carlton-yacht/preview-3.jpg' },
      { name: 'New Horizons', blurb: 'With Luminara, the collection adds its first-ever sailings to Asia and Alaska, alongside Northern Europe and transatlantic crossings.', image_url: '/media/cruises/ritz-carlton-yacht/preview-15.jpg' },
    ],
    experiences: [
      { title: 'Five Restaurants, Seven Bars', blurb: 'Mediterranean, Asian-fusion, and Pan-Latin menus across up to five restaurants and seven bars — on Luminara, venues shaped by Michelin-starred chefs Fabio Trabocchi and Michael Mina.', image_url: '/media/cruises/ritz-carlton-yacht/preview-5.jpg' },
      { title: 'The Bars & Lounges', blurb: 'From a hidden whisky and cognac room to sea-facing lounges, the evening unfolds slowly — considered cocktails and an easy sophistication that is unmistakably Ritz-Carlton.', image_url: '/media/cruises/ritz-carlton-yacht/preview-4.jpg' },
      { title: 'The Signature Pools', blurb: 'Sun-drenched pool decks and sea-level lounging, the day measured by nothing more than the light moving across the water.', image_url: '/media/cruises/ritz-carlton-yacht/preview-18.jpg' },
      { title: 'The Marina', blurb: 'A signature marina lowers from the hull straight into the sea — kayaks, paddleboards, and quiet swims off the back of the yacht at anchor.', image_url: '/media/cruises/ritz-carlton-yacht/preview-14.jpg' },
      { title: 'The Ritz-Carlton Spa', blurb: 'A dedicated spa with eleven treatment rooms and wellness spaces at the water\'s edge — the Ritz-Carlton spa ritual, reimagined for the sea.', image_url: '/media/cruises/ritz-carlton-yacht/preview-7.jpg' },
    ],
    suites: [
      { name: 'Suites with Private Terraces', blurb: 'Every accommodation is a suite — each with a private terrace, a spa-like double-vanity bath, and 24-hour in-suite dining, finished in a calm, residential palette.', image_url: '/media/cruises/ritz-carlton-yacht/MK26037_PMCxRCYCxJO-1669_cropped_872x1090.jpg' },
      { name: 'Owner\'s & Loft Suites', blurb: 'The upper suites stretch to 1,076 square feet, with expansive terraces and uninterrupted ocean views from every room.', image_url: '/media/cruises/ritz-carlton-yacht/preview-8.jpg' },
    ],
    ships: [
      { name: 'Evrima', description: '149 suites for 298 guests — the inaugural yacht, launched October 2022.', image: '/media/cruises/ritz-carlton-yacht/preview-15.jpg' },
      { name: 'Ilma', description: '224 suites for 448 guests, debuted September 2024 — the world\'s first Forbes Five-Star Cruise Ship.', image: '/media/cruises/ritz-carlton-yacht/preview-17.jpg' },
      { name: 'Luminara', description: '226 suites, 2025 — carrying the collection\'s first-ever sailings to Asia and Alaska.', image: '/media/cruises/ritz-carlton-yacht/preview.jpg' },
    ],
    sample_journeys: [
      { name: 'The Caribbean', nights: '7 nights', route: 'San Juan · St Barths · the Grenadines · St Lucia · Antigua', blurb: 'Private beaches and the Pitons, with the signature marina turning each turquoise anchorage into your own.' },
      { name: 'The Mediterranean & Adriatic', nights: '7 nights', route: 'Rome · Sorrento · Dubrovnik · Kotor · Venice', blurb: 'Walled cities and shallow harbours, anchored each evening within reach of dinner ashore.' },
      { name: 'Northern Europe', nights: '10 nights', route: 'Copenhagen · the Norwegian Fjords · Bergen · the Baltic', blurb: 'Long northern light and dramatic coastlines, at a pace that favours the journey over the schedule.' },
    ],
    slider_images: [
      '/media/cruises/ritz-carlton-yacht/preview-13.jpg',
      '/media/cruises/ritz-carlton-yacht/preview-18.jpg',
      '/media/cruises/ritz-carlton-yacht/preview-9.jpg',
      '/media/cruises/ritz-carlton-yacht/preview-4.jpg',
      '/media/cruises/ritz-carlton-yacht/preview-5.jpg',
      '/media/cruises/ritz-carlton-yacht/preview-17.jpg',
    ],
    sort_order: 26,
  },
  {
    id: '27', name: 'Orient Express Sailing Yachts', slug: 'orient-express-sailing-yachts',
    logo_url: '/assets/supplier logos/black transparent/cruise/orient_express_sailing-black-600.png',
    logo_url_white: '/assets/supplier logos/white transparent/cruise/orient_express_sailing-white-600.png',
    logo_url_black: '/assets/supplier logos/black transparent/cruise/orient_express_sailing-black-600.png',
    hero_image_url: '/media/cruises/orient-express-sailing-yacht/Orient-Express-Sailing-Yachts-Corinthian-Exterior-Wind-Luxigon.jpg',
    tagline: 'The legend returns to the sea',
    description: 'The Corinthian — Orient Express\'s first sailing yacht — carries the marque\'s 1883 heritage onto the water. At 220 metres under three patented carbon Solid Sails, it is the largest sailing yacht in the world: 54 suites, La Table by Yannick Alléno, and Le Spa by Guerlain. Maiden voyage 2026.',
    cruise_types: ['yacht'],
    highlights: [],
    intro: {
      eyebrow: 'Orient Express Sailing Yachts',
      heading: 'The 1883 legend, returned to the sea',
      body: 'For more than a century, Orient Express has meant travel as theatre — the glamour of the rails reimagined for those who measure a journey by its artistry. The Corinthian carries that legend onto the water: the largest sailing yacht in the world, 220 metres beneath three patented carbon Solid Sails, with just 54 suites. La Table by Yannick Alléno, Le Spa by Guerlain, and interiors by Maxime d\'Angeac make it less a ship than a private estate under sail. Maiden voyage 2026.',
    },
    destinations: [
      { name: 'The Mediterranean', blurb: 'The Riviera, the Amalfi Coast, and the islands of the western Mediterranean — entered under sail, at the unhurried pace of the wind, into harbours that favour the few.', image_url: '/media/cruises/orient-express-sailing-yacht/orientexpress-sailingyachts-corinthian-exterior-marine.jpg' },
      { name: 'The Adriatic & the Aegean', blurb: 'From Venice and the Dalmatian Coast to the Greek Isles — quiet anchorages and storied ports, reached the way the great voyages always were: by sail.', image_url: '/media/cruises/orient-express-sailing-yacht/Corinthian-Exterior-Marina-Ecadage_0.webp' },
    ],
    experiences: [
      { title: 'Revolutionary Design', blurb: 'Three patented carbon Solid Sails rise 100 metres above interiors by Maxime d\'Angeac — heritage Art Deco reimagined as the most advanced sailing yacht ever built.', image_url: '/media/cruises/orient-express-sailing-yacht/corinthian-design.webp' },
      { title: 'The Suites', blurb: '54 suites — among them the Zephyr Suite — finished in lacquer, leather, and brass, each a private salon opening onto the sea in the unmistakable Orient Express key.', image_url: '/media/cruises/orient-express-sailing-yacht/corinthian-suite-zephyr.webp' },
      { title: 'La Table by Yannick Alléno', blurb: 'The three-Michelin-starred chef brings the legendary dining car to sea — a signature restaurant where French haute cuisine meets the romance of the rails.', image_url: '/media/cruises/orient-express-sailing-yacht/orientexpress-sailingyachts-corinthian-restaurants-latable-delorientexpress-yannickalleno-rendering-8-2025.jpg' },
      { title: 'Le Spa by Guerlain', blurb: 'The storied Parisian maison brings its rituals afloat — a sanctuary of treatments and quiet at the water\'s edge, signed by Guerlain.', image_url: '/media/cruises/orient-express-sailing-yacht/orientexpress-sailingyachts-corinthian-Le-Spa-byGuerlain.jpg' },
      { title: "L'Encre Bar", blurb: 'A jewel-box bar and a hidden speakeasy — late nights of considered cocktails and low light, the evening unfolding exactly as it should aboard a legend.', image_url: '/media/cruises/orient-express-sailing-yacht/corinthian-lencre-bar.webp' },
    ],
    ships: [
      { name: 'Corinthian', description: '220 metres, 54 suites, under three patented carbon Solid Sails — the largest sailing yacht in the world, maiden voyage 2026.', image: '/media/cruises/orient-express-sailing-yacht/Orient-Express-Sailing-Yachts-Corinthian-Exterior-Wind-Luxigon.jpg' },
    ],
    sample_journeys: [
      { name: 'The Riviera & the Tyrrhenian', nights: '7 nights', route: 'Monaco · Saint-Tropez · Portofino · Amalfi · Capri', blurb: 'The western Mediterranean under sail, anchored each evening within reach of dinner ashore — or at La Table.' },
      { name: 'The Adriatic', nights: '7 nights', route: 'Venice · Rovinj · the Dalmatian Coast · Dubrovnik · Kotor', blurb: 'Walled cities and hidden coves along the Adriatic, the Solid Sails carrying you between them.' },
    ],
    slider_images: [
      '/media/cruises/orient-express-sailing-yacht/Orient-Express-Sailing-Yachts-Corinthian-Exterior-Wind-Luxigon.jpg',
      '/media/cruises/orient-express-sailing-yacht/corinthian-suite-zephyr.webp',
      '/media/cruises/orient-express-sailing-yacht/orientexpress-sailingyachts-corinthian-Le-Spa-byGuerlain.jpg',
      '/media/cruises/orient-express-sailing-yacht/corinthian-lencre-bar.webp',
      '/media/cruises/orient-express-sailing-yacht/orientexpress-sailingyachts-corinthian-restaurants-latable-delorientexpress-yannickalleno-rendering-8-2025.jpg',
    ],
    sort_order: 27,
  },
  // ── Ultra-Luxury Ocean ──────────────────────────────────────────────────────
  {
    id: '1', name: 'Regent Seven Seas Cruises', slug: 'regent-seven-seas',
    intro: {
      eyebrow: 'Regent Seven Seas Cruises',
      heading: 'The most luxurious fleet at sea',
      body: 'Regent sails an all-suite, all-balcony fleet on the most genuinely all-inclusive terms in luxury cruising — roundtrip business-class air, unlimited shore excursions at every port, fine dining across a half-dozen restaurants, premium beverages, gratuities, and butler service all folded into one fare. The result is a way of seeing the world where nothing is counted twice and nothing is left to chance.',
    },
    destinations: [
      { name: 'Tahiti & the South Pacific', blurb: 'The lagoons of Bora Bora and the Society Islands, where the ship becomes your floating overwater suite between turquoise anchorages.', image_url: '/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg' },
      { name: 'The Mediterranean', blurb: 'The Riviera, the Cinque Terre, and the Greek Isles — explored on unlimited included excursions shaped around your interests.', image_url: '/media/cruises/regent-seven-seas/regent-experience-1500.jpg' },
      { name: 'Asia & the Far East', blurb: 'From the rice terraces of Vietnam to the temples of Japan, on longer voyages that linger where the journey deepens.', image_url: '/media/cruises/regent-seven-seas/regent-emmersive-explore-1500.jpg' },
    ],
    experiences: [
      { title: 'The Grand Atrium', blurb: 'Sweeping staircases, chandeliers, and public rooms finished to the standard of a grand hotel — the everyday backdrop of a Regent voyage.', image_url: '/media/cruises/regent-seven-seas/splendor_atrium-1500.jpg' },
      { title: 'Life on Your Veranda', blurb: 'Every suite opens onto a private balcony, and butler service means morning coffee or evening champagne arrives exactly when you wish.', image_url: '/media/cruises/regent-seven-seas/suite_balcony-1500.jpg' },
    ],
    suites: [
      { name: 'All-Suite, All-Balcony', blurb: 'Spacious suites with private terraces, walk-in closets, and marble baths — every category includes butler service and 24-hour in-suite dining.', image_url: '/media/cruises/regent-seven-seas/splendor_suite-1500.jpg' },
    ],
    sample_journeys: [
      { name: 'Society Islands & Tahiti', nights: '10 nights', route: 'Papeete · Moorea · Taha\'a · Bora Bora · Rangiroa', blurb: 'French Polynesia with unlimited excursions and overwater days at anchor.' },
      { name: 'The Mediterranean', nights: '7 nights', route: 'Rome · Florence · Monte Carlo · Portofino · Barcelona', blurb: 'The classic Riviera and Italy, with included tours at every storied port.' },
      { name: 'Northern Europe', nights: '11 nights', route: 'Copenhagen · the Norwegian Fjords · Bergen · the Baltic capitals', blurb: 'Long northern light and dramatic coastlines, all-inclusive throughout.' },
    ],
    logo_url: '/assets/supplier logos/black transparent/cruise/regent-black-600.png',
    logo_url_white: '/media/cruises/regent-seven-seas/regent-white-600.png',
    hero_image_url: '/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg',
    tagline: 'The World\'s Most Luxurious Fleet™',
    description: 'Regent Seven Seas Cruises operates the world\'s most luxurious fleet. Every fare includes roundtrip business class air, unlimited shore excursions, fine dining, premium beverages, butler service in every suite, and pre-paid gratuities.',
    cruise_types: ['ocean'],
    highlights: [
      { title: 'Truly All-Inclusive', description: 'Business class air, shore excursions, beverages, dining, and gratuities — all included.' },
      { title: 'Unlimited Shore Excursions', description: 'Complimentary guided excursions at every port, no extra cost.' },
      { title: 'Butler Service in Every Suite', description: 'Dedicated butler for every guest, from embarkation to disembarkation.' },
      { title: 'Virtuoso Benefit', description: '$500 shipboard credit plus a complimentary shore excursion.' },
      { title: 'Specialty Dining', description: 'Chartreuse, Prime 7, Sette Mari, and Pacific Rim included in every fare.' },
      { title: 'Pre/Post Hotel Nights', description: 'Complimentary hotel nights before or after most voyages.' },
    ],
    ships: [
      { name: 'Seven Seas Prestige', description: 'New Prestige-class flagship, 850 guests — enters service December 2026.' /* TODO: add image */ },
      { name: 'Seven Seas Splendor', description: '750 guests, all-suite, all-balcony pinnacle of luxury.', image: '/media/cruises/regent-seven-seas/splendor_suite-1500.jpg' },
      { name: 'Seven Seas Explorer', image: '/media/cruises/regent-seven-seas/seven-seas-explorer.jpg', description: 'The world\'s most luxurious ship on launch.' },
      { name: 'Seven Seas Grandeur', image: '/media/cruises/regent-seven-seas/seven-seas-grandeur.jpg', description: 'Newest fleet addition, launched 2023.' },
      { name: 'Seven Seas Mariner', image: '/media/cruises/regent-seven-seas/seven-seas-mariner.jpg', description: 'First all-suite, all-balcony ship ever built.' },
      { name: 'Seven Seas Navigator', image: '/media/cruises/regent-seven-seas/seven-seas-navigator.jpg', description: '490 guests, intimate destination-rich sailings.' },
      { name: 'Seven Seas Voyager', image: '/media/cruises/regent-seven-seas/seven-seas-voyager.jpg', description: '700 guests on global voyages.' },
    ],
    slider_images: [
      '/media/cruises/regent-seven-seas/Regent-hero-Tahiti-2500.jpg',
      '/media/cruises/regent-seven-seas/splendor_suite-1500.jpg',
      '/media/cruises/regent-seven-seas/splendor_atrium-1500.jpg',
      '/media/cruises/regent-seven-seas/regent-emmersive-explore-1500.jpg',
      '/media/cruises/regent-seven-seas/regent-experience-1500.jpg',
      '/media/cruises/regent-seven-seas/Regent_Seven_Seas_Cruises-woman-hat-europe-1900.jpg',
    ],
    sort_order: 1,
  },
  {
    id: '2', name: 'Silversea Cruises', slug: 'silversea',
    intro: {
      eyebrow: 'Silversea',
      heading: 'Ultra-luxury to all seven continents',
      body: 'Silversea pairs all-suite, all-inclusive ocean voyages with the most capable expedition fleet in luxury cruising — intimate ships of fewer than 600 guests that reach the Mediterranean and the poles alike. Butler service comes with every suite, and the S.A.L.T. culinary program turns each destination into a meal. From the Galápagos to Antarctica, no continent is out of reach.',
    },
    destinations: [
      { name: 'The South Pacific', blurb: 'Bora Bora and the islands of French Polynesia, with the calm of an intimate ship at anchor in the lagoon.', image_url: '/media/cruises/silversea/silversea-southpacific-1500.jpg' },
      { name: 'Vietnam & Asia', blurb: 'The junks of Halong Bay and the temples beyond, on destination-rich voyages built around the S.A.L.T. table.', image_url: '/media/cruises/silversea/silversea-vietnam-1200x700.jpg' },
      { name: 'Antarctica', blurb: 'The white continent by Zodiac and expedition team — the polar extreme, reached in ultra-luxury comfort.', image_url: '/media/cruises/silversea/silversea-expedition-2021-world_cruise.jpg' },
    ],
    experiences: [
      { title: 'Expeditions to Every Continent', blurb: 'A purpose-built expedition fleet, an expert team, and a Zodiac for every landing — the wild places, without giving up the suite, the butler, or the cellar.', image_url: '/media/cruises/silversea/silversea-expeditions-1200x700.jpg' },
    ],
    sample_journeys: [
      { name: 'Antarctica', nights: '10 nights', route: 'Ushuaia · the Drake Passage · the Antarctic Peninsula', blurb: 'Ice, wildlife, and silence at the bottom of the world in all-suite comfort.' },
      { name: 'The Galápagos', nights: '7 nights', route: 'Baltra · Santa Cruz · Isabela · Fernandina · San Cristóbal', blurb: 'The enchanted islands aboard the 100-guest, Galápagos-dedicated Silver Origin.' },
      { name: 'The Mediterranean', nights: '9 nights', route: 'Athens · the Cyclades · Sicily · Amalfi · Rome', blurb: 'Storied coastlines with the destination-driven S.A.L.T. dining at the centre.' },
    ],
    logo_url: '/assets/supplier logos/jpg/Silversea-Logo.png',
    logo_url_white: '/media/cruises/silversea/silversea-logo_white.png',
    hero_image_url: '/media/cruises/silversea/silversea-hero.jpg',
    tagline: 'Ultra-luxury. All-inclusive. Expedition.',
    description: 'Silversea is the world leader in ultra-luxury and expedition cruising. With intimate ships carrying fewer than 600 guests, Silversea ventures to all seven continents — from the sun-drenched Mediterranean to the polar extremes of Antarctica.',
    cruise_types: ['ocean', 'expedition'],
    highlights: [
      { title: 'All-Inclusive Fares', description: 'Cuisine, wines, butler service, and shore excursions included.' },
      { title: 'Expedition Cruising', description: 'Purpose-built ships reach the planet\'s most remote destinations.' },
      { title: 'Butler Service', description: 'Personal butler for every guest throughout the voyage.' },
      { title: 'Virtuoso Benefit', description: '$300 onboard credit plus priority embarkation.' },
      { title: 'S.A.L.T. Culinary Programme', description: 'Sea and Land Taste — connecting guests to destination flavours.' },
      { title: 'Venetian Society Perks', description: 'Loyalty savings, priority boarding, and exclusive onboard recognition.' },
    ],
    ships: [
      { name: 'Silver Nova', description: '728 Guests • Nova Class — debuted 2023' /* TODO: add image */ },
      { name: 'Silver Ray', description: '728 Guests • Nova Class — debuted 2024' /* TODO: add image */ },
      { name: 'Silver Dawn', image: '/media/cruises/silversea/silver-dawn.jpg', description: '596 Guests • 411 Crew | Classic' },
      { name: 'Silver Moon', image: '/media/cruises/silversea/silver-moon.jpg', description: '596 Guests • 411 Crew | Classic' },
      { name: 'Silver Muse', image: '/media/cruises/silversea/silver-muse.jpg', description: '632 Guests • 415 Crew | Classic' },
      { name: 'Silver Cloud', image: '/media/cruises/silversea/silver-cloud.jpg', description: '254 Guests • 212 Crew | Expedition' },
      { name: 'Silver Endeavour', image: '/media/cruises/silversea/silver-endeavour.jpg', description: '220 Guests • 207 Crew | Expedition' },
      { name: 'Silver Origin', image: '/media/cruises/silversea/silver-origin.jpg', description: '100 Guests • 90 Crew | Expedition' }
    ],
    slider_images: [
      '/media/cruises/silversea/silversea-hero.jpg',
      '/media/cruises/silversea/silversea-southpacific-1500.jpg',
      '/media/cruises/silversea/silversea-expedition-2021-world_cruise.jpg',
      '/media/cruises/silversea/silversea-vietnam-1200x700.jpg',
      '/media/cruises/silversea/featured-image-silversea.jpg',
    ],
    sort_order: 2,
  },
  {
    id: '3', name: 'Seabourn Cruises', slug: 'seabourn',
    intro: {
      eyebrow: 'Seabourn',
      heading: 'Ultra-luxury, intimate by design',
      body: 'Seabourn sails small, all-suite, and all-inclusive, with a staff-to-guest ratio that makes the service feel personal rather than performed. Thomas Keller shapes the dining, caviar appears in the surf off the marina, and the Spa with Dr. Andrew Weil tends to the rest. It is ultra-luxury in a quieter key — warmth and ease where larger ships offer scale.',
    },
    destinations: [
      { name: 'The Mediterranean & Adriatic', blurb: 'The Riviera and the Dalmatian Coast at an intimate ship\'s pace, anchoring off towns the big ships can only pass.', image_url: '/media/cruises/seabourn/seabourn-cruises-hero-2000.jpg' },
    ],
    experiences: [
      { title: 'Sea, Sun & the Pool Deck', blurb: 'Whirlpools at the rail, loungers in the sun, and a glass of something cold as the coastline drifts by — the rhythm of a Seabourn day.', image_url: '/media/cruises/seabourn/Seabourn-featured-t1200x628.jpg' },
      { title: 'Caviar in the Surf & the Marina', blurb: 'A retractable marina opens off the stern for swims and watersports — and the signature Caviar in the Surf, served at the water\'s edge.', image_url: '/media/cruises/seabourn/seabourn-cruises-venture-video-content.jpg' },
      { title: 'An Ultra-Luxury Way of Life', blurb: 'Thomas Keller dining, an open bar, and a near one-to-one staff ratio — the details handled before you think to ask.', image_url: '/media/cruises/seabourn/seabourn-cruises-difference-video-banner.jpg' },
    ],
    sample_journeys: [
      { name: 'The Mediterranean', nights: '7 nights', route: 'Athens · the Greek Isles · the Amalfi Coast · Rome', blurb: 'Intimate harbours and storied coastlines, with caviar off the marina between.' },
      { name: 'The Caribbean', nights: '7 nights', route: 'Barbados · the Grenadines · St Barths · Antigua', blurb: 'Private anchorages and beach days, the marina lowered into the warm sea.' },
      { name: 'Northern Europe', nights: '11 nights', route: 'Copenhagen · the Norwegian Fjords · the Baltic capitals', blurb: 'Long summer light along dramatic coasts, ultra-luxury throughout.' },
    ],
    logo_url: '/media/cruises/seabourn/seabourn-black-600.png',
    logo_url_white: '/media/cruises/seabourn/seabourn-600.png',
    hero_image_url: '/media/cruises/seabourn/seabourn-cruises-hero-2000.jpg',
    tagline: 'Finest ultra-luxury ocean and expedition cruising.',
    description: 'Seabourn defines ultra-luxury with intimate ships, award-winning Thomas Keller cuisine, and an extraordinary staff-to-guest ratio delivering warmth and attentiveness that larger ships cannot match.',
    cruise_types: ['ocean'],
    highlights: [
      { title: 'Thomas Keller Dining', description: 'Exclusive Michelin-star-calibre cuisine partnership at sea.' },
      { title: 'All-Inclusive Beverages & Dining', description: 'Premium wines, spirits, and all dining venues complimentary.' },
      { title: 'Marina Watersports Platform', description: 'Direct access to kayaks, paddleboards, and water toys.' },
      { title: 'Expedition Voyages', description: 'Seabourn Venture and Pursuit explore Arctic, Antarctica, and beyond.' },
      { title: 'Virtuoso Benefit', description: '$300 onboard credit and complimentary spa access on embarkation day.' },
      { title: 'Intimate Scale', description: 'Ships carry just 458–604 guests for a resort-like atmosphere.' },
    ],
    ships: [
      { name: 'Seabourn Venture', description: 'Polar expedition ship, 264 guests.', image: '/media/cruises/seabourn/seabourn-cruises-venture-video-content.jpg' },
      { name: 'Seabourn Pursuit', image: '/media/cruises/seabourn/seabourn-pursuit.jpg', description: 'Sister expedition ship to Venture.' },
      { name: 'Seabourn Encore', image: '/media/cruises/seabourn/seabourn-encore.jpg', description: '600 guests, inspired by classic yachting.' },
      { name: 'Seabourn Ovation', image: '/media/cruises/seabourn/seabourn-ovation.jpg', description: 'Sister to Encore with expanded dining.' },
    ],
    slider_images: [
      '/media/cruises/seabourn/seabourn-cruises-hero-2000.jpg',
      '/media/cruises/seabourn/Seabourn-featured-t1200x628.jpg',
      '/media/cruises/seabourn/seabourn-cruises-venture-video-content.jpg',
      '/media/cruises/seabourn/seabourn-cruises-difference-video-banner.jpg',
    ],
    sort_order: 3,
  },
  {
    id: '4', name: 'Oceania Cruises', slug: 'oceania',
    intro: {
      eyebrow: 'Oceania Cruises',
      heading: 'The finest cuisine at sea',
      body: 'Oceania built its reputation on the plate — a half-dozen specialty restaurants, farm-to-table menus, and a hands-on Culinary Center, all on mid-size ships that slip into the most compelling ports in the world. Polo Grill, Toscana, Red Ginger, and the Grand Dining Room sit at the heart of every voyage, with the Aquamar Spa and an unhurried pace to match.',
    },
    experiences: [
      { title: 'The Finest Cuisine at Sea', blurb: 'Up to six specialty restaurants at no surcharge — Polo Grill, Toscana, Red Ginger — alongside the chandeliered Grand Dining Room and a hands-on Culinary Center.', image_url: '/media/cruises/oceania/oceania_cruises-oClass-Grand-Dining-Room-hero.jpg' },
      { title: 'Aquamar Spa & Wellness', blurb: 'Sea-facing treatment rooms, a vitality pool, and wellness programming that runs from poolside yoga to spa days at anchor.', image_url: '/media/cruises/oceania/oceania_cruises-spa-video-banner.jpg' },
      { title: 'The Library & Lounges', blurb: 'Leather chairs, full bookshelves, and quiet public rooms designed for the long sea day — the feel of a private club afloat.', image_url: '/media/cruises/oceania/oceania_cruises-next-video-content.jpg' },
    ],
    suites: [
      { name: 'Veranda Staterooms', blurb: 'Light-filled staterooms opening onto a private balcony, finished in a calm, residential palette with a marble-accented bath.', image_url: '/media/cruises/oceania/oceania-feautred-1200x628.jpg' },
    ],
    sample_journeys: [
      { name: 'The Mediterranean', nights: '10 nights', route: 'Barcelona · Provence · the Riviera · Florence · Rome', blurb: 'Port-rich days built around the table, with overnights in the great food cities.' },
      { name: 'Northern Europe', nights: '12 nights', route: 'London · Bruges · Copenhagen · the Baltic · the Norwegian Fjords', blurb: 'Capitals and coastlines at a mid-size ship\'s unhurried pace.' },
      { name: 'Asia & the Far East', nights: '14 nights', route: 'Tokyo · Kyoto · Shanghai · Hong Kong · Singapore', blurb: 'A deep voyage through Asia, the cuisine following the coastline ashore and aboard.' },
    ],
    logo_url: '/media/cruises/oceania/oceania-cruises-logo-black-600.png',
    logo_url_white: null,
    hero_image_url: '/media/cruises/oceania/oceania_cruises-oClass-Grand-Dining-Room-hero.jpg',
    tagline: 'Your World. Your Way.',
    description: 'Oceania Cruises is renowned for The Finest Cuisine at Sea — six specialty restaurants, farm-to-table menus, and a Culinary Center for hands-on classes. Their mid-size ships visit the most compelling ports in the world.',
    cruise_types: ['ocean'],
    highlights: [
      { title: 'Finest Cuisine at Sea', description: 'Six complimentary specialty restaurants helmed by master chefs.' },
      { title: 'Destination Immersion', description: 'Small ships access ports larger ships cannot reach.' },
      { title: 'Culinary Center', description: 'Hands-on cooking classes in a Le Cordon Bleu-inspired kitchen.' },
      { title: 'Simply More Programme', description: 'Shore excursions and beverage package included in most fares.' },
      { title: 'Virtuoso Benefit', description: '$300 onboard credit plus complimentary shore excursion credits.' },
      { title: 'Mid-Size Ships', description: '684–1,250 guests — intimate enough for personal service.' },
    ],
    ships: [
      { name: 'Vista', description: 'New O-Class ship, 1,200 guests — launched 2023.', image: '/media/cruises/oceania/oceania_cruises-oClass-Grand-Dining-Room-hero.jpg' },
      { name: 'Allura', image: '/media/cruises/oceania/oceania-allura.jpg', description: 'Sister to Vista, delivered 2025.' },
      { name: 'Riviera', image: '/media/cruises/oceania/oceania-riviera.jpg', description: '1,250 guests, classic Italian design.' },
      { name: 'Marina', image: '/media/cruises/oceania/oceania-marina.jpg', description: '1,250 guests, Mediterranean elegance.' },
      { name: 'Regatta', image: '/media/cruises/oceania/oceania-regatta.jpg', description: '684 guests, boutique R-Class ship.' },
    ],
    slider_images: [
      '/media/cruises/oceania/oceania_cruises-oClass-Grand-Dining-Room-hero.jpg',
      '/media/cruises/oceania/oceania-feautred-1200x628.jpg',
      '/media/cruises/oceania/oceania_cruises-next-video-content.jpg',
      '/media/cruises/oceania/oceania_cruises-spa-video-banner.jpg',
    ],
    sort_order: 4,
  },
  {
    id: '5', name: 'Azamara', slug: 'azamara',
    intro: {
      eyebrow: 'Azamara',
      heading: 'Destination immersion',
      body: 'Azamara is built around the place, not the ship — staying longer in port, overnighting in iconic cities, and sailing where larger ships cannot go. The mid-size fleet carries fewer than 700 guests, and every voyage includes an AzAmazing Evening, a complimentary destination event ashore. It is cruising for travellers who came for the country, not the cabin.',
    },
    destinations: [
      { name: 'The Mediterranean', blurb: 'The Amalfi Coast, the Riviera, and the Greek Isles — with the late departures and overnights that let you stay for dinner ashore.', image_url: '/media/cruises/azamara/azamara-featured-1200x628.jpg' },
      { name: 'Northern Europe & the British Isles', blurb: 'Edinburgh, the Norwegian coast, and the harbours of the north, explored in depth rather than glimpsed in passing.', image_url: '/media/cruises/azamara/pr-6-july-2020-edinburgh-scotland.jpg' },
      { name: 'Iconic Overland', blurb: 'Extended stays that reach the marquee land icons — Machu Picchu, Petra, the Holy Land — by way of the sea.', image_url: '/media/cruises/azamara/azamara-video-content.jpg' },
    ],
    experiences: [
      { title: 'AzAmazing Evenings', blurb: 'A complimentary, destination-immersive event on every voyage — a private concert in a historic square, a cultural performance found nowhere on the brochure.', image_url: '/media/cruises/azamara/azamara-hero-2200.jpg' },
    ],
    sample_journeys: [
      { name: 'Greek Isles & Overnights', nights: '8 nights', route: 'Athens · Mykonos · Santorini · Rhodes · Kuşadası', blurb: 'Late nights ashore in the islands, with overnights where the evening matters most.' },
      { name: 'The British Isles', nights: '12 nights', route: 'London · Edinburgh · the Hebrides · Dublin · the Channel Islands', blurb: 'A slow circumnavigation, deep into the harbours and history of the isles.' },
      { name: 'The Holy Land & Eastern Mediterranean', nights: '10 nights', route: 'Athens · Cyprus · Jerusalem · the Cyclades', blurb: 'Overnights that open the great land icons of the eastern Mediterranean.' },
    ],
    logo_url: '/media/cruises/azamara/azamara-logo-black-600.png',
    logo_url_white: '/media/cruises/azamara/azamara-logo-white-700.png',
    hero_image_url: '/media/cruises/azamara/azamara-hero-2200.jpg',
    tagline: 'Destination Immersion®',
    description: 'Azamara specialises in destination immersion — staying longer in port, overnighting in iconic cities, and sailing where larger ships cannot go. Their mid-size ships carry fewer than 700 guests for a boutique, personal feel.',
    cruise_types: ['ocean'],
    highlights: [
      { title: 'Longer Port Stays', description: 'More overnights and late departures so you experience each destination fully.' },
      { title: 'Country Intensive Voyages', description: 'Sailings focused on a single country\'s diverse regions and cultures.' },
      { title: 'AzAmazing Evenings', description: 'Exclusive complimentary shore event at a landmark every voyage.' },
      { title: 'All-Inclusive Spirits & Wine', description: 'Select spirits, international wines, and specialty coffees included.' },
      { title: 'Virtuoso Benefit', description: '$200 onboard credit and complimentary specialty dining.' },
      { title: 'Intimate Fleet', description: 'Under 700 guests — extraordinarily personal service.' },
    ],
    ships: [
      { name: 'Azamara Quest', description: '686 guests, boutique destination voyaging.', image: '/media/cruises/azamara/azamara-hero-2200.jpg' },
      { name: 'Azamara Journey', image: '/media/cruises/azamara/azamara-journey.jpg', description: '686 guests, twin of Quest.' },
      { name: 'Azamara Pursuit', image: '/media/cruises/azamara/azamara-pursuit.jpg', description: '686 guests, added 2018.' },
      { name: 'Azamara Onward', image: '/media/cruises/azamara/azamara-onward.jpg', description: 'Newest addition, 684 guests.' },
    ],
    slider_images: [
      '/media/cruises/azamara/azamara-hero-2200.jpg',
      '/media/cruises/azamara/azamara-featured-1200x628.jpg',
      '/media/cruises/azamara/pr-6-july-2020-edinburgh-scotland.jpg',
      '/media/cruises/azamara/pr-8-june-2020-st-petersburg-russia.jpg',
    ],
    sort_order: 5,
  },
  {
    id: '6', name: 'Celebrity Cruises', slug: 'celebrity',
    intro: {
      eyebrow: 'Celebrity Cruises',
      heading: 'Nothing comes close',
      body: 'Celebrity\'s Edge-class ships rewrote what a modern cruise looks like — the cantilevered Magic Carpet that moves up the hull, Infinite Veranda staterooms that open the wall to the sea, and the sculptural Rooftop Garden and Grand Plaza at the centre of the ship. The Retreat suite enclave runs its own restaurant, lounge, and sundeck, while the 100-guest Celebrity Flora reimagines the Galápagos entirely.',
    },
    destinations: [
      { name: 'The Caribbean', blurb: 'Turquoise islands and beach days across the Eastern and Southern Caribbean, the Magic Carpet hanging out over the water.', image_url: '/media/cruises/celebrity/celebrity-tropical-ship-1500.jpg' },
      { name: 'Bermuda', blurb: 'Pink sand and the Royal Naval Dockyard, on short, design-forward voyages from the US East Coast.', image_url: '/media/cruises/celebrity/celebrity-destinations-1500.jpg' },
      { name: 'The Galápagos', blurb: 'The enchanted islands aboard the 100-guest, purpose-built Celebrity Flora — naturalists, Zodiacs, and a glass-walled mega-yacht.', image_url: '/media/cruises/celebrity/celebrity-flora_boat-1500.jpg' },
    ],
    experiences: [
      { title: 'The Magic Carpet', blurb: 'A cantilevered platform that rises fifteen decks up the side of the ship — a dining room, a bar, and a tender platform, suspended over the sea.', image_url: '/media/cruises/celebrity/celebrity-magic_carpet_club-1500.jpg' },
      { title: 'The Rooftop Garden', blurb: 'Sculptural canopies, real lawns, and an open-air theatre on the top deck — a park at sea, designed rather than decorated.', image_url: '/media/cruises/celebrity/celebrity-rooftop-1500.jpg' },
      { title: 'The Grand Plaza', blurb: 'A three-deck atrium beneath a chandelier-tree, where the martini bar and live music gather the ship each evening.', image_url: '/media/cruises/celebrity/celebrity-center-1500.jpg' },
      { title: 'The Resort Deck', blurb: 'Pools, sculptures, and cabanas under the sun by day, lit like a resort by night — the social heart of an Edge-class ship.', image_url: '/media/cruises/celebrity/celebrity-hero-2500.jpg' },
      { title: 'Wellness, Reimagined', blurb: 'A Canyon Ranch-pedigree spa, Peloton bikes against Infinite Veranda windows, and wellness programming throughout.', image_url: '/media/cruises/celebrity/celebrity-pelaton-1500.jpg' },
    ],
    suites: [
      { name: 'The Retreat', blurb: 'A suite-class enclave with its own restaurant (Luminae), lounge, and private sundeck — a ship within the ship.', image_url: '/media/cruises/celebrity/celebrity-suite-living-1500.jpg' },
      { name: 'The Iconic Suite', blurb: 'The pinnacle of the fleet — a private plunge pool, wraparound views, and floor space that rivals a villa ashore.', image_url: '/media/cruises/celebrity/celebrity-villa-1500.jpg' },
      { name: 'The Suite Sundeck', blurb: 'Upper suites with private outdoor terraces and hot tubs, perched high above the water.', image_url: '/media/cruises/celebrity/celebrity-architecture_villa-1500.jpg' },
      { name: 'Edge Staterooms', blurb: 'The Infinite Veranda turns the whole stateroom into a balcony at the touch of a button, opening the wall to the sea.', image_url: '/media/cruises/celebrity/celebrity-flora-suite-1500.jpg' },
    ],
    sample_journeys: [
      { name: 'The Caribbean', nights: '7 nights', route: 'Fort Lauderdale · San Juan · St Thomas · St Maarten', blurb: 'Design-forward sailing through the Eastern Caribbean, beach days throughout.' },
      { name: 'The Mediterranean', nights: '10 nights', route: 'Rome · the Amalfi Coast · Santorini · Mykonos · Athens', blurb: 'The classic Mediterranean, the Magic Carpet over the water at every port.' },
      { name: 'The Galápagos', nights: '7 nights', route: 'Baltra · Santa Cruz · Isabela · Fernandina · San Cristóbal', blurb: 'The islands aboard Celebrity Flora, with naturalists and daily Zodiac landings.' },
    ],
    logo_url: '/media/cruises/celebrity/Celebrity-Cruises-no-sub-black.png',
    logo_url_white: null,
    hero_image_url: '/media/cruises/celebrity/celebrity-hero-2500.jpg',
    tagline: 'Nothing Comes Close',
    description: 'Celebrity Cruises blends contemporary design with elevated service. Their Edge-class ships feature the iconic Magic Carpet platform, Infinite Verandas, and Michelin-pedigree dining — redefining modern luxury cruising.',
    cruise_types: ['ocean'],
    highlights: [
      { title: 'Edge-Class Innovation', description: 'Revolutionary ship design including the iconic floating Magic Carpet platform.' },
      { title: 'Always Included Pricing', description: 'Classic beverages, Wi-Fi, and tips bundled into base fares.' },
      { title: 'Michelin-Calibre Cuisine', description: 'Specialty restaurants with menus co-developed with world-renowned chefs.' },
      { title: 'The Retreat', description: 'Exclusive suite-class experience with private deck, restaurant, and lounge.' },
      { title: 'Virtuoso Benefit', description: '$300 onboard credit and complimentary shore excursion credit.' },
      { title: 'Award-Winning Spa', description: 'Canyon Ranch SpaClub and thermal suite onboard.' },
    ],
    ships: [
      { name: 'Celebrity Edge', image: '/media/cruises/celebrity/celebrity-edge.jpg', description: 'The visionary ship that launched the revolutionary Edge Series.' },
      { name: 'Celebrity Apex', image: '/media/cruises/celebrity/celebrity-apex.jpg', description: 'The second ship in the highly-awarded Edge Series.' },
      { name: 'Celebrity Beyond', image: '/media/cruises/celebrity/celebrity-hero-2500.jpg', description: 'Taking the Edge Series further with expanded outdoor spaces.' },
      { name: 'Celebrity Ascent', image: '/media/cruises/celebrity/celebrity-ascent.jpg', description: 'The newest Edge Series ship, featuring the multi-deck Sunset Bar.' },
      { name: 'Celebrity Xcel', image: '/media/cruises/celebrity/celebrity-ship-1500.jpg', description: 'The fifth Edge Series ship, debuted 2025.' },
      { name: 'Celebrity Xcite', description: 'The sixth and final Edge Series ship, arriving 2028.' /* TODO: add image */ },
      { name: 'Celebrity Flora', image: '/media/cruises/celebrity/celebrity-flora_boat-1500.jpg', description: 'A 100-guest mega-yacht purpose-built for the Galapagos Islands.' },
    ],
    slider_images: [
      '/media/cruises/celebrity/celebrity-hero-2500.jpg',
      '/media/cruises/celebrity/celebrity-rooftop-1500.jpg',
      '/media/cruises/celebrity/celebrity-destinations-1500.jpg',
      '/media/cruises/celebrity/celebrity-architecture_villa-1500.jpg',
      '/media/cruises/celebrity/celebrity-center-1500.jpg',
      '/media/cruises/celebrity/celebrity-cabana_group-1500.jpg',
    ],
    sort_order: 6,
  },
  {
    id: '7', name: 'Cunard', slug: 'cunard',
    intro: {
      eyebrow: 'Cunard',
      heading: 'The grand tradition of ocean travel',
      body: 'Cunard keeps the great age of the ocean liner alive. Queen Mary 2 remains the only true liner in service, built to cross the Atlantic between Southampton and New York the way it was always meant to be crossed. White Star Service, the Queens Room ballroom, and the grills restaurants give the fleet of Queens a sense of occasion no other line attempts — a voyage that is itself the destination.',
    },
    destinations: [
      { name: 'The Transatlantic Crossing', blurb: 'Seven nights between Southampton and New York aboard Queen Mary 2 — the last regular ocean-liner crossing, gala nights and all.', image_url: '/media/cruises/cunard/cunard-featured-new_york-1200x628.jpg' },
      { name: 'Alaska & Beyond', blurb: 'Glaciers and the far north in the grand style, alongside Northern Europe, the Mediterranean, and full world voyages.', image_url: '/media/cruises/cunard/cunard-alaska-video-content.jpg' },
    ],
    experiences: [
      { title: 'The Grand Lobby', blurb: 'Sweeping staircases, marble, and a sense of arrival that begins the moment you step aboard — the theatre of the ocean liner.', image_url: '/media/cruises/cunard/cunard-Grand-Lobby-hero.jpg' },
      { title: 'Dining in the Grand Style', blurb: 'Multi-deck dining rooms and the grills restaurants, where gala evenings and White Star Service are part of the ritual.', image_url: '/media/cruises/cunard/queen-anne.jpg' },
    ],
    sample_journeys: [
      { name: 'The Transatlantic Crossing', nights: '7 nights', route: 'Southampton · New York', blurb: 'The classic liner crossing — gala nights, the Queens Room, and the open Atlantic.' },
      { name: 'Northern Europe & the British Isles', nights: '12 nights', route: 'Southampton · the Norwegian Fjords · the Baltic capitals', blurb: 'The grand fleet through the harbours of the north.' },
      { name: 'A World Voyage Segment', nights: 'Segments available', route: 'Across continents aboard a single grand voyage', blurb: 'The full world voyage tradition, bookable in legs.' },
    ],
    logo_url: '/assets/supplier logos/jpg/Cunard-black.png',
    logo_url_white: '/media/cruises/cunard/cunard-logo-white.png',
    hero_image_url: '/media/cruises/cunard/cunard-Grand-Lobby-dark-hero.jpg',
    tagline: 'Why cruise when you can Cunard',
    description: 'Cunard has defined ocean travel since 1839. White Star Service, celebrated Grand Lobbies, the iconic Queen Mary 2 transatlantic crossing, and a tradition of formal elegance make Cunard unlike any other cruise experience.',
    cruise_types: ['ocean'],
    highlights: [
      { title: 'White Star Service', description: 'Cunard\'s legendary service tradition — attentive, refined, and understated.' },
      { title: 'Transatlantic Crossings', description: 'The original Queen Mary 2 crossing — New York to Southampton in timeless style.' },
      { title: 'Grand Ballroom', description: 'The largest ballroom at sea — nightly dancing and entertainment.' },
      { title: 'Cunard Academy', description: 'Enrichment lectures, workshops, and exclusive onboard learning.' },
      { title: 'Virtuoso Benefit', description: '$200 onboard credit and formal dining priority reservations.' },
      { title: 'Grills Suites', description: 'Most exclusive accommodation afloat — private restaurant, butler, and concierge.' },
    ],
    ships: [
      { name: 'Queen Mary 2', description: 'The last true ocean liner — 2,691 guests.', image: '/media/cruises/cunard/cunard-Grand-Lobby-dark-hero.jpg' },
      { name: 'Queen Anne', image: '/media/cruises/cunard/queen-anne.jpg', description: 'Newest Cunard ship, launched 2024.' },
      { name: 'Queen Victoria', image: '/media/cruises/cunard/queen-victoria.jpg', description: 'Classic elegance for 2,014 guests.' },
      { name: 'Queen Elizabeth', image: '/media/cruises/cunard/queen-elizabeth.jpg', description: 'Twin of Queen Victoria, global voyager.' },
    ],
    slider_images: [
      '/media/cruises/cunard/cunard-Grand-Lobby-dark-hero.jpg',
      '/media/cruises/cunard/cunard-Grand-Lobby-hero.jpg',
      '/media/cruises/cunard/cunard-featured-new_york-1200x628.jpg',
      '/media/cruises/cunard/cunard-alaska-video-content.jpg',
    ],
    sort_order: 7,
  },
  {
    id: '8', name: 'Holland America Line', slug: 'holland-america',
    intro: {
      eyebrow: 'Holland America Line',
      heading: 'Savor the journey',
      body: 'A century and a half of Dutch seafaring stands behind Holland America\'s mid-size Pinnacle-class ships. The line is a master of Alaska and the great Grand Voyages, with a Music Walk of live venues — B.B. King\'s Blues Club, Rolling Stone Rock Room, Lincoln Center Stage — running through every evening. Classic, unhurried, and built for travellers who measure a cruise by the places it reaches.',
    },
    destinations: [
      { name: 'Alaska', blurb: 'Glacier Bay and the Inside Passage — a region Holland America has sailed for generations, with naturalists and a glacier on the bow.', image_url: '/media/cruises/holland-america/HAL-featured-1200x628.jpg' },
      { name: 'The Norwegian Fjords', blurb: 'Deep blue water and sheer cliffs along the Norwegian coast, the ship threading harbours the way the old liners did.', image_url: '/media/cruises/holland-america/hal-hero-2400.jpg' },
      { name: 'Japan & the Far East', blurb: 'Cherry-blossom coastlines and ancient ports, on longer voyages that lean into the journey.', image_url: '/media/cruises/holland-america/HAL-video-banner.jpg' },
    ],
    sample_journeys: [
      { name: 'Alaska Inside Passage', nights: '7 nights', route: 'Vancouver · Juneau · Glacier Bay · Ketchikan · Skagway', blurb: 'The classic Alaska week, with cruising days deep into Glacier Bay.' },
      { name: 'The Norwegian Fjords', nights: '14 nights', route: 'Amsterdam · Bergen · Geirangerfjord · the North Cape', blurb: 'The dramatic Norwegian coast and the land of the midnight sun.' },
      { name: 'A Grand World Voyage Segment', nights: 'Segments available', route: 'Continent to continent across one extended voyage', blurb: 'The multi-month Grand Voyage tradition, bookable in legs.' },
    ],
    logo_url: '/assets/supplier logos/jpg/Holland-America-black.png',
    logo_url_white: '/media/cruises/holland-america/hal_white-logo-700.png',
    hero_image_url: '/media/cruises/holland-america/hal-hero-2400.jpg',
    tagline: 'Savor the Journey',
    description: 'Holland America Line has been sailing the world for more than 150 years, blending Dutch heritage with destination discovery, world-class entertainment, and generous onboard spaces that feel like a grand hotel at sea.',
    cruise_types: ['ocean'],
    highlights: [
      { title: 'Grand World Voyages', description: 'Epic multi-month world cruises visiting dozens of countries.' },
      { title: 'Music Walk', description: 'Billboard Onboard, BB King\'s Blues Club, and Rolling Stone Lounge.' },
      { title: 'Culinary Arts Centre', description: 'Hands-on demonstrations with celebrated chefs.' },
      { title: 'Club Orange', description: 'Exclusive dining and priority services upgrade programme.' },
      { title: 'Virtuoso Benefit', description: '$200 onboard credit and complimentary beverage package.' },
      { title: 'Lincoln Center Stage', description: 'Live classical performances in the Music Walk every evening.' },
    ],
    ships: [
      { name: 'Rotterdam', description: 'Pinnacle-class, 2,668 guests.', image: '/media/cruises/holland-america/hal-hero-2400.jpg' },
      { name: 'Nieuw Statendam', image: '/media/cruises/holland-america/nieuw-statendam.jpg', description: 'Pinnacle-class, music and art at sea.' },
      { name: 'Koningsdam', image: '/media/cruises/holland-america/koningsdam.jpg', description: 'First Pinnacle-class ship, 2,650 guests.' },
      { name: 'Zuiderdam', image: '/media/cruises/holland-america/zuiderdam.jpg', description: 'Vista-class, intimate 1,916 guests.' },
    ],
    slider_images: [
      '/media/cruises/holland-america/hal-hero-2400.jpg',
      '/media/cruises/holland-america/HAL-featured-1200x628.jpg',
      '/media/cruises/holland-america/HAL-video-content.jpg',
    ],
    sort_order: 8,
  },
  {
    id: '9', name: 'Norwegian Cruise Line', slug: 'norwegian',
    intro: {
      eyebrow: 'Norwegian Cruise Line',
      heading: 'Freestyle cruising',
      body: 'Norwegian invented Freestyle Cruising — no fixed dining times, no formal nights, no assigned seats. The Prima-class ships add the thrills: go-kart racetracks, free-fall slides, and the largest ropes courses at sea, alongside twenty-plus restaurants and The Haven, a private suite enclave with its own pool and restaurant. And Pride of America sails Hawaii inter-island year-round, the only ship that does.',
    },
    destinations: [
      { name: 'Hawaii', blurb: 'Four islands in a week aboard the US-flagged Pride of America — the Na Pali Coast, volcanoes, and inter-island sailing no other line offers.', image_url: '/media/cruises/norwegian/NCL-hawaii-couple-sunset-deck-1500.jpg' },
      { name: 'The Caribbean & Beyond', blurb: 'Pink-sand beaches and warm-water ports, plus Alaska and the Mediterranean across the wider fleet.', image_url: '/media/cruises/norwegian/ncl-couple_beach-1080x1350.jpg' },
    ],
    experiences: [
      { title: 'Freestyle Dining', blurb: 'Twenty-plus restaurants with no fixed times or seats — from teppanyaki tableside to French bistro, dine when and where you please.', image_url: '/media/cruises/norwegian/NCL-restaurant-teppanyaki-habachi-1500.jpg' },
      { title: 'Race the Top Deck', blurb: 'Multi-level go-kart racetracks high above the sea — the signature thrill of the Prima-class ships.', image_url: '/media/cruises/norwegian/NCL-bliss-racetrack-1500.jpg' },
      { title: 'The Haven', blurb: 'A private ship-within-a-ship of suites with a keycard-only pool, sundeck, restaurant, and butler service.', image_url: '/media/cruises/norwegian/NCL-the_haven-top_deck-1500.jpg' },
      { title: 'Pools & Thrills', blurb: 'Free-fall slides, ropes courses, and sun decks built for energy — the active heart of a Norwegian ship.', image_url: '/media/cruises/norwegian/ncl-ship-sunset-1080x1350.jpg' },
    ],
    sample_journeys: [
      { name: 'Hawaii Inter-Island', nights: '7 nights', route: 'Honolulu · Maui · Hilo · Kona · Kauai', blurb: 'Four islands round-trip from Honolulu aboard Pride of America.' },
      { name: 'Alaska', nights: '7 nights', route: 'Seattle · Juneau · Skagway · Glacier Bay · Ketchikan', blurb: 'Glaciers and wilderness with the freedom of Freestyle dining.' },
      { name: 'Eastern Caribbean', nights: '7 nights', route: 'Miami · Puerto Plata · St Thomas · Tortola', blurb: 'Beaches and warm water, the thrills of a Prima-class ship between.' },
    ],
    logo_url: '/media/cruises/norwegian/NCL-logo-black.png',
    logo_url_white: '/media/cruises/norwegian/NCL-logo-white.png',
    hero_image_url: '/media/cruises/norwegian/ncl-hawaii-paddleboarding-hero.jpg',
    tagline: 'It\'s Different Out Here',
    description: 'Norwegian Cruise Line pioneered Freestyle Cruising — the freedom to dine when and where you want, dress how you please, and enjoy a vacation entirely on your terms. Their newest ships feature record-breaking amenities.',
    cruise_types: ['ocean'],
    highlights: [
      { title: 'Free At Sea', description: 'Beverage package, dining credits, Wi-Fi, and shore excursions included.' },
      { title: 'Freestyle Dining', description: '20+ dining options with no set times or table assignments.' },
      { title: 'The Haven', description: 'Ship-within-a-ship luxury enclave with private pool, restaurant, and butler.' },
      { title: 'Broadway Entertainment', description: 'Full Broadway production shows every sailing.' },
      { title: 'Virtuoso Benefit', description: '$300 onboard credit and specialty dining package.' },
      { title: 'Hawaii Exclusivity', description: 'Only major line sailing inter-island Hawaii year-round.' },
    ],
    ships: [
      { name: 'Norwegian Prima', description: 'New Prima-class, 3,215 guests — record-breaking amenities.', image: '/media/cruises/norwegian/ncl-hawaii-paddleboarding-hero.jpg' },
      { name: 'Norwegian Aqua', description: 'First Prima Plus class, ~3,570 guests — debuted 2025.' /* TODO: add image */ },
      { name: 'Norwegian Luna', description: 'Second Prima Plus class — debuts 2026.' /* TODO: add image */ },
      { name: 'Norwegian Viva', image: '/media/cruises/norwegian/norwegian-viva.jpg', description: 'Sister to Prima, launched 2023.' },
      { name: 'Norwegian Bliss', image: '/media/cruises/norwegian/norwegian-bliss.jpg', description: 'Breakaway Plus class, 4,004 guests.' },
      { name: 'Pride of America', image: '/media/cruises/norwegian/pride-of-america.jpg', description: 'Sailing Hawaii year-round.' },
    ],
    slider_images: [
      '/media/cruises/norwegian/ncl-hawaii-paddleboarding-hero.jpg',
      '/media/cruises/norwegian/NCL-featured-1200x628.jpg',
      '/media/cruises/norwegian/ncl-video-content-bg.jpg',
      '/media/cruises/norwegian/NCL-ship-front-1500.jpg',
      '/media/cruises/norwegian/NCL-hawaii-couple-sunset-deck-1500.jpg',
      '/media/cruises/norwegian/NCL-pool-family-1500.jpg',
      '/media/cruises/norwegian/NCL-bliss-racetrack-1500.jpg',
      '/media/cruises/norwegian/NCL-restaurant-teppanyaki-habachi-1500.jpg',
      '/media/cruises/norwegian/NCL-the_haven-top_deck-1500.jpg',
    ],
    sort_order: 9,
  },
  {
    id: '10', name: 'Royal Caribbean', slug: 'royal-caribbean',
    intro: {
      eyebrow: 'Royal Caribbean',
      heading: 'Adventure at its biggest',
      body: 'Royal Caribbean builds the largest cruise ships in the world — floating cities led by Icon of the Seas, with neighbourhoods, a central park, and record-breaking thrills. The Ultimate Abyss, the FlowRider surf simulator, and the North Star observation capsule sit alongside Perfect Day at CocoCay, the line\'s private Bahamas island. For families and first-timers, nothing else has this much to do.',
    },
    destinations: [
      { name: 'Perfect Day at CocoCay', blurb: 'The line\'s private Bahamas island — a waterpark, the tallest slide in North America, an overwater cabana, and a freshwater pool.', image_url: '/media/cruises/royal-caribbean/featured-image-RC.jpg' },
      { name: 'The Caribbean', blurb: 'St Lucia\'s Pitons, turquoise reefs, and beach days across the Eastern and Southern Caribbean.', image_url: '/media/cruises/royal-caribbean/rc-destinations-1500.jpg' },
      { name: 'The Mediterranean', blurb: 'The Amalfi Coast, Croatia, and the Greek Isles — the great European ports at the scale only Royal Caribbean attempts.', image_url: '/media/cruises/royal-caribbean/royal_caribbean-italy-hero-1900.jpg' },
    ],
    experiences: [
      { title: 'The Ultimate Abyss', blurb: 'The tallest slide at sea drops ten decks down the stern — one of dozens of firsts engineered into the Oasis- and Icon-class ships.', image_url: '/media/cruises/royal-caribbean/Hero_UltimateAbyss_Dark.jpg' },
      { title: 'North Star & the Pool Decks', blurb: 'A jewel-shaped capsule lifts you 300 feet above the sea, while pools, the AquaTheater, and the FlowRider fill the decks below.', image_url: '/media/cruises/royal-caribbean/rc-odyssey-1500.jpg' },
      { title: 'Sport at Sea', blurb: 'Mini-golf, rock-climbing, zip lines, and surf simulators — the most active top decks afloat.', image_url: '/media/cruises/royal-caribbean/symphony-of-the-seas.jpg' },
      { title: 'An Icon at Sea', blurb: 'Eight distinct neighbourhoods, a central park of living plants, and more than twenty pools and whirlpools on a single ship.', image_url: '/media/cruises/royal-caribbean/aerial-view-odyssey-of-the-seas-full-ship.jpg' },
    ],
    sample_journeys: [
      { name: 'Bahamas & Perfect Day', nights: '7 nights', route: 'Miami · Perfect Day at CocoCay · Nassau · the Eastern Bahamas', blurb: 'The private-island showcase, round-trip from Florida.' },
      { name: 'Eastern Caribbean', nights: '7 nights', route: 'Fort Lauderdale · St Thomas · St Maarten · Perfect Day at CocoCay', blurb: 'Beaches, reefs, and the full thrill deck between ports.' },
      { name: 'The Mediterranean', nights: '7 nights', route: 'Barcelona · Naples · Rome · Florence · the French Riviera', blurb: 'The great European ports aboard an Oasis-class ship.' },
    ],
    logo_url: '/assets/supplier logos/jpg/Royal-Caribbean-black.png',
    logo_url_white: '/media/cruises/royal-caribbean/royal-caribbean-logo-white-700.png',
    hero_image_url: '/media/cruises/royal-caribbean/Hero_UltimateAbyss_Dark.jpg',
    tagline: 'It\'s Big Time',
    description: 'Royal Caribbean pushes the boundaries of what\'s possible at sea — from the world\'s largest cruise ships to zip lines, surf simulators, and the new Icon of the Seas, a record-breaking city on the water carrying 7,600 guests.',
    cruise_types: ['ocean'],
    highlights: [
      { title: 'Icon of the Seas', description: 'World\'s largest cruise ship — 7,600 guests, 20 neighbourhoods, 6 world records.' },
      { title: 'Adventure Activities', description: 'Zip lines, surf simulators, FlowRider, rock climbing, and skydiving simulators.' },
      { title: 'Perfect Day at CocoCay', description: 'Royal Caribbean\'s exclusive private island in the Bahamas.' },
      { title: '20+ Dining Options', description: 'Specialty restaurants including celebrity chef concepts.' },
      { title: 'Virtuoso Benefit', description: '$200 onboard credit and complimentary beverage package.' },
      { title: 'Star Class Suites', description: 'Genie concierge, unlimited dining, and priority everything.' },
    ],
    ships: [
      { name: 'Icon of the Seas', description: 'World\'s largest cruise ship, 7,600 guests — launched 2024.', image: '/media/cruises/royal-caribbean/icon-of-the-seas-night-aerial-aft-view-vertical.jpg' },
      { name: 'Star of the Seas', description: 'Second Icon-class ship, ~7,600 guests — debuted 2025.' /* TODO: add image */ },
      { name: 'Legend of the Seas', description: 'Third Icon-class ship — debuts 2026.' /* TODO: add image */ },
      { name: 'Utopia of the Seas', description: 'The ultimate weekend getaway, newest Oasis-class.', image: '/media/cruises/royal-caribbean/utopia-of-the-seas-daytime-aft-view-vertical.jpg' },
      { name: 'Wonder of the Seas', image: '/media/cruises/royal-caribbean/wonder-of-the-seas-cruise-ship-aerial-aft.jpg', description: '6,988 guests, Oasis-class award winner.' },
      { name: 'Symphony of the Seas', image: '/media/cruises/royal-caribbean/symphony-exterior-aerial-day-sailing-splash-away-bay-ship.jpg', description: '6,680 guests, Oasis-class.' },
      { name: 'Odyssey of the Seas', image: '/media/cruises/royal-caribbean/odyssey-of-the-seas-night-time-pool-deck-north-star-aerial.jpg', description: 'Quantum Ultra class, advanced thrills.' },
    ],
    slider_images: [
      '/media/cruises/royal-caribbean/Hero_UltimateAbyss_Dark.jpg',
      '/media/cruises/royal-caribbean/aerial-view-odyssey-of-the-seas-full-ship.jpg',
      '/media/cruises/royal-caribbean/RC-ships-1500.jpg',
      '/media/cruises/royal-caribbean/cozumel-mexico-reef-snorkeling-fish-shore-excursions.jpg',
      '/media/cruises/royal-caribbean/utopia-of-the-seas-aft-ocean-horizon-zoomed.jpg',
      '/media/cruises/royal-caribbean/utopia-of-the-seas-daytime-aft-view-vertical.jpg',
      '/media/cruises/royal-caribbean/utopia-of-the-seas-aft-sea-day-sailing-aft-crop.jpg',
      '/media/cruises/royal-caribbean/wonder-of-the-seas-cruise-ship-aerial-aft.jpg',
      '/media/cruises/royal-caribbean/wonder-of-the-seas-aft-sunset-sailing-sea-day.jpg',
    ],
    sort_order: 10,
  },
  {
    id: '11', name: 'Princess Cruises', slug: 'princess',
    intro: {
      eyebrow: 'Princess Cruises',
      heading: 'Come back new',
      body: 'Princess pairs big-ship range with a personal touch through MedallionClass — a wearable device that orders a drink to wherever you are, unlocks your door, and finds your party across the ship. The Sphere-class Sun Princess leads a fleet strong in Alaska, the Caribbean, and the Mediterranean, with The Sanctuary adults-only retreat and Movies Under the Stars among its signatures.',
    },
    destinations: [
      { name: 'Alaska', blurb: 'Glaciers, fjords, and wilderness — a region Princess has built its reputation on, with cruisetours deep into Denali.', image_url: '/media/cruises/princess/princess-video-bg.jpg' },
      { name: 'The Caribbean & Mexico', blurb: 'Warm-water beaches and lively ports across the Caribbean and the Mexican Riviera, at an easy, sun-filled pace.', image_url: '/media/cruises/princess/princess-gallery-woman.jpg' },
    ],
    experiences: [
      { title: 'The Sanctuary', blurb: 'An adults-only retreat of shaded loungers, attentive service, and sea views — a calm deck apart from the rest of the ship.', image_url: '/media/cruises/princess/princess-hero-2200.jpg' },
      { title: 'MedallionClass', blurb: 'A wearable medallion that orders, unlocks, locates, and pays — the ship anticipating you rather than the other way around.', image_url: '/media/cruises/princess/princess-video-bg-content.jpg' },
    ],
    sample_journeys: [
      { name: 'Alaska', nights: '7 nights', route: 'Vancouver · Ketchikan · Juneau · Skagway · Glacier Bay', blurb: 'The classic Alaska week, with the option to extend overland to Denali.' },
      { name: 'The Mediterranean', nights: '10 nights', route: 'Barcelona · Provence · the Riviera · Florence · Rome', blurb: 'The great Mediterranean ports at a relaxed big-ship pace.' },
      { name: 'The Mexican Riviera', nights: '7 nights', route: 'Los Angeles · Cabo San Lucas · Mazatlán · Puerto Vallarta', blurb: 'Sun, beaches, and easy Pacific-coast ports round-trip from California.' },
    ],
    logo_url: '/media/cruises/princess/princess-cruises-2020-black-600.png',
    logo_url_white: '/media/cruises/princess/princess-cruises-white-600.png',
    hero_image_url: '/media/cruises/princess/princess-hero-2200.jpg',
    tagline: 'Come Back New.',
    description: 'Princess Cruises connects guests to the world through incredible destinations, award-winning entertainment, and warmth that has made them beloved for decades. The MedallionClass experience transforms every sailing with seamless, personalised service.',
    cruise_types: ['ocean'],
    highlights: [
      { title: 'MedallionClass Technology', description: 'Wearable OceanMedallion enables seamless boarding and delivery anywhere onboard.' },
      { title: 'Princess Plus & Premier', description: 'Wi-Fi, beverages, gratuities, and dining included in value bundles.' },
      { title: 'Discovery at Sea', description: 'Partnership with Discovery Channel for exclusive expedition content.' },
      { title: 'The Sanctuary', description: 'Adults-only sun deck retreat with dedicated service and cuisine.' },
      { title: 'Virtuoso Benefit', description: '$200 onboard credit and specialty dining reservation.' },
      { title: 'Alaska Voyages', description: 'The most comprehensive Alaska programme of any cruise line.' },
    ],
    ships: [
      { name: 'Sun Princess', description: 'Brand new Sphere-class, 4,300 guests — launched 2024.', image: '/media/cruises/princess/princess-hero-2200.jpg' },
      { name: 'Star Princess', description: 'Sphere-class, ~4,300 guests, LNG-capable — maiden voyage 2025.' /* TODO: add image */ },
      { name: 'Discovery Princess', image: '/media/cruises/princess/discovery-princess.jpg', description: 'Royal-class, 4,000 guests.' },
      { name: 'Sky Princess', image: '/media/cruises/princess/sky-princess.jpg', description: 'Mediterranean luxury.' },
      { name: 'Majestic Princess', image: '/media/cruises/princess/majestic-princess.jpg', description: 'Global sailings flagship.' },
    ],
    slider_images: [
      '/media/cruises/princess/princess-hero-2200.jpg',
      '/media/cruises/princess/princess-hero-2200-dark.jpg',
      '/media/cruises/princess/princess-gallery-woman.jpg',
    ],
    sort_order: 11,
  },
  // ── Expedition ──────────────────────────────────────────────────────────────
  {
    id: '12', name: 'Ponant', slug: 'ponant',
    logo_url: '/assets/supplier logos/black transparent/cruise/Ponant-black-600.png',
    logo_url_white: '/media/cruises/ponant/PONANT_Logo_white-500.png',
    hero_image_url: '/media/cruises/ponant/ponant-hero-2200.jpg',
    tagline: 'The French way of luxury expedition.',
    description: 'Ponant is the world\'s leading luxury expedition company — combining polar expertise, extraordinary destinations, and refined Gallic elegance. Their Le Commandant Charcot is the world\'s first luxury hybrid LNG-electric polar icebreaker.',
    cruise_types: ['ocean'],
    intro: {
      eyebrow: 'Ponant',
      heading: 'The French art of expedition',
      body: 'Ponant sails the world differently — French in spirit, intimate by design, and unrivalled at the ends of the earth. The fleet runs from the three-masted sailing yacht Le Ponant to the Explorer-class ships and Le Commandant Charcot, the world\'s only luxury hybrid LNG-electric polar icebreaker, the first to carry guests to the geographic North Pole. Across all of them: Gallic cuisine, refined design, and a way of reaching the remote that never sacrifices elegance.',
    },
    destinations: [
      { name: 'The Polar Regions', blurb: 'Antarctica, the high Arctic, and the geographic North Pole — the remotest places on earth, reached aboard the only luxury icebreaker built to carry you there.', image_url: '/media/cruises/ponant/ponant-hero-2200.jpg' },
      { name: 'Remote Horizons', blurb: 'The Kimberley, the South Pacific, and the Mediterranean under sail — expedition and art de vivre, wherever the fleet drops anchor.', image_url: '/media/cruises/ponant/ponant-featured-1200x628.jpg' },
    ],
    sample_journeys: [
      { name: 'Antarctica & the Peninsula', nights: '11 nights', route: 'Ushuaia · the Drake Passage · the Antarctic Peninsula · the South Shetlands', blurb: 'Ice, wildlife, and silence at the bottom of the world, with expert naturalists aboard.' },
      { name: 'The Geographic North Pole', nights: '16 nights', route: 'Longyearbyen · the pack ice · 90°N · Spitsbergen', blurb: 'Aboard Le Commandant Charcot — the rarest voyage in luxury travel, to the top of the planet.' },
      { name: 'The Kimberley', nights: '10 nights', route: 'Darwin · the Hunter River · King George Falls · Broome', blurb: 'Ancient gorges and tidal waterfalls along Australia\'s wild northwest, by Zodiac and ship.' },
    ],
    highlights: [
      { title: 'Polar Expertise', description: 'France\'s leading polar operator — Antarctica, Arctic, and remote archipelagos.' },
      { title: 'Le Commandant Charcot', description: 'World\'s only luxury hybrid LNG-electric icebreaker — reaching the geographic North Pole.' },
      { title: 'French Elegance', description: 'Refined Gallic cuisine, service, and design throughout.' },
      { title: 'Intimate Ships', description: '92–270 guests — true expedition intimacy with luxury comfort.' },
      { title: 'Virtuoso Benefit', description: '$300 shipboard credit and exclusive expedition briefing.' },
      { title: 'Le Ponant Yacht', description: '64-guest three-masted sailing yacht for the most intimate voyages.' },
    ],
    ships: [
      { name: 'Le Commandant Charcot', description: 'World\'s only luxury hybrid LNG-electric icebreaker, 245 guests.', image: '/media/cruises/ponant/ponant-hero-2200.jpg' },
      { name: 'Le Bellot', image: '/media/cruises/ponant/le-bellot.jpg', description: 'Explorer-class, 184 guests, polar.' },
      { name: 'Le Bougainville', image: '/media/cruises/ponant/le-bougainville.jpg', description: '184 guests, expedition luxury.' },
      { name: 'Le Ponant', image: '/media/cruises/ponant/le-ponant.jpg', description: '64 guests, three-masted sailing yacht.' },
      { name: 'Spirit of Ponant', description: 'Ponant Yachting catamaran — 2024.' /* TODO: add image */ },
      { name: 'La Désirade', description: 'Ponant Yachting catamaran — 2025.' /* TODO: add image */ },
    ],
    slider_images: [
      '/media/cruises/ponant/ponant-hero-2200.jpg',
      '/media/cruises/ponant/ponant-featured-1200x628.jpg',
      '/media/cruises/ponant/sustainability_video-background-ponant.jpg',
    ],
    sort_order: 12,
  },
  {
    id: '13', name: 'Lindblad Expeditions', slug: 'lindblad',
    intro: {
      eyebrow: 'Lindblad Expeditions–National Geographic',
      heading: 'Expeditions at the edge of the world',
      body: 'Lindblad pioneered expedition travel, and its partnership with National Geographic still defines the genre. Purpose-built polar ships carry just over a hundred guests alongside naturalists, undersea specialists, and Nat Geo photographers. From more Antarctic departures than any operator to the wildlife of the Galápagos, this is exploration with the experts who wrote the field guide.',
    },
    destinations: [
      { name: 'Antarctica', blurb: 'The white continent by Zodiac and kayak, with the most departures of any expedition operator and a naturalist for every landing.', image_url: '/media/cruises/lindblad/lindblad-antarctica-1920x1000.jpg' },
      { name: 'The Galápagos', blurb: 'Sea lions, blue-footed boobies, and giant tortoises — the islands that shaped Darwin, walked with Nat Geo-certified guides.', image_url: '/media/cruises/lindblad/lindblad-natgeo-video-content.jpg' },
      { name: 'The Arctic & Baja', blurb: 'Polar bears off Svalbard and grey whales in Baja — the planet\'s great wildlife theatres, north and south.', image_url: '/media/cruises/lindblad/lindblad-natgeo-featured-1200x628.jpg' },
    ],
    experiences: [
      { title: 'Expedition by Zodiac', blurb: 'A fleet of Zodiacs, kayaks, and an undersea program puts you in the landscape — among the ice and the wildlife, not just passing by.', image_url: '/media/cruises/lindblad/011520-home-antarctica-1920x1000.jpg' },
      { title: 'Exploring with National Geographic', blurb: 'Naturalists, an undersea specialist, and a Nat Geo photographer sail aboard — the expertise that turns a sighting into an understanding.', image_url: '/media/cruises/lindblad/lindblad-natgeo-video-banner.jpg' },
    ],
    sample_journeys: [
      { name: 'Antarctica', nights: '14 nights', route: 'Buenos Aires · Ushuaia · the Drake Passage · the Antarctic Peninsula', blurb: 'The white continent in depth, with daily Zodiac and kayak excursions.' },
      { name: 'The Galápagos', nights: '10 nights', route: 'Guayaquil · the central & western Galápagos islands', blurb: 'Two weeks among the wildlife, with naturalists and a flexible itinerary.' },
      { name: 'Arctic Svalbard', nights: '11 nights', route: 'Oslo · Longyearbyen · the pack ice · the Svalbard archipelago', blurb: 'In search of polar bears and walrus at the top of the world.' },
    ],
    logo_url: '/assets/supplier logos/jpg/Lindblad-black.png',
    logo_url_white: null,
    hero_image_url: '/media/cruises/lindblad/lindblad-antarctica-1920x1000.jpg',
    tagline: 'National Geographic. Expeditions at the edge of the world.',
    description: 'Lindblad Expeditions partners exclusively with National Geographic to deliver the world\'s finest nature and wildlife voyages. Their team of naturalists, undersea specialists, and photo instructors bring every destination vividly to life.',
    cruise_types: ['ocean'],
    highlights: [
      { title: 'National Geographic Partnership', description: 'Exclusive NatGeo partnership — certified naturalists and photo instructors on every voyage.' },
      { title: 'Undersea Programme', description: 'ROVs and specialist divers explore beneath every destination.' },
      { title: 'Antarctica Expertise', description: 'More Antarctic voyages than any other expedition operator.' },
      { title: 'Kayaking & Zodiac Access', description: 'Kayaks, paddleboards, and Zodiac craft included to reach remote shores.' },
      { title: 'Virtuoso Benefit', description: '$200 shipboard credit and complimentary NatGeo photo workshop.' },
      { title: 'Carbon Neutral', description: 'Committed to carbon-neutral operations across the entire fleet.' },
    ],
    ships: [
      { name: 'National Geographic Resolution', description: 'Purpose-built polar ship, 138 guests.', image: '/media/cruises/lindblad/lindblad-antarctica-1920x1000.jpg' },
      { name: 'National Geographic Endurance', image: '/media/cruises/lindblad/ng-endurance.jpg', description: '126 guests, advanced polar vessel.' },
      { name: 'National Geographic Explorer', image: '/media/cruises/lindblad/ng-explorer.jpg', description: '148 guests, ice-strengthened global expedition.' },
      { name: 'National Geographic Venture', image: '/media/cruises/lindblad/ng-venture.jpg', description: 'Coastal Alaska and Baja specialist.' },
    ],
    slider_images: [
      '/media/cruises/lindblad/lindblad-antarctica-1920x1000.jpg',
      '/media/cruises/lindblad/011520-home-antarctica-1920x1000.jpg',
      '/media/cruises/lindblad/lindblad-natgeo-featured-1200x628.jpg',
      '/media/cruises/lindblad/lindblad-natgeo-video-content.jpg',
    ],
    sort_order: 13,
  },
  {
    id: '14', name: 'UnCruise Adventures', slug: 'uncruise',
    intro: {
      eyebrow: 'UnCruise Adventures',
      heading: 'Small ships, big wilderness',
      body: 'UnCruise sails the smallest ships in the adventure fleet — 22 to 90 guests — straight into the places the big ships sail past. Days are spent off the vessel: kayaking, skiffing, hiking, and snorkelling, with everything included and a naturalist always close. From the bays of Alaska\'s Inside Passage to the Sea of Cortez, this is the wild, active end of cruising.',
    },
    destinations: [
      { name: "Alaska's Inside Passage", blurb: 'Glaciers, whales, and forested fjords reached by kayak and skiff — the most intimate way to sail Southeast Alaska.', image_url: '/media/cruises/uncruise/uncruise-featured.jpg' },
      { name: 'Baja & the Sea of Cortez', blurb: 'Snorkelling with sea lions and watching grey whales in the "aquarium of the world," off a ship small enough to anchor anywhere.', image_url: '/media/cruises/uncruise/UnCruise-hero-1400x624-Snorkeling_Baja_California--Ellen-Barone.jpg' },
    ],
    experiences: [
      { title: 'Wild by Nature', blurb: 'Whales off the bow, hikes into old-growth forest, and an all-inclusive deck of kayaks and paddleboards — the day shaped by the wildlife, not the schedule.', image_url: '/media/cruises/uncruise/uncruise-video-content.jpg' },
    ],
    sample_journeys: [
      { name: "Alaska's Inside Passage", nights: '7 nights', route: 'Juneau · Glacier Bay · the Tongass · Frederick Sound', blurb: 'Kayak, skiff, and hike through the bays and fjords of Southeast Alaska.' },
      { name: 'Baja & the Sea of Cortez', nights: '7 nights', route: 'La Paz · Espíritu Santo · Los Islotes · Magdalena Bay', blurb: 'Snorkel with sea lions and watch grey whales in the Sea of Cortez.' },
      { name: 'Columbia & Snake Rivers', nights: '7 nights', route: 'Portland · the Columbia Gorge · the Snake River · Hells Canyon', blurb: 'Following Lewis & Clark through the Pacific Northwest, vineyard to canyon.' },
    ],
    logo_url: '/media/cruises/uncruise/uncruise-logo-black-540.png',
    logo_url_white: '/media/cruises/uncruise/uncruise-logo-white-600.png',
    hero_image_url: '/media/cruises/uncruise/UnCruise-hero-1400x624-Snorkeling_Baja_California--Ellen-Barone.jpg',
    tagline: 'Small ships. Big adventures. Wild destinations.',
    description: 'UnCruise Adventures operates ultra-small expedition vessels to Alaska, Hawaii, Baja California, and the Galápagos. With 22–90 guests per ship, the experience is deeply personal, adventurous, and built around nature immersion.',
    cruise_types: ['ocean'],
    highlights: [
      { title: 'Ultra-Small Ships', description: '22–90 guests per ship — the ultimate personalised adventure.' },
      { title: 'Alaska Specialists', description: 'The most intimate Alaska Inside Passage programme available.' },
      { title: 'All-Inclusive Adventure', description: 'Kayaking, skiff tours, hiking, snorkelling — all included.' },
      { title: 'Galápagos Voyages', description: 'Small-ship access with expert naturalist guides.' },
      { title: 'Virtuoso Benefit', description: '$150 shipboard credit and complimentary expedition gear.' },
      { title: 'Expert Guides', description: 'Naturalists, historians, and guides with deep regional expertise.' },
    ],
    ships: [
      { name: 'Wilderness Legacy', description: '86 guests, flagship adventure vessel.' /* TODO: add image */ },
      { name: 'Safari Endeavour', description: '84 guests, Alaska and Baja.' /* TODO: add image */ },
      { name: 'Wilderness Discoverer', image: '/media/cruises/uncruise/wilderness-discoverer.jpg', description: '76 guests, Alaska and Columbia River.' },
      { name: 'Wilderness Explorer', description: '74 guests, Alaska Inside Passage.' /* TODO: add image */ },
      { name: 'Safari Voyager', image: '/media/cruises/uncruise/UnCruise-hero-1400x624-Snorkeling_Baja_California--Ellen-Barone.jpg', description: '66 guests, Costa Rica and Panama.' },
      { name: 'Wilderness Adventurer', image: '/media/cruises/uncruise/wilderness-adventurer.jpg', description: '60 guests, Alaska Inside Passage.' },
      { name: 'La Pinta', description: '48 guests, Galápagos.' /* TODO: add image */ },
      { name: 'Safari Explorer', image: '/media/cruises/uncruise/safari-explorer.jpg', description: '36 guests, Hawaii and Alaska.' },
      { name: 'Safari Quest', description: '22 guests, intimate small-ship adventure.' /* TODO: add image */ },
    ],
    slider_images: [
      '/media/cruises/uncruise/UnCruise-hero-1400x624-Snorkeling_Baja_California--Ellen-Barone.jpg',
      '/media/cruises/uncruise/uncruise-featured.jpg',
      '/media/cruises/uncruise/uncruise-video-content.jpg',
    ],
    sort_order: 14,
  },
  {
    id: '15', name: 'Paul Gauguin Cruises', slug: 'paul-gauguin',
    logo_url: '/assets/supplier logos/jpg/Paul-Gauguin-black.png',
    logo_url_white: '/media/cruises/paul-gauguin/PGC-white-500.png',
    hero_image_url: '/media/cruises/paul-gauguin/pg-borabora-hero.jpg',
    tagline: 'French Polynesia\'s finest voyage.',
    description: 'Paul Gauguin Cruises operates a single iconic ship permanently sailing French Polynesia — Tahiti, Moorea, Bora Bora, and beyond. Year-round in paradise, the m/s Paul Gauguin is the gold standard for South Pacific luxury cruising.',
    cruise_types: ['ocean', 'yacht'],
    intro: {
      eyebrow: 'Paul Gauguin Cruises',
      heading: 'A lifetime sailing French Polynesia',
      body: 'One ship, one ocean. The m/s Paul Gauguin sails French Polynesia year-round and nothing else — small enough at 332 guests to slip into the lagoons of Bora Bora and the remote bays of the Marquesas, with a retractable watersports marina off the stern. Aboard, the Gauguines — local Polynesian hosts — share the music, language, and stories of the islands. After three decades, it remains the most intimate way to know the South Pacific.',
    },
    destinations: [
      { name: 'Bora Bora & the Society Islands', blurb: 'The turquoise lagoons of Bora Bora, Taha\'a, and Raiatea — overwater days at anchor with the marina lowered straight into the warm Pacific.', image_url: '/media/cruises/paul-gauguin/pg-borabora-hero.jpg' },
      { name: 'Moorea', blurb: 'Jagged green peaks and a sapphire lagoon a short sail from Papeete — the postcard of French Polynesia, reached at a yacht\'s pace.', image_url: '/media/cruises/paul-gauguin/Moorea228_1640x562.jpg' },
      { name: 'The Marquesas', blurb: 'Remote, dramatic, and rarely visited — Fatu Hiva and the wild islands that drew the painter Gauguin himself, on the line\'s longer voyages.', image_url: '/media/cruises/paul-gauguin/Rail-Group_FatuHiva_06804_1640x562.jpg' },
    ],
    sample_journeys: [
      { name: 'The Society Islands', nights: '7 nights', route: 'Papeete · Moorea · Taha\'a · Bora Bora · Raiatea', blurb: 'The classic Polynesian week — lagoon to lagoon, with watersports and motu picnics between.' },
      { name: 'Marquesas, Tuamotus & Society Islands', nights: '14 nights', route: 'Papeete · Fakarava · the Marquesas · Rangiroa · Bora Bora', blurb: 'The grand voyage to the remote archipelagos, the marquee itinerary for those with time.' },
      { name: 'Cook Islands & Society Islands', nights: '11 nights', route: 'Papeete · Aitutaki · Rarotonga · Bora Bora · Moorea', blurb: 'Beyond French Polynesia into the Cooks, with long days at sea and rare anchorages.' },
    ],
    highlights: [
      { title: 'Year-Round French Polynesia', description: 'The only luxury ship sailing exclusively through French Polynesia year-round.' },
      { title: 'Watersports Marina', description: 'Kayaks, paddleboards, windsurfers, and snorkel gear included.' },
      { title: 'Intimate 332 Guests', description: 'One of the smallest luxury ships in the Pacific — deeply personal service.' },
      { title: 'Tahitian Culture', description: 'The Gauguines — local Polynesian staff who share culture and stories.' },
      { title: 'Virtuoso Benefit', description: '$200 shipboard credit and complimentary water sports package.' },
      { title: 'All-Inclusive Beverages', description: 'Open bar, specialty wines, and non-alcoholic drinks included.' },
    ],
    ships: [
      { name: 'm/s Paul Gauguin', description: '332 guests, permanent French Polynesia icon.', image: '/media/cruises/paul-gauguin/pg-borabora-hero.jpg' },
    ],
    slider_images: [
      '/media/cruises/paul-gauguin/pg-borabora-hero.jpg',
      '/media/cruises/paul-gauguin/Moorea228_1640x562.jpg',
      '/media/cruises/paul-gauguin/pg-featured-1200x628.jpg',
      '/media/cruises/paul-gauguin/Rail-Group_FatuHiva_06804_1640x562.jpg',
    ],
    sort_order: 15,
  },
  {
    id: '16', name: 'Star Clippers', slug: 'star-clippers',
    logo_url: '/assets/supplier logos/jpg/Star-Clippers-black.png',
    logo_url_white: null,
    hero_image_url: '/media/cruises/star-clippers/star_clippers-hero-2000.jpg',
    tagline: 'The romance of sailing under canvas.',
    description: 'Star Clippers operates the world\'s largest sailing ships — majestic tall ships harnessing the wind across the Caribbean and Mediterranean. With only 170–227 guests, every voyage is an intimate adventure in the golden age of sail.',
    cruise_types: ['yacht', 'ocean'],
    intro: {
      eyebrow: 'Star Clippers',
      heading: 'The golden age of sail, alive',
      body: 'Star Clippers sails the world\'s largest square-riggers — true tall ships, driven by canvas and the wind rather than the schedule. The five-masted Royal Clipper is the largest fully rigged sailing ship in service; her sisters Star Clipper and Star Flyer carry just 170 guests apiece. Teak decks, towering masts, and the freedom to climb aloft or anchor in a cove no large ship can reach — this is sailing as romance, not as metaphor.',
    },
    destinations: [
      { name: 'The Caribbean', blurb: 'The Grenadines, St Lucia, and the Leeward Islands under full sail — anchoring in bays and coves the cruise ships can only pass by.', image_url: '/media/cruises/star-clippers/star_clippers-hero-2000.jpg' },
      { name: 'The Mediterranean', blurb: 'The Riviera, Corsica, and the Greek Isles, the sails set against ancient coastlines — the way these waters were always meant to be crossed.', image_url: '/media/cruises/star-clippers/star_clippers-hero_v2-2000.jpg' },
    ],
    experiences: [
      { title: 'Life Under Sail', blurb: 'Climb the mast, take the wheel, or lie in the bowsprit netting as the ship heels into the wind — an open-bridge, hands-on romance no motor yacht can offer.', image_url: '/media/cruises/star-clippers/starclippers-featured.jpg' },
      { title: 'Watersports & Hidden Coves', blurb: 'A retractable marina opens off the stern for kayaks, snorkelling, and swims in anchorages reachable only under sail.', image_url: '/media/cruises/star-clippers/starclippers-video-content.jpg' },
    ],
    sample_journeys: [
      { name: 'The Grenadines', nights: '7 nights', route: 'Barbados · St Lucia · the Tobago Cays · Bequia · Martinique', blurb: 'Trade-wind sailing between the Windward Islands, with beach anchorages and reef snorkelling daily.' },
      { name: 'The Greek Isles', nights: '7 nights', route: 'Athens · Mykonos · Santorini · Hydra · the Cyclades', blurb: 'Island-hopping the Aegean under canvas, into small harbours the big ships skip.' },
      { name: 'The Riviera & Corsica', nights: '7 nights', route: 'Cannes · Saint-Tropez · Calvi · Portofino · Monaco', blurb: 'The glamorous coast at a sailor\'s pace, anchoring off beaches between the famous ports.' },
    ],
    highlights: [
      { title: 'Tall Ship Sailing', description: 'Real sailing ships — canvas sails, teak decks, and the sound of the wind.' },
      { title: 'Royal Clipper', description: 'World\'s largest fully rigged sailing ship — 227 guests, 5-masted.' },
      { title: 'Watersports Included', description: 'Kayaks, windsurfers, snorkel gear, and water ski all included.' },
      { title: 'Intimate Atmosphere', description: '170–227 guests — extraordinarily personal service.' },
      { title: 'Virtuoso Benefit', description: '$200 shipboard credit and complimentary excursion day.' },
      { title: 'Unique Port Access', description: 'Anchoring in bays and coves inaccessible to large ships.' },
    ],
    ships: [
      { name: 'Royal Clipper', description: 'World\'s largest fully rigged sailing ship, 227 guests.', image: '/media/cruises/star-clippers/star_clippers-hero-2000.jpg' },
      { name: 'Star Clipper', image: '/media/cruises/star-clippers/star-clipper.jpg', description: '170 guests, 4-masted barquentine.' },
      { name: 'Star Flyer', image: '/media/cruises/star-clippers/star-flyer.jpg', description: '170 guests, twin of Star Clipper.' },
    ],
    slider_images: [
      '/media/cruises/star-clippers/star_clippers-hero-2000.jpg',
      '/media/cruises/star-clippers/star_clippers-hero_v2-2000.jpg',
      '/media/cruises/star-clippers/starclippers-featured.jpg',
      '/media/cruises/star-clippers/starclippers-video-content.jpg',
    ],
    sort_order: 16,
  },
  {
    id: '17', name: 'Scenic', slug: 'scenic',
    intro: {
      eyebrow: 'Scenic',
      heading: 'Ultra-luxury, all the way to the poles',
      body: 'Scenic sails ultra-luxury, all-inclusive "Discovery Yachts" — Scenic Eclipse and Eclipse II carry their own submarine and helicopters to the ends of the earth. Every accommodation is a butler-served suite, the Senses Spa is an ESPA partnership, and up to ten dining venues span the voyage. The same all-inclusive philosophy runs Scenic\'s celebrated river fleet through the heart of Europe.',
    },
    destinations: [
      { name: 'Antarctica', blurb: 'The white continent aboard a Discovery Yacht equipped with a submarine and helicopters — among penguins and ice at the bottom of the world.', image_url: '/media/cruises/scenic/Scenic-Eclipse-Antarctica-On-the-Ice---Emperor-hero-2000.jpg' },
      { name: 'The Arctic & Fjords', blurb: 'Svalbard, Greenland, and the Norwegian fjords — sheer cliffs, glassy water, and the far north in ultra-luxury comfort.', image_url: '/media/cruises/scenic/scenic-antarctica-1500.jpg' },
      { name: "Europe's Rivers", blurb: 'The Danube, Rhine, and Rhône aboard all-inclusive Space-Ships — palaces, vineyards, and capitals at the water\'s edge.', image_url: '/media/cruises/scenic/scenic-land_tours-1500.jpg' },
    ],
    experiences: [
      { title: 'The Submarine', blurb: 'A custom submarine descends beneath the ice and the waves — an expedition tool no other luxury line carries as standard.', image_url: '/media/cruises/scenic/scenic-sub-1500.jpg' },
      { title: 'Helicopter Flightseeing', blurb: 'Onboard helicopters lift off the helipad for flightseeing over ice fields and coastlines few ever witness from above.', image_url: '/media/cruises/scenic/scenic-chopper-1080x1350.jpg' },
      { title: 'Senses Spa', blurb: 'An ESPA-partnered spa with treatment rooms, a plunge pool, and wellness spaces — restoration between landings.', image_url: '/media/cruises/scenic/scenic-spa-1500.jpg' },
      { title: 'Up to Ten Dining Experiences', blurb: 'From fine-dining tableside theatre to relaxed all-day venues — every meal, and every drink, included.', image_url: '/media/cruises/scenic/scenic-dining--1500.jpg' },
    ],
    suites: [
      { name: 'Spa-Inspired Suites', blurb: 'Butler-served suites with ocean-view spa baths and freestanding tubs — calm, residential, and finished to the millimetre.', image_url: '/media/cruises/scenic/scenic-bathroom-1500.jpg' },
      { name: 'Ocean & River Suites', blurb: 'Private balconies on the Discovery Yachts and full-wall windows on the river Space-Ships — the suite as a vantage point.', image_url: '/media/cruises/scenic/scenic-river-suite-couple-1500.jpg' },
    ],
    sample_journeys: [
      { name: 'Antarctica', nights: '11 nights', route: 'Buenos Aires · Ushuaia · the Drake Passage · the Antarctic Peninsula', blurb: 'The white continent with submarine dives and helicopter flightseeing.' },
      { name: 'The Arctic & Fjords', nights: '12 nights', route: 'Reykjavík · Greenland · Svalbard · the Norwegian coast', blurb: 'Glaciers and far-northern light in butler-served, all-inclusive comfort.' },
      { name: 'The Danube', nights: '8 nights', route: 'Budapest · Vienna · the Wachau Valley · Passau · Nuremberg', blurb: 'The heart of Europe aboard an all-inclusive river Space-Ship.' },
    ],
    logo_url: '/assets/supplier logos/jpg/Scenic-black.png',
    logo_url_white: '/media/cruises/scenic/scenic-white-logo.png',
    hero_image_url: '/media/cruises/scenic/Scenic-Eclipse-Antarctica-On-the-Ice---Emperor-hero-2000.jpg',
    tagline: 'Ultra-luxury. All the way to the poles.',
    description: 'Scenic operates ultra-luxury river cruises and the extraordinary Scenic Eclipse ocean discovery yachts. With a full-inclusion commitment and a submarine and helicopter onboard, Scenic reaches the world\'s most inspiring destinations in unmatched comfort.',
    cruise_types: ['ocean', 'river'],
    highlights: [
      { title: 'All-Inclusive Luxury', description: 'Shore excursions, fine dining, beverages, butler service, and Wi-Fi included.' },
      { title: 'Submarine & Helicopter Onboard', description: 'Exclusive discovery tools for experiences no other cruise line offers.' },
      { title: 'Scenic Eclipse', description: 'World\'s first ultra-luxury discovery yachts — groundbreaking design.' },
      { title: 'Polar Expeditions', description: 'Antarctica, the Arctic, and the world\'s most remote destinations.' },
      { title: 'Virtuoso Benefit', description: '$300 shipboard credit and exclusive Scenic Helicopter flight.' },
      { title: 'Infinity Pool', description: 'Heated infinity pool with panoramic sea views.' },
    ],
    ships: [
      { name: 'Scenic Eclipse', description: 'World\'s first discovery yacht, 228 guests, submarine onboard.', image: '/media/cruises/scenic/Scenic-Eclipse-Antarctica-On-the-Ice---Emperor-hero-2000.jpg' },
      { name: 'Scenic Eclipse II', image: '/media/cruises/scenic/scenic-eclipse-ii.jpg', description: 'Sister ship launched 2023.' },
    ],
    slider_images: [
      '/media/cruises/scenic/Scenic-Eclipse-Antarctica-On-the-Ice---Emperor-hero-2000.jpg',
      '/media/cruises/scenic/Scenic-Eclipse-Antarctica-featured.jpg',
      '/media/cruises/scenic/Scenic-Eclipse---Senses-Spa--video-content.jpg',
      '/media/cruises/scenic/Scenic-Eclipse-Antarctica---Devil-Island-Zodiac-video-banner.jpg',
      '/media/cruises/scenic/scenic-antarctica-1500.jpg',
      '/media/cruises/scenic/scenic-antarctica-zodiak-1500.jpg',
      '/media/cruises/scenic/scenic-chopper-1080x1350.jpg',
      '/media/cruises/scenic/scenic-dining--1500.jpg',
      '/media/cruises/scenic/scenic-river-suite-couple-1500.jpg',
      '/media/cruises/scenic/scenic-spa-1500.jpg',
      '/media/cruises/scenic/scenic-sub-1500.jpg',
    ],
    sort_order: 17,
  },
  {
    id: '18', name: 'Crystal Cruises', slug: 'crystal',
    intro: {
      eyebrow: 'Crystal',
      heading: 'The legend, reborn',
      body: 'Crystal returns as one of the most awarded names in luxury cruising — reborn with Crystal Symphony and Crystal Serenity, refined and reimagined. Butler service comes with every suite, the fare is all-inclusive, and Umi Uma remains the only Nobu Matsuhisa restaurant at sea. It is the legendary Crystal service, carried into a new era.',
    },
    destinations: [
      { name: 'The Mediterranean', blurb: 'Santorini\'s caldera, the Riviera, and the Adriatic — the classic luxury circuit, sailed at an intimate ship\'s pace.', image_url: '/media/cruises/crystal/crystal-santorini-yachting.jpg' },
    ],
    experiences: [
      { title: 'Umi Uma by Nobu', blurb: 'The only Nobu restaurant at sea — Nobu Matsuhisa\'s celebrated Japanese-Peruvian cuisine, served across the voyage.', image_url: '/media/cruises/crystal/voyage-onboardexp-2.png' },
      { title: 'Open-Air Dining', blurb: 'Sea-facing terraces and casual all-day venues where the meal follows the light and the coastline.', image_url: '/media/cruises/crystal-cruises/crystal-cruises-gallery-2.png' },
      { title: 'The Crystal Life', blurb: 'Champagne welcomes, white-glove service, and a high space-to-guest ratio — the unhurried, celebrated way of a Crystal voyage.', image_url: '/media/cruises/crystal/world-cruise-welcome-celebration-champagne.jpg' },
    ],
    suites: [
      { name: 'Suite Living', blurb: 'Residential living spaces with sea-view balconies, finished in a warm, contemporary palette — butler service in every category.', image_url: '/media/cruises/crystal-cruises/crystal-cruises-gallery-6.jpg' },
      { name: 'The Bedroom', blurb: 'Calm, light-filled bedrooms with rich textiles and a private terrace beyond the glass.', image_url: '/media/cruises/crystal-cruises/crystal-cruises-gallery-5.jpg' },
      { name: 'Marble Baths', blurb: 'Spa-like marble bathrooms — a quiet luxury that defined Crystal\'s reputation and survives its rebirth.', image_url: '/media/cruises/crystal-cruises/crystal-cruises-gallery-7.png' },
    ],
    sample_journeys: [
      { name: 'The Mediterranean', nights: '9 nights', route: 'Athens · the Greek Isles · Sicily · the Amalfi Coast · Rome', blurb: 'The classic luxury circuit, Umi Uma and butler service throughout.' },
      { name: 'Northern Europe', nights: '12 nights', route: 'Copenhagen · the Baltic capitals · the Norwegian Fjords', blurb: 'Long northern light along dramatic coasts, all-inclusive and unhurried.' },
      { name: 'The World Cruise', nights: 'Segments available', route: 'Continent to continent across a single grand voyage', blurb: 'The grand tradition Crystal is known for, bookable in segments.' },
    ],
    logo_url: '/media/cruises/crystal/crystal_cruises-black-600.png',
    logo_url_white: '/media/cruises/crystal/crystal_cruises-white-600.png',
    hero_image_url: '/media/cruises/crystal-cruises/crystal-cruises-gallery-1.png',
    tagline: 'Ultra Luxury Cruises Worldwide — redefining luxury at sea.',
    description: 'Crystal Cruises returns as the world\'s most awarded luxury cruise line — reborn with Crystal Symphony and plans for an expanded fleet. Guests experience all-inclusive luxury, Nobu at Sea, and the legendary Crystal service that earned decades of awards.',
    cruise_types: ['ocean', 'river', 'yacht'],
    highlights: [
      { title: 'Nobu at Sea', description: 'Exclusive Nobu Restaurant partnership — Michelin-quality omakase at sea.' },
      { title: 'All-Inclusive', description: 'Dining, beverages, butler service, Wi-Fi, and gratuities included.' },
      { title: 'Crystal Society', description: 'Loyalty programme with exclusive benefits and upgrades.' },
      { title: 'Creative Learning Institute', description: 'Masterclasses with leading artists, chefs, musicians, and thinkers.' },
      { title: 'Virtuoso Benefit', description: '$300 shipboard credit and complimentary specialty dining evening.' },
      { title: 'Crystal Esprit', description: 'Ultra-intimate 62-guest superyacht for exclusive anchorages.' },
    ],
    ships: [
      { name: 'Crystal Symphony', description: 'Reborn ultra-luxury icon.', image: '/media/cruises/crystal-cruises/crystal-symphony.png' },
      { name: 'Crystal Serenity', description: 'Re-imagined for world voyages.', image: '/media/cruises/crystal-cruises/crystal-serenity.png' },
      { name: 'Crystal Grace', description: 'First newbuild in ~25 years, ~650 guests — debuts May 2028.', image: '/media/cruises/crystal-cruises/crystal-grace.png' }
    ],
    slider_images: [
      '/media/cruises/crystal-cruises/crystal-cruises-gallery-2.png',
      '/media/cruises/crystal-cruises/crystal-cruises-gallery-3.png',
      '/media/cruises/crystal-cruises/crystal-cruises-gallery-4.jpg',
      '/media/cruises/crystal-cruises/crystal-cruises-gallery-5.jpg',
      '/media/cruises/crystal-cruises/crystal-cruises-gallery-6.jpg',
      '/media/cruises/crystal-cruises/crystal-cruises-gallery-7.png',
      '/media/cruises/crystal-cruises/crystal-cruises-gallery-8.png',
      '/media/cruises/crystal-cruises/crystal-cruises-gallery-9.webp',
      '/media/cruises/crystal-cruises/crystal-cruises-gallery-10.png',
      '/media/cruises/crystal-cruises/serenity-hero.png',
      '/media/cruises/crystal-cruises/symphony-hero.png',
      '/media/cruises/crystal-cruises/crystal-symphony.png',
      '/media/cruises/crystal-cruises/crystal-serenity.png',
      '/media/cruises/crystal-cruises/crystal-grace.png',
    ],
    sort_order: 18,
  },
  {
    id: '19', name: 'Viking', slug: 'viking',
    intro: {
      eyebrow: 'Viking',
      heading: 'Exploring the world in comfort',
      body: 'Viking is the destination-focused, small-ship line for thinking travellers — number one on the rivers, and now top-rated on the ocean and in expedition too. Adults-only, with no casinos and no nickel-and-diming, every voyage includes a shore excursion in each port. The signature Aquavit Terrace opens the bow to the passing landscape, and a Nordic spa waits below. Less spectacle, more place.',
    },
    destinations: [
      { name: 'The Rhine', blurb: 'Castles, vineyards, and storybook towns along the Rhine Gorge, the Aquavit Terrace open to the passing banks.', image_url: '/media/cruises/viking/Viking_Longship_hero.jpg' },
      { name: 'The Danube', blurb: 'Budapest, Vienna, and the Wachau Valley — the great river capitals of Central Europe at the water\'s edge.', image_url: '/media/cruises/viking/featured-image-Viking.jpg' },
      { name: 'The Seine & Paris', blurb: 'From the heart of Paris to the beaches of Normandy, the Seine winding past Monet\'s gardens and medieval towns.', image_url: '/media/cruises/viking/viking-longship.jpg' },
      { name: 'Egypt & the Nile', blurb: 'The temples of the pharaohs and the Valley of the Kings, sailed aboard Viking\'s own ships on the Nile.', image_url: '/media/cruises/viking/egypt-sphinx.jpg' },
    ],
    experiences: [
      { title: 'Included, In Every Port', blurb: 'A guided excursion comes with every stop, alongside privileged cultural access and enrichment lectures — the destination is the point.', image_url: '/media/cruises/viking/swiss-alps.jpg' },
    ],
    sample_journeys: [
      { name: 'Rhine Getaway', nights: '7 nights', route: 'Amsterdam · Kinderdijk · Cologne · the Rhine Gorge · Basel', blurb: 'The classic Rhine, castle to castle through four countries.' },
      { name: 'Danube Waltz', nights: '7 nights', route: 'Budapest · Vienna · the Wachau Valley · Passau · Regensburg', blurb: 'The river capitals of Central Europe, with an evening in Vienna.' },
      { name: 'Paris & Normandy', nights: '7 nights', route: 'Paris · Vernon (Giverny) · Rouen · the D-Day beaches', blurb: 'The Seine from the Eiffel Tower to the beaches of Normandy.' },
      { name: 'Pharaohs & Pyramids', nights: '11 nights', route: 'Cairo · Luxor · the Valley of the Kings · Aswan', blurb: 'Egypt by land and by Nile aboard Viking\'s own river ships.' },
    ],
    logo_url: '/media/cruises/viking/viking-cruises-black.png',
    logo_url_white: '/media/cruises/viking/viking-cruises_white@3x.png',
    hero_image_url: '/media/cruises/viking/Viking_Longship_hero.jpg',
    tagline: 'Exploring the world in comfort.',
    description: 'Viking is the world\'s leading small-ship travel company — number one for river cruising, and now top-rated for ocean and expedition. Adults-only, no casinos — Viking delivers destination-focused voyages with included shore excursions and cultural immersion.',
    cruise_types: ['river', 'ocean'],
    highlights: [
      { title: 'No. 1 River Cruise Line', description: 'World\'s leading river cruise line — Europe, Egypt, Asia, and beyond.' },
      { title: 'Adults-Only Policy', description: 'No children, no casinos — a refined, distraction-free voyage.' },
      { title: 'Included Shore Excursions', description: 'Guided tours in every port included in every fare.' },
      { title: 'Viking Longships', description: 'Most innovative river ships ever built — panoramic glass, aquavit terrace.' },
      { title: 'Virtuoso Benefit', description: '$300 onboard credit and free shore excursion upgrade.' },
      { title: 'Polar Expeditions', description: 'New Viking polar ships for the ends of the earth.' },
    ],
    ships: [
      { name: 'Viking Polaris', description: 'First Viking expedition ship, 378 guests.', image: '/media/cruises/viking/Viking_Longship_hero.jpg' },
      { name: 'Viking Vela', image: '/media/cruises/viking/viking-vela.jpg', description: 'New ocean ship, 930 guests, 2024.' },
      { name: 'Viking Vesta', description: 'Newest ocean ship, ~998 guests — delivered 2025.' /* TODO: add image */ },
      { name: 'Viking Mira', description: 'Ocean ship — debuts 2026.' /* TODO: add image */ },
      { name: 'Viking Star', image: '/media/cruises/viking/viking-star.jpg', description: '930 guests, global itineraries.' },
      { name: 'Viking Longship', image: '/media/cruises/viking/viking-longship.jpg', description: 'Iconic river ship class, 300+ European voyages.' },
    ],
    slider_images: [
      '/media/cruises/viking/Viking_Longship_hero.jpg',
      '/media/cruises/viking/egypt-sphinx.jpg',
      '/media/cruises/viking/swiss-alps.jpg',
      '/media/cruises/viking/featured-image-Viking.jpg',
    ],
    sort_order: 19,
  },
  // ── River ───────────────────────────────────────────────────────────────────
  {
    id: '20', name: 'AmaWaterways', slug: 'amawaterways',
    intro: {
      eyebrow: 'AmaWaterways',
      heading: 'The most awarded river cruise line',
      body: 'Named the World\'s Best River Cruise Line for more than a decade, AmaWaterways pairs twin-balcony staterooms with an active, wellness-minded way of sailing — guided bike tours and hikes in every port, a wellness host aboard, and the double-width flagship AmaMagna with four restaurants. The Chef\'s Table specialty dinner and regional wine pairings make the table as much a destination as the river.',
    },
    destinations: [
      { name: 'The Danube & the Wachau', blurb: 'Vienna, the blue church of Dürnstein, and terraced vineyards along the Wachau\'s great river bend.', image_url: '/media/cruises/ama-waterways/amawaterways-amamagna-explore-1500.jpg' },
      { name: 'The Douro & Porto', blurb: 'Portugal\'s wine river — port lodges, quinta estates, and the tiled old town of Porto above the water.', image_url: '/media/cruises/ama-waterways/amawaterways-amamagna-porto-1500.jpg' },
      { name: 'The Christmas Markets', blurb: 'The Danube and Rhine in December — twinkling market squares, mulled wine, and the festive heart of Europe.', image_url: '/media/cruises/ama-waterways/amawaterways-amamagna-xmas_market-1500.jpg' },
    ],
    experiences: [
      { title: 'Wine & the Chef\'s Table', blurb: 'Regional menus paired with local wines, and the Chef\'s Table specialty restaurant — AmaWaterways is a member of La Chaîne des Rôtisseurs.', image_url: '/media/cruises/ama-waterways/amawaterways-amamagna-wine_dinner-1500.jpg' },
      { title: 'The Sun Deck & Pool', blurb: 'A heated sun-deck pool and whirlpool, the vineyards and castles of the riverbank drifting past at eye level.', image_url: '/media/cruises/ama-waterways/amawaterways-amamagna-pool-1500.jpg' },
      { title: 'Cycle the Riverbanks', blurb: 'A fleet of bikes and guided hikes in every port — the active way to see the river, included in the fare.', image_url: '/media/cruises/ama-waterways/amawaterways-amamagna-bike-1500.jpg' },
    ],
    suites: [
      { name: 'Twin-Balcony Staterooms', blurb: 'The signature design — a French balcony and a full outside balcony in the same stateroom, opening the room to the river.', image_url: '/media/cruises/ama-waterways/amawaterways-amamagna-bed-1500.jpg' },
      { name: 'Spa-Style Baths', blurb: 'Light, modern bathrooms with twin sinks and a tub — among the most generous on Europe\'s rivers.', image_url: '/media/cruises/ama-waterways/amawaterways-amamagna-bath-1500.jpg' },
    ],
    sample_journeys: [
      { name: 'The Danube', nights: '7 nights', route: 'Vilshofen · Passau · Vienna · the Wachau Valley · Budapest', blurb: 'The classic Blue Danube, with biking and hiking in every port.' },
      { name: 'The Rhine', nights: '7 nights', route: 'Amsterdam · Cologne · the Rhine Gorge · Strasbourg · Basel', blurb: 'Castles and vineyards from the Netherlands to Switzerland.' },
      { name: 'The Douro', nights: '7 nights', route: 'Porto · the Douro Valley · Salamanca · Pinhão', blurb: 'Portugal\'s wine country, quinta to quinta along the terraced river.' },
    ],
    logo_url: '/media/cruises/ama-waterways/ama-waterways_540-black.png',
    logo_url_white: '/assets/supplier logos/white transparent/cruise/amaWaterways-white-600.png',
    hero_image_url: '/media/cruises/ama-waterways/amawaterways-amamagna-hero-2200.jpg',
    tagline: 'The most award-winning river cruise line in the world.',
    description: 'AmaWaterways has been named World\'s Best River Cruise Line by Travel + Leisure for more than a decade. Twin-balcony staterooms, wellness programmes, and included excursions set AmaWaterways apart on Europe\'s most iconic rivers.',
    cruise_types: ['river'],
    highlights: [
      { title: 'Award-Winning Fleet', description: 'World\'s Best River Cruise Line — Travel + Leisure, 10+ years.' },
      { title: 'Twin Balcony Staterooms', description: 'French balcony AND full outside balcony — signature AmaWaterways innovation.' },
      { title: 'Included Shore Excursions', description: 'Guided tours at every port included.' },
      { title: 'Wellness Programme', description: 'Fitness, hiking, and wellness activities every sailing.' },
      { title: 'AmaMagna', description: 'Twice the width of a traditional river ship — four restaurants.' },
      { title: 'Fine Dining', description: 'Multi-course regional dinners paired with local wines nightly.' },
    ],
    ships: [
      { name: 'AmaMagna', description: 'Revolutionary wide-beam river ship.', image: '/media/cruises/ama-waterways/amawaterways-amamagna-hero-2200.jpg' },
      { name: 'AmaKristina', image: '/media/cruises/ama-waterways/amakristina.jpg', description: '158 guests, European rivers.' },
      { name: 'AmaSiena', description: 'Rhine, Moselle, and Danube.' },
      { name: 'AmaLea', description: 'Italy\'s Po River and beyond.' },
      { name: 'AmaSofia', description: 'New for 2026 — European rivers.' /* TODO: add image */ },
      { name: 'AmaKaia', description: 'New for 2026 — Mekong River.' /* TODO: add image */ },
    ],
    slider_images: [
      '/media/cruises/ama-waterways/amawaterways-amamagna-hero-2200.jpg',
      '/media/cruises/ama-waterways/amawaterways-amamagna-video_content-1500.jpg',
      '/media/cruises/ama-waterways/Hero_HomePage_Couple_Deck-amawaterways-featured-1200x628.jpg',
      '/media/cruises/ama-waterways/amawaterways-amamagna-explore-1500.jpg',
      '/media/cruises/ama-waterways/amawaterways-amamagna-library-1500.jpg',
      '/media/cruises/ama-waterways/amawaterways-amamagna-wine_dinner-1500.jpg',
      '/media/cruises/ama-waterways/amawaterways-amamagna-pool-1500.jpg',
      '/media/cruises/ama-waterways/amawaterways-amamagna-porto-1500.jpg',
      '/media/cruises/ama-waterways/amawaterways-amamagna-winery-1500.jpg',
    ],
    sort_order: 20,
  },
  {
    id: '21', name: 'Uniworld', slug: 'uniworld',
    intro: {
      eyebrow: 'Uniworld',
      heading: 'The world\'s most awarded river cruise line',
      body: 'Uniworld\'s boutique Super Ships are floating works of art — no two alike, each filled with antiques, original paintings, and one-of-a-kind interiors inspired by the great châteaux and palaces of Europe. Pricing is 100% all-inclusive, from excursions and gratuities to premium spirits, and the staff-to-guest ratio is the highest on the rivers. Lavish, intimate, and unmistakably designed.',
    },
    experiences: [
      { title: 'Floating Boutique Hotels', blurb: 'Hand-curated interiors — Parisian Art Deco on one ship, Baroque opulence on another — filled with antiques and original art.', image_url: '/media/cruises/uniworld/joie-de-vivre.jpg' },
      { title: 'The Lounges & Bars', blurb: 'Jewel-box lounges and bars where the 100%-inclusive spirit shows — premium pours, fine detail, and the highest staff-to-guest ratio afloat.', image_url: '/media/cruises/uniworld/ss-sacy.jpg' },
    ],
    sample_journeys: [
      { name: 'The Danube', nights: '7 nights', route: 'Budapest · Vienna · the Wachau Valley · Passau · Nuremberg', blurb: 'The Blue Danube aboard a one-of-a-kind Super Ship, all-inclusive throughout.' },
      { name: 'The Seine & Paris', nights: '7 nights', route: 'Paris · Vernon (Giverny) · Rouen · Les Andelys', blurb: 'Impressionist France from the heart of Paris to Normandy.' },
      { name: 'The Douro', nights: '7 nights', route: 'Porto · the Douro Valley · Salamanca · Régua', blurb: 'Portugal\'s terraced wine river, in lavish, all-inclusive comfort.' },
    ],
    logo_url: '/media/cruises/uniworld/uniworld_river_cruises-black-500.png',
    logo_url_white: null,
    hero_image_url: '/media/cruises/uniworld/uniworld-sunset-hero-2000.jpg',
    tagline: 'The World\'s Most Awarded River Cruise Line',
    description: 'Uniworld Boutique River Cruise Collection operates the most lavish river ships in the world — handcrafted floating hotels inspired by the great châteaux of Europe, with 100% all-inclusive pricing and the highest staff-to-guest ratio in river cruising.',
    cruise_types: ['river'],
    highlights: [
      { title: 'Truly All-Inclusive', description: 'Shore excursions, dining, beverages, Wi-Fi, and gratuities included.' },
      { title: 'Handcrafted Interiors', description: 'Every ship a floating masterpiece — genuine antiques and original artworks.' },
      { title: 'Highest Staff-to-Guest Ratio', description: 'More staff per guest than any other river cruise line.' },
      { title: 'Full-Ship Charter', description: 'Private group buyouts available.' },
      { title: 'Virtuoso Benefit', description: '$250 shipboard credit and complimentary room upgrade.' },
      { title: 'Farm-to-Table Dining', description: 'Locally sourced ingredients, regional recipes, Michelin-calibre presentation.' },
    ],
    ships: [
      { name: 'S.S. Maria Theresa', description: 'Baroque glamour on the Danube — most opulent river ship in the world.', image: '/media/cruises/uniworld/uniworld-sunset-hero-2000.jpg' },
      { name: 'S.S. Joie de Vivre', image: '/media/cruises/uniworld/joie-de-vivre.jpg', description: 'Parisian chic on the Seine.' },
      { name: 'River Beatrice', image: '/media/cruises/uniworld/river-beatrice.jpg', description: 'Italian elegance on the Po.' },
      { name: 'S.S. Sacy', image: '/media/cruises/uniworld/ss-sacy.jpg', description: 'Luxury Nile immersion.' },
      { name: 'S.S. Emilie', description: 'Newest Super Ship — debuts 2026.' /* TODO: add image */ },
    ],
    slider_images: [
      '/media/cruises/uniworld/uniworld-sunset-hero-2000.jpg',
      '/media/cruises/uniworld/uniworld-video-content.jpg',
    ],
    sort_order: 21,
  },
  // ── Yacht ────────────────────────────────────────────────────────────────────
  {
    id: '22', name: 'Four Seasons Yachts', slug: 'four-seasons-yachts',
    logo_url: '/media/hotel-programs/logos/four-seasons-preferred-partner.png',
    logo_url_white: '/assets/supplier logos/white transparent/cruise/FourSeasons_Yacht-white-600.png',
    hero_image_url: '/media/cruises/four_seasons_yacht/YCT_207_aspect16x9.jpg',
    tagline: 'A New Category of Yachting',
    description: 'Four Seasons Yachts brings the legendary Four Seasons experience to the sea — a new category of modern yachting built on openness, residential-style living, and a near 1:1 staff-to-guest ratio. Two intimate, all-suite yachts, eleven restaurants and lounges, and the L\'Oceana Spa, sailing the Mediterranean, the Dalmatian Coast, and the Grand Caribbean.',
    cruise_types: ['yacht'],
    highlights: [],
    intro: {
      eyebrow: 'Four Seasons Yachts',
      heading: 'The Four Seasons, now at sea',
      body: 'For decades Four Seasons has defined what service can be on land. At sea, that philosophy becomes something new — modern yachting built on openness, fluidity, and refined living. Two intimate, all-suite yachts carry just a few hundred guests apiece with a near 1:1 staff-to-guest ratio; every suite is residential in scale, with floor-to-ceiling windows and expansive ocean-facing terraces. Eleven restaurants and lounges, the L\'Oceana Spa, and a retractable marina turn each voyage into a private Four Seasons that moves with the water.',
    },
    destinations: [
      { name: 'The Mediterranean', blurb: 'From the Riviera to storied Alexandria, the yachts trace the Mediterranean\'s most celebrated coastlines — gliding into shallow harbours and turquoise lagoons that larger ships can never reach, with shore experiences shaped entirely around you.', image_url: '/media/cruises/four_seasons_yacht/YCT_208_aspect16x9.jpg' },
      { name: 'The Grand Caribbean', blurb: 'A newly added region for the fleet — Saint Barths, Antigua, and the Grenadines, sailed at a pace that favours private islands and quiet anchorages over crowded ports.', image_url: '/media/cruises/four_seasons_yacht/YCT_210_aspect16x9.jpg' },
    ],
    experiences: [
      { title: 'Eleven Restaurants & Lounges', blurb: 'A Chef-in-Residence program and eleven distinct venues — from refined formal dining to relaxed sea-facing tables — built on local ingredients and seasonal inspiration, fully included.', image_url: '/media/cruises/four_seasons_yacht/FS1_Dk_06_-_Sedna_-_Formal_dinning_interior_2025-02-24.webp' },
      { title: 'Bar O & Onassis', blurb: 'Signature bars and lounges where the evening unfolds slowly — considered cocktails, an extensive cellar, and the easy sophistication that defines every Four Seasons.', image_url: '/media/cruises/four_seasons_yacht/FS1_Dk_06_Bar_O_Onassis_2025-02-24.webp' },
      { title: 'Champagne & Caviar', blurb: 'An onboard ritual — champagne and caviar service, taken on deck as the coastline slips past, in the unmistakable Four Seasons key.', image_url: '/media/cruises/four_seasons_yacht/FS1_Dk_06_Champagne_and_Caviar_2025-02-24.webp' },
      { title: 'Residential Living at Sea', blurb: 'Every accommodation is a suite, residential in scale — including the Yacht Residential Suites, the largest at sea, with up to four bedrooms, private terraces, and well-appointed kitchens.', image_url: '/media/cruises/four_seasons_yacht/04LEzxMLQmGtbmeDC8fS3Q-hHai7GvkTA-I4XxHg74DHQ-FSY_Loft-Suite_Livingroom-2-copy.webp' },
      { title: 'The Pool Deck & Horizon', blurb: 'Seamless indoor-outdoor decks, a horizon pool, and the L\'Oceana Spa\'s Five Elements of Vitality — wellness and open water, never more than a few steps apart.', image_url: '/media/cruises/four_seasons_yacht/FS1_Dk_11_Horizon_View2_02.2025.webp' },
    ],
    sample_journeys: [
      { name: 'The Dalmatian Coast', nights: '7 nights', route: 'Dubrovnik · Korčula · Hvar · Split · Kotor', blurb: 'Adriatic island-hopping between walled cities and hidden coves, anchored each evening within reach of dinner ashore.' },
      { name: 'The Grand Caribbean', nights: '7 nights', route: 'San Juan · Saint Barths · Antigua · the Grenadines · Tortola', blurb: 'Private beaches and turquoise anchorages, with the retractable marina turning each stop into your own watersports club.' },
      { name: 'Egypt & the Eastern Mediterranean', nights: '10 nights', route: 'Athens · the Cyclades · Alexandria · the North Coast · Limassol', blurb: 'Storied coastlines and turquoise lagoons, with private shore experiences and local-chef interactions ashore.' },
    ],
    ships: [
      { name: 'Four Seasons I', description: '95 residential all-suite accommodations with floor-to-ceiling windows and ocean-facing terraces — the inaugural Four Seasons yacht, maiden voyage 2026.', image: '/media/cruises/four_seasons_yacht/YCT_207_aspect16x9.jpg' },
      { name: 'Four Seasons II', description: '79 suites including 12 Yacht Residential Suites — the largest at sea, with up to four bedrooms, ample terraces, and well-appointed kitchens.', image: '/media/cruises/four_seasons_yacht/FSY_YachtExterior_sideview.webp' },
    ],
    slider_images: [
      '/media/cruises/four_seasons_yacht/YCT_207_aspect16x9.jpg',
      '/media/cruises/four_seasons_yacht/YCT_208_aspect16x9.jpg',
      '/media/cruises/four_seasons_yacht/FS1_Dk_06_-_Sedna_-_Formal_dinning_interior_2025-02-24.webp',
      '/media/cruises/four_seasons_yacht/FS1_Dk_05_-_Pistachio_version_1_02.2025.webp',
      '/media/cruises/four_seasons_yacht/04LEzxMLQmGtbmeDC8fS3Q-hHai7GvkTA-I4XxHg74DHQ-FSY_Loft-Suite_Livingroom-2-copy.webp',
      '/media/cruises/four_seasons_yacht/YCT_210_aspect16x9.jpg',
    ],
    sort_order: 22,
  },
  {
    id: '23', name: 'Virgin Voyages', slug: 'virgin-voyages',
    intro: {
      eyebrow: 'Virgin Voyages',
      heading: 'An epic sea change for all',
      body: 'Richard Branson\'s adults-only line threw out the cruise rulebook — no buffets, no formal nights, no kids, and no surcharges on the twenty-plus eateries, all included in the fare. In their place: a two-deck nightclub called The Manor, a wellness deck with a boxing ring and daily classes, and a tattoo parlour. Bold, design-led, and unmistakably Virgin.',
    },
    destinations: [
      { name: 'The Caribbean', blurb: 'Beach clubs and turquoise water from Miami — including Virgin\'s own Beach Club at Bimini, a day of music and sand.', image_url: '/media/cruises/virgin-voyages/IMG-DEST-costa-maya-mahahual-beach-sunset-v1-01-913747024-1092x1024.jpg' },
    ],
    experiences: [
      { title: 'Twenty-Plus Eateries, None Extra', blurb: 'From the tasting-menu Test Kitchen to Mexican, Korean BBQ, and Italian — every restaurant is included, with not a buffet in sight.', image_url: '/media/cruises/virgin-voyages/IMG-Voyages-TK-Scallops-900.jpg' },
      { title: 'The Manor', blurb: 'A two-deck nightclub at the heart of the ship — live music, late nights, and the Scarlet Night party out on deck.', image_url: '/media/cruises/virgin-voyages/RDR-FNB-the-manor-v1-03-1600x900.jpg' },
      { title: 'The Dock', blurb: 'A teak deck and Mediterranean-style lounge at the stern, with daybeds, mezze, and the sea at eye level.', image_url: '/media/cruises/virgin-voyages/RDR-FNB-The-Dock-bar-deck-roman-and-williams-v1-02-1600x900.jpg' },
      { title: 'Wellness, Reimagined', blurb: 'An outdoor athletic club with a boxing ring, a full gym, and daily yoga and fitness classes — all included.', image_url: '/media/cruises/virgin-voyages/IMG-WELL-yoga-ladies-1000x1000.jpg' },
    ],
    suites: [
      { name: 'Sea Terrace Cabins', blurb: 'Design-forward cabins with a hammock-strung terrace, mood lighting, and a runway-red palette — Virgin\'s take on the balcony stateroom.', image_url: '/media/cruises/virgin-voyages/IMG-CAB-Sea-Terrace-1092x1024.jpeg' },
      { name: 'RockStar Quarters', blurb: 'The suite tier — bigger terraces, a stocked bar, and a RockStar Agent to handle every request from bookings to bubbly.', image_url: '/media/cruises/virgin-voyages/RDR-STE-massive-suite-day-v02-04-1000x1000.jpg' },
    ],
    sample_journeys: [
      { name: 'The Caribbean', nights: '5 nights', route: 'Miami · Bimini Beach Club · Puerto Plata · Virgin\'s private night', blurb: 'Beach clubs, late nights, and all dining included, round-trip from Miami.' },
      { name: 'The Mediterranean', nights: '7 nights', route: 'Barcelona · Marseille · the Riviera · Ibiza', blurb: 'Design-led sailing through the western Med, with Ibiza after dark.' },
      { name: 'The Greek Isles', nights: '7 nights', route: 'Athens · Mykonos · Santorini · the Cyclades', blurb: 'The Aegean for adults — island days and Scarlet Nights.' },
    ],
    logo_url: '/media/cruises/virgin-voyages/virgin-voyages-600.png',
    logo_url_white: '/media/cruises/virgin-voyages/virgin-voyages-600.png',
    hero_image_url: '/media/cruises/virgin-voyages/IMG-DEST-costa-maya-mahahual-beach-sunset-v1-01-913747024-1092x1024.jpg',
    tagline: 'An Epic Sea Change For All',
    description: 'Virgin Voyages is Richard Branson\'s adults-only cruise line — bold, rebellious, and surprisingly luxurious. No buffets, no formal nights, no kids. Instead: 20+ restaurants, all dining included in every fare.',
    cruise_types: ['ocean'],
    highlights: [
      { title: 'Adults Only', description: 'No children — a social, sophisticated atmosphere exclusively for adults.' },
      { title: 'All Dining Included', description: '20+ eateries including Thomas Keller\'s Kith/Kin — all included.' },
      { title: 'The Perks', description: 'Wi-Fi, fitness classes, and basic beverages included in every cabin.' },
      { title: 'Beach Club Bimini', description: 'Richard\'s exclusive private island in the Bahamas.' },
      { title: 'Virtuoso Benefit', description: '$200 bar tab and complimentary spa treatment.' },
      { title: 'Bold Ship Design', description: 'Designed by world-leading architects — no traditional cruise aesthetic.' },
    ],
    ships: [
      { name: 'Scarlet Lady', description: '2,770 guests, Caribbean flagship.', image: '/media/cruises/virgin-voyages/scarlet lady-2252x1266.avif' },
      { name: 'Valiant Lady', image: '/media/cruises/virgin-voyages/Valiant lady-2252x1266.avif', description: 'Mediterranean and Transatlantic.' },
      { name: 'Resilient Lady', image: '/media/cruises/virgin-voyages/Resilient lady-2252x1266.avif', description: 'Greek Isles and Europe.' },
      { name: 'Brilliant Lady', image: '/media/cruises/virgin-voyages/Brilliant lady-2252x1266.avif', description: 'Fourth and final ship, launched 2025 — US East Coast and Alaska.' },
    ],
    slider_images: [
      '/media/cruises/virgin-voyages/IMG-DEST-costa-maya-mahahual-beach-sunset-v1-01-913747024-1092x1024.jpg',
      '/media/cruises/virgin-voyages/IMG-CAB-Sea-Terrace-1092x1024.jpeg',
      '/media/cruises/virgin-voyages/IMG-FNB-Razzle-Dazzle-Girls-1600x700.jpg',
      '/media/cruises/virgin-voyages/IMG-WELL-yoga-ladies-1000x1000.jpg',
      '/media/cruises/virgin-voyages/RDR-SHIP-exterior-scarlet-lady-v1-01-1600x900.jpg',
      '/media/cruises/virgin-voyages/RDR-FNB-The-Dock-bar-deck-roman-and-williams-v1-02-1600x900.jpg',
      '/media/cruises/virgin-voyages/RDR-FNB-the-manor-v1-03-1600x900.jpg',
      '/media/cruises/virgin-voyages/RDR-STE-cheeky-corner-suite-day-v6-04-1600x900.jpg',
      '/media/cruises/virgin-voyages/RDR-WELL-aquatic-club-deck-15-v1-01-1600x900.jpg',
      '/media/cruises/virgin-voyages/RDR_SHIP-exterior-transom-v1-01-1600x900.jpg',
    ],
    sort_order: 23,
  },
  {
    id: '24', name: 'Windstar Cruises', slug: 'windstar',
    logo_url: '/assets/supplier logos/jpg/Windstar-black.png',
    logo_url_white: null,
    hero_image_url: '/media/cruises/windstar/star-legend.jpg',   // TODO: source a proper Windstar hero (wide scenic)
    tagline: '180° from ordinary.',
    description: 'Windstar Cruises operates intimate sailing yachts and small motor yachts that anchor in harbours where larger ships cannot go. With 148–342 guests, Windstar delivers a personal, adventure-rich sailing experience across the Mediterranean, Caribbean, and Arctic.',
    cruise_types: ['yacht', 'ocean'],
    intro: {
      eyebrow: 'Windstar Cruises',
      heading: '180 degrees from ordinary',
      body: 'Windstar sails small — intimate sailing yachts and Star-class motor yachts carrying just 148 to 342 guests, into the hidden harbours and quiet coves the big ships sail right past. The original sailing yachts, led by the five-masted Wind Surf, run on canvas and the wind; an open-bridge policy means you\'re welcome to watch the sails set or learn to steer. Casual by day, refined by night — yachting without the formality.',
    },
    sample_journeys: [
      { name: 'The Greek Isles & Turkey', nights: '7 nights', route: 'Athens · Mykonos · Kusadasi · Santorini · Nafplion', blurb: 'Late-night sailaways from small Aegean harbours, with the sails set against the islands.' },
      { name: 'Windward Islands', nights: '7 nights', route: 'Barbados · St Lucia · the Grenadines · Martinique · Dominica', blurb: 'Trade-wind Caribbean sailing into coves and beach anchorages off the larger ships\' map.' },
      { name: 'Tahiti & the Society Islands', nights: '7 nights', route: 'Papeete · Moorea · Taha\'a · Bora Bora · Raiatea', blurb: 'French Polynesia aboard an intimate yacht, with watersports off the marina platform.' },
    ],
    highlights: [
      { title: 'Sailing Yachts', description: 'Original sailing yachts — Wind Star, Wind Spirit, and 5-masted flagship Wind Surf.' },
      { title: 'Star-Class Motor Yachts', description: 'Three Star-class yachts for expanded capacity and new itineraries.' },
      { title: 'All In Fares', description: 'Beverages, Wi-Fi, and tips included option.' },
      { title: 'Unique Port Access', description: 'Anchor in bays and coves unreachable by large ships.' },
      { title: 'Virtuoso Benefit', description: '$150 shipboard credit and complimentary water sports day.' },
      { title: 'Open Bridge Policy', description: 'Guests welcome to visit the bridge and learn to sail.' },
    ],
    ships: [
      { name: 'Wind Surf', description: '342 guests, 5-masted flagship sailing yacht.' /* TODO: add image */ },
      { name: 'Wind Star', image: '/media/cruises/windstar/wind-star.jpg', description: '148 guests, iconic four-masted sailing yacht.' },
      { name: 'Wind Spirit', image: '/media/cruises/windstar/wind-spirit.jpg', description: '148 guests, Mediterranean and Caribbean.' },
      { name: 'Star Breeze', image: '/media/cruises/windstar/star-breeze.jpg', description: '312 guests, Star Plus motor yacht.' },
      { name: 'Star Legend', image: '/media/cruises/windstar/star-legend.jpg', description: '312 guests, Arctic and Caribbean.' },
      { name: 'Star Pride', description: '312 guests, Star Plus motor yacht.' /* TODO: add image */ },
      { name: 'Star Seeker', description: 'First newbuild in ~30 years — 112 all-suite, ice-capable. Debuts 2026.' /* TODO: add image */ },
      { name: 'Star Explorer', description: 'All-suite newbuild — debuts December 2026.' /* TODO: add image */ },
    ],
    slider_images: [
      '/media/cruises/windstar/star-legend.jpg',   // TODO: source proper Windstar slider images
    ],
    sort_order: 24,
  },
  {
    id: '28', name: 'Explora Journeys', slug: 'explora-journeys',
    logo_url: '/media/cruises/explora/explora-logo.png',
    logo_url_white: null,
    hero_image_url: '/media/cruises/explora/explora-hero.jpg',
    tagline: 'Ocean travel, redefined',
    description: 'Explora Journeys is the luxury-lifestyle brand of the MSC Group — a new fleet of all-suite, ocean-front ships built around space, calm, and the European art of living well. EXPLORA I and EXPLORA II carry around 900 guests apiece, with multiple pools including an all-weather Conservatory, a wellness spa, and a relaxed, unhurried sense of the sea.',
    cruise_types: ['ocean'],
    highlights: [],
    intro: {
      eyebrow: 'Explora Journeys',
      heading: 'The ocean, in no hurry',
      body: 'Explora Journeys reimagines luxury at sea as something calmer and more spacious — every accommodation an ocean-front suite, every deck designed for lingering rather than queuing. The European art of living well runs through it: multiple pools including an all-weather Conservatory, a generous spa and wellness world, and a fleet that favours longer, more immersive itineraries. Less a cruise than a way of being on the water.',
    },
    destinations: [
      { name: 'The Mediterranean', blurb: 'Dubrovnik, the Adriatic, and the islands of the western Mediterranean, traced on relaxed, immersive itineraries.', image_url: '/media/cruises/explora-journeys/An-Invitation-to-Explora-Med.webp' },
      { name: 'The Amalfi Coast', blurb: 'The cliffside towns and turquoise water of southern Italy, the ship anchored within sight of the pastel facades.', image_url: '/media/cruises/explora-journeys/explora-amalfi.jpg' },
      { name: 'Hidden Coves', blurb: 'Quiet anchorages and lesser-known harbours, the kind of places a calmer, more spacious ship is built to savour.', image_url: '/media/cruises/explora-journeys/explora-cove.jpg' },
    ],
    experiences: [
      { title: 'The Conservatory Pool', blurb: 'An all-weather pool beneath a retractable roof, surrounded by greenery and ocean light — the social heart of the ship in any climate.', image_url: '/media/cruises/explora-journeys/Explora_Conservatory_Pool_Drone_347_MASTER-1.webp' },
    ],
    ships: [
      { name: 'EXPLORA I', description: 'The inaugural ship — around 900 guests, all ocean-front suites, launched 2023.', image: '/media/cruises/explora-journeys/An-Invitation-to-Explora-Med.webp' },
      { name: 'EXPLORA II', description: 'The second ship of the fleet, launched 2024 — all-suite, all ocean-front.', image: '/media/cruises/explora-journeys/explora-amalfi.jpg' },
    ],
    sample_journeys: [
      { name: 'The Mediterranean', nights: '7 nights', route: 'Rome · the Amalfi Coast · Sicily · the Adriatic · Dubrovnik', blurb: 'Southern Italy and the Adriatic at an unhurried, immersive pace.' },
      { name: 'Northern Europe', nights: '10 nights', route: 'Southampton · the Norwegian Fjords · Copenhagen · the Baltic', blurb: 'Long northern light and dramatic coastlines, all-suite throughout.' },
      { name: 'Caribbean & Transatlantic', nights: '14 nights', route: 'Lisbon · the Azores · the Eastern Caribbean', blurb: 'A relaxed crossing into the islands, the sea days as much the point as the ports.' },
    ],
    slider_images: [
      '/media/cruises/explora/explora-hero.jpg',
      '/media/cruises/explora-journeys/explora-amalfi.jpg',
      '/media/cruises/explora-journeys/Explora_Conservatory_Pool_Drone_347_MASTER-1.webp',
      '/media/cruises/explora-journeys/explora-cove.jpg',
    ],
    sort_order: 8,
  },
]

const MOCK_PROGRAM_PROPERTIES: ProgramFeaturedProperty[] = [
  { id: '1', program_slug: 'four-seasons-preferred-partner', name: 'Four Seasons Resort Maui', location: 'Wailea, Hawaii', image_url: '/media/hotel-programs/four-seasons/fs-maui-ocean_suite-3840x2160.jpg', description: 'An oceanfront paradise.', booking_link: null, sort_order: 1 },
  { id: '2', program_slug: 'four-seasons-preferred-partner', name: 'Four Seasons Grand-Hôtel du Cap-Ferrat', location: 'Saint-Jean-Cap-Ferrat, France', image_url: '/media/hero images/four-seasons-CapFerrat-pool-hero.jpg', description: 'A legendary Riviera palace.', booking_link: null, sort_order: 2 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

// cruise_lines is the single source of truth; MOCK is only the offline fallback
// when Supabase env is absent. createServiceClient needs both vars.
const hasSupabase = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY

// ─── Cruise Lines ─────────────────────────────────────────────────────────────

export async function getCruiseLines(cruiseType?: string): Promise<CruiseLine[]> {
  if (!hasSupabase()) {
    return cruiseType
      ? MOCK_CRUISE_LINES.filter(c => c.cruise_types.includes(cruiseType))
      : MOCK_CRUISE_LINES
  }

  try {
    const sb = createServiceClient()
    let query = sb
      .from('cruise_lines')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (cruiseType) query = query.contains('cruise_types', [cruiseType])

    const { data, error } = await query
    if (error || !data || data.length === 0) {
      return cruiseType
        ? MOCK_CRUISE_LINES.filter(c => c.cruise_types.includes(cruiseType))
        : MOCK_CRUISE_LINES
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((r: any) => ({
      ...r,
      highlights: r.highlights ?? [],
      ships: r.ships ?? [],
      slider_images: r.slider_images ?? [],
      cruise_types: r.cruise_types ?? (r.cruise_type ? [r.cruise_type] : []),
      benefits: r.benefits ?? [],
      destinations: r.destinations ?? [],
      experiences: r.experiences ?? [],
      suites: r.suites ?? [],
      sample_journeys: r.sample_journeys ?? [],
    }))
  } catch { return MOCK_CRUISE_LINES }
}

export async function getCruiseLine(slug: string): Promise<CruiseLine | null> {
  if (!hasSupabase()) {
    return MOCK_CRUISE_LINES.find(c => c.slug === slug) ?? null
  }

  try {
    const sb = createServiceClient()
    const { data, error } = await sb
      .from('cruise_lines')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error || !data) return MOCK_CRUISE_LINES.find(c => c.slug === slug) ?? null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = data as any
    return {
      ...r,
      highlights: r.highlights ?? [],
      ships: r.ships ?? [],
      slider_images: r.slider_images ?? [],
      cruise_types: r.cruise_types ?? (r.cruise_type ? [r.cruise_type] : []),
      benefits: r.benefits ?? [],
      destinations: r.destinations ?? [],
      experiences: r.experiences ?? [],
      suites: r.suites ?? [],
      sample_journeys: r.sample_journeys ?? [],
    }
  } catch { return MOCK_CRUISE_LINES.find(c => c.slug === slug) ?? null }
}

export async function getAllCruiseLineSlugs(): Promise<string[]> {
  const lines = await getCruiseLines()
  return lines.map(c => c.slug)
}

// ─── Program Featured Properties ──────────────────────────────────────────────

export async function getProgramFeaturedProperties(programSlug: string): Promise<ProgramFeaturedProperty[]> {
  if (!hasSupabase()) {
    return MOCK_PROGRAM_PROPERTIES.filter(p => p.program_slug === programSlug)
  }

  try {
    const sb = createServiceClient()
    const { data, error } = await sb
      .from('program_featured_properties')
      .select('*')
      .eq('program_slug', programSlug)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error || !data) return []
    return data as ProgramFeaturedProperty[]
  } catch { return [] }
}

// ─── Admin write ────────────────────────────────────────────────────────────────

/**
 * Update a single cruise line's editable fields (logos + client-facing copy).
 * Used by the admin Cruise Lines editor. cruise_lines is the single source of
 * truth, so a change reflects across every tenant site. Service-role only —
 * the caller (an admin API route) must gate on super-admin. Whitelisted fields
 * only, so a stray body key can never touch slug/ships/etc.
 */
export type CruiseLineUpdate = Partial<
  Pick<CruiseLine, 'logo_url' | 'logo_url_white' | 'logo_url_black' | 'tagline' | 'description' | 'hero_image_url'>
>

export async function updateCruiseLine(
  id: string,
  fields: CruiseLineUpdate,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client?: any
) {
  const supabase = client ?? createServiceClient()

  const allowed: (keyof CruiseLineUpdate)[] = [
    'logo_url',
    'logo_url_white',
    'logo_url_black',
    'tagline',
    'description',
    'hero_image_url',
  ]
  const patch: Record<string, unknown> = {}
  for (const k of allowed) {
    if (fields[k] !== undefined) patch[k] = fields[k]
  }
  if (Object.keys(patch).length === 0) return

  const { error } = await supabase.from('cruise_lines').update(patch).eq('id', id)
  if (error) throw error
}
