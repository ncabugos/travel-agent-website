#!/usr/bin/env node
/**
 * mirror_hotel_images.js
 *
 * Downloads every reachable `cover_image_url` from `luxury_hotels` and
 * re-uploads it to the Supabase Storage bucket `hotel-covers` (migration
 * 024). Each row's `cover_image_url` is then rewritten to the permanent
 * Supabase Storage public URL.
 *
 * Why: Virtuoso's brochure CDN (media.virtuoso.com) rotates, re-numbers,
 * and privacy-gates asset IDs on an ~annual basis. Mirroring decouples
 * our site from that lifecycle.
 *
 * Idempotent — skips rows whose cover_image_url is already under our
 * project's Supabase Storage host. Safe to re-run.
 *
 * Usage:
 *   # Dry run — list what would change, upload nothing:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     node scripts/mirror_hotel_images.js --dry-run
 *
 *   # Real run:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     node scripts/mirror_hotel_images.js
 *
 *   # Real run, only for a single slug or hotel id:
 *   node scripts/mirror_hotel_images.js --slug=1-hotel-south-beach
 *   node scripts/mirror_hotel_images.js --id=<uuid>
 *
 *   # Skip any rows whose current URL responds 200 on Virtuoso CDN
 *   # (so only "broken" URLs are mirrored — useful for faster re-runs):
 *   node scripts/mirror_hotel_images.js --only-broken
 */

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY
const BUCKET       = 'hotel-covers'
const PAGE_SIZE    = 500

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const args = process.argv.slice(2)
const flag = (name) => args.includes(name)
const valueFlag = (name) => {
  const found = args.find((a) => a.startsWith(name + '='))
  return found ? found.split('=')[1] : null
}

const DRY_RUN     = flag('--dry-run')
const ONLY_BROKEN = flag('--only-broken')
const ONLY_SLUG   = valueFlag('--slug')
const ONLY_ID     = valueFlag('--id')

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SUPABASE_HOST = new URL(SUPABASE_URL).host

/** Returns true if the URL already points to our own Supabase Storage. */
function isAlreadyMirrored(url) {
  if (!url) return false
  try {
    return new URL(url).host === SUPABASE_HOST
  } catch {
    return false
  }
}

/** Infer a safe file extension from a URL or content-type, defaulting to jpg. */
function inferExtension(url, contentType) {
  if (contentType) {
    if (contentType.includes('png'))  return 'png'
    if (contentType.includes('webp')) return 'webp'
    if (contentType.includes('jpeg') || contentType.includes('jpg')) return 'jpg'
  }
  try {
    const p = new URL(url).pathname.toLowerCase()
    if (p.endsWith('.png'))  return 'png'
    if (p.endsWith('.webp')) return 'webp'
  } catch {}
  return 'jpg'
}

function mimeFor(ext) {
  return ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
}

