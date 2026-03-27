import { HOTEL_LOGOS } from '@/lib/media-library'
import { createServiceClient } from '@/lib/supabase/service'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HotelProgramBenefit {
  title: string
  description: string
}

export interface HotelProgram {
  id: string
  slug: string
  name: string
  logo_url: string | null
  logo_url_white: string | null   // transparent white version for dark hero
  image_url: string | null
  slider_images: string[]
  tagline: string | null
  description: string | null
  category: 'invitation_only' | 'brand_programme' | 'luxury_collection' | 'global_network' | null
  property_count: number | null
  benefits: HotelProgramBenefit[]
  eligibility_notes: string | null
  booking_notes: string | null
  sort_order: number
  is_active: boolean
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_HOTEL_PROGRAMS: HotelProgram[] = [
  {
    id: '1',
    slug: 'belmond-bellini-club',
    name: 'Belmond Bellini Club',
    logo_url: HOTEL_LOGOS.belmondBelliniClub,
    logo_url_white: HOTEL_LOGOS.belmondBelliniClubWhite,
    image_url: '/media/hotel-programs/belmond-bellini-club/belmond-hero-2000.jpg',
    slider_images: [
      '/media/hotel-programs/belmond-bellini-club/belmond-slider-1-1500.jpg',
      '/media/hotel-programs/belmond-bellini-club/belmond-slider-2-1500.jpg',
      '/media/hotel-programs/belmond-bellini-club/belmond-copacabana-1500.jpg',
      '/media/hotel-programs/belmond-bellini-club/belmond-cap-1500.jpg',
      '/media/hotel-programs/belmond-bellini-club/belmond-reids-1500.jpg',
      '/media/hotel-programs/belmond-bellini-club/belmond-siem-1500.jpg',
    ],
    tagline: 'An invitation-only club for the world\'s finest travel advisors.',
    description: 'Regarded as one of the finest travel agent recognition programmes, the Belmond Bellini Club develops closer relationships between Belmond and a handpicked selection of agencies worldwide. Membership is by invitation only and grants access to exclusive benefits not available through any other booking channel.',
    category: 'invitation_only',
    property_count: null,
    benefits: [
      { title: 'Complimentary Room Upgrade', description: 'Upgrade upon arrival, subject to availability.' },
      { title: 'Complimentary Internet', description: 'High-speed Wi-Fi throughout the stay.' },
      { title: 'Daily Breakfast for Two', description: 'Buffet or full breakfast for two guests, daily.' },
      { title: 'Flexible Hotel Credit', description: 'Up to $200 (USD) fully flexible hotel or resort credit per stay.' },
      { title: '$500 Gift Voucher', description: 'Gift voucher for future Belmond travel when purchasing an experience valued at $5,000 or more.' },
      { title: 'VIP Recognition', description: 'Personal welcome by property management and dedicated staff recognition.' },
      { title: 'In-Room Welcome Amenity', description: 'A special welcome gift awaiting on arrival.' },
      { title: 'Top-of-Waitlist Priority', description: 'Priority placement on waitlists for high-demand properties and experiences.' },
    ],
    eligibility_notes: 'Available exclusively to guests who book through Eden for Your World.',
    booking_notes: 'Mention your booking through Eden for Your World at check-in to ensure all Bellini Club benefits are applied.',
    sort_order: 1,
    is_active: true,
  },
  {
    id: '2',
    slug: 'dorchester-diamond-club',
    name: 'Diamond Club — Dorchester Collection',
    logo_url: HOTEL_LOGOS.dorchesterDiamondClub,
    logo_url_white: HOTEL_LOGOS.dorchesterDiamondClubWhite,
    image_url: '/media/hotel-programs/dorchester/dorchester-hero-2000.jpg',
    slider_images: [
      '/media/hotel-programs/dorchester/dorchester-slider-1-1500.jpg',
      '/media/hotel-programs/dorchester/dorchester-slider-2-1500.jpg',
      '/media/hotel-programs/dorchester/dorchester-slider-3-1500.jpg',
      '/media/hotel-programs/dorchester/dorchester-slider-4-1500.jpg',
    ],
    tagline: 'Unrivalled privileges at the world\'s most iconic Dorchester hotels.',
    description: 'The Diamond Club provides value-added benefits and priority upgrades at any hotel within the Dorchester Collection. Access is available exclusively when booking through a participating preferred travel agency.',
    category: 'invitation_only',
    property_count: 10,
    benefits: [
      { title: 'Complimentary Room Upgrade', description: 'Upgrade upon arrival, subject to availability.' },
      { title: 'Unlimited Wi-Fi', description: 'Complimentary high-speed internet throughout the stay.' },
      { title: 'Daily Breakfast for Two', description: 'Buffet or full breakfast for two guests, daily.' },
      { title: 'Local Currency Credit', description: '100 units in local currency per stay for rooms and junior suites; per day for suites.' },
      { title: 'VIP Recognition', description: 'Personal welcome by property management and VIP treatment from all staff.' },
      { title: 'In-Room Welcome Amenity', description: 'A curated welcome gift upon arrival.' },
    ],
    eligibility_notes: 'Must be booked through Eden for Your World to unlock Diamond Club benefits.',
    booking_notes: 'Quote your advisor\'s name and agency when reserving to ensure benefits are registered.',
    sort_order: 2,
    is_active: true,
  },
  {
    id: '3',
    slug: 'four-seasons-preferred-partner',
    name: 'Four Seasons Preferred Partner',
    logo_url: HOTEL_LOGOS.fourSeasonsPreferred,
    logo_url_white: HOTEL_LOGOS.fourSeasonsPreferredWhite,
    image_url: '/media/hotel-programs/four-seasons/fs-taormina-pool-couple-1080x1350.jpg',
    slider_images: [
      '/media/hotel-programs/four-seasons/fs-hawaii-1500.jpg',
      '/media/hotel-programs/four-seasons/fs-hangzhou-1500.jpg',
      '/media/hotel-programs/four-seasons/fs-Golden_pool-1500.jpg',
      '/media/hotel-programs/four-seasons/fs-miami_surf-1500.jpg',
      '/media/hotel-programs/four-seasons/fs-lanai_wellness-1500.jpg',
      '/media/hotel-programs/four-seasons/fs-explore_lodge-1500.jpg',
    ],
    tagline: 'The exclusive network connecting the world\'s finest hotels with the world\'s finest travel consultants.',
    description: 'The Four Seasons Preferred Partner programme is an exclusive, invitation-only network of high-end travel consultants. It enables extraordinary guests to experience Four Seasons properties with a suite of value-added benefits available only through a participating preferred agency.',
    category: 'invitation_only',
    property_count: 130,
    benefits: [
      { title: 'Daily Breakfast for Two', description: 'Full breakfast served daily for two guests, either in the restaurant or in-room.' },
      { title: 'Hotel Credit (Rooms)', description: 'USD $100 flexible hotel or resort credit per stay for guest room bookings.' },
      { title: 'Hotel Credit (Suites)', description: 'USD $200 hotel credit per stay for suites and specialty suites.' },
      { title: 'Hotel Credit (Private Retreats)', description: 'USD $200 hotel credit per bedroom per stay for private retreat bookings.' },
      { title: 'Room Category Upgrade', description: 'One category room upgrade, subject to availability at check-in.' },
    ],
    eligibility_notes: 'Must be booked via a Four Seasons Preferred Partner agency. Not available on direct or third-party bookings.',
    booking_notes: 'Rate must be booked through Eden for Your World. Present the Preferred Partner confirmation at check-in.',
    sort_order: 3,
    is_active: true,
  },
  {
    id: '4',
    slug: 'ritz-carlton-stars',
    name: 'STARS — The Ritz-Carlton',
    logo_url: HOTEL_LOGOS.ritzCarltonStars,
    logo_url_white: HOTEL_LOGOS.ritzCarltonStarsWhite,
    image_url: '/media/hotel-programs/marriott-stars---luminous/marriott-hero-2200.jpg',
    slider_images: [
      '/media/hotel-programs/marriott-stars---luminous/marriott-STARS-gallery-1-1500.jpg',
      '/media/hotel-programs/marriott-stars---luminous/ritz-yacht-santorini-1500.jpg',
      '/media/hotel-programs/marriott-stars---luminous/ritz-yacht-rear-1500.jpg',
      '/media/hotel-programs/marriott-stars---luminous/marriott-STARS-gallery-2-1500.jpg',
      '/media/hotel-programs/marriott-stars---luminous/marriott-STARS-gallery-3-1500.jpg',
      '/media/hotel-programs/marriott-stars---luminous/marriott-STARS-gallery-4-1500.jpg',
    ],
    tagline: 'A special recognition programme that transforms Ritz-Carlton stays into legendary memories.',
    description: 'STARS represents a curated relationship between The Ritz-Carlton and a select group of elite travel agencies worldwide. The programme elevates the guest experience through thoughtful, personalised touches that begin before arrival and continue throughout the stay.',
    category: 'invitation_only',
    property_count: 100,
    benefits: [
      { title: 'Personal Management Welcome', description: 'Welcomed personally by hotel management, plus a welcome card from the General Manager.' },
      { title: 'Pre-Registration & Express Check-In', description: 'Guests pre-registered before arrival for a seamless, expedited check-in experience.' },
      { title: '4:00 PM Late Check-Out', description: 'Complimentary late check-out until 4:00 PM, upon request and subject to availability.' },
      { title: 'Breakfast for Two', description: 'Continental or full breakfast for two guests, daily.' },
      { title: 'In-Room Welcome Amenity', description: 'Complimentary in-room amenity selected by the property.' },
      { title: 'Room or Suite Upgrade', description: 'Priority upgrade to a superior room or suite upon arrival, subject to availability.' },
    ],
    eligibility_notes: 'Exclusive to bookings placed through an authorised STARS travel agency.',
    booking_notes: 'Book through Eden for Your World and reference the STARS programme. Benefits confirmed at reservation.',
    sort_order: 4,
    is_active: true,
  },
  {
    id: '5',
    slug: 'rosewood-elite',
    name: 'Rosewood Elite',
    logo_url: HOTEL_LOGOS.rosewoodElite,
    logo_url_white: HOTEL_LOGOS.rosewoodEliteWhite,
    image_url: '/media/hotel-programs/rosewood-elite/rosewood-miramar-hero-scaled.jpg',
    slider_images: [
      '/media/hotel-programs/rosewood-elite/bangkok-Rosewood-1500.jpg',
      '/media/hotel-programs/rosewood-elite/italy-rosewood-1500.jpg',
      '/media/hotel-programs/rosewood-elite/las_ventanas-rosewood-1500.jpg',
      '/media/hotel-programs/rosewood-elite/hongkong_pool-Rosewood-1500.jpg',
      '/media/hotel-programs/rosewood-elite/guanzhou-rosewood-1500.jpg',
      '/media/hotel-programs/rosewood-elite/beijing-rosewood-1500.jpg',
    ],
    tagline: 'Where ultra-luxury becomes truly personal.',
    description: 'Rosewood Elite addresses the desire to embrace and recognise elite clientele at Rosewood\'s most extraordinary hotels and resorts worldwide. Guests who book through a Rosewood Elite agency enjoy exclusive privileges curated for those who expect the very best.',
    category: 'invitation_only',
    property_count: 35,
    benefits: [
      { title: 'Daily Breakfast for Two', description: 'Full breakfast for two guests served daily.' },
      { title: 'Complimentary Room Upgrade', description: 'Free room upgrade upon arrival, subject to availability.' },
      { title: 'Managing Director Welcome', description: 'Personalised welcome from the property\'s Managing Director.' },
      { title: 'Pre-Registration', description: 'Express pre-registration arranged prior to arrival.' },
      { title: 'No Relocation Policy', description: 'Guaranteed no-relocation policy — your reserved room will not be reassigned.' },
      { title: 'Property-Specific Amenity', description: 'Additional amenities such as a $100 resort or spa credit (varies by location).' },
    ],
    eligibility_notes: 'Benefits apply at participating Rosewood properties when booked through a Rosewood Elite agency.',
    booking_notes: 'Reservation must be placed through Eden for Your World with the Rosewood Elite programme code.',
    sort_order: 5,
    is_active: true,
  },
  {
    id: '6',
    slug: 'hera-accor-hotels',
    name: 'Accor Preferred by HERA',
    logo_url: HOTEL_LOGOS.accorHera,
    logo_url_white: HOTEL_LOGOS.accorHeraWhite,
    image_url: '/media/hotel-programs/hera-accor/accor-FAENA-pool-1920.jpg',
    slider_images: [
      '/media/hotel-programs/hera-accor/accor-FAENA-pool-1920.jpg',
      '/media/hotel-programs/hera-accor/accor-hotels-1500-1.jpg',
      '/media/hotel-programs/hera-accor/accor-hotels-1500-2.jpg',
      '/media/hotel-programs/hera-accor/accor-hotels-1500-3.jpg',
    ],
    tagline: 'Preferred access to 5,000+ luxury properties worldwide.',
    description: 'Accor Preferred by HERA provides privileged access to Accor\'s vast global portfolio of luxury and lifestyle hotels, including Raffles, Fairmont, Sofitel, and Orient Express. The programme unlocks exclusive benefits for guests who choose to book through a participating preferred advisor.',
    category: 'global_network',
    property_count: 5000,
    benefits: [
      { title: 'Daily Breakfast for Two', description: 'Complimentary full breakfast for two guests, served daily.' },
      { title: '$100 Property Credit', description: 'USD $100 flexible credit applicable towards dining, spa, or on-property expenses, per stay.' },
      { title: 'VIP Welcome', description: 'A personalised VIP welcome experience upon arrival.' },
      { title: 'Early Check-In & Late Check-Out', description: 'Priority early check-in and late check-out, subject to availability.' },
      { title: 'Room Upgrade', description: 'One category room upgrade at check-in, subject to availability.' },
    ],
    eligibility_notes: 'Available across Accor\'s luxury portfolio — Raffles, Fairmont, Sofitel, Orient Express, and more.',
    booking_notes: 'Book through Eden for Your World and reference the HERA programme to activate benefits.',
    sort_order: 6,
    is_active: true,
  },
  {
    id: '7',
    slug: 'mandarin-oriental-fan-club',
    name: 'Mandarin Oriental Fan Club',
    logo_url: HOTEL_LOGOS.mandarinFanClub,
    logo_url_white: HOTEL_LOGOS.mandarinFanClubWhite,
    image_url: '/media/hotel-programs/mandarin-oriental/mandarin-oriental-fan-club-Hero-2000.jpg',
    slider_images: [
      '/media/hotel-programs/mandarin-oriental/mandarin-oriental-fan-club-Featured Slider 1500.jpg',
      '/media/hotel-programs/mandarin-oriental/mandarin-oriental-fan-club-Featured Slider 2 1500.jpg',
      '/media/hotel-programs/mandarin-oriental/mandarin-oriental-fan-club-Featured Slider 3 1500.jpg',
      '/media/hotel-programs/mandarin-oriental/mandarin-oriental-fan-club-Featured Slider 4 1500.jpg',
      '/media/hotel-programs/mandarin-oriental/mandarin-oriental-fan-club-Featured-Slider-5-1500.jpg',
      '/media/hotel-programs/mandarin-oriental/mandarin-oriental-fan-club-Featured Slider 6 1500.jpg',
    ],
    tagline: 'Invitation-only access to Mandarin Oriental\'s legendary hospitality.',
    description: 'The Mandarin Oriental Fan Club is an invitation-only programme that provides unique services and exclusive privileges at Mandarin Oriental\'s prestigious collection of hotels, resorts, and residences worldwide.',
    category: 'invitation_only',
    property_count: 35,
    benefits: [
      { title: 'Food & Beverage or Spa Credit', description: 'USD $100 credit applicable to food and beverage or spa services, per stay.' },
      { title: 'Daily Continental Breakfast', description: 'Complimentary continental breakfast for two guests, daily.' },
      { title: 'Complimentary High-Speed Internet', description: 'Complimentary Wi-Fi for the duration of the stay.' },
      { title: 'Personalised Welcome Amenity', description: 'A curated in-room gift and a personalised welcome note from senior management.' },
      { title: 'Room Category Upgrade', description: 'One category room upgrade, subject to availability at check-in.' },
    ],
    eligibility_notes: 'Fan Club benefits must be requested through your Eden for Your World advisor at the time of booking.',
    booking_notes: 'Quote the Mandarin Oriental Fan Club programme when booking through Eden for Your World.',
    sort_order: 7,
    is_active: true,
  },
  {
    id: '8',
    slug: 'shangri-la-hotels-the-luxury-circle',
    name: 'Shangri-La — The Luxury Circle',
    logo_url: HOTEL_LOGOS.shangriLaLuxuryCircle,
    logo_url_white: HOTEL_LOGOS.shangriLaLuxuryCircleWhite,
    image_url: '/media/hotel-programs/shangri-la/ShangriLa-hotels-Hero-2000.jpg',
    slider_images: [
      '/media/hotel-programs/shangri-la/ShangriLa-hotels-Featured Slider 1500.jpg',
      '/media/hotel-programs/shangri-la/ShangriLa-hotels-Featured Slider 2 1500.jpg',
      '/media/hotel-programs/shangri-la/ShangriLa-hotels-Featured Slider 3 1500.jpg',
      '/media/hotel-programs/shangri-la/ShangriLa-hotels-Featured Slider 4 1500.jpg',
      '/media/hotel-programs/shangri-la/ShangriLa-hotels-Featured Slider 5 1500.jpg',
      '/media/hotel-programs/shangri-la/ShangriLa-hotels-Featured Slider 6 1500.jpg',
    ],
    tagline: 'Hospitality from the Heart, perfected at every Shangri-La property.',
    description: 'The Luxury Circle represents the pinnacle of Shangri-La\'s commitment to personalised, heartfelt hospitality. Exclusively available through select preferred travel agencies, it delivers an elevated experience across Shangri-La, Kerry, and JEN hotels worldwide.',
    category: 'invitation_only',
    property_count: 100,
    benefits: [
      { title: 'Guaranteed Room Upgrade', description: 'Upgrade to the next room category confirmed at time of booking, subject to availability.' },
      { title: 'Hotel Credit', description: 'USD $50, $100 or 10% of Average Daily Rate (whichever is higher) as a flexible hotel credit.' },
      { title: 'Full Breakfast for Two', description: 'Complimentary full breakfast for two guests daily, including in-room dining.' },
      { title: 'VIP Welcome Amenity', description: 'In-room welcome gift plus a joint welcome letter from the General Manager and your advisor.' },
      { title: 'Early Check-In & Late Check-Out', description: 'Priority early check-in and late check-out, subject to availability.' },
      { title: 'No-Walk Policy', description: 'Strict no-walk policy and priority waitlist clearance to guarantee reserved accommodation.' },
      { title: 'Dedicated Concierge', description: 'Access to a dedicated concierge for personalised service throughout the stay.' },
    ],
    eligibility_notes: 'Bookings must be made via an authorised Luxury Circle travel agency with the programme code applied.',
    booking_notes: 'Book through Eden for Your World and mention The Luxury Circle programme at time of reservation.',
    sort_order: 8,
    is_active: true,
  },
  {
    id: '9',
    slug: 'rocco-forte-hotels',
    name: 'Sir Rocco\'s Knights — Rocco Forte Hotels',
    logo_url: HOTEL_LOGOS.roccoForte,
    logo_url_white: HOTEL_LOGOS.roccoForteWhite,
    image_url: '/media/hotel-programs/rocco-forte/Rocco-Forte-hotels-Hero-2000.jpg',
    slider_images: [
      '/media/hotel-programs/rocco-forte/roccoforte-slider-1-1500.jpg',
      '/media/hotel-programs/rocco-forte/roccoforte-slider-2-1500.jpg',
      '/media/hotel-programs/rocco-forte/roccoforte-slider-3-1500.jpg',
      '/media/hotel-programs/rocco-forte/Rocco-Forte-hotels-Featured Slider 1500.jpg',
      '/media/hotel-programs/rocco-forte/Rocco-Forte-hotels-Featured Slider 2 1500.jpg',
      '/media/hotel-programs/rocco-forte/Rocco-Forte-hotels-Featured Slider 3 1500.jpg',
    ],
    tagline: 'An exclusive fraternity honouring the world\'s most distinguished travel advisors.',
    description: 'Sir Rocco\'s Knights is Rocco Forte Hotels\' invitation-only preferred partner programme. It recognises a handpicked selection of elite agencies globally and rewards discerning clients with spectacular privileges across Rocco Forte\'s European portfolio of prestige properties.',
    category: 'invitation_only',
    property_count: 14,
    benefits: [
      { title: 'Daily Full Breakfast', description: 'Complimentary full breakfast for two guests, served daily.' },
      { title: 'Food & Beverage Credit', description: '€85 / £75 / $100 USD food and beverage credit in local currency, per stay.' },
      { title: 'Spa Discount', description: '15% discount on spa services at most Rocco Forte properties.' },
      { title: 'Priority Room Upgrade', description: 'Priority upgrade upon arrival, subject to availability.' },
      { title: 'Priority Early Check-In & Late Check-Out', description: 'Early check-in and late check-out prioritised, subject to availability.' },
      { title: 'Seasonal Welcome Amenity', description: 'A seasonal, curated welcome amenity and a personalised note from the General Manager.' },
    ],
    eligibility_notes: 'Available at all Rocco Forte Hotels when booked through an authorised Sir Rocco\'s Knights agency.',
    booking_notes: 'Book through Eden for Your World and reference the Sir Rocco\'s Knights programme.',
    sort_order: 9,
    is_active: true,
  },
  {
    id: '10',
    slug: 'one-and-only-hotels-and-resorts',
    name: 'One&Only',
    logo_url: HOTEL_LOGOS.oneAndOnly,
    logo_url_white: HOTEL_LOGOS.oneAndOnlyWhite,
    image_url: '/media/hotel-programs/one-and-only/oneandonly-resorts-Hero-2000.jpg',
    slider_images: [
      '/media/hotel-programs/one-and-only/oneandonly-slider-1-1500.jpg',
      '/media/hotel-programs/one-and-only/oneandonly-slider-2-1500.jpg',
      '/media/hotel-programs/one-and-only/oneandonly-slider-3-1500.jpg',
      '/media/hotel-programs/one-and-only/oneandonly-slider-4-1500.jpg',
    ],
    tagline: 'The most exclusive places on earth — now more personal than ever.',
    description: 'One&Only Resorts occupies the world\'s most breathtaking destinations with properties that redefine ultra-luxury. Booking through a preferred agency unlocks a curated set of exclusive benefits that reflect the brand\'s philosophy of personalised, unapologetic luxury.',
    category: 'brand_programme',
    property_count: 15,
    benefits: [
      { title: 'Daily Breakfast for Two', description: 'Complimentary full breakfast for two guests, served daily.' },
      { title: 'Resort or Spa Credit', description: 'A resort or spa credit per stay for on-property experiences.' },
      { title: 'Complimentary Room Upgrade', description: 'Upgrade to a superior room category based on availability at check-in.' },
      { title: 'Early Check-In & Late Check-Out', description: 'Priority early check-in and late check-out, subject to availability.' },
      { title: 'Complimentary Wi-Fi', description: 'High-speed Wi-Fi complimentary throughout the stay.' },
      { title: 'Access to Best Room Inventory', description: 'Priority access to the best guest room inventory within the booked category.' },
      { title: 'Personalised Recognition', description: 'Staff-wide recognition and personalised service throughout the stay.' },
    ],
    eligibility_notes: 'Benefits apply at all One&Only Resorts when reservation is placed through a preferred partner agency.',
    booking_notes: 'Contact Eden for Your World to book and activate your exclusive One&Only benefits.',
    sort_order: 10,
    is_active: true,
  },
  {
    id: '11',
    slug: 'auberge-resorts-collection',
    name: 'Auberge Resorts Collection',
    logo_url: HOTEL_LOGOS.aubergeResorts,
    logo_url_white: HOTEL_LOGOS.aubergeResortsWhite,
    image_url: '/media/hotel-programs/auberge-resorts/auberge-hero-2000.jpg',
    slider_images: [
      '/media/hotel-programs/auberge-resorts/auberge-resorts-collection-Featured Slider 1500.jpg',
      '/media/hotel-programs/auberge-resorts/auberge-resorts-collection-Featured Slider 2 1500.jpg',
      '/media/hotel-programs/auberge-resorts/auberge-resorts-collection-Featured Slider 3 1500.jpg',
      '/media/hotel-programs/auberge-resorts/auberge-resorts-Featured Slider 4 1500.jpg',
    ],
    tagline: 'Hand-crafted luxury in the world\'s most inspiring places.',
    description: 'Auberge Resorts Collection is a portfolio of exceptional hotels and resorts in iconic destinations. Each property delivers a one-of-a-kind experience with remarkable, warm hospitality. Booking through a preferred partner ensures the fullest expression of Auberge\'s personal service.',
    category: 'brand_programme',
    property_count: 25,
    benefits: [
      { title: 'Daily Breakfast for Two', description: 'Complimentary full breakfast for two guests, served daily.' },
      { title: 'Resort or Spa Credit', description: 'A resort or spa credit per stay for on-property indulgences.' },
      { title: 'Complimentary Room Upgrade', description: 'Room upgrade based on availability at check-in.' },
      { title: 'Early Check-In & Late Check-Out', description: 'Priority early check-in and late check-out, subject to availability.' },
      { title: 'Complimentary Wi-Fi', description: 'Complimentary high-speed internet access throughout the stay.' },
      { title: 'Personalised Recognition', description: 'VIP treatment and personalised welcome from the property team.' },
    ],
    eligibility_notes: 'Benefits apply at all Auberge Resorts Collection properties when booked through Eden for Your World.',
    booking_notes: 'Book through Eden for Your World and mention the preferred partner programme at reservation.',
    sort_order: 11,
    is_active: true,
  },
  {
    id: '12',
    slug: 'hyatt-prive',
    name: 'World of Hyatt Privé',
    logo_url: HOTEL_LOGOS.hyattPrive,
    logo_url_white: HOTEL_LOGOS.hyattPriveTransparent,
    image_url: '/media/hotel-programs/hyatt-prive/hyatt-hero-2000.jpg',
    slider_images: [
      '/media/hotel-programs/hyatt-prive/hyatt-slider-1-1500.jpg',
      '/media/hotel-programs/hyatt-prive/hyatt-slider-2-1500.jpg',
      '/media/hotel-programs/hyatt-prive/hyatt-slider-3-1500.jpg',
      '/media/hotel-programs/hyatt-prive/hyatt-slider-4-1500.jpg',
    ],
    tagline: 'Strictly limited to a small collection of Hyatt\'s most exceptional global agencies.',
    description: 'World of Hyatt Privé is an exclusive travel advisor programme providing preferred benefits at Hyatt\'s most prestigious properties, including Park Hyatt, Alila, Andaz, and Grand Hyatt. Membership is strictly limited, ensuring recognition and service of the highest order.',
    category: 'invitation_only',
    property_count: 1000,
    benefits: [
      { title: 'Property Credit', description: 'Up to USD $100 credit per room per stay for dining, spa, and hotel services.' },
      { title: 'Room Category Upgrade', description: 'One category room upgrade, excluding non-suite to suite, subject to availability.' },
      { title: 'Daily Full Breakfast', description: 'Complimentary full breakfast served daily for two guests.' },
      { title: 'VIP Welcome Amenity', description: 'A personalised welcome amenity awaiting on arrival.' },
      { title: 'Early Check-In & Late Check-Out', description: 'Priority early check-in and late check-out, subject to availability.' },
      { title: 'Complimentary Wi-Fi', description: 'Complimentary high-speed Wi-Fi throughout the stay.' },
    ],
    eligibility_notes: 'Available at participating Hyatt properties when booked through an authorised Privé travel advisor.',
    booking_notes: 'Book through Eden for Your World and reference the Hyatt Privé programme at time of reservation.',
    sort_order: 12,
    is_active: true,
  },
  {
    id: '13',
    slug: 'kempinski-club-1897',
    name: 'Club 1897 — Kempinski',
    logo_url: HOTEL_LOGOS.kempinskiClub1897,
    logo_url_white: HOTEL_LOGOS.kempinskiClub1897White,
    image_url: '/media/hotel-programs/kempinski/kempinski-hero-scaled.jpg',
    slider_images: [
      '/media/hotel-programs/kempinski/kempinski-slider-1-1500.jpg',
      '/media/hotel-programs/kempinski/kempinski-slider-2-1500.jpg',
      '/media/hotel-programs/kempinski/kempinski-slider-3-1500.jpg',
      '/media/hotel-programs/kempinski/kempinski-istanbul-1500.jpg',
      '/media/hotel-programs/kempinski/kempinski-munich-1500.jpg',
      '/media/hotel-programs/kempinski/kempinski-cancun-1500.jpg',
    ],
    tagline: 'A passport to a world of curated privileges at Europe\'s oldest luxury hotel group.',
    description: 'Club 1897 is Kempinski Hotels\' preferred partner programme, named after the year the brand was founded. It grants access to curated privileges across Kempinski\'s extraordinary portfolio spanning over 35 countries, from palace hotels to resort retreats.',
    category: 'invitation_only',
    property_count: 75,
    benefits: [
      { title: 'Complimentary Room Upgrade', description: 'Upgrade upon arrival, subject to availability.' },
      { title: 'Complimentary Internet', description: 'High-speed Wi-Fi complimentary throughout the stay.' },
      { title: 'Daily Breakfast for Two', description: 'Buffet or full breakfast for two guests, daily.' },
      { title: 'Hotel or Resort Credit', description: 'Daily hotel or resort credit for dining, spa, or leisure.' },
      { title: 'VIP Recognition', description: 'Staff-wide VIP recognition and a personal welcome upon arrival.' },
      { title: 'In-Room Welcome Amenity', description: 'A special in-room welcome gift.' },
      { title: 'Top-of-Waitlist Priority', description: 'Priority placement on the waitlist for high-demand dates and properties.' },
    ],
    eligibility_notes: 'Available at all Kempinski properties worldwide when booked through a Club 1897 preferred agency.',
    booking_notes: 'Book through Eden for Your World and reference Club 1897 to activate all programme benefits.',
    sort_order: 13,
    is_active: true,
  },
  {
    id: '14',
    slug: 'peninsula-pen-club',
    name: 'The Peninsula PenClub',
    logo_url: HOTEL_LOGOS.peninsulaPenClub,
    logo_url_white: HOTEL_LOGOS.peninsulaPenClubWhite,
    image_url: '/media/hotel-programs/peninsula-penclub/Peninsula-Hotels-Hero-2000.jpg',
    slider_images: [
      '/media/hotel-programs/peninsula-penclub/Peninsula-Hotels-Featured Slider 1500.jpg',
      '/media/hotel-programs/peninsula-penclub/Peninsula-Hotels-Featured Slider 2 1500.jpg',
      '/media/hotel-programs/peninsula-penclub/Peninsula-Hotels-Featured Slider 3 1500.jpg',
      '/media/hotel-programs/peninsula-penclub/Peninsula-Hotels-Featured Slider 4 1500.jpg',
      '/media/hotel-programs/peninsula-penclub/Peninsula-Hotels-Featured Slider 5 1500.jpg',
      '/media/hotel-programs/peninsula-penclub/Peninsula-Hotels-Featured Slider 6 1500.jpg',
    ],
    tagline: 'A select and personalised programme with membership by invitation only.',
    description: 'The Peninsula PenClub is The Peninsula Hotels\' invitation-only preferred partner programme. It reflects the brand\'s dedication to bespoke service and delivers exclusive privileges across iconic Peninsula properties in Hong Kong, New York, Paris, Tokyo, and beyond.',
    category: 'invitation_only',
    property_count: 14,
    benefits: [
      { title: 'Exclusive Hotel Amenities', description: 'Property-specific amenities curated for PenClub guests, differing per hotel.' },
      { title: 'Daily Full Breakfast', description: 'Complimentary full breakfast for up to two guests, served daily.' },
      { title: 'Peninsula Time', description: 'Flexible check-in and check-out times — The Peninsula\'s signature farewell to rigid schedules.' },
      { title: 'Room Upgrade', description: 'Upgrade upon arrival to a superior room, subject to availability.' },
      { title: 'Upgraded Welcome Amenity', description: 'An elevated in-room welcome gift, exclusive to PenClub guests.' },
      { title: 'Complimentary VOIP Calls', description: 'Complimentary long-distance calls via VOIP at select global city properties.' },
    ],
    eligibility_notes: 'PenClub benefits apply at all Peninsula Hotels when the reservation is placed through an authorised agency.',
    booking_notes: 'Book through Eden for Your World and request PenClub benefits to be noted on the reservation.',
    sort_order: 14,
    is_active: true,
  },
  {
    id: '15',
    slug: 'como-hotels',
    name: 'COMO Hotels and Resorts',
    logo_url: HOTEL_LOGOS.comoHotels,
    logo_url_white: HOTEL_LOGOS.comoHotelsWhite,
    image_url: '/media/hotel-programs/como-hotels/Como-hero-tuscany-2200.jpg',
    slider_images: [
      '/media/hotel-programs/como-hotels/COMO-hotels-1500-1.jpg',
      '/media/hotel-programs/como-hotels/COMO-hotels-1500-2.jpg',
      '/media/hotel-programs/como-hotels/COMO-hotels-1500-3.jpg',
    ],
    tagline: 'Where holistic wellness meets breathtaking design.',
    description: 'COMO Hotels and Resorts is a collection of intimate, design-led properties in the world\'s most inspiring destinations. Each property reflects a deep commitment to wellness, whole-food cuisine, and mindful luxury. A preferred agency booking unlocks an elevated, deeply personal COMO experience.',
    category: 'brand_programme',
    property_count: 20,
    benefits: [
      { title: 'Daily Breakfast for Two', description: 'Complimentary breakfast for two guests, served daily.' },
      { title: 'Resort or Spa Credit', description: 'A resort or spa credit per stay for wellness treatments or on-property experiences.' },
      { title: 'Complimentary Room Upgrade', description: 'Room upgrade based on availability at check-in.' },
      { title: 'Early Check-In & Late Check-Out', description: 'Priority early check-in and late check-out, subject to availability.' },
      { title: 'Complimentary Wi-Fi', description: 'Complimentary Wi-Fi throughout the stay.' },
      { title: 'Personalised Recognition', description: 'Personalised VIP welcome and dedicated attention throughout the stay.' },
    ],
    eligibility_notes: 'Benefits apply at all COMO Hotels and Resorts when booked through Eden for Your World.',
    booking_notes: 'Contact Eden for Your World to book and ensure preferred partner benefits are applied.',
    sort_order: 15,
    is_active: true,
  },
  {
    id: '16',
    slug: 'oetker-hotel-collection-pearl-partner',
    name: 'Pearl Partner — Oetker Collection',
    logo_url: HOTEL_LOGOS.oetkerPearl,
    logo_url_white: HOTEL_LOGOS.oetkerPearlWhite,
    image_url: '/media/hotel-programs/oetker-pearl/oetker-featured.jpg',
    slider_images: [
      '/media/hotel-programs/oetker-pearl/oetker-ducap-1500.jpg',
      '/media/hotel-programs/oetker-pearl/oetker-estate-1500.jpg',
      '/media/hotel-programs/oetker-pearl/oetker-eden_rock_villa-1500.jpg',
      '/media/hotel-programs/oetker-pearl/oetker-lifestyle-couple-1500.jpg',
    ],
    tagline: '"Masterpiece Hotels" — true icons of elegance and individuality.',
    description: 'The Oetker Collection Pearl Partner programme provides privileged access to an extraordinary portfolio of "Masterpiece Hotels" — including Brenners Park-Hotel & Spa, Hôtel du Cap-Eden-Roc, and Le Bristol Paris. Each property is united by an uncompromising commitment to excellence.',
    category: 'invitation_only',
    property_count: 10,
    benefits: [
      { title: 'Daily Full American Breakfast', description: 'Full American-style breakfast for two guests, served daily.' },
      { title: 'Best Room in Category', description: 'Access to the best available room within the booked category.' },
      { title: 'Guaranteed Room Upgrade', description: 'One category room upgrade confirmed at time of booking, subject to availability.' },
      { title: 'Complimentary High-Speed Internet', description: 'Complimentary Wi-Fi throughout the stay.' },
      { title: 'Priority Courtesy Car Access', description: 'Priority access to the hotel courtesy car, where applicable.' },
      { title: 'Property Credit', description: '€95 ($100 USD) credit per stay; increased to €190 ($200 USD) for stays of 2+ nights.' },
    ],
    eligibility_notes: 'Pearl Partner benefits apply at all Oetker Collection properties when booked through an authorised travel agency.',
    booking_notes: 'Book through Eden for Your World and reference the Pearl Partner programme at time of reservation.',
    sort_order: 16,
    is_active: true,
  },
  {
    id: '17',
    slug: 'aman-hotels-and-resorts',
    name: 'AMAN',
    logo_url: HOTEL_LOGOS.aman,
    logo_url_white: HOTEL_LOGOS.amanWhite,
    image_url: '/media/hotel-programs/aman/aman-hero-2000.jpg',
    slider_images: [
      '/media/hotel-programs/aman/aman-slider-1-1500.jpg',
      '/media/hotel-programs/aman/aman-slider-2-1500.jpg',
      '/media/hotel-programs/aman/aman-slider-3-1500.jpg',
      '/media/hotel-programs/aman/aman-resorts-hotels-Featured Slider 1500.jpg',
      '/media/hotel-programs/aman/aman-resorts-hotels-Featured Slider 2 1500.jpg',
      '/media/hotel-programs/aman/aman-resorts-hotels-Featured Slider 3 1500.jpg',
    ],
    tagline: 'Sanctuary — redefined at the world\'s most serene destinations.',
    description: 'Aman is one of the world\'s most exclusive hotel groups, operating intimate sanctuaries in breathtaking settings across the globe. Aman properties are celebrated for extraordinary architecture, minimalist design, and deeply immersive guest experiences. Preferred agency bookings unlock an additional layer of personal service.',
    category: 'brand_programme',
    property_count: 35,
    benefits: [
      { title: 'Daily Breakfast for Two', description: 'Complimentary full breakfast for two guests, served daily.' },
      { title: 'Resort or Spa Credit', description: 'A resort or spa credit per stay for Aman Spa treatments or on-property experiences.' },
      { title: 'Complimentary Room Upgrade', description: 'Room upgrade based on availability at check-in.' },
      { title: 'Early Check-In & Late Check-Out', description: 'Flexible check-in and check-out, subject to availability.' },
      { title: 'Complimentary Wi-Fi', description: 'Complimentary high-speed internet access throughout the stay.' },
      { title: 'Personalised Recognition', description: 'Personalised welcome and attentive service from the Aman team throughout the stay.' },
    ],
    eligibility_notes: 'Benefits apply at all Aman properties when the reservation is made through Eden for Your World.',
    booking_notes: 'Book through Eden for Your World to unlock exclusive Aman preferred partner privileges.',
    sort_order: 17,
    is_active: true,
  },
  {
    id: '18',
    slug: 'montage-hotels',
    name: 'Montage Hotels & Resorts',
    logo_url: HOTEL_LOGOS.montage,
    logo_url_white: HOTEL_LOGOS.montageWhite,
    image_url: '/media/hotel-programs/montage/montage-hotels-Featured Slider 1500.jpg',
    slider_images: [
      '/media/hotel-programs/montage/montage-slider-1-1500.jpg',
      '/media/hotel-programs/montage/montage-slider-2-1500.jpg',
      '/media/hotel-programs/montage/montage-slider-3-1500.jpg',
      '/media/hotel-programs/montage/montage-slider-4-1500.jpg',
    ],
    tagline: 'Gracious service, inspired design, and cherished memories.',
    description: 'Montage Hotels & Resorts is a collection of ultra-luxury properties in iconic American destinations. The brand is celebrated for gracious, individualised service and its commitment to creating memories that last a lifetime. Preferred agency bookings add an exclusive layer of recognition and value.',
    category: 'brand_programme',
    property_count: 12,
    benefits: [
      { title: 'Daily Breakfast for Two', description: 'Complimentary breakfast for two guests, served daily.' },
      { title: 'Resort or Spa Credit', description: 'A resort or spa credit per stay for on-property experiences.' },
      { title: 'Complimentary Room Upgrade', description: 'Room upgrade based on availability at check-in.' },
      { title: 'Early Check-In & Late Check-Out', description: 'Priority early check-in and late check-out, subject to availability.' },
      { title: 'Complimentary Wi-Fi', description: 'Complimentary high-speed internet access throughout the stay.' },
      { title: 'Personalised Service', description: 'VIP recognition and deeply personalised service throughout the stay.' },
    ],
    eligibility_notes: 'Benefits apply at all Montage Hotels & Resorts when booked through Eden for Your World.',
    booking_notes: 'Book through Eden for Your World and reference the Montage preferred partner programme.',
    sort_order: 18,
    is_active: true,
  },
  {
    id: '19',
    slug: 'marriott-international-luminous',
    name: 'Marriott International — Stars & Luminous',
    logo_url: HOTEL_LOGOS.marriottLuminous,
    logo_url_white: HOTEL_LOGOS.marriottLuminousWhite,
    image_url: '/media/hotel-programs/marriott-stars---luminous/marriott-hero-2200.jpg',
    slider_images: [
      '/media/hotel-programs/marriott-stars---luminous/marriott-STARS-gallery-1-1500.jpg',
      '/media/hotel-programs/marriott-stars---luminous/edition-weho-1500.jpg',
      '/media/hotel-programs/marriott-stars---luminous/st-regis-maldives-1500.jpg',
      '/media/hotel-programs/marriott-stars---luminous/marriott-rome-1500.jpg',
      '/media/hotel-programs/marriott-stars---luminous/st-regis-glasshouse-china-1500.jpg',
      '/media/hotel-programs/marriott-stars---luminous/marriott-vancouver-1500.jpg',
      '/media/hotel-programs/marriott-stars---luminous/marriott-STARS-gallery-5-1500.jpg',
      '/media/hotel-programs/marriott-stars---luminous/marriott-STARS-gallery-6-1500.jpg',
      '/media/hotel-programs/marriott-stars---luminous/marriott-STARS-gallery-7-1500.jpg',
      '/media/hotel-programs/marriott-stars---luminous/marriott-STARS-gallery-8-1500.jpg',
    ],
    tagline: 'Luxury privileges at over 250 of the world\'s most prestigious Marriott properties.',
    description: 'Marriott Stars & Luminous is Marriott International\'s preferred partner programme covering luxury brands including The Ritz-Carlton, St. Regis, EDITION, The Luxury Collection, W Hotels, Bvlgari, and JW Marriott. The programme unlocks exclusive benefits at over 250 participating properties worldwide.',
    category: 'global_network',
    property_count: 250,
    benefits: [
      { title: 'Daily Breakfast for Two', description: 'Complimentary daily breakfast for two guests.' },
      { title: '$100 Hotel Credit', description: 'USD $100 hotel credit per stay at select participating properties.' },
      { title: 'Room Upgrade', description: 'Room upgrade upon availability at check-in.' },
      { title: 'Early Check-In & Late Check-Out', description: 'Early check-in and late check-out upon availability.' },
      { title: 'Welcome Amenity & VIP Status', description: 'In-room welcome amenity and VIP status recognition throughout the stay.' },
      { title: 'Complimentary Wi-Fi', description: 'Complimentary Wi-Fi throughout the stay.' },
    ],
    eligibility_notes: 'Benefits available at participating Marriott luxury brand properties when booked through a Stars & Luminous preferred agency.',
    booking_notes: 'Book through Eden for Your World. Ensure the Stars & Luminous rate is confirmed on your reservation.',
    sort_order: 19,
    is_active: true,
  },
  {
    id: '20',
    slug: 'leading-hotels-of-the-world',
    name: 'The Leading Hotels of the World',
    logo_url: HOTEL_LOGOS.leadingHotels,
    logo_url_white: HOTEL_LOGOS.leadingHotelsWhite,
    image_url: '/media/hotel-programs/leading-hotels/leading-hotels-hero-2000.jpg',
    slider_images: [
      '/media/hotel-programs/leading-hotels/leading-hotels-slider-1-1500.jpg',
      '/media/hotel-programs/leading-hotels/leading-hotels-slider-2-1500.jpg',
      '/media/hotel-programs/leading-hotels/leading-hotels-slider-3-1500.jpg',
      '/media/hotel-programs/leading-hotels/leading_hotels-Featured Slider 1500.jpg',
      '/media/hotel-programs/leading-hotels/leading_hotels-Featured Slider 2 1500.jpg',
      '/media/hotel-programs/leading-hotels/leading_hotels-Featured Slider 3 1500.jpg',
    ],
    tagline: 'The world\'s original collection of independent luxury hotels.',
    description: 'The Leading Hotels of the World is a prestigious collection of over 400 independent luxury hotels spanning more than 80 countries. Since 1928, it has been the gold standard in curated independent luxury travel, connecting discerning guests with extraordinary properties that reflect the unique character and culture of their destination. Booking through a preferred partner ensures exclusive recognition and benefits unavailable on any other channel.',
    category: 'global_network',
    property_count: 400,
    benefits: [
      { title: 'Upgrade Priority at Arrival', description: 'Priority upgrade to a superior room upon arrival, subject to availability.' },
      { title: 'Daily Continental Breakfast for Two', description: 'Complimentary continental breakfast for two guests, served daily.' },
      { title: 'Early Check-In & Late Check-Out', description: 'Early check-in and late check-out based on availability.' },
      { title: 'Complimentary Wi-Fi', description: 'High-speed Wi-Fi complimentary throughout the duration of the stay.' },
    ],
    eligibility_notes: 'Benefits apply at participating Leading Hotels of the World properties when booked through Eden for Your World.',
    booking_notes: 'Book through Eden for Your World and reference the Leading Hotels preferred partner programme to activate all benefits.',
    sort_order: 20,
    is_active: true,
  },
]

// ─── Data Fetchers ────────────────────────────────────────────────────────────

const DEMO_ID = 'demo-agent'
const isDemo = (agentId?: string) =>
  !agentId || agentId === DEMO_ID || !process.env.NEXT_PUBLIC_SUPABASE_URL

/** Fetch all active hotel programs ordered by sort_order */
export async function getHotelPrograms(): Promise<HotelProgram[]> {
  if (isDemo()) return MOCK_HOTEL_PROGRAMS

  try {
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('hotel_programs')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error || !data) return MOCK_HOTEL_PROGRAMS

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((row: any) => ({
      ...row,
      benefits: (row.benefits ?? []) as HotelProgramBenefit[],
    }))
  } catch {
    return MOCK_HOTEL_PROGRAMS
  }
}

/** Fetch a single hotel program by slug */
export async function getHotelProgram(slug: string): Promise<HotelProgram | null> {
  if (isDemo()) {
    return MOCK_HOTEL_PROGRAMS.find(p => p.slug === slug) ?? null
  }

  try {
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('hotel_programs')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error || !data) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = data as any
    return {
      ...row,
      benefits: (row.benefits ?? []) as HotelProgramBenefit[],
    }
  } catch {
    return MOCK_HOTEL_PROGRAMS.find(p => p.slug === slug) ?? null
  }
}

/** Get all slugs — used for generateStaticParams */
export async function getAllHotelProgramSlugs(): Promise<string[]> {
  const programs = await getHotelPrograms()
  return programs.map(p => p.slug)
}
