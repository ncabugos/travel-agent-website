/**
 * POST /api/agent-portal/upload?kind=headshot|logo
 * Multipart form data with a single 'file' field. Uploads to the public
 * 'agent-assets' bucket under the signed-in advisor's id and returns
 * { url } — the public URL. The agent is resolved from the session, never
 * from the payload.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

const BUCKET = 'agent-assets'
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB, matches the ImageUpload hint
const KINDS = new Set(['headshot', 'logo'])
const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: agent } = await (admin.from('agents') as any)
    .select('id')
    .eq('email', session.user.email)
    .maybeSingle()
  if (!agent?.id) {
    return NextResponse.json({ error: 'No agent record linked to this email.' }, { status: 403 })
  }

  const kind = req.nextUrl.searchParams.get('kind') ?? ''
  if (!KINDS.has(kind)) {
    return NextResponse.json({ error: 'kind must be headshot or logo' }, { status: 400 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File exceeds 10 MB limit' }, { status: 400 })
    }
    const ext = EXT[file.type]
    if (!ext) {
      return NextResponse.json({ error: `Unsupported file type: ${file.type}. Use JPG, PNG, or WebP.` }, { status: 400 })
    }

    const path = `${agent.id}/${kind}-${Date.now()}.${ext}`
    const buffer = new Uint8Array(await file.arrayBuffer())

    const { error: uploadError } = await admin.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: file.type, upsert: false })
    if (uploadError) {
      console.error('[agent-portal/upload]', uploadError.message)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: { publicUrl } } = admin.storage.from(BUCKET).getPublicUrl(path)
    return NextResponse.json({ url: publicUrl })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed'
    console.error('[agent-portal/upload] unexpected error', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
