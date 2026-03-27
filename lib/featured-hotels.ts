// ─── Featured Hotels per Program ──────────────────────────────────────────────
// Sourced from Virtuoso_Hotels_Database.xlsx — 6 curated properties per program.
// All images are downloaded locally to public/media/hotel-programs/featured/[slug]/
// To update: drop new JPGs in the folder and update the path below.

export interface FeaturedHotel {
  name: string
  city: string
  country: string
  image_url: string
  detail_url: string
  description?: string
}

const F = (slug: string, file: string) =>
  `/media/hotel-programs/featured/${slug}/${file}`

export const FEATURED_HOTELS: Record<string, FeaturedHotel[]> = {
  'four-seasons-preferred-partner': [
    {
      name: 'Four Seasons Resort and Residences Anguilla',
      city: 'West End', country: 'Anguilla',
      image_url: F('four-seasons-preferred-partner', '01-four-seasons-resort-and-residences-anguilla.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/four-seasons-anguilla',
      description: 'Stunning beachfront suites on the Caribbean\'s most exclusive island.',
    },
    {
      name: 'Four Seasons Hotel Buenos Aires',
      city: 'Buenos Aires', country: 'Argentina',
      image_url: F('four-seasons-preferred-partner', '02-four-seasons-hotel-buenos-aires.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/four-seasons-buenos-aires',
      description: 'A Palermo landmark blending Belle Époque grandeur with Argentine elegance.',
    },
    {
      name: 'Four Seasons Hotel Sydney',
      city: 'Sydney', country: 'Australia',
      image_url: F('four-seasons-preferred-partner', '03-four-seasons-hotel-sydney.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/four-seasons-sydney',
      description: 'Harbourside luxury steps from the Opera House and Circular Quay.',
    },
    {
      name: 'The Ocean Club, A Four Seasons Resort, Bahamas',
      city: 'Nassau', country: 'Bahamas',
      image_url: F('four-seasons-preferred-partner', '04-the-ocean-club-a-four-seasons-resort-bahamas.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/ocean-club-four-seasons-bahamas',
      description: 'Legendary Ocean Club on Paradise Island — private beach, golf, spa.',
    },
    {
      name: 'Four Seasons Hotel George V',
      city: 'Paris', country: 'France',
      image_url: F('four-seasons-preferred-partner', '05-four-seasons-hotel-george-v.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/four-seasons-george-v-paris',
      description: 'Art Deco palace near the Champs-Élysées, three Michelin-starred dining.',
    },
    {
      name: 'Four Seasons Resort Bali at Sayan',
      city: 'Ubud', country: 'Indonesia',
      image_url: F('four-seasons-preferred-partner', '06-four-seasons-resort-bali-at-sayan.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/four-seasons-bali-sayan',
      description: 'Jungle canopy retreat above the Ayung River — ultimate Balinese sanctuary.',
    },
  ],

  'belmond-bellini-club': [
    {
      name: 'Belmond Hotel Cipriani, Venice',
      city: 'Venice', country: 'Italy',
      image_url: F('belmond-bellini-club', '01-belmond-hotel-cipriani-venice.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/belmond-cipriani',
      description: 'An island sanctuary with pool, garden and legendary Venetian hospitality.',
    },
    {
      name: 'Copacabana Palace, A Belmond Hotel',
      city: 'Rio de Janeiro', country: 'Brazil',
      image_url: F('belmond-bellini-club', '02-copacabana-palace-a-belmond-hotel-rio-de-janeiro.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/belmond-copacabana-palace',
      description: 'Rio\'s most glamorous address — rooftop pool and carnival views.',
    },
    {
      name: 'Caruso, A Belmond Hotel, Amalfi Coast',
      city: 'Ravello', country: 'Italy',
      image_url: F('belmond-bellini-club', '03-caruso-a-belmond-hotel-amalfi-coast.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/belmond-caruso',
      description: '11th-century palazzo perched over the Med with an infinity pool.',
    },
    {
      name: 'Cap Juluca, A Belmond Hotel',
      city: 'Anguilla', country: 'Anguilla',
      image_url: F('belmond-bellini-club', '04-cap-juluca-a-belmond-hotel-anguilla.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/belmond-cap-juluca',
      description: 'Moorish white villas arcing around pristine Maundays Bay beach.',
    },
    {
      name: 'Castello di Casole, A Belmond Hotel, Tuscany',
      city: 'Casole d\'Elsa', country: 'Italy',
      image_url: F('belmond-bellini-club', '05-castello-di-casole-a-belmond-hotel-tuscany.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/belmond-castello-di-casole',
      description: '1,000-year-old castle among Tuscan vineyards and rolling hills.',
    },
    {
      name: 'Casa de Sierra Nevada, A Belmond Hotel',
      city: 'San Miguel de Allende', country: 'Mexico',
      image_url: F('belmond-bellini-club', '06-casa-de-sierra-nevada-a-belmond-hotel-san-miguel-d.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/belmond-casa-sierra-nevada',
      description: 'Colonial hacienda in a UNESCO World Heritage town in central Mexico.',
    },
  ],

  'dorchester-diamond-club': [
    {
      name: 'The Dorchester, London',
      city: 'London', country: 'United Kingdom',
      image_url: F('dorchester-diamond-club', '01-the-dorchester.jpg'), // placeholder until added
      detail_url: 'https://www.dorchestercollection.com/london/the-dorchester',
      description: 'Iconic Park Lane address — the pinnacle of British luxury since 1931.',
    },
    {
      name: 'Hotel Bel-Air',
      city: 'Los Angeles', country: 'United States',
      image_url: F('dorchester-diamond-club', '02-hotel-bel-air.jpg'),
      detail_url: 'https://www.dorchestercollection.com/los-angeles/hotel-bel-air',
      description: 'Exclusive canyon retreat — 12 acres of gardens and a legendary Swan Lake.',
    },
    {
      name: 'The Beverly Hills Hotel',
      city: 'Beverly Hills', country: 'United States',
      image_url: F('dorchester-diamond-club', '03-the-beverly-hills-hotel.jpg'),
      detail_url: 'https://www.dorchestercollection.com/los-angeles/the-beverly-hills-hotel',
      description: 'Hollywood\'s pink palace — bungalows, pool cabanas, and old-school glamour.',
    },
    {
      name: 'Hôtel Plaza Athénée, Paris',
      city: 'Paris', country: 'France',
      image_url: F('dorchester-diamond-club', '04-hotel-plaza-athenee.jpg'),
      detail_url: 'https://www.dorchestercollection.com/paris/hotel-plaza-athenee',
      description: 'Haute couture address on avenue Montaigne, featuring iconic red awnings.',
    },
    {
      name: 'Hotel Eden, Rome',
      city: 'Rome', country: 'Italy',
      image_url: F('dorchester-diamond-club', '05-hotel-eden.jpg'),
      detail_url: 'https://www.dorchestercollection.com/rome/hotel-eden',
      description: 'Pincian Hill palazzo overlooking Rome — terrace dining above the Eternal City.',
    },
    {
      name: 'Le Meurice, Paris',
      city: 'Paris', country: 'France',
      image_url: F('dorchester-diamond-club', '06-le-meurice.jpg'),
      detail_url: 'https://www.dorchestercollection.com/paris/le-meurice',
      description: 'The hotel of kings and artists, standing opposite the Tuileries Garden.',
    },
  ],

  'ritz-carlton-stars': [
    {
      name: 'The Ritz-Carlton Maldives, Fari Islands',
      city: 'Fari Islands', country: 'Maldives',
      image_url: F('ritz-carlton-stars', '01-the-ritz-carlton-maldives-fari-islands.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/ritz-carlton-maldives-fari',
      description: 'Overwater villa clusters in the North Malé Atoll — pure seclusion.',
    },
    {
      name: 'The St. Regis Bali Resort',
      city: 'Nusa Dua', country: 'Indonesia',
      image_url: F('ritz-carlton-stars', '02-the-st-regis-bali-resort.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/st-regis-bali',
      description: 'Private villa lagoon sanctuary on Bali\'s most exclusive southern tip.',
    },
    {
      name: 'The St. Regis Florence',
      city: 'Florence', country: 'Italy',
      image_url: F('ritz-carlton-stars', '03-the-st-regis-florence.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/st-regis-florence',
      description: 'Renaissance palace on the Arno — butler service and frescoed suites.',
    },
    {
      name: 'The Ritz-Carlton, Kyoto',
      city: 'Kyoto', country: 'Japan',
      image_url: F('ritz-carlton-stars', '04-the-ritz-carlton-kyoto.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/ritz-carlton-kyoto',
      description: 'Ryokan-inspired luxury beside the Kamogawa River — Japan in full bloom.',
    },
    {
      name: 'Bulgari Hotel Paris',
      city: 'Paris', country: 'France',
      image_url: F('ritz-carlton-stars', '05-bulgari-hotel-paris.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/bulgari-hotel-paris',
      description: 'Haussmann mansion and private garden steps from the Arc de Triomphe.',
    },
    {
      name: 'The Ritz-Carlton, Amman',
      city: 'Amman', country: 'Jordan',
      image_url: F('ritz-carlton-stars', '06-the-ritz-carlton-amman.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/ritz-carlton-amman',
      description: 'Sophisticated haven in the Jordanian capital with panoramic city views.',
    },
  ],

  'rosewood-elite': [
    {
      name: 'Rosewood Miramar Beach',
      city: 'Santa Barbara', country: 'United States',
      image_url: F('rosewood-elite', '01-rosewood-miramar-beach.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/rosewood-miramar-beach',
      description: 'Beachfront estate in Montecito — the California Riviera at its finest.',
    },
    {
      name: 'Rosewood Hong Kong',
      city: 'Hong Kong', country: 'China',
      image_url: F('rosewood-elite', '02-rosewood-hong-kong.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/rosewood-hong-kong',
      description: 'Sky-high harbour views from a landmark 65-storey tower in Kowloon.',
    },
    {
      name: 'Rosewood Villa Magna, Madrid',
      city: 'Madrid', country: 'Spain',
      image_url: F('rosewood-elite', '03-rosewood-villa-magna.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/rosewood-villa-magna',
      description: 'Reborn Madrid legend on the Paseo de la Castellana — art, design, Michelin.',
    },
    {
      name: 'Rosewood Mayakoba',
      city: 'Playa del Carmen', country: 'Mexico',
      image_url: F('rosewood-elite', '04-rosewood-mayakoba.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/rosewood-mayakoba',
      description: 'Thatched palapa villas in a jungle lagoon on the Riviera Maya.',
    },
    {
      name: 'Rosewood Bermuda',
      city: 'Hamilton', country: 'Bermuda',
      image_url: F('rosewood-elite', '05-rosewood-bermuda.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/rosewood-bermuda',
      description: 'Pastel-pink cottages on Tucker\'s Point — private beach and pink sand.',
    },
    {
      name: 'Rosewood Luang Prabang',
      city: 'Luang Prabang', country: 'Laos',
      image_url: F('rosewood-elite', '05-rosewood-bermuda.jpg'), // shares image — update when available
      detail_url: 'https://www.virtuoso.com/hotels/rosewood-luang-prabang',
      description: 'Hillside tented villas above the Mekong in a UNESCO World Heritage city.',
    },
  ],

  'hera-accor-hotels': [
    {
      name: 'Faena Hotel Miami Beach',
      city: 'Miami Beach', country: 'United States',
      image_url: F('hera-accor-hotels', '01-faena-hotel-miami-beach.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/faena-hotel-miami',
      description: 'Philippe Starck-designed ultra-luxury on the Art Deco mid-beach strip.',
    },
    {
      name: 'Sofitel Legend Metropole Hanoi',
      city: 'Hanoi', country: 'Vietnam',
      image_url: F('hera-accor-hotels', '02-sofitel-legend-metropole-hanoi.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/sofitel-metropole-hanoi',
      description: 'French colonial icon dating to 1901 — Hanoi\'s most historic hotel.',
    },
    {
      name: 'Fairmont Banff Springs',
      city: 'Banff', country: 'Canada',
      image_url: F('hera-accor-hotels', '03-fairmont-banff-springs.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/fairmont-banff-springs',
      description: 'The "Castle of the Rockies" — majestic mountain icon since 1888.',
    },
    {
      name: 'Hamilton Princess & Beach Club',
      city: 'Hamilton', country: 'Bermuda',
      image_url: F('hera-accor-hotels', '04-hamilton-princess-beach-club-a-fairmont-managed-ho.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/hamilton-princess-bermuda',
      description: 'Bermuda\'s Pink Palace on the harbour — art collection and private beach.',
    },
    {
      name: 'Raffles Hotel Singapore',
      city: 'Singapore', country: 'Singapore',
      image_url: F('hera-accor-hotels', '05-raffles-hotel-singapore.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/raffles-singapore',
      description: '1887 colonial grande dame — legendary Long Bar, butler suites.',
    },
    {
      name: 'Orient Express Hotel, Rome',
      city: 'Rome', country: 'Italy',
      image_url: F('hera-accor-hotels', '06-orient-express-hotel-rome.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/orient-express-rome',
      description: 'Historic palazzo reimagined as the brand\'s first urban hotel.',
    },
  ],

  'mandarin-oriental-fan-club': [
    {
      name: 'Mandarin Oriental, Paris',
      city: 'Paris', country: 'France',
      image_url: F('mandarin-oriental-fan-club', '01-mandarin-oriental-paris.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/mandarin-oriental-paris',
      description: 'Rue Saint-Honoré palace with garden pool — Paris\'s most discreet luxury.',
    },
    {
      name: 'Mandarin Oriental, Bangkok',
      city: 'Bangkok', country: 'Thailand',
      image_url: F('mandarin-oriental-fan-club', '02-mandarin-oriental-bangkok.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/mandarin-oriental-bangkok',
      description: '150 years on the Chao Phraya — the world\'s most legendary hotel.',
    },
    {
      name: 'Mandarin Oriental, Bodrum',
      city: 'Bodrum', country: 'Turkey',
      image_url: F('mandarin-oriental-fan-club', '03-mandarin-oriental-bodrum.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/mandarin-oriental-bodrum',
      description: 'Cliffside resort overlooking the Aegean — private beach and deep-blue vistas.',
    },
    {
      name: 'Mandarin Oriental, London',
      city: 'London', country: 'United Kingdom',
      image_url: F('mandarin-oriental-fan-club', '04-mandarin-oriental-london.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/mandarin-oriental-london',
      description: 'Hyde Park Corner — Knightsbridge\'s original luxury landmark since 1902.',
    },
    {
      name: 'Mandarin Oriental, Tokyo',
      city: 'Tokyo', country: 'Japan',
      image_url: F('mandarin-oriental-fan-club', '05-mandarin-oriental-tokyo.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/mandarin-oriental-tokyo',
      description: 'High above Nihonbashi — Mount Fuji views and Japanese precision.',
    },
    {
      name: 'Mandarin Oriental, New York',
      city: 'New York', country: 'United States',
      image_url: F('mandarin-oriental-fan-club', '06-mandarin-oriental-new-york.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/mandarin-oriental-new-york',
      description: 'Columbus Circle sky palace — Central Park panoramas and Michelin dining.',
    },
  ],

  'shangri-la-hotels-the-luxury-circle': [
    {
      name: 'Shangri-La Sydney',
      city: 'Sydney', country: 'Australia',
      image_url: F('shangri-la-hotels-the-luxury-circle', '01-shangri-la-sydney.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/shangri-la-sydney',
      description: 'Harbour Bridge and Opera House panoramas from the Rocks precinct.',
    },
    {
      name: 'Island Shangri-La, Hong Kong',
      city: 'Hong Kong', country: 'China',
      image_url: F('shangri-la-hotels-the-luxury-circle', '02-island-shangri-la-hong-kong.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/island-shangri-la',
      description: 'Pacific Place tower crowned by a 16-storey hand-painted Chinese mural.',
    },
    {
      name: 'Shangri-La Paris',
      city: 'Paris', country: 'France',
      image_url: F('shangri-la-hotels-the-luxury-circle', '03-shangri-la-paris.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/shangri-la-paris',
      description: 'Napoléon III\'s grand-nephew\'s palace — Eiffel Tower views over the Seine.',
    },
    {
      name: 'Shangri-La Le Touessrok, Mauritius',
      city: 'Trou d\'Eau Douce', country: 'Mauritius',
      image_url: F('shangri-la-hotels-the-luxury-circle', '04-shangri-la-le-touessrok-mauritius.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/shangri-la-le-touessrok',
      description: 'Private island access, lagoon villas and award-winning golf in paradise.',
    },
    {
      name: 'Shangri-La, Singapore',
      city: 'Singapore', country: 'Singapore',
      image_url: F('shangri-la-hotels-the-luxury-circle', '01-shangri-la-sydney.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/shangri-la-singapore',
      description: 'Garden oasis on Orchard Road — 15 acres of tropical grounds and pools.',
    },
    {
      name: 'Shangri-La Tokyo',
      city: 'Tokyo', country: 'Japan',
      image_url: F('shangri-la-hotels-the-luxury-circle', '06-shangri-la-tokyo.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/shangri-la-tokyo',
      description: 'Marunouchi tower hotel with unobstructed views of the Imperial Palace.',
    },
  ],

  'rocco-forte-hotels': [
    {
      name: 'Hotel de Russie, Rome',
      city: 'Rome', country: 'Italy',
      image_url: F('rocco-forte-hotels', '01-hotel-de-russie-a-rocco-forte-hotel.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/hotel-de-russie-rome',
      description: 'Via del Babuino hideaway with secret garden and celebrity heritage.',
    },
    {
      name: 'Brown\'s Hotel, London',
      city: 'London', country: 'United Kingdom',
      image_url: F('rocco-forte-hotels', '02-brown-s-hotel-a-rocco-forte-hotel.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/browns-hotel-london',
      description: 'London\'s oldest hotel — Mayfair discretion and Kipling-era charm.',
    },
    {
      name: 'The Balmoral, Edinburgh',
      city: 'Edinburgh', country: 'United Kingdom',
      image_url: F('rocco-forte-hotels', '03-the-balmoral-a-rocco-forte-hotel.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/the-balmoral-edinburgh',
      description: 'Castle-view landmark towering over Princes Street since 1902.',
    },
    {
      name: 'Hotel de la Ville, Rome',
      city: 'Rome', country: 'Italy',
      image_url: F('rocco-forte-hotels', '04-hotel-de-la-ville-a-rocco-forte-hotel.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/hotel-de-la-ville-rome',
      description: 'Spanish Steps perch — palazzo suites with private rooftop terraces.',
    },
    {
      name: 'Verdura Resort, Sicily',
      city: 'Sciacca', country: 'Italy',
      image_url: F('rocco-forte-hotels', '05-verdura-resort-a-rocco-forte-hotel.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/verdura-resort-sicily',
      description: 'Mediterranean coastline resort with three golf courses and a thalasso spa.',
    },
    {
      name: 'Hotel Savoy, Florence',
      city: 'Florence', country: 'Italy',
      image_url: F('rocco-forte-hotels', '06-hotel-savoy-a-rocco-forte-hotel.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/hotel-savoy-florence',
      description: 'Piazza della Repubblica centrepiece — Florentine elegance reimagined.',
    },
  ],

  'one-and-only-hotels-and-resorts': [
    {
      name: 'One&Only Reethi Rah',
      city: 'North Malé Atoll', country: 'Maldives',
      image_url: F('one-and-only-hotels-and-resorts', '01-one-only-reethi-rah.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/one-and-only-reethi-rah',
      description: 'The largest resort island in the Maldives — 128 villas and unmatched space.',
    },
    {
      name: 'One&Only Cape Town',
      city: 'Cape Town', country: 'South Africa',
      image_url: F('one-and-only-hotels-and-resorts', '02-one-only-cape-town.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/one-and-only-cape-town',
      description: 'V&A Waterfront jewel with Table Mountain backdrop and signature Nobu.',
    },
    {
      name: 'One&Only Palmilla',
      city: 'San José del Cabo', country: 'Mexico',
      image_url: F('one-and-only-hotels-and-resorts', '03-one-only-palmilla.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/one-and-only-palmilla',
      description: 'Baja California\'s original luxury resort — 900-year-old chapel, private beach.',
    },
    {
      name: 'One&Only Le Saint Géran',
      city: 'Poste de Flacq', country: 'Mauritius',
      image_url: F('one-and-only-hotels-and-resorts', '04-one-only-le-saint-geran.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/one-and-only-le-saint-geran',
      description: 'Mauritius\'s original luxury legend — private peninsula, lagoon villas.',
    },
    {
      name: 'One&Only Aesthesis',
      city: 'Athens', country: 'Greece',
      image_url: F('one-and-only-hotels-and-resorts', '05-one-only-aesthesis.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/one-and-only-aesthesis',
      description: 'Beachfront retreat on the Athenian Riviera — vineyards, spa, Greek light.',
    },
    {
      name: 'One&Only Mandarina',
      city: 'Riviera Nayarit', country: 'Mexico',
      image_url: F('one-and-only-hotels-and-resorts', '06-one-only-mandarina.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/one-and-only-mandarina',
      description: 'Treehouse and cliffside villas in a pristine Mexican jungle reaching the Pacific.',
    },
  ],

  'auberge-resorts-collection': [
    {
      name: 'Esperanza, Auberge Collection',
      city: 'Cabo San Lucas', country: 'Mexico',
      image_url: F('auberge-resorts-collection', '01-esperanza-auberge-collection.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/esperanza-auberge',
      description: 'Cabo\'s most gracious hideaway — clifftop infinity pools and private beach.',
    },
    {
      name: 'Auberge du Soleil',
      city: 'Rutherford', country: 'United States',
      image_url: F('auberge-resorts-collection', '02-auberge-du-soleil.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/auberge-du-soleil',
      description: 'The original wine country retreat in Napa Valley since 1981.',
    },
    {
      name: 'Calistoga Ranch, Auberge Collection',
      city: 'Calistoga', country: 'United States',
      image_url: F('auberge-resorts-collection', '03-calistoga-ranch-auberge-collection.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/calistoga-ranch-auberge',
      description: 'Canyon hideaway lodges in the volcanic heart of Napa — geothermal pools.',
    },
    {
      name: 'Chileno Bay Resort, Auberge Collection',
      city: 'Cabo San Lucas', country: 'Mexico',
      image_url: F('auberge-resorts-collection', '04-chileno-bay-resort-residences-auberge-collection.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/chileno-bay-auberge',
      description: 'Marine-protected bay with snorkelling and sunset swimming in Los Cabos.',
    },
    {
      name: 'Grace Hotel Santorini, Auberge Collection',
      city: 'Santorini', country: 'Greece',
      image_url: F('auberge-resorts-collection', '05-grace-hotel-santorini-auberge-collection.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/grace-santorini',
      description: 'Oia clifftop suites with the most photographed caldera view in the world.',
    },
    {
      name: 'Hacienda AltaGracia, Auberge Collection',
      city: 'Pérez Zeledón', country: 'Costa Rica',
      image_url: F('auberge-resorts-collection', '06-hacienda-altagracia-auberge-collection.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/hacienda-altagracia',
      description: 'Coffee plantation retreat in the cloud forest — organic, authentic Costa Rica.',
    },
  ],

  'hyatt-prive': [
    {
      name: 'Park Hyatt Paris-Vendôme',
      city: 'Paris', country: 'France',
      image_url: F('hyatt-prive', '01-park-hyatt-paris-vendome.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/park-hyatt-paris-vendome',
      description: 'Limestone palace on Rue de la Paix — Paris\'s most discreet luxury address.',
    },
    {
      name: 'Park Hyatt Sydney',
      city: 'Sydney', country: 'Australia',
      image_url: F('hyatt-prive', '02-park-hyatt-sydney.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/park-hyatt-sydney',
      description: 'Front row Opera House views from a private harbourside sanctuary.',
    },
    {
      name: 'Alila Marea Beach Resort',
      city: 'Encinitas', country: 'United States',
      image_url: F('hyatt-prive', '03-alila-villas-hadahaa.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/alila-marea-beach',
      description: 'California coastal retreat — cliffside terraces above the Pacific surf.',
    },
    {
      name: 'Park Hyatt Maldives Hadahaa',
      city: 'Gaafu Alifu Atoll', country: 'Maldives',
      image_url: F('hyatt-prive', '04-park-hyatt-maldives-hadahaa.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/park-hyatt-maldives',
      description: 'Remote southern atoll villa resort — untouched reef, no day-trippers.',
    },
    {
      name: 'Grand Hyatt Bali',
      city: 'Nusa Dua', country: 'Indonesia',
      image_url: F('hyatt-prive', '05-grand-hyatt-bali.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/grand-hyatt-bali',
      description: 'Balinese water palace — lagoon pools, private beach, five restaurants.',
    },
    {
      name: 'Palacio Duhau - Park Hyatt Buenos Aires',
      city: 'Buenos Aires', country: 'Argentina',
      image_url: F('hyatt-prive', '06-palacio-duhau-park-hyatt-buenos-aires.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/park-hyatt-buenos-aires',
      description: 'Restored 1930s Recoleta palace with gardens linking two buildings.',
    },
  ],

  'kempinski-club-1897': [
    {
      name: 'Hotel Adlon Kempinski Berlin',
      city: 'Berlin', country: 'Germany',
      image_url: F('kempinski-club-1897', '01-hotel-adlon-kempinski-berlin.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/hotel-adlon-berlin',
      description: 'Brandenburg Gate neighbour — Germany\'s most storied hotel address.',
    },
    {
      name: 'The Apurva Kempinski Bali',
      city: 'Nusa Dua', country: 'Indonesia',
      image_url: F('kempinski-club-1897', '02-the-apurva-kempinski-bali.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/apurva-kempinski-bali',
      description: 'Balinese cliff resort inspired by traditional temples — terraced and regal.',
    },
    {
      name: 'Kempinski Hotel Corvinus Budapest',
      city: 'Budapest', country: 'Hungary',
      image_url: F('kempinski-club-1897', '03-kempinski-hotel-corvinus-budapest.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/kempinski-corvinus-budapest',
      description: 'Deák Ferenc Street showpiece facing the Hungarian State Opera House.',
    },
    {
      name: 'Emirates Palace Mandarin Oriental, Abu Dhabi',
      city: 'Abu Dhabi', country: 'UAE',
      image_url: F('kempinski-club-1897', '04-emirates-palace-mandarin-oriental-abu-dhabi.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/emirates-palace',
      description: 'Gold-gilded palace on the Gulf — 1.3 km private beach and 302 domes.',
    },
    {
      name: 'Kempinski Hotel Mall of the Emirates',
      city: 'Dubai', country: 'UAE',
      image_url: F('kempinski-club-1897', '05-kempinski-hotel-mall-of-the-emirates.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/kempinski-mall-emirates',
      description: 'Ski slope-view suites — the most distinctly Dubai luxury experience.',
    },
    {
      name: 'Kempinski Hotel Barbaros Bay',
      city: 'Bodrum', country: 'Turkey',
      image_url: F('kempinski-club-1897', '06-kempinski-hotel-barbaros-bay-bodrum.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/kempinski-barbaros-bay',
      description: 'Aegean bay villa resort — private jetties and turquoise sea immersion.',
    },
  ],

  'peninsula-pen-club': [
    {
      name: 'The Peninsula Hong Kong',
      city: 'Hong Kong', country: 'China',
      image_url: F('peninsula-pen-club', '01-the-peninsula-hong-kong.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/the-peninsula-hong-kong',
      description: 'The "Grande Dame of the Far East" — Tsim Sha Tsui since 1928.',
    },
    {
      name: 'The Peninsula Paris',
      city: 'Paris', country: 'France',
      image_url: F('peninsula-pen-club', '02-the-peninsula-paris.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/the-peninsula-paris',
      description: 'Kléber mansion near the Arc de Triomphe — rooftop pool with city views.',
    },
    {
      name: 'The Peninsula Tokyo',
      city: 'Tokyo', country: 'Japan',
      image_url: F('peninsula-pen-club', '03-the-peninsula-tokyo.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/the-peninsula-tokyo',
      description: 'Hibiya crossing — minimalist Japanese refinement from the Imperial Palace.',
    },
    {
      name: 'The Peninsula Beverly Hills',
      city: 'Beverly Hills', country: 'United States',
      image_url: F('peninsula-pen-club', '04-the-peninsula-beverly-hills.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/the-peninsula-beverly-hills',
      description: 'Garden villas and bungalows — the most private celebrity retreat on Wilshire.',
    },
    {
      name: 'The Peninsula London',
      city: 'London', country: 'United Kingdom',
      image_url: F('peninsula-pen-club', '05-the-peninsula-london.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/the-peninsula-london',
      description: 'Belgravia\'s newest jewel — Hyde Park Corner with city panoramas.',
    },
    {
      name: 'The Peninsula Bangkok',
      city: 'Bangkok', country: 'Thailand',
      image_url: F('peninsula-pen-club', '06-the-peninsula-bangkok.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/the-peninsula-bangkok',
      description: 'Chao Phraya riverfront tower — Thai silk, tuk-tuk transfers, rooftop terrace.',
    },
  ],

  'como-hotels': [
    {
      name: 'COMO The Treasury, Perth',
      city: 'Perth', country: 'Australia',
      image_url: F('como-hotels', '01-como-the-treasury-perth.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/como-the-treasury-perth',
      description: 'Heritage precinct conversion — six historic buildings reimagined in Western Australia.',
    },
    {
      name: 'COMO Parrot Cay',
      city: 'Turks & Caicos', country: 'Turks and Caicos',
      image_url: F('como-hotels', '02-como-parrot-cay.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/como-parrot-cay',
      description: 'Private island sanctuary — barefoot luxury and celebrity privacy.',
    },
    {
      name: 'COMO Uma Bhutan',
      city: 'Paro', country: 'Bhutan',
      image_url: F('como-hotels', '03-como-uma-bhutan.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/como-uma-bhutan',
      description: 'Five intimate lodges across pristine Bhutan — altitude, spirituality, serenity.',
    },
    {
      name: 'COMO Maalifushi',
      city: 'Thaa Atoll', country: 'Maldives',
      image_url: F('como-hotels', '04-como-maalifushi.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/como-maalifushi',
      description: 'Remote southern atoll — diving, SUP, and COMO wellness in a pristine lagoon.',
    },
    {
      name: 'COMO Castello del Nero',
      city: 'Chianti', country: 'Italy',
      image_url: F('como-hotels', '05-como-the-treasury-perth.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/como-castello-del-nero',
      description: '12th-century Chianti castle with vineyard, Michelin dining and COMO spa.',
    },
    {
      name: 'COMO Metropolitan London',
      city: 'London', country: 'United Kingdom',
      image_url: F('como-hotels', '06-como-castello-del-nero.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/como-metropolitan-london',
      description: 'Hyde Park Corner contemporary townhouse with COMO Shambhala spa.',
    },
  ],

  'oetker-hotel-collection-pearl-partner': [
    {
      name: 'Jumby Bay Island',
      city: 'Saint John\'s', country: 'Antigua',
      image_url: F('oetker-hotel-collection-pearl-partner', '01-jumby-bay-island-oetker-hotels.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/jumby-bay-island',
      description: 'Fully private 300-acre Caribbean island — no cars, pure barefoot luxury.',
    },
    {
      name: 'Brenners Park-Hotel & Spa',
      city: 'Baden-Baden', country: 'Germany',
      image_url: F('oetker-hotel-collection-pearl-partner', '02-brenners-park-hotel-spa-oetker-hotels.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/brenners-park-hotel-spa',
      description: 'Palatial Black Forest institution on the Lichtentaler Allee since 1872.',
    },
    {
      name: 'Hotel du Cap-Eden-Roc',
      city: 'Antibes', country: 'France',
      image_url: F('oetker-hotel-collection-pearl-partner', '03-hotel-du-cap-eden-roc-oetker-hotels.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/hotel-du-cap-eden-roc',
      description: 'Cap d\'Antibes rocky peninsula jewel — the Riviera\'s most storied retreat.',
    },
    {
      name: 'L\'Apogée Courchevel',
      city: 'Courchevel', country: 'France',
      image_url: F('oetker-hotel-collection-pearl-partner', '04-l-apogee-courchevel-oetker-hotels.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/lapogee-courchevel',
      description: 'Alpine ski-in ski-out chalet suites with private cinema and Michelin dining.',
    },
    {
      name: 'Palácio Tangará',
      city: 'São Paulo', country: 'Brazil',
      image_url: F('oetker-hotel-collection-pearl-partner', '05-palacio-tangara-oetker-hotels.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/palacio-tangara',
      description: 'Burle Marx rainforest estate — São Paulo\'s most tranquil urban sanctuary.',
    },
    {
      name: 'Hotel La Palma, Capri',
      city: 'Capri', country: 'Italy',
      image_url: F('oetker-hotel-collection-pearl-partner', '06-hotel-la-palma-capri-oetker-hotels.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/hotel-la-palma-capri',
      description: 'Capri\'s oldest hotel reborn — terrace gardens above the Marina Grande.',
    },
  ],

  'aman-hotels-and-resorts': [
    {
      name: 'Amangiri',
      city: 'Canyon Point', country: 'United States',
      image_url: F('aman-hotels-and-resorts', '01-amangiri.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/amangiri',
      description: 'Desert minimalism in a Utah canyon — the world\'s most sought-after reservation.',
    },
    {
      name: 'Amanpuri',
      city: 'Phuket', country: 'Thailand',
      image_url: F('aman-hotels-and-resorts', '02-amanpuri.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/amanpuri',
      description: 'The original Aman — 1988 coconut grove pavilions above Pansea Bay.',
    },
    {
      name: 'Aman Tokyo',
      city: 'Tokyo', country: 'Japan',
      image_url: F('aman-hotels-and-resorts', '03-aman-tokyo.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/aman-tokyo',
      description: 'Sky-high abstraction of Japanese ryokan design above the Imperial Palace.',
    },
    {
      name: 'Amanzoe',
      city: 'Porto Heli', country: 'Greece',
      image_url: F('aman-hotels-and-resorts', '04-amanzoe.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/amanzoe',
      description: 'Peloponnese hilltop pavilions — Greek light, private pool, Aegean silence.',
    },
    {
      name: 'Amanemu',
      city: 'Mie Prefecture', country: 'Japan',
      image_url: F('aman-hotels-and-resorts', '05-amanemu.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/amanemu',
      description: 'Hot-spring ryokan suites on Ago Bay — deeply restorative onsen bathing.',
    },
    {
      name: 'Aman New York',
      city: 'New York', country: 'United States',
      image_url: F('aman-hotels-and-resorts', '06-aman-new-york.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/aman-new-york',
      description: 'Crown Jewel Building reimagined — jazz club, spa floors, private residences.',
    },
  ],

  'montage-hotels': [
    {
      name: 'Montage Laguna Beach',
      city: 'Laguna Beach', country: 'United States',
      image_url: F('montage-hotels', '01-montage-laguna-beach.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/montage-laguna-beach',
      description: 'California Arts & Crafts clifftop resort — artist colony heritage and ocean lawns.',
    },
    {
      name: 'Montage Deer Valley',
      city: 'Park City', country: 'United States',
      image_url: F('montage-hotels', '02-montage-deer-valley.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/montage-deer-valley',
      description: 'Ski-in ski-out mountain lodge above Park City with heated outdoor pools.',
    },
    {
      name: 'Montage Los Cabos',
      city: 'San José del Cabo', country: 'Mexico',
      image_url: F('montage-hotels', '03-montage-los-cabos.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/montage-los-cabos',
      description: 'Adults-only East Cape beach enclave — Baja\'s most intimate luxury resort.',
    },
    {
      name: 'Montage Healdsburg',
      city: 'Healdsburg', country: 'United States',
      image_url: F('montage-hotels', '04-montage-healdsburg.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/montage-healdsburg',
      description: 'Sonoma wine country estate — 13 acres of vineyards, pool and farmhouse dining.',
    },
    {
      name: 'Montage Big Sky',
      city: 'Big Sky', country: 'United States',
      image_url: F('montage-hotels', '05-montage-big-sky.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/montage-big-sky',
      description: 'Rocky Mountain ski village lodge — year-round adventure at Yellowstone\'s door.',
    },
    {
      name: 'Montage Palmetto Bluff',
      city: 'Bluffton', country: 'United States',
      image_url: F('montage-hotels', '06-montage-palmetto-bluff.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/montage-palmetto-bluff',
      description: 'Low Country inn cottages on the May River — Southern grace and wild marshes.',
    },
  ],

  'marriott-international-luminous': [
    {
      name: 'The Ritz-Carlton, Kyoto',
      city: 'Kyoto', country: 'Japan',
      image_url: F('marriott-international-luminous', '01-the-ritz-carlton-kyoto.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/ritz-carlton-kyoto',
      description: 'Ryokan-inspired sanctuary beside the Kamogawa River — Japan in full bloom.',
    },
    {
      name: 'St. Regis Maldives Vommuli Resort',
      city: 'Dhaalu Atoll', country: 'Maldives',
      image_url: F('marriott-international-luminous', '02-the-st-regis-maldives-vommuli-resort.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/st-regis-maldives',
      description: 'Underwater observatory villa resort in the remote southern Maldives.',
    },
    {
      name: 'JW Marriott Venice Resort & Spa',
      city: 'Venice', country: 'Italy',
      image_url: F('marriott-international-luminous', '03-jw-marriott-venice-resort-spa.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/jw-marriott-venice',
      description: 'Private island resort a boat ride from St. Mark\'s Square — pure Venice escape.',
    },
    {
      name: 'W Hong Kong',
      city: 'Hong Kong', country: 'China',
      image_url: F('marriott-international-luminous', '04-w-hong-kong.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/w-hong-kong',
      description: 'Kowloon skyline icon — WET pool deck, bold design and harbour drama.',
    },
    {
      name: 'Mystique, a Luxury Collection Hotel, Santorini',
      city: 'Santorini', country: 'Greece',
      image_url: F('marriott-international-luminous', '05-mystique-a-luxury-collection-hotel-santorini.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/mystique-santorini',
      description: 'Oia cliffside cave suites with sweeping caldera views — intimate and dramatic.',
    },
    {
      name: 'The Ritz-Carlton, Grand Cayman',
      city: 'Grand Cayman', country: 'Cayman Islands',
      image_url: F('marriott-international-luminous', '06-the-ritz-carlton-grand-cayman.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/ritz-carlton-grand-cayman',
      description: 'Seven Mile Beach estate — dive, snorkel and island elegance in the Caribbean.',
    },
  ],

  'leading-hotels-of-the-world': [
    {
      name: 'Le Bristol Paris',
      city: 'Paris', country: 'France',
      image_url: F('leading-hotels-of-the-world', '01-le-bristol-paris.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/le-bristol-paris',
      description: 'Faubourg Saint-Honoré palace — rooftop pool, three Michelin stars and Épicure.',
    },
    {
      name: 'Hôtel de Crillon, A Rosewood Hotel',
      city: 'Paris', country: 'France',
      image_url: F('leading-hotels-of-the-world', '02-hotel-de-crillon-a-rosewood-hotel.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/hotel-de-crillon',
      description: 'Louis XV palace on Place de la Concorde — Karl Lagerfeld-designed suites.',
    },
    {
      name: 'Baur au Lac',
      city: 'Zurich', country: 'Switzerland',
      image_url: F('leading-hotels-of-the-world', '03-baur-au-lac.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/baur-au-lac',
      description: 'Lake Zurich lakeside institution — family-owned since 1844, impeccable service.',
    },
    {
      name: 'Grand Hotel Tremezzo',
      city: 'Lake Como', country: 'Italy',
      image_url: F('leading-hotels-of-the-world', '04-grand-hotel-tremezzo.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/grand-hotel-tremezzo',
      description: 'Art Nouveau lakeside villa — floating pool on Lake Como since 1910.',
    },
    {
      name: 'The Ritz-Carlton Hotel de la Paix, Geneva',
      city: 'Geneva', country: 'Switzerland',
      image_url: F('leading-hotels-of-the-world', '05-hotel-de-la-paix-geneva.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/ritz-carlton-hotel-de-la-paix-geneva',
      description: 'Belle Époque landmark above Lake Geneva — Michelin dining and mountain views.',
    },
    {
      name: 'Badrutt\'s Palace Hotel',
      city: 'St. Moritz', country: 'Switzerland',
      image_url: F('leading-hotels-of-the-world', '06-badrutt-s-palace-hotel.jpg'),
      detail_url: 'https://www.virtuoso.com/hotels/badrutts-palace',
      description: 'The original ski palace — St. Moritz legend since 1896, still family-run.',
    },
  ],
}

/**
 * Get the 6 featured hotels for a given program slug.
 * Returns an empty array if no data is defined for that slug.
 */
export function getFeaturedHotels(programSlug: string): FeaturedHotel[] {
  return FEATURED_HOTELS[programSlug] ?? []
}
