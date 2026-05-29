-- =============================================================================
-- Migration: 037_marriott_luminous_covers.sql
-- Description: Set cover_image_url for 20 "Luxury Group at Marriott International"
--              hotels that were rendering broken/missing thumbnails on the
--              book-hotel/marriott-international-luminous program page. Images
--              were added to public/media/hotel-programs/marriott-stars---luminous/
--              and matched to luxury_hotels by slug.
-- Idempotent: plain UPDATEs keyed on slug; safe to re-run.
-- =============================================================================

update public.luxury_hotels set cover_image_url = '/media/hotel-programs/marriott-stars---luminous/al-maha-luxury-collection.jpeg'              where slug = 'al-maha-a-luxury-collection-desert-resort-spa-dubai-united-arab-emirates';
update public.luxury_hotels set cover_image_url = '/media/hotel-programs/marriott-stars---luminous/bisha-luxury-collection.jpeg'                 where slug = 'bisha-a-luxury-collection-hotel-toronto-canada';
update public.luxury_hotels set cover_image_url = '/media/hotel-programs/marriott-stars---luminous/bvlgari-hotel-milano.jpeg'                    where slug = 'bvlgari-hotel-milano-italy';
update public.luxury_hotels set cover_image_url = '/media/hotel-programs/marriott-stars---luminous/bvlgari-roma.jpeg'                            where slug = 'bvlgari-hotel-roma-italy';
update public.luxury_hotels set cover_image_url = '/media/hotel-programs/marriott-stars---luminous/bvlgari-tokyo.jpeg'                           where slug = 'bvlgari-hotel-tokyo-japan';
update public.luxury_hotels set cover_image_url = '/media/hotel-programs/marriott-stars---luminous/domes-miramare-luxury-collection.webp'        where slug = 'domes-miramare-a-luxury-collection-resort-corfu-greece';
update public.luxury_hotels set cover_image_url = '/media/hotel-programs/marriott-stars---luminous/hotel-bristol-luxury-collection.webp'         where slug = 'hotel-bristol-a-luxury-collection-hotel-warsaw-poland';
update public.luxury_hotels set cover_image_url = '/media/hotel-programs/marriott-stars---luminous/hotel-cala-di-volpe.jpeg'                     where slug = 'cala-di-volpe-a-luxury-collection-hotel-costa-smeralda-italy';
update public.luxury_hotels set cover_image_url = '/media/hotel-programs/marriott-stars---luminous/hotel-du-couvent-luxury-collection.jpeg'      where slug = 'htel-du-couvent-luxury-collection-hotel-france';
update public.luxury_hotels set cover_image_url = '/media/hotel-programs/marriott-stars---luminous/hotel-goldener-hirsch-luxury-collection.jpeg' where slug = 'hotel-goldener-hirsch-a-luxury-collection-hotel-salzburg-austria';
update public.luxury_hotels set cover_image_url = '/media/hotel-programs/marriott-stars---luminous/hotel-marques-de-riscal-luxury-collection.webp' where slug = 'hotel-marques-de-riscal-a-luxury-collection-hotel-elciego-spain';
update public.luxury_hotels set cover_image_url = '/media/hotel-programs/marriott-stars---luminous/houston-grand-hotel-river-oaks.jpeg'          where slug = 'houston-grand-hotel-river-oaks-united-states';
update public.luxury_hotels set cover_image_url = '/media/hotel-programs/marriott-stars---luminous/lido-house-autograph-collection.webp'        where slug = 'lido-house-autograph-collection-united-states';
update public.luxury_hotels set cover_image_url = '/media/hotel-programs/marriott-stars---luminous/mauna-kea-autograph-collection.jpg'          where slug = 'mauna-kea-beach-hotel-autograph-collection-united-states';
update public.luxury_hotels set cover_image_url = '/media/hotel-programs/marriott-stars---luminous/muir-luxury-collection.jpeg'                 where slug = 'muir-a-luxury-collection-hotel-halifax-canada';
update public.luxury_hotels set cover_image_url = '/media/hotel-programs/marriott-stars---luminous/mystique-luxury-collection-santorini.jpeg'    where slug = 'mystique-a-luxury-collection-hotel-santorini-greece';
update public.luxury_hotels set cover_image_url = '/media/hotel-programs/marriott-stars---luminous/nekajui-ritz-reserve.jpeg'                    where slug = 'nekajui-a-ritz-carlton-reserve-costa-rica';
update public.luxury_hotels set cover_image_url = '/media/hotel-programs/marriott-stars---luminous/parklane-luxury-collection-limassol.jpeg'     where slug = 'parklane-a-luxury-collection-resort-spa-limassol-cyprus';
update public.luxury_hotels set cover_image_url = '/media/hotel-programs/marriott-stars---luminous/salterra-luxury-collection-south-caicos.jpeg' where slug = 'salterra-a-luxury-collection-resort-spa-south-caicos-turks-and-caicos-islands';
update public.luxury_hotels set cover_image_url = '/media/hotel-programs/marriott-stars---luminous/santa-marina-luxury-collection-mykonos.jpeg'  where slug = 'santa-marina-a-luxury-collection-resort-mykonos-greece';
update public.luxury_hotels set cover_image_url = '/media/hotel-programs/marriott-stars---luminous/hotel-alfonso-xiii-luxury-collection.avif'  where slug = 'hotel-alfonso-xiii-a-luxury-collection-hotel-seville-spain';
update public.luxury_hotels set cover_image_url = '/media/hotel-programs/marriott-stars---luminous/powerscourt-hotel-resort-spa.avif'          where slug = 'powerscourt-hotel-resort-spa-ireland';
