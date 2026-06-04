// app/api/admin/marketing-posts/route.ts
// Admin CRUD for the Insights blog. Service-role (bypasses RLS) like the rest
// of the admin console; the /admin tree is auth-gated by middleware.ts.
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/service'
import type { MarketingPost } from '@/types/index'

const SELECT = '*, category:marketing_categories(*)'

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80)
}

export async function GET() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('marketing_posts')
    .select(SELECT)
    .order('published_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<MarketingPost>
  const supabase = createServiceClient()

  const slug = body.slug?.trim() || (body.title ? slugify(body.title) : '')
  if (!slug) return NextResponse.json({ error: 'A title or slug is required' }, { status: 400 })

  const { data, error } = await supabase
    .from('marketing_posts')
    .insert({
      title:              body.title ?? '',
      slug,
      status:             body.status ?? 'draft',
      excerpt:            body.excerpt ?? null,
      body_html:          body.body_html ?? '',
      cover_image_url:    body.cover_image_url ?? null,
      category_id:        body.category_id ?? null,
      author_name:        body.author_name?.trim() || 'Nick Cabugos',
      author_credentials: body.author_credentials?.trim() || 'Founder of Elite Advisor Hub',
      seo_title:          body.seo_title ?? null,
      seo_description:    body.seo_description ?? null,
      og_image_url:       body.og_image_url ?? null,
      faq:                Array.isArray(body.faq) ? body.faq : [],
      read_minutes:       body.read_minutes ?? null,
      featured:           body.featured ?? false,
      published_at:       body.published_at ?? new Date().toISOString(),
    } as never)
    .select(SELECT)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  if (data.status === 'published') revalidateInsights(data.slug)
  return NextResponse.json(data, { status: 201 })
}

/** Bust the cache for every surface a published post can appear on. */
export function revalidateInsights(slug?: string) {
  revalidatePath('/insights')
  revalidatePath('/insights/category/[slug]', 'page')
  if (slug) revalidatePath(`/insights/${slug}`)
  revalidatePath('/insights/rss.xml')
  revalidatePath('/') // homepage Insights teaser
  revalidatePath('/sitemap.xml')
}
