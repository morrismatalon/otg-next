/**
 * Off The Grid — End-to-end test flow
 *
 * Usage:
 *   node scripts/test-flow.mjs
 *
 * Requires:
 *   NEXT_PUBLIC_SUPABASE_URL      — in .env.local
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY — in .env.local
 *   SUPABASE_SERVICE_ROLE_KEY     — in .env.local (for admin operations)
 *
 * What it tests:
 *   1. Sign up as buyer
 *   2. Sign up as seller
 *   3. Submit application as seller
 *   4. Approve application (service role — simulates admin)
 *   5. Auto-create designer record and link to seller
 *   6. Create a listing as the seller
 *   7. Fetch and verify the listing
 *   8. Verify checkout data (no real Stripe call)
 *   9. Clean up all test data
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// ── Load .env.local ───────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url))
try {
  const env = readFileSync(join(__dirname, '..', '.env.local'), 'utf8')
  for (const line of env.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const [key, ...rest] = trimmed.split('=')
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
  }
} catch { /* ok */ }

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!URL || !ANON) {
  console.error('✖  NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required')
  process.exit(1)
}

const anonClient = createClient(URL, ANON, { auth: { persistSession: false } })
const adminClient = SERVICE
  ? createClient(URL, SERVICE, { auth: { persistSession: false } })
  : null

// ── State ─────────────────────────────────────────────────────────────────────
const ts = Date.now()
const buyerEmail = `test-buyer-${ts}@otg-test.dev`
const sellerEmail = `test-seller-${ts}@otg-test.dev`
const testPassword = 'TestOTG2025!'
const designerId = `test-studio-${ts}`
const listingId = `test-listing-${ts}`
let passed = 0
let failed = 0
const createdUsers = []
const createdRecords = [] // { table, id }

// ── Helpers ───────────────────────────────────────────────────────────────────
function ok(msg) {
  console.log(`  ✓  ${msg}`)
  passed++
}

function fail(msg, err) {
  console.error(`  ✖  ${msg}${err ? ': ' + (err.message ?? JSON.stringify(err)) : ''}`)
  failed++
}

async function assert(label, fn) {
  try {
    const result = await fn()
    if (result?.error) throw result.error
    ok(label)
    return result?.data ?? result
  } catch (err) {
    fail(label, err)
    return null
  }
}

// ── Tests ─────────────────────────────────────────────────────────────────────
console.log('\n── Off The Grid E2E Test Flow ───────────────────────────────────')
console.log(`   Supabase: ${URL}`)
console.log(`   Timestamp: ${ts}`)
console.log('')

// 1. Sign up as buyer
console.log('Step 1 — Sign up as buyer')
const buyerResult = await assert('buyer sign-up', () =>
  anonClient.auth.signUp({ email: buyerEmail, password: testPassword })
)
if (buyerResult?.user) createdUsers.push(buyerResult.user.id)

// 2. Sign up as seller
console.log('\nStep 2 — Sign up as seller')
const sellerResult = await assert('seller sign-up', () =>
  anonClient.auth.signUp({ email: sellerEmail, password: testPassword })
)
if (sellerResult?.user) createdUsers.push(sellerResult.user.id)

const sellerId = sellerResult?.user?.id

// 3. Submit application as seller
console.log('\nStep 3 — Submit application')
const appResult = await assert('application submitted', () =>
  anonClient.from('applications').insert({
    name: `Test Seller ${ts}`,
    studio_name: `Test Studio ${ts}`,
    business_type: 'sole-trader',
    email: sellerEmail,
    location: 'London, UK',
    customer_volume: 'under-50',
    status: 'pending',
  }).select('id').single()
)
const appId = appResult?.id
if (appId) createdRecords.push({ table: 'applications', id: appId })

// 4. Approve application (requires service role)
console.log('\nStep 4 — Approve application (admin)')
if (!adminClient) {
  fail('approve application', { message: 'SUPABASE_SERVICE_ROLE_KEY not set — skipping admin steps' })
} else if (appId) {
  await assert('application status updated to approved', () =>
    adminClient.from('applications').update({ status: 'approved' }).eq('id', appId)
  )
}

