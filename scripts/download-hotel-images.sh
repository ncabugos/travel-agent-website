#!/usr/bin/env bash
# ============================================================================
# download-hotel-images.sh
#
# Downloads sourced hi-res hotel imagery into public/media/hotel-programs/.
# Run from the repo root:
#     bash scripts/download-hotel-images.sh
#
# Coverage summary (see README at bottom of file for the full report):
#   AUTO   = curl will fetch it for you
#   MANUAL = the source is JS-rendered, gated, or email-only — you do it
#   WEBP   = file is .webp on the source; conversion to .jpg shown below
#
# ============================================================================

set -u  # don't -e — we want to keep going if a single URL is 404

BASE="public/media/hotel-programs"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"

mkdir -p "$BASE/featured/leading-hotels-of-the-world"
mkdir -p "$BASE/como-hotels"
mkdir -p "$BASE/dorchester"
mkdir -p "$BASE/hera-accor"
mkdir -p "$BASE/hyatt-prive"
mkdir -p "$BASE/montage"
mkdir -p "$BASE/oetker-pearl"
mkdir -p "$BASE/one-and-only"

# Helper — curl with desktop UA, follow redirects, fail loudly
fetch() {
    local url="$1" out="$2"
    echo "  -> $out"
    curl -sSL -A "$UA" -o "$out" "$url" || echo "     FAILED: $url"
}

# ============================================================================
# TIER 1 — Leading Hotels of the World (featured properties)
# Destination: $BASE/featured/leading-hotels-of-the-world/
# ============================================================================

echo "=== LHW featured hotels ==="

# ---- 02 Hotel Hassler Roma ------------------------------------- AUTO
# Source: hotelhasslerroma.com (brand site, partner-licensed editorial use)
# Hassler Penthouse interior — signature suite shot from the site's gallery
echo "[02] Hotel Hassler Roma:"
fetch "https://www.hotelhasslerroma.com/wp-content/uploads/2025/09/DSC07551.jpg" \
      "$BASE/featured/leading-hotels-of-the-world/02-hotel-hassler-roma.jpg"
# Alternates (uncomment one to swap):
#   DSC04718.jpg — Villa Medici Penthouse with terrace
#   DSC02631.jpg — Presidential Suite San Pietro
#   DSC05915.jpg — Presidential Suite Trinità dei Monti

# ---- 06 The Sukhothai Bangkok ---------------------------------- AUTO (webp)
# Source: bangkok.sukhothai.com/en/about-the-sukhothai-bangkok/gallery
# Files are .webp. Convert to .jpg afterwards — see WEBP CONVERSION block at bottom.
echo "[06] The Sukhothai Bangkok (downloads as .webp; convert below):"
fetch "https://bangkok.sukhothai.com/file/gallery/gallery_image/gallery-celadon-1.webp" \
      "$BASE/featured/leading-hotels-of-the-world/06-the-sukhothai-bangkok.webp"
# Alternates: gallery-swimming-pool-1.webp through -7.webp (pool/garden hero),
#             gallery-sukhothai-suite-living-room.webp, gallery-celadon-2.webp / -3.webp

# ---- 01, 03, 04, 05 The Lowell / Le Sirenuse / La Mamounia / Hotel d'Angleterre ---- MANUAL
# All four hotels' brand sites and LHW property pages are JavaScript-rendered.
# Image URLs are not in the static HTML, so curl can't reach them.
# Manual steps for each (visit LHW property page, open Gallery, right-click hi-res, Save As):
#   01-the-lowell.jpg         <- https://www.lhw.com/hotel/The-Lowell-New-York-NY
#   03-le-sirenuse.jpg        <- https://www.lhw.com/hotel/Le-Sirenuse-Positano-Italy
#   04-la-mamounia.jpg        <- https://www.lhw.com/hotel/La-Mamounia-Marrakech-Morocco
#   05-hotel-dangleterre.jpg  <- https://www.lhw.com/hotel/Hotel-D'Angleterre-Copenhagen-Denmark
# Save each into $BASE/featured/leading-hotels-of-the-world/

# ============================================================================
# TIER 2 — Slider supplements
# ============================================================================

echo
echo "=== Slider supplements ==="

# ---- COMO Hotels and Resorts (3 needed) ------------------------ MANUAL
# Source: comohotels.com/media-centre — free registration required (instant).
# Pick: COMO Castello del Nero (Tuscany), COMO Parrot Cay (T&C), COMO Uma Paro (Bhutan).
# Save as: como-slider-4-1500.jpg, como-slider-5-1500.jpg, como-slider-6-1500.jpg
# Into: $BASE/como-hotels/

