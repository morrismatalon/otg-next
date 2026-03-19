'use server'

import { createClient } from '@/lib/supabase/server'

export interface ApplyFormState {
  error?: string
  success?: boolean
}

export async function submitApplication(
  _prev: ApplyFormState,
  formData: FormData
): Promise<ApplyFormState> {
  const name = formData.get('name') as string
  const studio_name = formData.get('studio') as string
  const business_type = formData.get('type') as string
  const location = formData.get('location') as string
  const instagram = (formData.get('instagram') as string) || null
  const customer_volume = formData.get('volume') as string

  if (!name || !studio_name || !business_type || !location || !customer_volume) {
    return { error: 'Please fill in all required fields.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.from('applications').insert({
    name,
    studio_name,
    business_type,
    location,
    instagram,
    customer_volume,
  })

  if (error) {
    return { error: 'Something went wrong. Please try again.' }
  }

  return { success: true }
}
