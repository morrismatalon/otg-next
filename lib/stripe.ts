import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Zero-decimal currencies don't need ×100 conversion
const ZERO_DECIMAL = new Set([
  'BIF','CLP','DJF','GNF','JPY','KMF','KRW','MGA','PYG',
  'RWF','UGX','VND','VUV','XAF','XOF','XPF',
])

export function toStripeAmount(price: number, currency: string): number {
  return ZERO_DECIMAL.has(currency.toUpperCase())
    ? Math.round(price)
    : Math.round(price * 100)
}
