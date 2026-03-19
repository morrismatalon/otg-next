'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export interface NewListingState {
  error?: string
}

export async function createListing(
  _prev: NewListingState,
  formData: FormData
): Promise<NewListingState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not signed in.' }

  // Find designer linked to this user
  const { data: designer, error: dErr } = await supabase
    .from('designers')
    .select('id, city')
    .eq('user_id', user.id)
    .single()

  if (dErr || !designer) {
    return { error: 'No designer profile found for your account.' }
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const priceRaw = formData.get('price') as string
  const currency = formData.get('currency') as string
  const category = formData.get('category') as string
  const imageUrl = formData.get('imageUrl') as string

  if (!title || !priceRaw || !currency || !category) {
    return { error: 'Please fill in all required fields.' }
  }

  const price = parseFloat(priceRaw)
  if (isNaN(price) || price <= 0) {
    return { error: 'Please enter a valid price.' }
  }

  // Format price display
  const symbols: Record<string, string> = {
    JPY: '¥',
    GBP: '£',
    EUR: '€',
    KRW: '₩',
    USD: '$',
  }
  const sym = symbols[currency] ?? currency
  const formatted =
    currency === 'JPY' || currency === 'KRW'
      ? `${sym} ${Math.round(price).toLocaleString()}`
      : `${sym} ${price.toFixed(2)}`

  // Generate a slug-style ID
  const id = `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)}-${Date.now()}`

  const images = imageUrl ? [imageUrl] : ['/card-1.jpg']

  const { error: insertErr } = await supabase.from('listings').insert({
    id,
    designer_id: designer.id,
    title,
    description: description || '',
    price,
    currency,
    price_display: formatted,
    category,
    city: designer.city,
    images,
  })

  if (insertErr) {
    return { error: 'Failed to create listing. Please try again.' }
  }

  redirect('/dashboard')
}