async function fetchImage(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; EliteAdvisorHub/1.0 image-mirror)',
      accept: 'image/*,*/*;q=0.8',
    },
  })
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`)
    err.status = res.status
    throw err
  }
  const buf = Buffer.from(await res.arrayBuffer())
  return { buf, contentType: res.headers.get('content-type') || '' }
}

async function uploadToBucket(slug, buf, ext) {
  const path = `${slug}.${ext}`
  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, buf, {
    contentType: mimeFor(ext),
    upsert: true,
    cacheControl: '31536000, immutable',
  })
  if (upErr) throw upErr
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(
    `🪄  Mirroring luxury_hotels → ${BUCKET}${DRY_RUN ? ' (DRY RUN)' : ''}` +
    (ONLY_SLUG   ? `, slug=${ONLY_SLUG}`   : '') +
    (ONLY_ID     ? `, id=${ONLY_ID}`       : '') +
    (ONLY_BROKEN ? `, only-broken`          : '')
  )

  // ── Fetch every hotel in the catalogue (pagination).
  const allHotels = []
  let from = 0
  for (;;) {
    let q = supabase
      .from('luxury_hotels')
      .select('id, name, slug, cover_image_url')
      .order('sort_order', { ascending: true })
      .range(from, from + PAGE_SIZE - 1)

    if (ONLY_SLUG) q = q.eq('slug', ONLY_SLUG)
    if (ONLY_ID)   q = q.eq('id',   ONLY_ID)

    const { data, error } = await q
    if (error) throw error
    if (!data || data.length === 0) break
    allHotels.push(...data)
    if (data.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }

  console.log(`📊  Fetched ${allHotels.length} hotels.`)

  // ── Tallies for end-of-run summary.
  const stats = {
    total: allHotels.length,
    skipped_already_mirrored: 0,
    skipped_no_url: 0,
    skipped_no_slug: 0,
    skipped_ok_on_origin: 0,
    fetched_ok: 0,
    fetch_failed: 0,
    uploaded: 0,
    db_updated: 0,
    db_update_failed: 0,
  }
  const failures = []

  for (let i = 0; i < allHotels.length; i++) {
    const h = allHotels[i]
    const tag = `[${i + 1}/${allHotels.length}] ${h.name}`

    if (!h.slug) {
      console.log(`${tag}  → SKIP (no slug)`)
      stats.skipped_no_slug++
      continue
    }
    if (!h.cover_image_url) {
      console.log(`${tag}  → SKIP (no cover_image_url)`)
      stats.skipped_no_url++
      continue
    }
    if (isAlreadyMirrored(h.cover_image_url)) {
      stats.skipped_already_mirrored++
      continue
    }

    // Optional: only mirror URLs that are currently broken.
    if (ONLY_BROKEN) {
      try {
        const head = await fetch(h.cover_image_url, {
          method: 'HEAD',
          headers: { 'user-agent': 'EliteAdvisorHub/1.0' },
        })
        if (head.ok) {
          stats.skipped_ok_on_origin++
          continue
        }
      } catch {
        // treat network errors as "broken" — fall through to mirror attempt
      }
    }

    try {
      const { buf, contentType } = await fetchImage(h.cover_image_url)
      stats.fetched_ok++
      const ext = inferExtension(h.cover_image_url, contentType)

      if (DRY_RUN) {
        console.log(`${tag}  → DRY (would upload ${buf.length} bytes as ${h.slug}.${ext})`)
        continue
      }

      const publicUrl = await uploadToBucket(h.slug, buf, ext)
      stats.uploaded++

      const { error: updErr } = await supabase
        .from('luxury_hotels')
        .update({ cover_image_url: publicUrl })
        .eq('id', h.id)
      if (updErr) {
        stats.db_update_failed++
        failures.push({ hotel: h.name, stage: 'db_update', msg: updErr.message })
        console.log(`${tag}  → UPLOADED but DB update failed: ${updErr.message}`)
        continue
      }
      stats.db_updated++
      console.log(`${tag}  → MIRRORED`)
    } catch (err) {
      stats.fetch_failed++
      failures.push({
        hotel: h.name,
        url: h.cover_image_url,
        stage: 'fetch',
        msg: err.status ? `HTTP ${err.status}` : err.message,
      })
      console.log(
        `${tag}  → FETCH FAIL (${err.status ? `HTTP ${err.status}` : err.message})`
      )
    }

    // Gentle rate limit so we're polite to the source CDN.
    await new Promise((r) => setTimeout(r, 100))
  }

  // ── Summary.
  console.log('\n──────────── Summary ────────────')
  for (const [k, v] of Object.entries(stats)) console.log(`  ${k.padEnd(30)} ${v}`)
  if (failures.length) {
    console.log(`\n  First 10 failures:`)
    failures.slice(0, 10).forEach((f) =>
      console.log(`    - ${f.hotel}  (${f.stage}: ${f.msg})`)
    )
    if (failures.length > 10) console.log(`    …and ${failures.length - 10} more.`)
  }
  console.log('─────────────────────────────────')
}

main().catch((err) => {
  console.error('\n❌  Fatal:', err)
  process.exit(1)
})
