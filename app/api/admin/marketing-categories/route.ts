// app/api/admin/marketing-categories/route.ts
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET() {
  const supabase = createServiceClient()
  const { data, error } = await supabase.from('marketing_categories').select('*').order('sort_order')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('marketing_categories')
    .insert({
      label:       body.label,
      slug:        body.slug,
      description: body.description ?? null,
      pillar_key:  body.pillar_key ?? null,
      sort_order:  body.sort_order ?? 0,
      is_active:   body.is_active ?? true,
    })
    .select('*')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  revalidatePath('/insights')
  return NextResponse.json(data, { status: 201 })
}
