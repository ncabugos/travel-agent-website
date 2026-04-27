// ─── Blog Post (Supabase) ────────────────────────────────────────────────────
export interface GalleryImage {
  url: string
  caption?: string
}

export interface BlogPost {
  id: string
  agent_id: string
  title: string
  slug: string
  published_at: string
  excerpt: string | null
  body_html: string
  cover_image_url: string | null
  categories: string[]
  tags: string[]
  status: 'draft' | 'published'
  is_broadcast: boolean
  target_agent_ids: string[]
  target_demo_slugs: string[]
  gallery_images: GalleryImage[]
  category_ids?: string[] // Optional for backward compatibility, loaded via join
  supplier_tags: string[] // Prefixed slugs: 'hotel:<slug>' or 'cruise:<slug>'
  /** Optional per-post override of the <title> tag. Empty/null → falls back to `title`. */
  seo_title?: string | null
  /** Optional per-post override of the meta description. Empty/null → falls back to `excerpt`. */
  seo_description?: string | null
}

export interface BlogCategory {
  id: string
  slug: string
  label: string
  description: string | null
  sort_order: number
  is_active: boolean
  created_at: string
}

// ─── Destination ───────────────────────────────────────────────────────────
export interface Destination {
  id: string
  name: string
  country: string
  description: string
  imageUrl?: string
  slug: string
  featured: boolean
  createdAt: string
}

// ─── Package / Tour ─────────────────────────────────────────────────────────
export interface TravelPackage {
  id: string
  title: string
  destination: Destination
  durationDays: number
  priceUsd: number
  includes: string[]
  imageUrl?: string
  slug: string
}

// ─── Inquiry / Lead ──────────────────────────────────────────────────────────
export interface Inquiry {
  id: string
  name: string
  email: string
  phone?: string
  destination?: string
  message: string
  createdAt: string
  status: 'new' | 'contacted' | 'booked' | 'closed'
}
