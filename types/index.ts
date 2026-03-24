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
  gallery_images: GalleryImage[]
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
