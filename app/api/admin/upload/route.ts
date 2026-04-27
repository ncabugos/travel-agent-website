/**
 * POST /api/admin/upload
 * Accepts multipart form data with a single 'file' field.
 * Uploads to the 'blog-assets' bucket in Supabase Storage.
 * Returns { url: string } — the public URL.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

const BUCKET = 'blog-assets'
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File exceeds 10 MB limit' }, { status: 400 })
    }

    // Validate mime type
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 })
    }

    // Build a unique path: blog-assets/<timestamp>-<sanitized-name>
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const safeName = file.name
      .replace(/\.[^/.]+$/, '')                 // strip extension
      .replace(/[^a-zA-Z0-9_-]/g, '_')          // sanitize
      .substring(0, 60)                         // cap length
    const path = `${Date.now()}-${safeName}.${ext}`

    const supabase = createServiceClient()
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('[upload]', uploadError.message)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(path)

    return NextResponse.json({ url: publicUrl })
  } catch (err: any) {
    console.error('[upload] unexpected error', err)
    return NextResponse.json({ error: err.message ?? 'Upload failed' }, { status: 500 })
  }
}
