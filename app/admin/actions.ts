'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { ADMIN_EMAIL } from '@/lib/constants'
import { resend, FROM_EMAIL } from '@/lib/resend'
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
  // Send approval email if we have an address
  if (app.email) {
    const { error: emailErr } = await resend.emails.send({
      from: FROM_EMAIL,
      to: app.email,
      subject: 'Your Off The Grid application has been approved',
      html: `
        <p>Hi ${app.name},</p>
        <p>Congratulations — your studio <strong>${app.studio_name}</strong> has been approved to join Off The Grid.</p>
        <p>Your permanent studio number is: <strong>No. ${studio_number}</strong></p>
        <p>You can now create an account at <a href="${process.env.NEXT_PUBLIC_SITE_URL}/auth/sign-up">${process.env.NEXT_PUBLIC_SITE_URL}/auth/sign-up</a> to access your seller dashboard and start listing your work.</p>
        <p>Welcome to the grid.</p>
        <p>— The Off The Grid team</p>
      `,
    })
    if (emailErr) {
      console.error('[OTG] Failed to send approval email:', emailErr.message)
    } else {
      console.log(`[OTG] ✉  Approval email sent to ${app.email}`)
    }
  } else {
    console.log(`[OTG] ✉  No email on file for ${app.name} — skipping approval email`)
  }

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
