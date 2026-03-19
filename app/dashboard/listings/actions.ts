'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateListing(
  id: string,
  data: { title: string; description: string; price: number; price_display: string; category: string }
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  // Verify the listing belongs to this user's designer
  const { data: listing } = await supabase
    .from('listings')
    .select('designer_id, designers!inner(user_id)')
    .eq('id', id)
    .single()

  if (!listing) return { error: 'Listing not found.' }

  const { error } = await supabase
    .from('listings')
    .update(data)
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/listings')
  revalidatePath('/dashboard')
  return {}
}

export async function deleteListing(id: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/listings')
  revalidatePath('/dashboard')
  return {}
}
