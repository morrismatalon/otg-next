import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('[Stripe webhook] signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { listingId, buyerName, buyerEmail, message } = session.metadata ?? {}

    if (!listingId || !buyerName || !buyerEmail) {
      console.error('[Stripe webhook] missing metadata on session', session.id)
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase.from('orders').insert({
      listing_id: listingId,
      buyer_name: buyerName,
      buyer_email: buyerEmail,
      message: message || null,
      stripe_session_id: session.id,
      stripe_payment_intent:
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : (session.payment_intent?.id ?? null),
      status: 'confirmed',
    })

    if (error) {
      console.error('[Stripe webhook] failed to insert order:', error.message)
      return NextResponse.json({ error: 'DB insert failed' }, { status: 500 })
    }

    console.log('[Stripe webhook] order created for session', session.id)
  }

  return NextResponse.json({ received: true })
}
