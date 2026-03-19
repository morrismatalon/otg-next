'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export interface CheckoutState {
  error?: string
}

export async function placeOrder(
  _prev: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  const supabase = await createClient()

  const listingId = formData.get('listingId') as string
  const buyerName = formData.get('buyerName') as string
  const buyerEmail = formData.get('buyerEmail') as string
  const message = (formData.get('message') as string) || null

  if (!listingId || !buyerName || !buyerEmail) {
    return { error: 'Please fill in all required fields.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(buyerEmail)) {
    return { error: 'Please enter a valid email address.' }
  }

  // Verify listing exists
  const { error: listingErr } = await supabase
    .from('listings')
    .select('id')
    .eq('id', listingId)
    .single()

  if (listingErr) {
    return { error: 'This listing no longer exists.' }
  }

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      listing_id: listingId,
      buyer_name: buyerName,
      buyer_email: buyerEmail,
      message,
    })
    .select('id')
    .single()

  if (error || !order) {
    return { error: 'Something went wrong. Please try again.' }
  }

  redirect(`/orders/${order.id}`)
}
