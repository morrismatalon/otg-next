'use server'

import { redirect } from 'next/navigation'
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
    console.error('[apply] insert failed — code:', error.code, '— message:', error.message)
    if (error.code === 'PGRST205') {
      return {
        error:
          'Database tables not set up yet. Run schema.sql then updates.sql in the Supabase SQL Editor.',
      }
    }
    return { error: `Could not submit application: ${error.message}` }
  }

  redirect('/apply/success')
}
