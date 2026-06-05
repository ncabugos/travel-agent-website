// app/api/admin/categories/route.ts
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getCurrentSuperAdmin } from '@/lib/admin-auth'

export async function GET() {
  const adminUser = await getCurrentSuperAdmin()
  if (!adminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase.from('blog_categories').select('*').order('sort_order')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const adminUser = await getCurrentSuperAdmin()
  if (!adminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('blog_categories')
    .insert({
      label: body.label,
      slug: body.slug,
      description: body.description ?? null,
      sort_order: body.sort_order ?? 0,
      is_active: body.is_active ?? true
    })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}