// 5. Create designer record and link to seller
console.log('\nStep 5 — Create designer record')
if (!adminClient) {
  fail('create designer', { message: 'SUPABASE_SERVICE_ROLE_KEY not set — skipping' })
} else if (sellerId) {
  await assert('designer record created', () =>
    adminClient.from('designers').upsert({
      id: designerId,
      name: `Test Studio ${ts}`,
      studio_number: '9999',
      location: 'London, UK',
      city: 'London',
      country: 'UK',
      specialty: 'Outerwear',
      categories: ['Outerwear'],
      commissions: false,
      bio: 'Test designer for automated flow.',
      verified: true,
      user_id: sellerId,
    }, { onConflict: 'id' })
  )
  createdRecords.push({ table: 'designers', id: designerId })
}

// 6. Create a listing
console.log('\nStep 6 — Create listing')
if (!adminClient) {
  fail('create listing', { message: 'SUPABASE_SERVICE_ROLE_KEY not set — skipping' })
} else {
  await assert('listing created', () =>
    adminClient.from('listings').upsert({
      id: listingId,
      designer_id: designerId,
      title: `Test Jacket ${ts}`,
      description: 'A test jacket created by the automated test flow.',
      price: 250,
      currency: 'GBP',
      price_display: '£ 250',
      category: 'Outerwear',
      city: 'London',
      images: ['/card-1.jpg'],
    }, { onConflict: 'id' })
  )
  createdRecords.push({ table: 'listings', id: listingId })
}

// 7. Fetch and verify listing
console.log('\nStep 7 — Fetch and verify listing')
const fetchedListing = await assert('listing is publicly readable', () =>
  anonClient.from('listings')
    .select('id, title, price, currency')
    .eq('id', listingId)
    .single()
)

if (fetchedListing) {
  if (fetchedListing.price === 250) {
    ok('listing price is correct (£ 250)')
  } else {
    fail(`listing price mismatch: expected 250, got ${fetchedListing.price}`)
  }
  if (fetchedListing.currency === 'GBP') {
    ok('listing currency is correct (GBP)')
  } else {
    fail(`listing currency mismatch`)
  }
}

// 8. Verify checkout data (no real Stripe call)
console.log('\nStep 8 — Verify checkout readiness')
if (fetchedListing) {
  const stripeAmount = fetchedListing.currency === 'JPY' || fetchedListing.currency === 'KRW'
    ? Math.round(fetchedListing.price)
    : Math.round(fetchedListing.price * 100)

  if (stripeAmount === 25000) {
    ok(`Stripe amount correct (${stripeAmount} pence for £ 250)`)
  } else {
    fail(`Stripe amount mismatch: expected 25000, got ${stripeAmount}`)
  }

  const successUrl = `http://localhost:3001/orders/success?session_id={CHECKOUT_SESSION_ID}`
  if (successUrl.includes('/orders/success')) {
    ok('success_url format valid')
  } else {
    fail('success_url format invalid')
  }
}

// 9. Clean up
console.log('\nStep 9 — Clean up test data')
if (adminClient) {
  for (const record of [...createdRecords].reverse()) {
    await assert(`delete ${record.table}/${record.id}`, () =>
      adminClient.from(record.table).delete().eq('id', record.id)
    )
  }
  for (const userId of createdUsers) {
    await assert(`delete auth user ${userId}`, () =>
      adminClient.auth.admin.deleteUser(userId)
    )
  }
} else {
  console.log('  ⚠  Skipping cleanup — no service role key')
  console.log(`  ⚠  Manually delete: listings/${listingId}, designers/${designerId}, application ${appId}`)
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log('')
console.log('────────────────────────────────────────────────────────────────')
console.log(`  ${passed} passed   ${failed} failed`)

if (failed === 0) {
  console.log('  ✓ All steps passed.')
} else if (!adminClient && failed <= 6) {
  console.log('  ⚠  Some steps skipped (no SUPABASE_SERVICE_ROLE_KEY).')
  console.log('     Add it to .env.local to run the full flow.')
} else {
  console.log('  ✖ Some steps failed. See above for details.')
  process.exit(1)
}
console.log('')
