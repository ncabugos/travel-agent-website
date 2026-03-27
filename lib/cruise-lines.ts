import { createServiceClient } from '@/lib/supabase/service'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CruiseLine {
  id: string
  name: string
  slug: string
  logo_url: string | null
  logo_url_white: string | null   // transparent white version for dark hero
  hero_image_url: string | null
  description: string | null
  tagline: string | null
  cruise_types: string[]          // e.g. ['ocean'] or ['ocean', 'river'] for lines like Viking
  highlights: CruiseHighlight[]
  ships: CruiseShip[]
  slider_images: string[]
  sort_order: number
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
  // ── Ultra-Luxury Ocean ──────────────────────────────────────────────────────
  {
    id: '1', name: 'Regent Seven Seas Cruises', slug: 'regent-seven-seas',
    logo_url: '/media/cruises/regent-seven-seas/regent-black-500.jpg',
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
    logo_url: '/assets/supplier logos/jpg/Silversea-Logo.jpg',
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
      { name: 'Seabourn Sojourn', image: '/media/cruises/seabourn/seabourn-sojourn.jpg', description: '458 guests on worldwide itineraries.' },
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
    logo_url: '/media/cruises/oceania/oceania-cruises-logo-black-600.jpg',
    logo_url_white: null,
    hero_image_url: '/media/cruises/oceania/oceania_cruises-oClass-Grand-Dining-Room-hero.jpg',
    tagline: 'Your world. Your way.',
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
      { name: 'Allura', image: '/media/cruises/oceania/oceania-allura.jpg', description: 'Sister to Vista, launching 2025.' },
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
    logo_url: '/media/cruises/azamara/azamara-logo-black-600.jpg',
    logo_url_white: '/media/cruises/azamara/azamara-logo-white-700.png',
    hero_image_url: '/media/cruises/azamara/azamara-hero-2200.jpg',
    tagline: 'Destination immersion. Enriched voyages.',
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
    logo_url: '/media/cruises/celebrity/Celebrity-Cruises-no-sub-black.png',
    logo_url_white: null,
    hero_image_url: '/media/cruises/celebrity/celebrity-hero-2500.jpg',
    tagline: 'Modern luxury. Bold design. Revolutionary at sea.',
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
      { name: 'Celebrity Xcel', image: '/media/cruises/celebrity/celebrity-ship-1500.jpg', description: 'The highly anticipated fifth Edge Series ship, debuting in 2025.' },
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
    logo_url: '/assets/supplier logos/jpg/Cunard-black.jpg',
    logo_url_white: '/media/cruises/cunard/cunard-logo-white.png',
    hero_image_url: '/media/cruises/cunard/cunard-Grand-Lobby-dark-hero.jpg',
    tagline: 'The most famous ocean liners in the world.',
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
    logo_url: '/assets/supplier logos/jpg/Holland-America-black.jpg',
    logo_url_white: '/media/cruises/holland-america/hal_white-logo-700.png',
    hero_image_url: '/media/cruises/holland-america/hal-hero-2400.jpg',
    tagline: '150 years of seafaring tradition.',
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
    logo_url: '/media/cruises/norwegian/NCL-logo-black.png',
    logo_url_white: '/media/cruises/norwegian/NCL-logo-white.png',
    hero_image_url: '/media/cruises/norwegian/ncl-hawaii-paddleboarding-hero.jpg',
    tagline: 'Freestyle Cruising. No schedules. Just freedom.',
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
    logo_url: '/assets/supplier logos/jpg/Royal-Caribbean-black.jpg',
    logo_url_white: '/media/cruises/royal-caribbean/royal-caribbean-logo-white-700.png',
    hero_image_url: '/media/cruises/royal-caribbean/Hero_UltimateAbyss_Dark.jpg',
    tagline: 'Adventure at sea. Reimagined.',
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
    logo_url: '/media/cruises/princess/princess-cruises-2020-black-600.jpg',
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
    logo_url: '/assets/supplier logos/jpg/Scenic-black.jpg',
    logo_url_white: '/media/cruises/ponant/PONANT_Logo_white-500.png',
    hero_image_url: '/media/cruises/ponant/ponant-hero-2200.jpg',
    tagline: 'The French way of luxury expedition.',
    description: 'Ponant is the world\'s leading luxury expedition company — combining polar expertise, extraordinary destinations, and refined Gallic elegance. Their Le Commandant Charcot is the world\'s first luxury nuclear-powered icebreaker.',
    cruise_types: ['ocean'],
    highlights: [
      { title: 'Polar Expertise', description: 'France\'s leading polar operator — Antarctica, Arctic, and remote archipelagos.' },
      { title: 'Le Commandant Charcot', description: 'World\'s only luxury nuclear icebreaker — reaching the geographic North Pole.' },
      { title: 'French Elegance', description: 'Refined Gallic cuisine, service, and design throughout.' },
      { title: 'Intimate Ships', description: '92–270 guests — true expedition intimacy with luxury comfort.' },
      { title: 'Virtuoso Benefit', description: '$300 shipboard credit and exclusive expedition briefing.' },
      { title: 'Le Ponant Yacht', description: '64-guest three-masted sailing yacht for the most intimate voyages.' },
    ],
    ships: [
      { name: 'Le Commandant Charcot', description: 'World\'s only luxury icebreaker, 270 guests.', image: '/media/cruises/ponant/ponant-hero-2200.jpg' },
      { name: 'Le Bellot', image: '/media/cruises/ponant/le-bellot.jpg', description: 'Explorer-class, 184 guests, polar.' },
      { name: 'Le Bougainville', image: '/media/cruises/ponant/le-bougainville.jpg', description: '184 guests, expedition luxury.' },
      { name: 'Le Ponant', image: '/media/cruises/ponant/le-ponant.jpg', description: '64 guests, three-masted sailing yacht.' },
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
    logo_url: '/assets/supplier logos/jpg/Lindblad-black.jpg',
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
    logo_url: '/media/cruises/uncruise/uncruise-logo-black-540.jpg',
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
      { name: 'Safari Voyager', description: '36 guests, Baja and Panama voyages.', image: '/media/cruises/uncruise/UnCruise-hero-1400x624-Snorkeling_Baja_California--Ellen-Barone.jpg' },
      { name: 'Wilderness Adventurer', image: '/media/cruises/uncruise/wilderness-adventurer.jpg', description: '60 guests, Alaska Inside Passage.' },
      { name: 'Wilderness Discoverer', image: '/media/cruises/uncruise/wilderness-discoverer.jpg', description: '76 guests, Alaska and Columbia River.' },
      { name: 'Safari Explorer', image: '/media/cruises/uncruise/safari-explorer.jpg', description: '36 guests, Hawaii and Alaska.' },
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
    logo_url: '/assets/supplier logos/jpg/Paul-Gauguin-black.jpg',
    logo_url_white: '/media/cruises/paul-gauguin/PGC-white-500.png',
    hero_image_url: '/media/cruises/paul-gauguin/pg-borabora-hero.jpg',
    tagline: 'French Polynesia\'s finest voyage.',
    description: 'Paul Gauguin Cruises operates a single iconic ship permanently sailing French Polynesia — Tahiti, Moorea, Bora Bora, and beyond. Year-round in paradise, the m/s Paul Gauguin is the gold standard for South Pacific luxury cruising.',
    cruise_types: ['ocean', 'yacht'],
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
    logo_url: '/assets/supplier logos/jpg/Star-Clippers-black.jpg',
    logo_url_white: null,
    hero_image_url: '/media/cruises/star-clippers/star_clippers-hero-2000.jpg',
    tagline: 'The romance of sailing under canvas.',
    description: 'Star Clippers operates the world\'s largest sailing ships — majestic tall ships harnessing the wind across the Caribbean and Mediterranean. With only 170–227 guests, every voyage is an intimate adventure in the golden age of sail.',
    cruise_types: ['yacht', 'ocean'],
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
    logo_url: '/assets/supplier logos/jpg/Scenic-black.jpg',
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
    logo_url: '/media/cruises/crystal/crystal_cruises-black-600.jpg',
    logo_url_white: '/media/cruises/crystal/crystal_cruises-white-600.png',
    hero_image_url: '/media/cruises/crystal-cruises/crystal-cruises-gallery-1.png',
    tagline: 'The world\'s most awarded luxury cruise line. Reborn.',
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
      { name: 'Crystal Grace', description: 'The newest addition joining the fleet in 2028.', image: '/media/cruises/crystal-cruises/crystal-grace.png' }
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
    logo_url: '/media/cruises/ama-waterways/ama-waterways_540-black.jpg',
    logo_url_white: '/media/cruises/ama-waterways/AMA_white_400.png',
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
      { name: 'AmaSiena', image: '/media/cruises/ama-waterways/amasiena.jpg', description: 'Rhine, Moselle, and Danube.' },
      { name: 'AmaLea', image: '/media/cruises/ama-waterways/amalea.jpg', description: 'Italy\'s Po River and beyond.' },
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
    logo_url: '/media/cruises/uniworld/uniworld_river_cruises-black-500.png',
    logo_url_white: null,
    hero_image_url: '/media/cruises/uniworld/uniworld-sunset-hero-2000.jpg',
    tagline: 'The world\'s most luxurious all-inclusive river cruise line.',
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
    logo_url: '/media/hotel-programs/logos/four-seasons-preferred-partner.jpg',
    logo_url_white: '/assets/supplier logos/white transparent/FS_preferred-600.webp',
    hero_image_url: '/media/cruises/four_seasons_yacht/YCT_207_aspect16x9.jpg',
    tagline: 'The Four Seasons experience, reimagined at sea.',
    description: 'Four Seasons Yachts brings legendary Four Seasons service to the sea. An intimate superyacht carrying just 96 guests with a 1:1 staff-to-guest ratio, four restaurants, and itineraries through the Caribbean and Mediterranean.',
    cruise_types: ['yacht'],
    highlights: [
      { title: '1:1 Staff-to-Guest Ratio', description: 'One team member per guest — extraordinary personalised service.' },
      { title: 'Four Seasons Dining', description: 'Four world-class restaurants onboard — fully included.' },
      { title: 'All Suite — Private Balconies', description: 'Every suite exceeds 800 sq ft with private terrace.' },
      { title: 'Private Marina Access', description: 'Retractable marina for watersports and snorkelling.' },
      { title: 'Curated Itineraries', description: 'Caribbean and Mediterranean routes built around extraordinary experiences.' },
      { title: 'Ultra-Bespoke', description: 'Private island excursions and helicopter transfers arranged exclusively.' },
    ],
    ships: [
      { name: 'Four Seasons I', description: '96 guests, the inaugural superyacht.', image: '/media/cruises/four_seasons_yacht/YCT_207_aspect16x9.jpg' },
    ],
    slider_images: [
      '/media/cruises/four_seasons_yacht/YCT_207_aspect16x9.jpg',
      '/media/cruises/four_seasons_yacht/YCT_208_aspect16x9.jpg',
      '/media/cruises/four_seasons_yacht/YCT_210_aspect16x9.jpg',
    ],
    sort_order: 22,
  },
  {
    id: '23', name: 'Virgin Voyages', slug: 'virgin-voyages',
    logo_url: '/media/cruises/virgin-voyages/virgin-voyages-600.png',
    logo_url_white: '/media/cruises/virgin-voyages/virgin-voyages-600.png',
    hero_image_url: '/media/cruises/virgin-voyages/IMG-DEST-costa-maya-mahahual-beach-sunset-v1-01-913747024-1092x1024.jpg',
    tagline: 'Brilliant at sea. Always adult.',
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
      { name: 'Brilliant Lady', image: '/media/cruises/virgin-voyages/Brilliant lady-2252x1266.avif', description: 'Newest addition, US East Coast.' },
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
    logo_url: '/assets/supplier logos/jpg/Windstar-black.jpg',
    logo_url_white: null,
    hero_image_url: '/media/cruises/star-clippers/star_clippers-hero_v2-2000.jpg',
    tagline: '180° from ordinary.',
    description: 'Windstar Cruises operates intimate sailing yachts and small motor yachts that anchor in harbours where larger ships cannot go. With 148–342 guests, Windstar delivers a personal, adventure-rich sailing experience across the Mediterranean, Caribbean, and Arctic.',
    cruise_types: ['yacht', 'ocean'],
    highlights: [
      { title: 'Sailing Yachts', description: 'Original three masted sailing yachts — Wind Star, Wind Spirit, Wind Song.' },
      { title: 'Star-Class Motor Yachts', description: 'Three Star-class yachts for expanded capacity and new itineraries.' },
      { title: 'All In Fares', description: 'Beverages, Wi-Fi, and tips included option.' },
      { title: 'Unique Port Access', description: 'Anchor in bays and coves unreachable by large ships.' },
      { title: 'Virtuoso Benefit', description: '$150 shipboard credit and complimentary water sports day.' },
      { title: 'Open Bridge Policy', description: 'Guests welcome to visit the bridge and learn to sail.' },
    ],
    ships: [
      { name: 'Wind Star', image: '/media/cruises/windstar/wind-star.jpg', description: '148 guests, iconic four-masted sailing yacht.' },
      { name: 'Wind Spirit', image: '/media/cruises/windstar/wind-spirit.jpg', description: '148 guests, Mediterranean and Caribbean.' },
      { name: 'Star Breeze', image: '/media/cruises/windstar/star-breeze.jpg', description: '312 guests, expanded Star Class.' },
      { name: 'Star Legend', image: '/media/cruises/windstar/star-legend.jpg', description: '312 guests, Arctic and Caribbean.' },
    ],
    slider_images: [
      '/media/cruises/star-clippers/star_clippers-hero_v2-2000.jpg',
    ],
    sort_order: 24,
  },
]

const MOCK_PROGRAM_PROPERTIES: ProgramFeaturedProperty[] = [
  { id: '1', program_slug: 'four-seasons-preferred-partner', name: 'Four Seasons Resort Maui', location: 'Wailea, Hawaii', image_url: '/media/hotel-programs/four-seasons/fs-maui-ocean_suite-3840x2160.jpg', description: 'An oceanfront paradise.', booking_link: null, sort_order: 1 },
  { id: '2', program_slug: 'four-seasons-preferred-partner', name: 'Four Seasons Grand-Hôtel du Cap-Ferrat', location: 'Saint-Jean-Cap-Ferrat, France', image_url: '/media/hero images/four-seasons-CapFerrat-pool-hero.jpg', description: 'A legendary Riviera palace.', booking_link: null, sort_order: 2 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const hasSupabase = () => !!process.env.NEXT_PUBLIC_SUPABASE_URL

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
