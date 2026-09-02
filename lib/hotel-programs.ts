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
  logo_url_black: string | null   // transparent black version for light/cream backgrounds
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

// ─── Agency-name tokens ───────────────────────────────────────────────────────

/**
 * `hotel_programs` is a single global catalogue shared by every advisor, so its
 * copy must never name one agency. Rows write `{{agency_name}}` instead — the
 * same token convention as blog shortcodes (`renderShortcodes` in lib/blog.ts)
 * — and each template resolves it against the advisor whose site is rendering.
 */
export function applyAgencyTokens(
  text: string | null | undefined,
  agencyName: string | null | undefined,
): string | null {
  if (!text) return text ?? null
  return text.replaceAll('{{agency_name}}', agencyName?.trim() || 'us')
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_HOTEL_PROGRAMS: HotelProgram[] = [
  {
    id: '1',
    slug: 'belmond-bellini-club',
    name: 'Belmond Bellini Club',
    logo_url: HOTEL_LOGOS.belmondBelliniClub,
    logo_url_white: HOTEL_LOGOS.belmondBelliniClubWhite,
    logo_url_black: HOTEL_LOGOS.belmondBelliniClubBlack,
    image_url: '/media/hotel-programs/belmond-bellini-club/belmond-hero-2000.jpg',
    slider_images: [
      '/media/hotel-programs/belmond-bellini-club/belmond-slider-1-1500.jpg',
      '/media/hotel-programs/belmond-bellini-club/belmond-slider-2-1500.jpg',
      '/media/hotel-programs/belmond-bellini-club/belmond-slider-4-1500.jpg',
      '/media/hotel-programs/belmond-bellini-club/home-slider-image-Belmond-Leapard.jpg',
      '/media/hotel-programs/belmond-bellini-club/belmond-cap-1500.jpg',
      '/media/hotel-programs/belmond-bellini-club/belmond-reids-1500.jpg',
      '/media/hotel-programs/belmond-bellini-club/belmond-siem-1500.jpg',
    ],
    tagline: 'The hotels, trains, and river cruises of Belmond — with you recognized at the door.',
    description: 'As a handpicked Bellini Club member, we pass on privileges reserved for Belmond\'s closest partners — a complimentary upgrade on arrival, a resort credit, and a VIP welcome before you check in.',
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
    eligibility_notes: 'Available exclusively to guests who book through {{agency_name}}.',
    booking_notes: 'Mention your booking through {{agency_name}} at check-in to ensure all Bellini Club benefits are applied.',
    sort_order: 1,
    is_active: true,
  },
  {
    id: '2',
    slug: 'dorchester-diamond-club',
    name: 'Diamond Club — Dorchester Collection',
    logo_url: HOTEL_LOGOS.dorchesterDiamondClub,
    logo_url_white: HOTEL_LOGOS.dorchesterDiamondClubWhite,
    logo_url_black: HOTEL_LOGOS.dorchesterDiamondClubBlack,
    image_url: '/media/hotel-programs/dorchester/dorchester-hero-2000.jpg',
    slider_images: [
      'https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-intro-1500.jpg',
      'https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-pool-belair-1500.jpg',
      'https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-front-BH-1500.jpg',
      'https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-dining-belair-1500.jpg',
      'https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-front-rome-1500.jpg',
      'https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-drink-rome-1500.jpg',
      'https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-lounge-belair-1500.jpg',
      'https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-pool-milan-1500.jpg',
      'https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-bath-milan-1500.jpg',
      'https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-bed-belair-1500.jpg',
      'https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-cafe-BH-1500.jpg',
      'https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-dinner-belair-1500.jpg',
      'https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-events-belair-1500.jpg',
      'https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-food-rome-1500.jpg',
      'https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-pool-BH-1500.jpg',
      'https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-pres-milan-1500.jpg',
      'https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-restaurant-belair-1500.jpg',
      'https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-room-rome-1500.jpg',
      'https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-service-1500.jpg',
      'https://zcllngvctqthvqaupxyt.supabase.co/storage/v1/object/public/hotel-covers/gallery/dorchester/dorchester-sign-BH-1500.jpg',
    ],
    tagline: 'The Dorchester, Le Meurice, Hotel Eden — at their most generous.',
    description: 'Our Diamond Club standing brings a room upgrade on arrival, daily breakfast, and a hotel credit at every Dorchester Collection address — arranged before you check in.',
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
    eligibility_notes: 'Must be booked through {{agency_name}} to unlock Diamond Club benefits.',
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
    logo_url_black: HOTEL_LOGOS.fourSeasonsPreferredBlack,
    image_url: '/media/hotel-programs/four-seasons/fs-hero-2200.jpg',
    slider_images: [
      '/media/hotel-programs/four-seasons/fs-hero_v2-2200.jpg',
      '/media/hotel-programs/four-seasons/fs-paris-1500.jpg',
      '/media/hotel-programs/four-seasons/fs-hawaii-1500.jpg',
      '/media/hotel-programs/four-seasons/fs-Golden_pool-1500.jpg',
      '/media/hotel-programs/four-seasons/fs-sayan_bali-1200.jpg',
      '/media/hotel-programs/four-seasons/fs-miami_surf-1500.jpg',
      '/media/hotel-programs/four-seasons/fs-explore_lodge-1500.jpg',
      '/media/hotel-programs/four-seasons/fs-lanai_wellness-1500.jpg',
      '/media/hotel-programs/four-seasons/fs-hangzhou-1500.jpg',
      '/media/hotel-programs/four-seasons/MAN_965_aspect16x9.jpg',
      '/media/hotel-programs/four-seasons/FS-residences-1500-video-bg.jpg',
      '/media/hotel-programs/four-seasons/fs-taormina-pool-couple-1080x1350.jpg',
    ],
    tagline: 'Four Seasons, anywhere in the world — with more than a reservation waiting.',
    description: 'As a Four Seasons Preferred Partner, we secure daily breakfast, a hotel credit, and a room upgrade on arrival when available — at properties from Bora Bora to Florence.',
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
    booking_notes: 'Rate must be booked through {{agency_name}}. Present the Preferred Partner confirmation at check-in.',
    sort_order: 3,
    is_active: true,
  },
  {
    id: '4',
    slug: 'ritz-carlton-stars',
    name: 'STARS — The Ritz-Carlton',
    logo_url: HOTEL_LOGOS.ritzCarltonStars,
    logo_url_white: HOTEL_LOGOS.ritzCarltonStarsWhite,
    logo_url_black: HOTEL_LOGOS.ritzCarltonStarsBlack,
    image_url: '/media/hotel-programs/marriott-luminous/Ritz-SB-hero-scaled.jpg',
    slider_images: [
      '/media/hotel-programs/marriott-luminous/st-regis-maldives-1500.jpg',
      '/media/hotel-programs/marriott-luminous/marriott-hero-2200.jpg',
      '/media/hotel-programs/marriott-luminous/marriott-slider-1-1500.jpg',
      '/media/hotel-programs/marriott-luminous/marriott-slider-2-1500.jpg',
      '/media/hotel-programs/marriott-stars---luminous/marriott-STARS-gallery-1-1500.jpg',
      '/media/hotel-programs/marriott-stars---luminous/ritz-yacht-santorini-1500.jpg',
      '/media/hotel-programs/marriott-stars---luminous/ritz-yacht-rear-1500.jpg',
      '/media/hotel-programs/marriott-stars---luminous/marriott-STARS-gallery-4-1500.jpg',
    ],
    tagline: 'Ritz-Carlton stays, elevated by touches arranged before you arrive.',
    description: 'Through STARS, a Ritz-Carlton stay carries a personal welcome from management, daily breakfast, a 4 PM checkout, and a room upgrade on arrival when available.',
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
    booking_notes: 'Book through {{agency_name}} and reference the STARS programme. Benefits confirmed at reservation.',
    sort_order: 4,
    is_active: true,
  },
  {
    id: '5',
    slug: 'rosewood-elite',
    name: 'Rosewood Elite',
    logo_url: HOTEL_LOGOS.rosewoodElite,
    logo_url_white: HOTEL_LOGOS.rosewoodEliteWhite,
    logo_url_black: HOTEL_LOGOS.rosewoodEliteBlack,
    image_url: '/media/hotel-programs/rosewood-elite/rosewood-hero-sb.jpg',
    slider_images: [
      '/media/hotel-programs/rosewood-elite/rosewood-miramar-hero-scaled.jpg',
      '/media/hotel-programs/rosewood-elite/rosewood-slider-1-1500.jpg',
      '/media/hotel-programs/rosewood-elite/rosewood-slider-2-1500.jpg',
      '/media/hotel-programs/rosewood-elite/rosewood-slider-3-1500.jpg',
      '/media/hotel-programs/rosewood-elite/rosewood-slider-4-1500.jpg',
      '/media/hotel-programs/rosewood-elite/rosewood-slider-5-1500.jpg',
      '/media/hotel-programs/rosewood-elite/guanzhou-rosewood-1500.jpg',
      '/media/hotel-programs/rosewood-elite/beijing-rosewood-1500.jpg',
    ],
    tagline: 'Rosewood\'s sense of place — and a welcome held just for you.',
    description: 'Our Rosewood Elite standing brings daily breakfast, a room upgrade on arrival, and a welcome from the property\'s managing director — arranged before you arrive.',
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
    booking_notes: 'Reservation must be placed through {{agency_name}} with the Rosewood Elite programme code.',
    sort_order: 5,
    is_active: true,
  },
  {
    id: '6',
    slug: 'hera-accor-hotels',
    name: 'Accor Preferred by HERA',
    logo_url: HOTEL_LOGOS.accorHera,
    logo_url_white: HOTEL_LOGOS.accorHeraWhite,
    logo_url_black: HOTEL_LOGOS.accorHeraBlack,
    image_url: '/media/hotel-programs/hera-accor/accor-hotels-1500-1.jpg',
    slider_images: [
      '/media/hotel-programs/hera-accor/accor-hotels-1500-2.jpg',
      '/media/hotel-programs/hera-accor/accor-hotels-1500-3.jpg',
      '/media/hotel-programs/hera-accor/Orient-express-1830x1200-1.jpg',
      '/media/hotel-programs/hera-accor/accor-FAENA-pool-1920.jpg',
    ],
    tagline: 'Raffles, Fairmont, and the Orient Express — across Accor\'s finest houses.',
    description: 'Booked through us, an Accor stay carries daily breakfast, a property credit, and a room upgrade on arrival — at Raffles, Fairmont, Sofitel, and beyond.',
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
    booking_notes: 'Book through {{agency_name}} and reference the HERA programme to activate benefits.',
    sort_order: 6,
    is_active: true,
  },
  {
    id: '7',
    slug: 'mandarin-oriental-fan-club',
    name: 'Mandarin Oriental Fan Club',
    logo_url: HOTEL_LOGOS.mandarinFanClub,
    logo_url_white: HOTEL_LOGOS.mandarinFanClubWhite,
    logo_url_black: HOTEL_LOGOS.mandarinFanClubBlack,
    image_url: '/media/hotel-programs/mandarin-oriental/mandarin-hero-2000.jpg',
    slider_images: [
      '/media/hotel-programs/mandarin-oriental/mandarin-slider-1-1500.jpg',
      '/media/hotel-programs/mandarin-oriental/mandarin-slider-2-1500.jpg',
      '/media/hotel-programs/mandarin-oriental/mandarin-slider-3-1500.jpg',
      '/media/hotel-programs/mandarin-oriental/mandarin-slider-4-1500.jpg',
      '/media/hotel-programs/mandarin-oriental/mandarin-oriental-fan-club-Featured-Slider-5-1500.jpg',
      '/media/hotel-programs/mandarin-oriental/mandarin-oriental-fan-club-Featured Slider 6 1500.jpg',
    ],
    tagline: 'Mandarin Oriental\'s legendary service — extended to you.',
    description: 'As Fan Club members, we arrange a room upgrade on arrival, daily breakfast, and a dining or spa credit at every Mandarin Oriental — set before you check in.',
    category: 'invitation_only',
    property_count: 35,
    benefits: [
      { title: 'Food & Beverage or Spa Credit', description: 'USD $100 credit applicable to food and beverage or spa services, per stay.' },
      { title: 'Daily Continental Breakfast', description: 'Complimentary continental breakfast for two guests, daily.' },
      { title: 'Complimentary High-Speed Internet', description: 'Complimentary Wi-Fi for the duration of the stay.' },
      { title: 'Personalised Welcome Amenity', description: 'A curated in-room gift and a personalised welcome note from senior management.' },
      { title: 'Room Category Upgrade', description: 'One category room upgrade, subject to availability at check-in.' },
    ],
    eligibility_notes: 'Fan Club benefits must be requested through your {{agency_name}} advisor at the time of booking.',
    booking_notes: 'Quote the Mandarin Oriental Fan Club programme when booking through {{agency_name}}.',
    sort_order: 7,
    is_active: true,
  },
  {
    id: '8',
    slug: 'shangri-la-hotels-the-luxury-circle',
    name: 'Shangri-La — The Luxury Circle',
    logo_url: HOTEL_LOGOS.shangriLaLuxuryCircle,
    logo_url_white: HOTEL_LOGOS.shangriLaLuxuryCircleWhite,
    logo_url_black: HOTEL_LOGOS.shangriLaLuxuryCircleBlack,
    image_url: '/media/hotel-programs/shangri-la/shangri-featured-1500.jpg',
    slider_images: [
      '/media/hotel-programs/shangri-la/shangri-slider-1-1500.jpg',
      '/media/hotel-programs/shangri-la/shangri-slider-2-1500.jpg',
      '/media/hotel-programs/shangri-la/shangri-slider-3-1500.jpg',
      '/media/hotel-programs/shangri-la/shangri-slider-4-1500.jpg',
      '/media/hotel-programs/shangri-la/ShangriLa-hotels-Hero-2000.jpg',
      '/media/hotel-programs/shangri-la/ShangriLa-hotels-Featured Slider 5 1500.jpg',
      '/media/hotel-programs/shangri-la/ShangriLa-hotels-Featured Slider 6 1500.jpg',
    ],
    tagline: 'Shangri-La\'s hospitality from the heart — at its most generous.',
    description: 'Our Luxury Circle standing brings a guaranteed room upgrade, daily breakfast, and a hotel credit at every Shangri-La — with a welcome arranged before you arrive.',
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
    booking_notes: 'Book through {{agency_name}} and mention The Luxury Circle programme at time of reservation.',
    sort_order: 8,
    is_active: true,
  },
  {
    id: '9',
    slug: 'rocco-forte-hotels',
    name: 'Sir Rocco\'s Knights — Rocco Forte Hotels',
    logo_url: HOTEL_LOGOS.roccoForte,
    logo_url_white: HOTEL_LOGOS.roccoForteWhite,
    logo_url_black: HOTEL_LOGOS.roccoForteBlack,
    image_url: '/media/hotel-programs/rocco-forte/roccoforte-hero-2000.jpg',
    slider_images: [
      '/media/hotel-programs/rocco-forte/roccoforte-featured-1500.jpg',
      '/media/hotel-programs/rocco-forte/roccoforte-slider-1-1500.jpg',
      '/media/hotel-programs/rocco-forte/roccoforte-slider-2-1500.jpg',
      '/media/hotel-programs/rocco-forte/roccoforte-slider-3-1500.jpg',
    ],
    tagline: 'Rocco Forte\'s European houses — Rome, London, Florence, and beyond.',
    description: 'Through Sir Rocco\'s Knights, we arrange daily breakfast, a dining credit, and a room upgrade across Rocco Forte\'s European houses — with a welcome before you arrive.',
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
    booking_notes: 'Book through {{agency_name}} and reference the Sir Rocco\'s Knights programme.',
    sort_order: 9,
    is_active: true,
  },
  {
    id: '10',
    slug: 'one-and-only-hotels-and-resorts',
    name: 'One&Only',
    logo_url: HOTEL_LOGOS.oneAndOnly,
    logo_url_white: HOTEL_LOGOS.oneAndOnlyWhite,
    logo_url_black: HOTEL_LOGOS.oneAndOnlyBlack,
    image_url: '/media/hotel-programs/one-and-only/oneandonly-resorts-Hero-2000.jpg',
    slider_images: [
      '/media/hotel-programs/one-and-only/oneandonly-slider-1-1500.jpg',
      '/media/hotel-programs/one-and-only/oneandonly-slider-2-1500.jpg',
      '/media/hotel-programs/one-and-only/oneandonly-slider-3-1500.jpg',
      '/media/hotel-programs/one-and-only/oneandonly-slider-4-1500.jpg',
      '/media/hotel-programs/one-and-only/oneandonly-featured-1500.jpg',
    ],
    tagline: 'One&Only\'s most extraordinary addresses — made personal.',
    description: 'Booked through us, a One&Only stay carries daily breakfast, a resort or spa credit, and a room upgrade on arrival — with recognition from the moment you land.',
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
    booking_notes: 'Contact {{agency_name}} to book and activate your exclusive One&Only benefits.',
    sort_order: 10,
    is_active: true,
  },
  {
    id: '11',
    slug: 'auberge-resorts-collection',
    name: 'Auberge Resorts Collection',
    logo_url: HOTEL_LOGOS.aubergeResorts,
    logo_url_white: HOTEL_LOGOS.aubergeResortsWhite,
    logo_url_black: HOTEL_LOGOS.aubergeResortsBlack,
    image_url: '/media/hotel-programs/auberge-resorts/auberge-hero-2000.jpg',
    slider_images: [
      '/media/hotel-programs/auberge-resorts/auberge-slider-1-1500.jpg',
      '/media/hotel-programs/auberge-resorts/auberge-slider-2-1500.jpg',
      '/media/hotel-programs/auberge-resorts/auberge-slider-3-1500.jpg',
      '/media/hotel-programs/auberge-resorts/auberge-resorts-Featured-Slider-4-1500.jpg',
      '/media/hotel-programs/auberge-resorts/auberge-featured-1500.jpg',
    ],
    tagline: 'Auberge\'s sense of place, in the world\'s most inspiring settings.',
    description: 'Our Auberge standing brings daily breakfast, a resort or spa credit, and a room upgrade on arrival — arranged before you ever reach the door.',
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
    eligibility_notes: 'Benefits apply at all Auberge Resorts Collection properties when booked through {{agency_name}}.',
    booking_notes: 'Book through {{agency_name}} and mention the preferred partner programme at reservation.',
    sort_order: 11,
    is_active: true,
  },
  {
    id: '12',
    slug: 'hyatt-prive',
    name: 'World of Hyatt Privé',
    logo_url: HOTEL_LOGOS.hyattPrive,
    logo_url_white: HOTEL_LOGOS.hyattPriveTransparent,
    logo_url_black: HOTEL_LOGOS.hyattPriveBlack,
    image_url: '/media/hotel-programs/hyatt-prive/hyatt-hero-2000.jpg',
    slider_images: [
      '/media/hotel-programs/hyatt-prive/hyatt-slider-1-1500.jpg',
      '/media/hotel-programs/hyatt-prive/hyatt-slider-2-1500.jpg',
      '/media/hotel-programs/hyatt-prive/hyatt-slider-3-1500.jpg',
      '/media/hotel-programs/hyatt-prive/hyatt-slider-4-1500.jpg',
      '/media/hotel-programs/hyatt-prive/hyatt-slider-5-1500.jpg',  // Park Hyatt Cabo del Sol exterior (1000px — replace when higher-res available)
      '/media/hotel-programs/hyatt-prive/hyatt-slider-6-1500.jpg',  // Miraval Arizona retreat patio (1000px — replace when higher-res available)
    ],
    tagline: 'Park Hyatt, Alila, Andaz — Hyatt\'s most exceptional houses.',
    description: 'Through World of Hyatt Privé, we arrange daily breakfast, a property credit, and a room upgrade on arrival at Park Hyatt, Alila, Andaz, and Grand Hyatt.',
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
    booking_notes: 'Book through {{agency_name}} and reference the Hyatt Privé programme at time of reservation.',
    sort_order: 12,
    is_active: true,
  },
  {
    id: '13',
    slug: 'kempinski-club-1897',
    name: 'Club 1897 — Kempinski',
    logo_url: HOTEL_LOGOS.kempinskiClub1897,
    logo_url_white: HOTEL_LOGOS.kempinskiClub1897White,
    logo_url_black: HOTEL_LOGOS.kempinskiClub1897Black,
    image_url: '/media/hotel-programs/kempinski-1897/kempinski-hero-scaled.jpg',
    slider_images: [
      '/media/hotel-programs/kempinski-1897/kempinski-slider-1-1500.jpg',
      '/media/hotel-programs/kempinski-1897/kempinski-slider-2-1500.jpg',
      '/media/hotel-programs/kempinski-1897/kempinski-slider-3-1500.jpg',
      '/media/hotel-programs/kempinski-1897/kempinski-featured-1080.jpg',
    ],
    tagline: 'Europe\'s oldest luxury house — a passport to its finest addresses.',
    description: 'Our Club 1897 standing brings a room upgrade, daily breakfast, and a hotel credit across Kempinski\'s palaces and resorts — arranged before you arrive.',
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
    booking_notes: 'Book through {{agency_name}} and reference Club 1897 to activate all programme benefits.',
    sort_order: 13,
    is_active: true,
  },
  {
    id: '14',
    slug: 'peninsula-pen-club',
    name: 'The Peninsula PenClub',
    logo_url: HOTEL_LOGOS.peninsulaPenClub,
    logo_url_white: HOTEL_LOGOS.peninsulaPenClubWhite,
    logo_url_black: HOTEL_LOGOS.peninsulaPenClubBlack,
    image_url: '/media/hotel-programs/peninsula/peninsula-hero.jpg',
    slider_images: [
      '/media/hotel-programs/peninsula/peninsula-brand-hero-2000.jpg',
      '/media/hotel-programs/peninsula/peninsula-slider-1-1500.jpg',
      '/media/hotel-programs/peninsula/peninsula-slider-2-1500.jpg',
      '/media/hotel-programs/peninsula/peninsula-slider-3-1500.jpg',
      '/media/hotel-programs/peninsula/peninsula-slider-4-1500.jpg',
      '/media/hotel-programs/peninsula-penclub/Peninsula-Hotels-Featured Slider 5 1500.jpg',
      '/media/hotel-programs/peninsula-penclub/Peninsula-Hotels-Featured Slider 6 1500.jpg',
    ],
    tagline: 'The Peninsula, on your schedule — Hong Kong, Paris, New York, and beyond.',
    description: 'As PenClub members, we arrange daily breakfast, a room upgrade, and Peninsula Time — flexible arrival and departure — at every Peninsula, set before you check in.',
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
    booking_notes: 'Book through {{agency_name}} and request PenClub benefits to be noted on the reservation.',
    sort_order: 14,
    is_active: true,
  },
  {
    id: '15',
    slug: 'como-hotels',
    name: 'COMO Hotels and Resorts',
    logo_url: HOTEL_LOGOS.comoHotels,
    logo_url_white: HOTEL_LOGOS.comoHotelsWhite,
    logo_url_black: HOTEL_LOGOS.comoHotelsBlack,
    image_url: '/media/hotel-programs/como-hotels/Como-hero-tuscany-2200.jpg',
    slider_images: [
      '/media/hotel-programs/como-hotels/COMO-hotels-1500-1.jpg',
      '/media/hotel-programs/como-hotels/COMO-hotels-1500-2.jpg',
      '/media/hotel-programs/como-hotels/COMO-hotels-1500-3.jpg',
    ],
    tagline: 'COMO\'s wellness and design — in the world\'s most beautiful places.',
    description: 'Booked through us, a COMO stay carries daily breakfast, a resort or spa credit, and a room upgrade on arrival — with a welcome arranged before you reach the door.',
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
    eligibility_notes: 'Benefits apply at all COMO Hotels and Resorts when booked through {{agency_name}}.',
    booking_notes: 'Contact {{agency_name}} to book and ensure preferred partner benefits are applied.',
    sort_order: 15,
    is_active: true,
  },
  {
    id: '16',
    slug: 'oetker-hotel-collection-pearl-partner',
    name: 'Pearl Partner — Oetker Collection',
    logo_url: HOTEL_LOGOS.oetkerPearl,
    logo_url_white: HOTEL_LOGOS.oetkerPearlWhite,
    logo_url_black: HOTEL_LOGOS.oetkerPearlBlack,
    image_url: '/media/hotel-programs/oetker-pearl/oetker-ducap-1500.jpg',
    slider_images: [
      '/media/hotel-programs/oetker-pearl/oetker-eden_rock_villa-1500.jpg',
      '/media/hotel-programs/oetker-pearl/oetker-estate-1500.jpg',
      '/media/hotel-programs/oetker-pearl/oetker-lifestyle-couple-1500.jpg',
      '/media/hotel-programs/oetker-pearl/oetker-eden_villa-1500.jpg',
      '/media/hotel-programs/oetker-pearl/oetker-featured.jpg',
    ],
    tagline: 'Oetker\'s Masterpiece Hotels — Le Bristol, Eden-Roc, Brenners.',
    description: 'Our Pearl Partner standing brings a guaranteed room upgrade, daily breakfast, and a property credit at Oetker\'s Masterpiece Hotels — arranged before you arrive.',
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
    booking_notes: 'Book through {{agency_name}} and reference the Pearl Partner programme at time of reservation.',
    sort_order: 16,
    is_active: true,
  },
  {
    id: '17',
    slug: 'aman-hotels-and-resorts',
    name: 'AMAN',
    logo_url: HOTEL_LOGOS.aman,
    logo_url_white: HOTEL_LOGOS.amanWhite,
    logo_url_black: HOTEL_LOGOS.amanBlack,
    image_url: '/media/hotel-programs/aman/aman-hero-2000.jpg',
    slider_images: [
      '/media/hotel-programs/aman/aman-featured-1500.jpg',
      '/media/hotel-programs/aman/aman-slider-1-1500.jpg',
      '/media/hotel-programs/aman/aman-slider-2-1500.jpg',
      '/media/hotel-programs/aman/aman-slider-3-1500.jpg',
      '/media/hotel-programs/aman/home-slider-image-AmanPuri-Thailand.jpg',
    ],
    tagline: 'Aman\'s sanctuaries — quiet, remote, and entirely yours.',
    description: 'Booked through us, an Aman stay carries daily breakfast, a resort or spa credit, and a room upgrade on arrival — with a welcome arranged before you reach the door.',
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
    eligibility_notes: 'Benefits apply at all Aman properties when the reservation is made through {{agency_name}}.',
    booking_notes: 'Book through {{agency_name}} to unlock exclusive Aman preferred partner privileges.',
    sort_order: 17,
    is_active: true,
  },
  {
    id: '18',
    slug: 'montage-hotels',
    name: 'Montage Hotels & Resorts',
    logo_url: HOTEL_LOGOS.montage,
    logo_url_white: HOTEL_LOGOS.montageWhite,
    logo_url_black: HOTEL_LOGOS.montageBlack,
    image_url: '/media/hotel-programs/montage/montage-cabo-spa_pool-1500.jpg',
    slider_images: [
      '/media/hotel-programs/montage/montage-slider-1-1500.jpg',
      '/media/hotel-programs/montage/montage-slider-2-1500.jpg',
      '/media/hotel-programs/montage/montage-slider-3-1500.jpg',
      '/media/hotel-programs/montage/montage-slider-4-1500.jpg',
    ],
    tagline: 'Montage\'s gracious service, at America\'s most celebrated resorts.',
    description: 'Our Montage standing brings daily breakfast, a resort or spa credit, and a room upgrade on arrival — arranged before you ever reach the door.',
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
    eligibility_notes: 'Benefits apply at all Montage Hotels & Resorts when booked through {{agency_name}}.',
    booking_notes: 'Book through {{agency_name}} and reference the Montage preferred partner programme.',
    sort_order: 18,
    is_active: true,
  },
  {
    id: '19',
    slug: 'marriott-international-luminous',
    name: 'Marriott International — Stars & Luminous',
    logo_url: HOTEL_LOGOS.marriottLuminous,
    logo_url_white: HOTEL_LOGOS.marriottLuminousWhite,
    logo_url_black: HOTEL_LOGOS.marriottLuminousBlack,
    image_url: '/media/hotel-programs/marriott-luminous/marriott-hero-2200.jpg',
    slider_images: [
      '/media/hotel-programs/marriott-luminous/marriott-slider-1-1500.jpg',
      '/media/hotel-programs/marriott-luminous/marriott-slider-2-1500.jpg',
      '/media/hotel-programs/marriott-luminous/marriott-slider-3-1500.jpg',
      '/media/hotel-programs/marriott-luminous/marriott-slider-4-1500.jpg',
      '/media/hotel-programs/marriott-luminous/marriott-hotels-1500-1.jpg',
      '/media/hotel-programs/marriott-luminous/marriott-hotels-1500-2.jpg',
      '/media/hotel-programs/marriott-luminous/marriott-hotels-1500-3.jpg',
      '/media/hotel-programs/marriott-stars---luminous/marriott-STARS-gallery-1-1500.jpg',
      '/media/hotel-programs/marriott-stars---luminous/edition-weho-1500.jpg',
      '/media/hotel-programs/marriott-stars---luminous/st-regis-maldives-1500.jpg',
      '/media/hotel-programs/marriott-stars---luminous/marriott-rome-1500.jpg',
      '/media/hotel-programs/marriott-stars---luminous/st-regis-glasshouse-china-1500.jpg',
      '/media/hotel-programs/marriott-stars---luminous/marriott-vancouver-1500.jpg',
      '/media/hotel-programs/marriott-stars---luminous/marriott-STARS-gallery-6-1500.jpg',
      '/media/hotel-programs/marriott-stars---luminous/marriott-STARS-gallery-7-1500.jpg',
      '/media/hotel-programs/marriott-stars---luminous/marriott-STARS-gallery-8-1500.jpg',
    ],
    tagline: 'St. Regis, EDITION, Bvlgari — Marriott\'s luxury houses, elevated.',
    description: 'Through Stars & Luminous, we arrange daily breakfast, a hotel credit, and a room upgrade on arrival at St. Regis, EDITION, Bvlgari, and The Luxury Collection.',
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
    booking_notes: 'Book through {{agency_name}}. Ensure the Stars & Luminous rate is confirmed on your reservation.',
    sort_order: 19,
    is_active: true,
  },
  {
    id: '20',
    slug: 'leading-hotels-of-the-world',
    name: 'The Leading Hotels of the World',
    logo_url: HOTEL_LOGOS.leadingHotels,
    logo_url_white: HOTEL_LOGOS.leadingHotelsWhite,
    logo_url_black: HOTEL_LOGOS.leadingHotelsBlack,
    image_url: '/media/hotel-programs/leading-hotels/leading-hotels-hero-2000.jpg',
    slider_images: [
      // ─── Newly added member-property shots ───────────────────────────
      '/media/hotel-programs/leading-hotels/le-sirenuse.webp',          // Le Sirenuse · Positano
      '/media/hotel-programs/leading-hotels/hotel-hassler.webp',        // Hotel Hassler · Rome
      '/media/hotel-programs/leading-hotels/la-mamounia.webp',          // La Mamounia · Marrakech
      '/media/hotel-programs/leading-hotels/dangleterre.webp',          // Hotel d'Angleterre · Copenhagen
      '/media/hotel-programs/leading-hotels/thelowell.webp',            // The Lowell · New York
      '/media/hotel-programs/leading-hotels/sukhothai-suite-01.webp',   // The Sukhothai · Bangkok
      // ─── Legacy brand-led shots (kept for variety) ───────────────────
      '/media/hotel-programs/leading-hotels/leading-hotels-slider-1-1500.jpg',
      '/media/hotel-programs/leading-hotels/leading-hotels-slider-2-1500.jpg',
      '/media/hotel-programs/leading-hotels/leading-hotels-slider-3-1500.jpg',
      '/media/hotel-programs/leading-hotels/leading-hotels-featured-1500.jpg',
    ],
    tagline: 'Over 400 independent houses — each unmistakably of its place.',
    description: 'As a Leading Hotels partner, we arrange a room upgrade on arrival, daily breakfast, and early check-in across more than 400 independent hotels worldwide.',
    category: 'global_network',
    property_count: 400,
    benefits: [
      { title: 'Upgrade Priority at Arrival', description: 'Priority upgrade to a superior room upon arrival, subject to availability.' },
      { title: 'Daily Continental Breakfast for Two', description: 'Complimentary continental breakfast for two guests, served daily.' },
      { title: 'Early Check-In & Late Check-Out', description: 'Early check-in and late check-out based on availability.' },
      { title: 'Complimentary Wi-Fi', description: 'High-speed Wi-Fi complimentary throughout the duration of the stay.' },
    ],
    eligibility_notes: 'Benefits apply at participating Leading Hotels of the World properties when booked through {{agency_name}}.',
    booking_notes: 'Book through {{agency_name}} and reference the Leading Hotels preferred partner programme to activate all benefits.',
    sort_order: 20,
    is_active: true,
  },
  // ── Brands added 2026-06 — logos in the catalog; benefits to be filled by the
  //    operator via the admin editor / a future seed once verified (no fabricated perks). ──
  {
    id: '21',
    slug: 'six-senses',
    name: 'Six Senses',
    logo_url: '/assets/supplier logos/black transparent/SixSenses-logo-black-600.png',
    logo_url_white: '/assets/supplier logos/white transparent/SixSenses-logo-white-600.png',
    logo_url_black: '/assets/supplier logos/black transparent/SixSenses-logo-black-600.png',
    image_url: '/media/hotel-programs/six-senses/Six_Senses-Hero-2000.jpg',
    slider_images: [
      '/media/hotel-programs/six-senses/Six_Senses-Featured%20Slider%205%201500.jpg',        // Maldives · Laamu
      '/media/hotel-programs/six-senses/Six_Senses-Featured%20Section%201500.jpg',           // Uluwatu · Bali
      '/media/hotel-programs/six-senses/Six_Senses-Featured%20Slider%201500.jpg',            // Spa arrival court
      '/media/hotel-programs/six-senses/Six_Senses-Featured%20Slider%204%201500.jpg',        // Bhutan · Punakha
      '/media/hotel-programs/six-senses/Six_Senses-post-content-2-1080.jpg',                 // Yoga over the sea
      '/media/hotel-programs/six-senses/Six_Senses-Featured%20Slider%206%201500.jpg',        // Con Dao · Vietnam
      '/media/hotel-programs/six-senses/Six_Senses-Featured%20Slider%202%201500.jpg',        // Travertine lap pool
      '/media/hotel-programs/six-senses/Six_Senses-Sustainability-Section-1500.jpg',         // Earth Lab garden
      '/media/hotel-programs/six-senses/Six_Senses-Featured%20Slider%203%201500.jpg',        // Hydrothermal suite
      '/media/hotel-programs/six-senses/Six_Senses_hotels-post-content-2-1080.jpg',          // Alchemy Bar
      '/media/hotel-programs/six-senses/Six_Senses-post-content-1-1080.jpg',                 // Yao Noi · villa pool
    ],
    tagline: 'Wellness, sustainability, and the quiet corners of the world.',
    description: 'Six Senses resorts and spas, booked through our preferred partnership — with the recognition and on-property privileges it carries.',
    category: 'brand_programme',
    property_count: null,
    benefits: [
      { title: 'Room Upgrade on Arrival', description: 'Upgrade to the next room or villa category at check-in, subject to availability.' },
      { title: 'Daily Breakfast for Two', description: 'Full breakfast for two guests, served daily throughout the stay.' },
      { title: 'Resort Credit', description: 'A credit to spend across the spa, wellness programme, or dining — typically USD 100 equivalent, once per stay.' },
      { title: 'Early Check-In & Late Check-Out', description: 'Extended arrival and departure times, subject to availability.' },
      { title: 'Complimentary Wi-Fi', description: 'High-speed internet throughout the duration of your stay.' },
      { title: 'VIP Welcome & Recognition', description: 'A welcome amenity on arrival and recognition by the resort team.' },
    ],
    eligibility_notes: 'Benefits apply at participating Six Senses resorts and spas when the reservation is placed through {{agency_name}}.',
    booking_notes: 'Book through {{agency_name}} and request the Six Senses preferred partner rate so every benefit is noted on your reservation.',
    sort_order: 21,
    is_active: true,
  },
  {
    id: '22',
    slug: 'jumeirah-passport',
    name: 'Jumeirah Passport',
    logo_url: '/assets/supplier logos/black transparent/jumeirah_passport-black-600.png',
    logo_url_white: '/assets/supplier logos/white transparent/jumeirah-passport-logo-white-600.png',
    logo_url_black: '/assets/supplier logos/black transparent/jumeirah_passport-black-600.png',
    image_url: '/media/hotel-programs/jumeirah/Burj-Al-Arab-Jumeirah-hero-2500.jpg',
    slider_images: [
      '/media/hotel-programs/jumeirah/burj-al-arab-jumeirah-aerial-at-sunset-1-1.jpg',
      '/media/hotel-programs/jumeirah/jcomheroimagejumeirah-dar-al-masyaf--villa--cluster--pool--drone--lifestyle.jpg',
      '/media/hotel-programs/jumeirah/jumeirah-al-qasr-hero-shot-exterior-lifestyle-5_16-9_landscape.jpg',
      '/media/hotel-programs/jumeirah/jumeirah-al-naseem-wadi-pool-cabana-pool-side_square.jpg',
      '/media/hotel-programs/jumeirah/jumeirah-vittaveli--main-pool-3-11.jpg',
      '/media/hotel-programs/jumeirah/jumeirah-mallorca-spa.jpg',
      '/media/hotel-programs/jumeirah/jumeirah-mallorca-suite.jpg',
      '/media/hotel-programs/jumeirah/al-qasr-ocean-deluxe-suite-16-9_landscape.jpg',
      '/media/hotel-programs/jumeirah/grosvenor-house-suites-by-jumeirah-living-grosvenor-penthouse-living-room_16_landscape.jpg',
      '/media/hotel-programs/jumeirah/11jumeirahhotelguangzhouchairmansuite_landscape.jpg',
    ],
    tagline: 'Jumeirah\'s landmark hotels — Dubai, London, and beyond.',
    description: 'Jumeirah\'s flagship properties, booked through the Passport partnership — with the recognition and added privileges reserved for it.',
    category: 'brand_programme',
    property_count: null,
    benefits: [
      { title: 'Room Upgrade on Arrival', description: 'Upgrade to the next available room category at check-in, subject to availability.' },
      { title: 'Daily Breakfast for Two', description: 'Breakfast for two guests, served daily throughout the stay.' },
      { title: 'Hotel Credit', description: 'A food, beverage, or spa credit applied to your stay — typically USD 100 equivalent, once per stay.' },
      { title: 'Early Check-In & Late Check-Out', description: 'Extended arrival and departure times, subject to availability.' },
      { title: 'Complimentary Wi-Fi', description: 'High-speed internet throughout the duration of your stay.' },
      { title: 'VIP Welcome Amenity', description: 'A welcome gift in your room and recognition by the hotel team.' },
    ],
    eligibility_notes: 'Passport benefits apply at participating Jumeirah hotels and resorts when booked through {{agency_name}}.',
    booking_notes: 'Book through {{agency_name}} and reference Jumeirah Passport so the benefits are attached to your reservation.',
    sort_order: 22,
    is_active: true,
  },
  {
    id: '23',
    slug: 'preferred-hotels-resorts',
    name: 'Preferred Hotels & Resorts',
    logo_url: '/assets/supplier logos/black transparent/preferredHotels-logo-black-600.png',
    logo_url_white: '/assets/supplier logos/white transparent/preferredHotels-logo-white-600.png',
    logo_url_black: '/assets/supplier logos/black transparent/preferredHotels-logo-black-600.png',
    image_url: '/media/hotel-programs/preferred-hotels/Preferred_hotels-Hero-2000.jpg',
    slider_images: [
      '/media/hotel-programs/preferred-hotels/Preferred_hotels-Featured%20Slider%201500.jpg',
      '/media/hotel-programs/preferred-hotels/Preferred_hotels-Featured%20Section%201500.jpg',
      '/media/hotel-programs/preferred-hotels/Preferred_hotels-Featured%20Slider%202%201500.jpg',
      '/media/hotel-programs/preferred-hotels/Preferred_hotels-Featured%20Slider%203%201500.jpg',
      '/media/hotel-programs/preferred-hotels/Preferred_hotels-Featured%20Slider%204%201500.jpg',
      '/media/hotel-programs/preferred-hotels/Preferred_hotels-Featured%20Slider%205%201500.jpg',
      '/media/hotel-programs/preferred-hotels/Preferred_hotels-Featured%20Slider%206%201500.jpg',
      '/media/hotel-programs/preferred-hotels/Preferred_hotels-LEGEND-Section-1500.jpg',
      '/media/hotel-programs/preferred-hotels/Preferred_hotels-post-content-1-1080.jpg',
      '/media/hotel-programs/preferred-hotels/Preferred_hotels-post-content-2-1080.jpg',
    ],
    tagline: 'Independent hotels of character, the world over.',
    description: 'A global collection of independent luxury hotels, booked through our Preferred partnership — with member recognition and on-property benefits.',
    category: 'global_network',
    property_count: null,
    benefits: [
      { title: 'Room Upgrade on Arrival', description: 'Upgrade to the next available room category at check-in, subject to availability.' },
      { title: 'Daily Breakfast for Two', description: 'Breakfast for two guests, served daily throughout the stay.' },
      { title: 'Food & Beverage Credit', description: 'A property credit toward dining or the spa — typically USD 100 equivalent, once per stay.' },
      { title: 'Early Check-In & Late Check-Out', description: 'Extended arrival and departure times, subject to availability.' },
      { title: 'Complimentary Wi-Fi', description: 'High-speed internet throughout the duration of your stay.' },
    ],
    eligibility_notes: 'Benefits apply at participating Preferred Hotels & Resorts properties when booked through {{agency_name}}.',
    booking_notes: 'Book through {{agency_name}} and reference the Preferred partner programme at time of reservation.',
    sort_order: 23,
    is_active: true,
  },
  {
    id: '24',
    slug: 'couture',
    name: 'Couture by Langham',
    logo_url: '/assets/supplier logos/black transparent/couture-logo-black-600.png',
    logo_url_white: '/assets/supplier logos/white transparent/couture-logo-white-600.png',
    logo_url_black: '/assets/supplier logos/black transparent/couture-logo-black-600.png',
    image_url: '/media/hotel-programs/couture-by-langham/Hero-2000.jpg',
    slider_images: [
      '/media/hotel-programs/couture-by-langham/Featured%20Slider%201500.jpg',
      '/media/hotel-programs/couture-by-langham/Featured%20Section%201500.jpg',
      '/media/hotel-programs/couture-by-langham/Featured%20Slider%202%201500.jpg',
      '/media/hotel-programs/couture-by-langham/Featured%20Slider%203%201500.jpg',
      '/media/hotel-programs/couture-by-langham/Featured%20Slider%204%201500.jpg',
      '/media/hotel-programs/couture-by-langham/Featured%20Slider%205%201500.jpg',
      '/media/hotel-programs/couture-by-langham/Featured%20Slider%206%201500.jpg',
      '/media/hotel-programs/couture-by-langham/post-content-1-1080.jpg',
      '/media/hotel-programs/couture-by-langham/post-content-2-1080.jpg',
      '/media/hotel-programs/couture-by-langham/post-content-3-1080x1350.jpg',
    ],
    tagline: 'The Langham houses — London, Hong Kong, and beyond.',
    description: 'Couture is Langham Hospitality Group\'s programme for luxury travel advisors. Booked through it, your stay at a Langham, Cordis, or Eaton property carries partner recognition and a set of on-property privileges not available on a direct booking.',
    category: 'invitation_only',
    property_count: null,
    benefits: [
      { title: 'Room Upgrade on Arrival', description: 'Upgrade to the next available room category at check-in, subject to availability.' },
      { title: 'Daily Breakfast for Two', description: 'Breakfast for two guests, served daily throughout the stay.' },
      { title: 'Hotel Credit', description: 'A dining or spa credit applied to your stay — typically USD 100 equivalent, once per stay.' },
      { title: 'Early Check-In & Late Check-Out', description: 'Extended arrival and departure times, subject to availability.' },
      { title: 'Complimentary Wi-Fi', description: 'High-speed internet throughout the duration of your stay.' },
      { title: 'VIP Welcome Amenity', description: 'A welcome gift in your room and recognition by the hotel team.' },
    ],
    eligibility_notes: 'Couture benefits apply at participating Langham Hospitality Group properties when booked through {{agency_name}}.',
    booking_notes: 'Book through {{agency_name}} and reference the Couture programme so the benefits are confirmed on your reservation.',
    sort_order: 24,
    is_active: true,
  },
]

// ─── Data Fetchers ────────────────────────────────────────────────────────────

const DEMO_ID = 'demo-agent'
const DEMO_AGENT_IDS = new Set(['demo-agent', 't2-demo', 't3-demo', 'ytc-demo'])
const isDemo = (agentId?: string) =>
  !agentId || agentId === DEMO_ID || !process.env.NEXT_PUBLIC_SUPABASE_URL
const isAnyDemoAgent = (agentId?: string) => !!agentId && DEMO_AGENT_IDS.has(agentId)

/**
 * The DB (`hotel_programs`) is the single source of truth for program logos +
 * copy. We only fall back to MOCK_HOTEL_PROGRAMS when the Supabase env is
 * absent (offline/preview builds) — NOT merely because no agentId was passed.
 * This is what lets demo agents and the no-arg callers (t4 home, book-hotel
 * detail pages, admin, agent-portal) all render live DB content.
 */
const hasSupabaseEnv = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY

/** Fetch all active hotel programs ordered by sort_order */
export async function getHotelPrograms(): Promise<HotelProgram[]> {
  if (!hasSupabaseEnv()) return MOCK_HOTEL_PROGRAMS

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
  if (!hasSupabaseEnv()) {
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

// ─── Per-Agent Selections ─────────────────────────────────────────────────────

/**
 * Fetch the curated set of Hotel Programs configured for a specific agent.
 *
 * Behavior:
 *   - If the agent has zero rows in agent_hotel_program_selections (or the
 *     agent is a demo), falls back to the full global active set.
 *   - Otherwise returns only the enabled selections, ordered by the agent's
 *     per-row sort_order (ascending), then by the program's global sort_order.
 *
 * The fallback behavior means a brand-new agent record automatically shows
 * the full catalogue — admins only need to touch this when curating.
 */
export async function getAgentHotelPrograms(agentId?: string): Promise<HotelProgram[]> {
  // Offline/preview only — demo agents now read the live DB catalogue (they
  // simply have no agent_hotel_program_selections, so the no-selections branch
  // below falls through to the full global set from getHotelPrograms()).
  if (!hasSupabaseEnv()) {
    return MOCK_HOTEL_PROGRAMS
  }

  try {
    const supabase = createServiceClient()

    const { data: selections, error: selErr } = await supabase
      .from('agent_hotel_program_selections')
      .select('program_id, sort_order')
      .eq('agent_id', agentId!)
      .eq('is_enabled', true)
      .order('sort_order', { ascending: true })

    if (selErr) return getHotelPrograms()
    if (!selections || selections.length === 0) return getHotelPrograms()

    // Preserve the agent's custom ordering.
    const selectedIds = selections.map((s) => s.program_id)
    const { data: programs, error: progErr } = await supabase
      .from('hotel_programs')
      .select('*')
      .in('id', selectedIds)
      .eq('is_active', true)

    if (progErr || !programs) return getHotelPrograms()

    const orderIndex = new Map(selectedIds.map((id, i) => [id, i]))
    const sorted = [...programs].sort(
      (a, b) => (orderIndex.get(a.id) ?? 0) - (orderIndex.get(b.id) ?? 0)
    )

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return sorted.map((row: any) => ({
      ...row,
      benefits: (row.benefits ?? []) as HotelProgramBenefit[],
    }))
  } catch {
    return getHotelPrograms()
  }
}

/**
 * Fetch the raw set of program IDs the agent has selected (enabled or not).
 * Used by the admin + agent-portal UI to render checkbox state.
 */
export async function getAgentHotelProgramSelections(
  agentId: string
): Promise<Array<{ program_id: string; is_enabled: boolean; sort_order: number }>> {
  if (isDemo(agentId) || isAnyDemoAgent(agentId)) return []
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('agent_hotel_program_selections')
      .select('program_id, is_enabled, sort_order')
      .eq('agent_id', agentId)
      .order('sort_order', { ascending: true })

    if (error || !data) return []
    return data
  } catch {
    return []
  }
}

/**
 * Replace an agent's entire Hotel Programs selection set in one transaction.
 * Expects the caller (an API route) to use a service-role client when called
 * for admin-scoped writes. For agent-self writes, the caller should pass the
 * user-scoped client and rely on RLS to enforce `auth.uid() = agent_id`.
 */
export async function replaceAgentHotelProgramSelections(
  agentId: string,
  enabledProgramIds: string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client?: any
) {
  const supabase = client ?? createServiceClient()

  const { error: delErr } = await supabase
    .from('agent_hotel_program_selections')
    .delete()
    .eq('agent_id', agentId)
  if (delErr) throw delErr

  if (enabledProgramIds.length === 0) return

  const rows = enabledProgramIds.map((program_id, i) => ({
    agent_id: agentId,
    program_id,
    is_enabled: true,
    sort_order: i,
  }))

  const { error: insErr } = await supabase
    .from('agent_hotel_program_selections')
    .insert(rows)
  if (insErr) throw insErr
}

/**
 * Update a single hotel program's editable fields (logos + client-facing copy).
 * Used by the admin Hotel Programs editor. Service-role only — the caller (an
 * admin API route) must gate on super-admin. Only whitelisted fields are
 * written, so a stray body key can never touch slug/benefits/etc.
 */
export type HotelProgramUpdate = Partial<
  Pick<HotelProgram, 'logo_url' | 'logo_url_white' | 'logo_url_black' | 'tagline' | 'description'>
>

export async function updateHotelProgram(
  programId: string,
  fields: HotelProgramUpdate,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client?: any
) {
  const supabase = client ?? createServiceClient()

  const allowed: (keyof HotelProgramUpdate)[] = [
    'logo_url',
    'logo_url_white',
    'logo_url_black',
    'tagline',
    'description',
  ]
  const patch: Record<string, unknown> = {}
  for (const k of allowed) {
    if (fields[k] !== undefined) patch[k] = fields[k]
  }
  if (Object.keys(patch).length === 0) return

  const { error } = await supabase
    .from('hotel_programs')
    .update(patch)
    .eq('id', programId)
  if (error) throw error
}
