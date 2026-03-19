'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { ADMIN_EMAIL } from '@/lib/constants'
import type { DbApplication } from '@/lib/supabase/types'

function generateDesignerId(studioName: string): string {
  return studioName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
}

function generateStudioNumber(): string {
  const n = Math.floor(Math.random() * 9000) + 1000
  return String(n).padStart(4, '0')
}

async function autoCreateDesigner(
  supabase: Awaited<ReturnType<typeof createClient>>,
  app: DbApplication
): Promise<{ designerId: string; studioNumber: string } | null> {
  const id = generateDesignerId(app.studio_name)
  const studio_number = generateStudioNumber()

  // Ensure unique ID by appending timestamp if needed
  const { data: existing } = await supabase
    .from('designers')
    .select('id')
    .eq('id', id)
    .single()

  const finalId = existing ? `${id}-${Date.now()}` : id

  // Parse city/country from location "City, Country"
  const parts = app.location.split(',').map((s) => s.trim())
  const city = parts[0] ?? app.location
  const country = parts[1] ?? ''

  const { error } = await supabase.from('designers').insert({
    id: finalId,
    name: app.name,
    studio_number,
    location: app.location,
    city,
    country,
    specialty: 'General', // Admin can update later
    categories: [],
    commissions: false,
    bio: '',
    instagram: app.instagram,
    verified: true,
  })

  if (error) {
    console.error('[OTG] Failed to create designer record:', error.message)
    return null
  }

  console.log(
    `[OTG] ✓ Designer record created for approved application:`,
    JSON.stringify({
      designerId: finalId,
      name: app.name,
      studioName: app.studio_name,
      studioNumber: studio_number,
      location: app.location,
    }, null, 2)
  )

  // Confirmation "email" (console for now)
  console.log(
    `[OTG] ✉  Confirmation would be sent to: ${app.name}`,
    `\n  Subject: Your Off The Grid application has been approved`,
    `\n  Body: Congratulations ${app.name}. Your studio "${app.studio_name}" has been approved.`,
    `\n  Your permanent studio number is: No. ${studio_number}`,
    `\n  You can now sign up at https://offthegrid.com/auth/sign-up to access your dashboard.`
  )

  return { designerId: finalId, studioNumber: studio_number }
}

export async function updateApplicationStatus(
  id: string,
  status: 'approved' | 'rejected'
): Promise<{ error?: string; designerId?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) {
    return { error: 'Unauthorized' }
  }

  // Fetch the application first
  const { data: app, error: fetchErr } = await supabase
    .from('applications')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchErr || !app) {
    return { error: 'Application not found.' }
  }

  // Update status
  const { error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', id)

  if (error) return { error: error.message }

  // If approved, auto-create designer record
  let designerId: string | undefined
  if (status === 'approved') {
    const result = await autoCreateDesigner(supabase, app as DbApplication)
    if (result) {
      designerId = result.designerId
    }
  } else {
    console.log(
      `[OTG] ✗ Application rejected:`,
      JSON.stringify({ name: app.name, studio: app.studio_name, location: app.location }, null, 2)
    )
  }

  revalidatePath('/admin')
  return { designerId }
}
