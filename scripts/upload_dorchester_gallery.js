#!/usr/bin/env node
/**
 * Upload Dorchester Collection gallery images to Supabase Storage
 * and update hotel_programs.slider_images for dorchester-diamond-club.
 * Also uploads hotel-specific images for The Lana Dubai and Beverly Hills Hotel.
 */

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://zcllngvctqthvqaupxyt.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjbGxuZ3ZjdHF0aHZxYXVweHl0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzIzNzkxNiwiZXhwIjoyMDg4ODEzOTE2fQ.LANXYhw46J_eNExnMTYfkWIQ95xM5HyKvA9ei25k0qY'
const BUCKET = 'hotel-covers'

const GALLERY_DIR = path.join(
  '/Users/nickcabugos/Library/CloudStorage/GoogleDrive-cabugosb3@gmail.com/My Drive/002 Travel Agent Website Service/travel-agent-website/public/media/hotel-programs/dorchester/gallery'
)

const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
})

function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase()
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  if (ext === '.png') return 'image/png'
  if (ext === '.webp') return 'image/webp'
  return 'image/jpeg'
}

async function uploadFile(localPath, storagePath) {
  const fileBuffer = fs.readFileSync(localPath)
  const contentType = getContentType(localPath)

  // Check if already exists
  const { data: existing } = await sb.storage.from(BUCKET).list(path.dirname(storagePath), {
    search: path.basename(storagePath),
  })
  if (existing && existing.some((f) => f.name === path.basename(storagePath))) {
    const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`
    console.log(`  SKIP (exists): ${storagePath}`)
    return url
  }

  const { error } = await sb.storage.from(BUCKET).upload(storagePath, fileBuffer, {
    contentType,
    upsert: false,
  })

  if (error) {
    if (error.message?.includes('already exists') || error.statusCode === '409') {
      const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`
      console.log(`  SKIP (409): ${storagePath}`)
      return url
    }
    console.error(`  ERROR uploading ${storagePath}:`, error.message)
    return null
  }

  const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`
  console.log(`  OK: ${storagePath}`)
  return url
}

async function main() {
  // ── 1. Upload root-level gallery images for dorchester-diamond-club program ──
  console.log('\n=== Uploading Dorchester program gallery images ===')
  const rootFiles = fs.readdirSync(GALLERY_DIR).filter((f) => {
    const full = path.join(GALLERY_DIR, f)
    return fs.statSync(full).isFile() && /\.(jpg|jpeg|png|webp)$/i.test(f)
  })

  const programGalleryUrls = []
  for (const file of rootFiles) {
    const localPath = path.join(GALLERY_DIR, file)
    const storagePath = `gallery/dorchester/${file}`
    const url = await uploadFile(localPath, storagePath)
    if (url) programGalleryUrls.push(url)
  }
  console.log(`\nUploaded ${programGalleryUrls.length} / ${rootFiles.length} program gallery images`)

  // ── 2. Update hotel_programs.slider_images for dorchester-diamond-club ──
  if (programGalleryUrls.length > 0) {
    console.log('\n=== Updating hotel_programs.slider_images ===')
    const { error } = await sb
      .from('hotel_programs')
      .update({ slider_images: programGalleryUrls })
      .eq('slug', 'dorchester-diamond-club')

    if (error) {
      console.error('ERROR updating hotel_programs:', error.message)
    } else {
      console.log(`Set ${programGalleryUrls.length} slider_images for dorchester-diamond-club`)
    }
  }

  // ── 3. Upload Lana Dubai hotel images ──
  console.log('\n=== Uploading The Lana Dubai hotel images ===')
  const lanaDir = path.join(GALLERY_DIR, 'Lana Dubai')
  const lanaFiles = fs.readdirSync(lanaDir).filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))

  const lanaUrls = []
  for (const file of lanaFiles) {
    const localPath = path.join(lanaDir, file)
    const storagePath = `hotel-gallery/the-lana-dubai/${file}`
    const url = await uploadFile(localPath, storagePath)
    if (url) lanaUrls.push(url)
  }
  console.log(`\nUploaded ${lanaUrls.length} / ${lanaFiles.length} Lana Dubai images`)

  if (lanaUrls.length > 0) {
    const { error } = await sb
      .from('luxury_hotels')
      .update({ gallery_images: lanaUrls })
      .eq('slug', 'the-lana-dubai')

    if (error) {
      if (error.message?.includes('gallery_images')) {
        console.log('Note: gallery_images column may not exist yet. Skipping hotel gallery update.')
        console.log('Lana Dubai gallery URLs saved to: lana-dubai-gallery-urls.txt')
        fs.writeFileSync(
          path.join(__dirname, 'lana-dubai-gallery-urls.txt'),
          lanaUrls.join('\n')
        )
      } else {
        console.error('ERROR updating lana dubai gallery:', error.message)
      }
    } else {
      console.log(`Set ${lanaUrls.length} gallery_images for the-lana-dubai`)
    }
  }

  // ── 4. Upload Beverly Hills Hotel images ──
  console.log('\n=== Uploading Beverly Hills Hotel images ===')
  const bhDir = path.join(GALLERY_DIR, 'beverly-hills-hotel')
  const bhFiles = fs.readdirSync(bhDir).filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))

  const bhUrls = []
  for (const file of bhFiles) {
    const localPath = path.join(bhDir, file)
    const storagePath = `hotel-gallery/beverly-hills-hotel/${file}`
    const url = await uploadFile(localPath, storagePath)
    if (url) bhUrls.push(url)
  }
  console.log(`\nUploaded ${bhUrls.length} / ${bhFiles.length} Beverly Hills Hotel images`)

  if (bhUrls.length > 0) {
    const { error } = await sb
      .from('luxury_hotels')
      .update({ gallery_images: bhUrls })
      .eq('slug', 'beverly-hills-hotel')

    if (error) {
      if (error.message?.includes('gallery_images')) {
        console.log('Note: gallery_images column may not exist yet.')
        console.log('Beverly Hills gallery URLs saved to: beverly-hills-gallery-urls.txt')
        fs.writeFileSync(
          path.join(__dirname, 'beverly-hills-gallery-urls.txt'),
          bhUrls.join('\n')
        )
      } else {
        console.error('ERROR updating beverly hills gallery:', error.message)
      }
    } else {
      console.log(`Set ${bhUrls.length} gallery_images for beverly-hills-hotel`)
    }
  }

  console.log('\n=== Done ===')
}

main().catch(console.error)
