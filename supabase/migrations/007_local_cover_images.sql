-- =============================================================================
-- Migration: 007_local_cover_images.sql
-- Description: Update cover_image_url to use self-hosted images from public/blog/
--              instead of external WordPress URLs that fail on Vercel deployment.
-- =============================================================================

UPDATE public.blog_posts SET cover_image_url = '/blog/JO.jpg'
  WHERE slug = 'john-oberacker-has-been-named-one-of-conde-nast-travelers-top-travel-specialists-for-2025';

UPDATE public.blog_posts SET cover_image_url = '/blog/Screen-Shot-2018-10-01-at-8.09.08-AM.png'
  WHERE slug = 'john-oberacker-how-virtuosos-most-innovative-advisor-stays-ahead-of-the-curve';

UPDATE public.blog_posts SET cover_image_url = '/blog/johnO-most_innovative_20181.jpg'
  WHERE slug = 'john-oberacker-of-eden-for-your-world-wins-virtuoso-2018-most-innovative-advisor-award';

UPDATE public.blog_posts SET cover_image_url = '/blog/IMG_2728-e1526335642852.jpg'
  WHERE slug = 'turkey-an-edenfyw-travelers-view';

UPDATE public.blog_posts SET cover_image_url = '/blog/IMG_0415.jpg'
  WHERE slug = 'peru';

UPDATE public.blog_posts SET cover_image_url = '/blog/The-Private-Suite-1-1.jpg'
  WHERE slug = 'the-private-suite-at-lax';

UPDATE public.blog_posts SET cover_image_url = '/blog/C241C4B9-00CC-4830-887B-681F8827C7F2.jpg'
  WHERE slug = 'travel-capsule-wardrobe-by-sin60style';

UPDATE public.blog_posts SET cover_image_url = '/blog/personal_photo-269-e1515929910143-1000x600.jpg'
  WHERE slug = 'meet-kasra-esteghamat-of-eden-for-your-world';

UPDATE public.blog_posts SET cover_image_url = '/blog/FullSizeRender-70-e1489965570664.jpg'
  WHERE slug = 'epic-egypt';

UPDATE public.blog_posts SET cover_image_url = '/blog/IMG_0700-copy.jpg'
  WHERE slug = 'the-galapagos';

UPDATE public.blog_posts SET cover_image_url = '/blog/IMG_9334.jpg'
  WHERE slug = 'luxury-hideaways-in-vietnam';

UPDATE public.blog_posts SET cover_image_url = '/blog/IMG_4224.jpg'
  WHERE slug = 'paris-paris-paris';

UPDATE public.blog_posts SET cover_image_url = '/blog/IMG_3476.jpg'
  WHERE slug = 'amangiri';

UPDATE public.blog_posts SET cover_image_url = '/blog/PNK_8769-e1408646901700.jpg'
  WHERE slug = 'virtuoso-travel-week-2014';

UPDATE public.blog_posts SET cover_image_url = '/blog/20140716-120655-43615812.jpg'
  WHERE slug = 'a-piece-of-eden-in-maui-hawaii';

UPDATE public.blog_posts SET cover_image_url = '/blog/John-Rising-Star-2014.jpg'
  WHERE slug = 'virtuoso-rising-star-2014';

UPDATE public.blog_posts SET cover_image_url = '/blog/10380247_10153024479977565_8815801556595650250_o.jpg'
  WHERE slug = 'la-vie-est-belle-en-st-barth';

UPDATE public.blog_posts SET cover_image_url = '/blog/20140523-163741-59861272.jpg'
  WHERE slug = 'buenos-aires-argentina';

UPDATE public.blog_posts SET cover_image_url = '/blog/20140516-105631.jpg'
  WHERE slug = 'travel-weeks-sao-paolo-2014';

UPDATE public.blog_posts SET cover_image_url = '/blog/20140501-074947.jpg'
  WHERE slug = 'jason-decaires-taylor';

UPDATE public.blog_posts SET cover_image_url = '/blog/Rio-Bourdain-1.jpg'
  WHERE slug = 'get-up-off-the-couch';

UPDATE public.blog_posts SET cover_image_url = '/blog/hotel.jpg'
  WHERE slug = 'get-your-hotel-perks';

UPDATE public.blog_posts SET cover_image_url = '/blog/Phone-Passport-EFYW-1.jpg'
  WHERE slug = 'we-give-you-the-world';

UPDATE public.blog_posts SET cover_image_url = '/blog/20140201-154904.jpg'
  WHERE slug = 'hermanus-and-birkenhead-house-south-africa';

UPDATE public.blog_posts SET cover_image_url = '/blog/20140125-155352.jpg'
  WHERE slug = 'cape-town-south-africa';

UPDATE public.blog_posts SET cover_image_url = '/blog/20140121-074540.jpg'
  WHERE slug = 'la-residence-franschhoek-south-africa';

UPDATE public.blog_posts SET cover_image_url = '/blog/20140115-082213-1.jpg'
  WHERE slug = 'royal-malewane-thornybush-game-reserve-south-africa';

UPDATE public.blog_posts SET cover_image_url = '/blog/20140112-134246.jpg'
  WHERE slug = 'singita-lebombo-lodge-kruger-national-park-south-africa';

UPDATE public.blog_posts SET cover_image_url = '/blog/20140110-074219.jpg'
  WHERE slug = 'phinda-private-game-reserve-south-africa';

UPDATE public.blog_posts SET cover_image_url = '/blog/20140130-150805.jpg'
  WHERE slug = 'johannesburg-south-africa';

UPDATE public.blog_posts SET cover_image_url = '/blog/buddha-quote.jpg'
  WHERE slug = 'buddhas-good-word-travel';
