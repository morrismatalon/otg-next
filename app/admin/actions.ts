'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { ADMIN_EMAIL } from '@/lib/constants'
import { resend, FROM_EMAIL } from '@/lib/resend'
import { SITE_URL } from '@/lib/config'
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
  app: DbApplication
): Promise<{ designerId: string; studioNumber: string } | null> {
  // Use service-role client — designers table INSERT requires auth.role() = 'service_role'
  let admin
  try {
    admin = createAdminClient()
  } catch (err) {
    console.error('[OTG] Cannot create designer — service role key missing:', err)
    return null
  }

  const id = generateDesignerId(app.studio_name)
  const studio_number = generateStudioNumber()

  // Ensure unique ID by appending timestamp if needed
  const { data: existing } = await admin
    .from('designers')
    .select('id')
    .eq('id', id)
    .single()

  const finalId = existing ? `${id}-${Date.now()}` : id

  // Parse city/country from location "City, Country"
  const parts = app.location.split(',').map((s) => s.trim())
  const city = parts[0] ?? app.location
  const country = parts[1] ?? ''

  const { error } = await admin.from('designers').insert({
    id: finalId,
    name: app.name,
    studio_number,
    location: app.location,
    city,
    country,
    specialty: 'General',
    categories: [],
    commissions: false,
    bio: '',
    instagram: app.instagram ?? null,
    verified: true,
  })

  if (error) {
    console.error('[OTG] Failed to create designer record:', error.code, error.message)
    return null
  }

  console.log('[OTG] ✓ Designer record created:', { designerId: finalId, studio_number, name: app.name })

  // Send approval email
  if (app.email) {
    const signUpUrl = `${SITE_URL}/auth/sign-up`
    const { error: emailErr } = await resend.emails.send({
      from: FROM_EMAIL,
      to: app.email,
      subject: 'Your Off The Grid application has been approved',
      html: `
        <p style="font-family:Georgia,serif;font-size:16px;line-height:1.7;color:#1a1a18">Hi ${app.name},</p>
        <p style="font-family:Georgia,serif;font-size:16px;line-height:1.7;color:#1a1a18">
          Your studio <strong>${app.studio_name}</strong> has been approved to join Off The Grid.
        </p>
        <p style="font-family:Georgia,serif;font-size:16px;line-height:1.7;color:#1a1a18">
          Your permanent studio number is: <strong>No. ${studio_number}</strong>
        </p>
        <p style="font-family:Georgia,serif;font-size:16px;line-height:1.7;color:#1a1a18">
          Create your account to access your seller dashboard and start listing:
        </p>
        <p>
          <a href="${signUpUrl}" style="font-family:Georgia,serif;font-size:16px;color:#1a1a18">${signUpUrl}</a>
        </p>
        <p style="font-family:Georgia,serif;font-size:16px;line-height:1.7;color:#1a1a18">
          After signing up, you&apos;ll land directly on your studio dashboard. Welcome to the grid.
        </p>
        <p style="font-family:Georgia,serif;font-size:16px;line-height:1.7;color:#6b6b68">— Off The Grid</p>
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
  // Auth check uses anon client — we need the calling user's session
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) {
    return { error: 'Unauthorized' }
  }

  // Fetch application
  const { data: app, error: fetchErr } = await supabase
    .from('applications')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchErr || !app) {
    return { error: 'Application not found.' }
  }

  // Update status
  const { error: updateErr } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', id)

  if (updateErr) return { error: updateErr.message }

  // If approved, create designer record via service role
  let designerId: string | undefined
  if (status === 'approved') {
    const result = await autoCreateDesigner(app as DbApplication)
    if (result) {
      designerId = result.designerId
    }
  } else {
    console.log('[OTG] ✗ Application rejected:', { name: app.name, studio: app.studio_name })
  }

  revalidatePath('/admin')
  return { designerId }
}
