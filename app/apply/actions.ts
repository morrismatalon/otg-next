'use server'

import { createBuildClient } from '@/lib/supabase/build'

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
  const email = (formData.get('email') as string) || null
  const location = formData.get('location') as string
  const instagram = (formData.get('instagram') as string) || null
  const customer_volume = formData.get('volume') as string

  if (!name || !studio_name || !business_type || !location || !customer_volume) {
    return { error: 'Please fill in all required fields.' }
  }

  const supabase = createBuildClient()

  const { error } = await supabase.from('applications').insert({
    name,
    studio_name,
    business_type,
    email,
    location,
    instagram,
    customer_volume,
  })

  if (error) {
    console.error('[apply] insert failed:', error.code, error.message)
    // PGRST205 = table not found — schema.sql + updates.sql need to be run
    if (error.code === 'PGRST205') {
      return { error: 'Database not set up yet. Run schema.sql and updates.sql in the Supabase SQL Editor first.' }
    }
    return { error: `Submission failed: ${error.message}` }
  }

  return { success: true }
}