# ---- Dorchester Collection (2 needed) -------------------------- MANUAL
# Source: media.dorchestercollection.com (JS-rendered, no login required).
# Pick: Plaza Athénée Paris facade, Beverly Hills Hotel pool/facade.
# Save as: dorchester-slider-5-1500.jpg, dorchester-slider-6-1500.jpg
# Into: $BASE/dorchester/
# ATTRIBUTION REQUIRED: credit "Dorchester Collection" on any visible use.

# ---- Accor Preferred by HERA (2 needed) ------------------------ MANUAL
# Source: press.accor.com/gallery (JS-rendered, no login required).
# Filter Brand = Raffles → Raffles Singapore facade.
# Filter Brand = Sofitel → Sofitel Legend Old Cataract Aswan terrace.
# Save as: accor-slider-4-1500.jpg, accor-slider-5-1500.jpg
# Into: $BASE/hera-accor/

# ---- World of Hyatt Privé (2 needed) --------------------------- AUTO (low-res fallback)
# Source: newsroom.hyatt.com — direct image URLs visible at 1000px width.
# Below the spec (1500px+) but usable as a placeholder.
# For full-res, fall back to brand sites (manual).
echo "[Hyatt Privé] slider supplements (1000px — UNDERSIZED, swap when possible):"
fetch "https://newsroom.hyatt.com/image/Park+Hyatt+Cabo+del+Sol+-+Exterior+Evening_1000.jpg" \
      "$BASE/hyatt-prive/hyatt-slider-5-1500.jpg"
fetch "https://newsroom.hyatt.com/image/Miraval+Arizona+-+Retreat+Patio_1000.jpg" \
      "$BASE/hyatt-prive/hyatt-slider-6-1500.jpg"
# Manual upgrade: newsroom.hyatt.com/media-gallery → category Luxury → drill into Park Hyatt Tokyo
# or Alila Ventana Big Sur album for higher-res editorial shots.

# ---- Montage Hotels & Resorts (1 needed) ----------------------- MANUAL
# Source: NO public image library. Email media@montage.com — request hi-res for
# Montage Kapalua Bay pool/exterior. Mention you're a Virtuoso advisor.
# Save as: montage-slider-6-1500.jpg
# Into: $BASE/montage/

# ---- Pearl Partner — Oetker Collection (1 needed) -------------- MANUAL
# Source: oetker-collection.com is the Oetker corporate group (not the hotel collection).
# For hotel imagery: Hotel du Cap-Eden-Roc press releases on oetkercollection.com
# (the hotel brand) include downloadable hi-res. Or email the property's PR contact.
# Save as: oetker-slider-6-1500.jpg
# Into: $BASE/oetker-pearl/

# ---- One&Only Resorts (1 needed) ------------------------------- MANUAL
# Source: oneandonlyresorts.com/media-centre (JS-rendered).
# For deeper hi-res, register at oneandonlybrand.com (advisor approval, ~24hr).
# Pick: One&Only Reethi Rah overwater villa boardwalk.
# Save as: oneandonly-slider-6-1500.jpg
# Into: $BASE/one-and-only/

# ============================================================================
# WEBP CONVERSION
# Sukhothai files came down as .webp. Convert to .jpg with one of:
#
#   # macOS — install once: brew install webp
#   cwebp -version >/dev/null 2>&1 && {
#       for f in "$BASE/featured/leading-hotels-of-the-world"/*.webp; do
#           [ -e "$f" ] && dwebp "$f" -o "${f%.webp}.jpg" && rm "$f"
#       done
#   }
#
#   # OR with ImageMagick (already on most systems):
#   for f in "$BASE/featured/leading-hotels-of-the-world"/*.webp; do
#       [ -e "$f" ] && magick "$f" "${f%.webp}.jpg" && rm "$f"
#   done
# ============================================================================

echo
echo "Done. Coverage: 3 of 19 slots filled automatically (Hassler, Sukhothai-webp,"
echo "and 2 undersized Hyatt thumbnails). Remaining 16 require manual download —"
echo "see commented sections above and the dossier in the chat history."

# ============================================================================
# README — why this script is so sparse
#
# Most luxury hotel groups serve their press galleries via JavaScript-rendered
# single-page apps. The HTML response is just a shell; image URLs only appear
# after a browser executes the page's JS. curl can't run JS, so it can't see
# them. The exceptions where this script does succeed:
#
#   1. Hotel Hassler Roma — older WordPress site, image URLs are in static HTML
#   2. Sukhothai Bangkok — gallery page lists .webp files in static markup
#   3. Hyatt newsroom — older CMS that pre-renders image URLs at 1000px
#
# Everything else needs you to either (a) open a browser and right-click, or
# (b) register/log in for press-portal access.
#
# If you want me to crawl more pages to upgrade specific slots, point me at
# one and I'll dig deeper.
# ============================================================================
