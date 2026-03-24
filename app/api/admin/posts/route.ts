import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import type { BlogPost } from '@/types/index'

const ALL_COLUMNS =
  'id, agent_id, title, slug, published_at, excerpt, body_html, cover_image_url, categories, tags, status, is_broadcast, target_agent_ids, gallery_images'

export async function GET() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select(ALL_COLUMNS)
    .order('published_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body = await request.json() as Partial<BlogPost>
  const supabase = createServiceClient()

  // Auto-generate slug from title if not provided
  if (!body.slug && body.title) {
    body.slug = body.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 80)
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      agent_id:         body.agent_id,
      title:            body.title ?? '',
      slug:             body.slug ?? '',
      published_at:     body.published_at ?? new Date().toISOString(),
      excerpt:          body.excerpt ?? null,
      body_html:        body.body_html ?? '',
      cover_image_url:  body.cover_image_url ?? null,
      categories:       body.categories ?? [],
      tags:             body.tags ?? [],
      status:           body.status ?? 'draft',
      is_broadcast:     body.is_broadcast ?? false,
      target_agent_ids: body.target_agent_ids ?? [],
      gallery_images:   body.gallery_images ?? [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
    .select(ALL_COLUMNS)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}
