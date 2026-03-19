export interface DbDesigner {
  id: string
  name: string
  studio_number: string
  location: string
  city: string
  country: string
  specialty: string
  categories: string[]
  commissions: boolean
  bio: string
  instagram: string | null
  verified: boolean
  user_id: string | null
  created_at: string
}

export interface DbListing {
  id: string
  designer_id: string
  title: string
  description: string
  price: number
  currency: string
  price_display: string
  category: string
  city: string
  images: string[]
  created_at: string
  designers?: DbDesigner
}

export interface DbApplication {
  id: string
  name: string
  studio_name: string
  business_type: string
  email: string | null
  instagram: string | null
  location: string
  customer_volume: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export interface DbOrder {
  id: string
  listing_id: string
  buyer_name: string
  buyer_email: string
  message: string | null
  stripe_session_id: string | null
  stripe_payment_intent: string | null
  status: 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled'
  created_at: string
  listings?: DbListing & { designers?: DbDesigner }
}
