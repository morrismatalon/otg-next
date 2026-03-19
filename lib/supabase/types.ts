export interface DbDesigner {
  id: string
  name: string
  studio_number: string
  location: string        // "City, Country"
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
  currency: string        // "JPY" | "GBP" | "EUR" | "KRW"
  price_display: string   // "¥ 42,000" — pre-formatted
  category: string
  city: string
  images: string[]        // array of public paths or storage URLs
  created_at: string
  // joined
  designers?: DbDesigner
}

export interface DbApplication {
  id: string
  name: string
  studio_name: string
  business_type: string
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
  status: 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled'
  created_at: string
  // joined
  listings?: DbListing & { designers?: DbDesigner }
}
