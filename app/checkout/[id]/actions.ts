'use server'

import { redirect } from 'next/navigation'
import { getListingById } from '@/lib/data'
import { getStripe, toStripeAmount } from '@/lib/stripe'
import { SITE_URL } from '@/lib/config'

export interface CheckoutState {
  error?: string
}

export async function placeOrder(
  _prev: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  const listingId = formData.get('listingId') as string
  const buyerName = formData.get('buyerName') as string
  const buyerEmail = formData.get('buyerEmail') as string
  const message = (formData.get('message') as string) || ''

  if (!listingId || !buyerName || !buyerEmail) {
    return { error: 'Please fill in all required fields.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(buyerEmail)) {
    return { error: 'Please enter a valid email address.' }
  }

  const listing = await getListingById(listingId)
  if (!listing) {
    return { error: 'This listing no longer exists.' }
  }

  let session: { url: string | null }
  try {
    session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: listing.currency.toLowerCase(),
            unit_amount: toStripeAmount(listing.priceNum, listing.currency),
            product_data: {
              name: listing.name,
              description: `${listing.designer} · ${listing.city}`,
              images: listing.imageSrc.startsWith('http') ? [listing.imageSrc] : [],
            },
          },
        },
      ],
      customer_email: buyerEmail,
      metadata: {
        listingId,
        buyerName,
        buyerEmail,
        message,
      },
      success_url: `${SITE_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/checkout/${listingId}`,
    })
  } catch (err) {
    console.error('[Stripe] session creation failed:', err)
    return { error: 'Payment setup failed. Please try again.' }
  }

  if (!session.url) {
    return { error: 'Could not start checkout. Please try again.' }
  }

  redirect(session.url)
}
