import { createClient } from '@/lib/supabase/server'
import type { DbDesigner, DbListing, DbOrder } from '@/lib/supabase/types'

// ─── Shared shape used by all UI components ──────────────────────────────────

export interface Designer {
  id: string
  initials: string
  name: string
  studioNo: string
  city: string
  country: string
  specialty: string
  categories: string[]
  listingCount: number
  commissions: boolean
  bio: string
  instagram: string | null
  verified: boolean
  userId: string | null
}

export interface Listing {
  id: string
  designerId: string
  imageSrc: string
  designer: string
  name: string
  price: string
  priceNum: number
  city: string
  category: string
  description: string
  createdAt: string
}

export interface Order {
  id: string
  listingId: string
  buyerName: string
  buyerEmail: string
  message: string | null
  status: string
  createdAt: string
  listing?: Listing
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

function initials(name: string): string {
  return name
    .split(/[\s.]+/)
    .filter(Boolean)
    .map((p) => p[0].toUpperCase())
    .slice(0, 2)
    .join('')
}

function dbToDesigner(d: DbDesigner, listingCount = 0): Designer {
  return {
    id: d.id,
    initials: initials(d.name),
    name: d.name,
    studioNo: d.studio_number,
    city: d.city,
    country: d.country,
    specialty: d.specialty,
    categories: d.categories,
    listingCount,
    commissions: d.commissions,
    bio: d.bio,
    instagram: d.instagram,
    verified: d.verified,
    userId: d.user_id,
  }
}

function dbToListing(l: DbListing): Listing {
  return {
    id: l.id,
    designerId: l.designer_id,
    imageSrc: l.images?.[0] ?? '/card-1.jpg',
    designer: l.designers?.name ?? '',
    name: l.title,
    price: l.price_display,
    priceNum: l.price,
    city: l.city,
    category: l.category,
    description: l.description,
    createdAt: l.created_at,
  }
}

function dbToOrder(o: DbOrder): Order {
  return {
    id: o.id,
    listingId: o.listing_id,
    buyerName: o.buyer_name,
    buyerEmail: o.buyer_email,
    message: o.message,
    status: o.status,
    createdAt: o.created_at,
    listing: o.listings ? dbToListing(o.listings as DbListing) : undefined,
  }
}

// ─── Designer Queries ─────────────────────────────────────────────────────────

export async function getAllDesigners(): Promise<Designer[]> {
  const supabase = await createClient()

  const { data: designerRows, error: dErr } = await supabase
    .from('designers')
    .select('*')
    .eq('verified', true)
    .order('studio_number')

  if (dErr || !designerRows) return []

  const { data: countRows } = await supabase
    .from('listings')
    .select('designer_id')

  const counts: Record<string, number> = {}
  for (const row of countRows ?? []) {
    counts[row.designer_id] = (counts[row.designer_id] ?? 0) + 1
  }

  return designerRows.map((d) => dbToDesigner(d, counts[d.id] ?? 0))
}

export async function getDesignerById(id: string): Promise<Designer | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('designers')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null

  const { count } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('designer_id', id)

  return dbToDesigner(data, count ?? 0)
}

export async function getDesignerByUserId(userId: string): Promise<Designer | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('designers')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error || !data) return null

  const { count } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('designer_id', data.id)

  return dbToDesigner(data, count ?? 0)
}

export async function getDesignerIds(): Promise<string[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('designers').select('id')
  return (data ?? []).map((d) => d.id)
}

// ─── Listing Queries ──────────────────────────────────────────────────────────

export async function getAllListings(): Promise<Listing[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('listings')
    .select('*, designers(name)')
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data.map(dbToListing)
}

export async function getListingById(id: string): Promise<Listing | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('listings')
    .select('*, designers(name)')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return dbToListing(data)
}

export async function getListingIds(): Promise<string[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('listings').select('id')
  return (data ?? []).map((l) => l.id)
}

export async function getListingsByDesigner(designerId: string): Promise<Listing[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('listings')
    .select('*, designers(name)')
    .eq('designer_id', designerId)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data.map(dbToListing)
}

// ─── Order Queries ────────────────────────────────────────────────────────────

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select('*, listings(*, designers(name, studio_number, city))')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return dbToOrder(data as DbOrder)
}
