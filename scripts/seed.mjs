/**
 * Off The Grid — Supabase seeder
 *
 * Usage:
 *   node scripts/seed.mjs
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (or the environment).
 * Get it from: Supabase Dashboard → Project Settings → API → service_role key
 *
 * The service role key bypasses Row Level Security so it can insert designers
 * and listings without needing public insert policies.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// ── Load .env.local manually (no dotenv dependency) ───────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dirname, '..', '.env.local')

try {
  const env = readFileSync(envPath, 'utf8')
  for (const line of env.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const [key, ...rest] = trimmed.split('=')
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
  }
} catch {
  console.log('ℹ  No .env.local found — using environment variables directly')
}

// ── Validate env ──────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL) {
  console.error('✖  NEXT_PUBLIC_SUPABASE_URL is not set')
  process.exit(1)
}

if (!SERVICE_ROLE_KEY || SERVICE_ROLE_KEY.startsWith('your-service-role')) {
  console.error(`
✖  SUPABASE_SERVICE_ROLE_KEY is not set.

   1. Open your Supabase dashboard: ${SUPABASE_URL.replace('.supabase.co', '')}.supabase.co
   2. Go to Project Settings → API
   3. Copy the "service_role" key (secret — never expose in client code)
   4. Add to .env.local:
      SUPABASE_SERVICE_ROLE_KEY=eyJ...

   Then re-run: node scripts/seed.mjs
  `)
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

// ── Helpers ───────────────────────────────────────────────────────────────────
let passed = 0
let failed = 0

async function step(label, fn) {
  try {
    const result = await fn()
    if (result?.error) throw result.error
    console.log(`  ✓  ${label}`)
    passed++
    return result?.data ?? result
  } catch (err) {
    console.error(`  ✖  ${label}: ${err?.message ?? err}`)
    failed++
    return null
  }
}

// ── Designers ─────────────────────────────────────────────────────────────────
const designers = [
  { id: 'yuto-mori', name: 'Yuto Mori', studio_number: '0031', location: 'Tokyo, Japan', city: 'Tokyo', country: 'Japan', specialty: 'Outerwear', categories: ['Outerwear'], commissions: true, bio: 'Working from a small studio in Shimokitazawa since 2018. Yuto builds outerwear around the tension between utility and ceremony — pieces made to be worn hard and kept forever. Every garment is cut, assembled, and finished by hand.', instagram: null, verified: true },
  { id: 'reiko-aoki', name: 'Reiko Aoki', studio_number: '0019', location: 'Osaka, Japan', city: 'Osaka', country: 'Japan', specialty: 'Separates', categories: ['Tops', 'Bottoms'], commissions: false, bio: 'Reiko trained in pattern-cutting in Kyoto before returning to Osaka to build a practice around separates. Her work focuses on drape, raw edges, and fabrics sourced from regional mills. Listings only — no commissions.', instagram: null, verified: true },
  { id: 'dara-osei', name: 'Dara Osei', studio_number: '0047', location: 'London, UK', city: 'London', country: 'UK', specialty: 'Tailoring', categories: ['Tops', 'Outerwear'], commissions: true, bio: "East London. Trained through apprenticeship, not school. Dara's tailoring comes from British workwear and West African formal dress — two traditions he treats with equal seriousness. Studio accepts commissions on a case-by-case basis.", instagram: null, verified: true },
  { id: 'n-ferreira', name: 'N. Ferreira', studio_number: '0052', location: 'Lisbon, Portugal', city: 'Lisbon', country: 'Portugal', specialty: 'Accessories', categories: ['Accessories'], commissions: false, bio: 'Nuno works from a shared studio in Mouraria. His practice centres on accessories — bags, straps, and small leather goods — made in very limited runs. Influences range from Portuguese saddlery to 1990s Tokyo streetwear.', instagram: null, verified: true },
  { id: 'mia-krause', name: 'Mia Krause', studio_number: '0038', location: 'Berlin, Germany', city: 'Berlin', country: 'Germany', specialty: 'Knitwear', categories: ['Tops', 'Outerwear'], commissions: true, bio: 'Mia knits everything by hand from a studio in Neukölln. She works with undyed wool sourced from small farms in Germany and Poland. Slow production, deliberately limited quantities. She accepts commissions for custom colourways.', instagram: null, verified: true },
  { id: 'jihoon-park', name: 'Jihoon Park', studio_number: '0061', location: 'Seoul, South Korea', city: 'Seoul', country: 'South Korea', specialty: 'Bottoms', categories: ['Bottoms'], commissions: false, bio: 'Jihoon studied textile engineering before moving into independent production. His trousers and shorts are engineered with precision — technical fabrics, unconventional seaming, functional silhouettes. Based in Mapo-gu.', instagram: null, verified: true },
  { id: 'saoirse-omurchu', name: 'Saoirse Ó Murchú', studio_number: '0073', location: 'Dublin, Ireland', city: 'Dublin', country: 'Ireland', specialty: 'Knitwear', categories: ['Tops', 'Accessories'], commissions: true, bio: "Saoirse knits from a converted shed in the Liberties. She learned from her grandmother and has spent eight years refining the same fisherman stitch vocabulary into something entirely her own. Natural fibres only — she won't work with anything synthetic. Commissions open year-round, though waiting list can stretch to four months.", instagram: '@saoirse.studio', verified: true },
  { id: 'marco-de-luca', name: 'Marco De Luca', studio_number: '0081', location: 'Naples, Italy', city: 'Naples', country: 'Italy', specialty: 'Tailoring', categories: ['Tops', 'Bottoms', 'Outerwear'], commissions: false, bio: 'Fifth-generation Neapolitan. Marco learned to sew before he could read. His tailoring draws on the Campanian tradition of soft construction — no canvas, no padding, just cloth shaped by hand. He keeps a small stock of seasonal pieces; nothing is made to order. Listings only.', instagram: '@marcodeluca.napoli', verified: true },
  { id: 'fatou-diallo', name: 'Fatou Diallo', studio_number: '0055', location: 'Paris, France', city: 'Paris', country: 'France', specialty: 'Draping', categories: ['Tops', 'Bottoms'], commissions: true, bio: "Fatou grew up between Dakar and Paris. Her practice is built around fabric draping — nothing is pinned until the cloth speaks first. She works from a studio in the 18th arrondissement, sourcing deadstock silk and wool from the Sentier district. Studio is small; commissions are selective.", instagram: '@fatoudiallo.studio', verified: true },
  { id: 'hyun-ji-seo', name: 'Hyun-Ji Seo', studio_number: '0067', location: 'Seoul, South Korea', city: 'Seoul', country: 'South Korea', specialty: 'Accessories', categories: ['Accessories'], commissions: false, bio: 'Hyun-Ji worked in industrial textile production for six years before stepping out to make accessories by hand in a studio in Seongsu-dong. Her bags and card cases are built to last decades — brass hardware, hand-stitched seams, leathers sourced from tanneries in Icheon. Listings only; no custom orders.', instagram: '@hyunji.objects', verified: true },
  { id: 'petros-papa', name: 'Petros Papadimitriou', studio_number: '0044', location: 'Athens, Greece', city: 'Athens', country: 'Greece', specialty: 'Knitwear', categories: ['Tops', 'Outerwear'], commissions: true, bio: "Petros runs a small knitting practice out of Monastiraki, working almost entirely with Greek island wool and natural dyes — madder, weld, and walnut shell. His pieces are slow to make and built to outlast the seasons they're made in. He accepts commissions for specific colourways.", instagram: null, verified: true },
]

// ── Listings ──────────────────────────────────────────────────────────────────
const listings = [
  { id: 'panel-bomber-iridescent', designer_id: 'yuto-mori', title: 'Panel bomber, iridescent shell', description: 'Four-panel construction in a Japanese iridescent shell fabric. Interior is unlined to keep weight low. Two chest pockets with press-stud closures. Fits true to size. One of three made.', price: 42000, currency: 'JPY', price_display: '¥ 42,000', category: 'Outerwear', city: 'Tokyo', images: ['/card-1.jpg'] },
  { id: 'asymmetric-coat-wool', designer_id: 'yuto-mori', title: 'Asymmetric coat, boiled wool', description: 'Boiled wool from Niigata, asymmetric front closure, dropped shoulder. The hem sits lower on the right side by intent. Hand-finished seams. One size — fits M through XL depending on preference.', price: 68000, currency: 'JPY', price_display: '¥ 68,000', category: 'Outerwear', city: 'Tokyo', images: ['/card-3.jpg'] },
  { id: 'field-jacket-ripstop', designer_id: 'yuto-mori', title: 'Field jacket, ripstop cotton', description: 'Ripstop cotton in washed olive. Four exterior pockets, one interior map pocket. Straight fit, slightly oversized. Made in an edition of five.', price: 34000, currency: 'JPY', price_display: '¥ 34,000', category: 'Outerwear', city: 'Tokyo', images: ['/card-2.jpg'] },
  { id: 'liner-vest-quilted', designer_id: 'yuto-mori', title: 'Liner vest, quilted nylon', description: 'Quilted nylon liner vest in off-black. Designed to wear under the panel bomber or alone. Press-stud front, two hand pockets. Fits S–XL.', price: 22000, currency: 'JPY', price_display: '¥ 22,000', category: 'Outerwear', city: 'Tokyo', images: ['/card-4.jpg'] },
  { id: 'satin-wide-leg', designer_id: 'reiko-aoki', title: 'Satin wide leg, raw hem', description: 'Wide-leg trousers in a heavyweight satin from a Nishijin mill. Raw hem, elasticated waistband with a tie. Cut for a relaxed, low-crotch silhouette. Hand-washed before shipping.', price: 18500, currency: 'JPY', price_display: '¥ 18,500', category: 'Bottoms', city: 'Osaka', images: ['/card-2.jpg'] },
  { id: 'draped-top-gauze', designer_id: 'reiko-aoki', title: 'Draped top, cotton gauze', description: 'Open-weave cotton gauze in undyed natural. One-piece drape construction, no closures. Intended to be worn tied or left open. Light enough to layer. One size.', price: 12000, currency: 'JPY', price_display: '¥ 12,000', category: 'Tops', city: 'Osaka', images: ['/card-3.jpg'] },
  { id: 'wrap-skirt-linen', designer_id: 'reiko-aoki', title: 'Wrap skirt, washed linen', description: 'Washed linen wrap skirt in slate grey. Midi length, adjustable tie. Raw edges on all seams. Fits 26–34" waist.', price: 16000, currency: 'JPY', price_display: '¥ 16,000', category: 'Bottoms', city: 'Osaka', images: ['/card-1.jpg'] },
  { id: 'boxy-shirt-poplin', designer_id: 'reiko-aoki', title: 'Boxy shirt, cotton poplin', description: 'Boxy-cut shirt in cotton poplin, off-white. Dropped shoulder, single chest pocket, no collar — just a wide band neck. Edition of eight.', price: 14500, currency: 'JPY', price_display: '¥ 14,500', category: 'Tops', city: 'Osaka', images: ['/card-4.jpg'] },
  { id: 'hand-printed-oversized-tee', designer_id: 'dara-osei', title: 'Hand-printed oversized tee', description: 'Screen-printed by hand in East London on a heavyweight organic cotton blank. The print references Ghanaian kente textile geometry. Each one varies slightly — no two are identical. Run of twelve.', price: 185, currency: 'GBP', price_display: '£ 185', category: 'Tops', city: 'London', images: ['/card-3.jpg'] },
  { id: 'structured-blazer-canvas', designer_id: 'dara-osei', title: 'Structured blazer, canvas', description: 'Canvas blazer with internal structure — chest piece and bridle stay. Single button, jetted pockets. Made to order, 6–8 week lead time. British canvas, Japanese lining.', price: 620, currency: 'GBP', price_display: '£ 620', category: 'Outerwear', city: 'London', images: ['/card-1.jpg'] },
  { id: 'workwear-jacket-denim', designer_id: 'dara-osei', title: 'Workwear jacket, raw denim', description: '14oz raw denim workwear jacket. Four external pockets, triple-stitched at stress points. Will fade uniquely with wear. One size left.', price: 340, currency: 'GBP', price_display: '£ 340', category: 'Outerwear', city: 'London', images: ['/card-2.jpg'] },
  { id: 'pleated-trouser-twill', designer_id: 'dara-osei', title: 'Pleated trouser, wool twill', description: 'Double-pleated trouser in a mid-weight British wool twill. High rise, straight leg. Made to measure at no extra cost — just include your measurements at checkout.', price: 280, currency: 'GBP', price_display: '£ 280', category: 'Bottoms', city: 'London', images: ['/card-4.jpg'] },
  { id: 'neon-deck-limited', designer_id: 'n-ferreira', title: 'Neon deck, limited run', description: 'Structured tote in vegetable-tanned cow leather, fluorescent accents on the handles and gusset. Based on a Portuguese saddlebag form. Numbered edition of six. This is No. 4.', price: 320, currency: 'EUR', price_display: '€ 320', category: 'Accessories', city: 'Lisbon', images: ['/card-4.jpg'] },
  { id: 'shoulder-bag-bridle', designer_id: 'n-ferreira', title: 'Shoulder bag, bridle leather', description: 'Traditional bridle leather shoulder bag. Single strap, brass hardware, three interior divisions. Will darken and deepen with use. Made entirely by hand.', price: 480, currency: 'EUR', price_display: '€ 480', category: 'Accessories', city: 'Lisbon', images: ['/card-1.jpg'] },
  { id: 'card-wallet-calf', designer_id: 'n-ferreira', title: 'Card wallet, calf leather', description: 'Three-pocket card wallet in natural calf leather. Hand-stitched with linen thread. Minimal profile, good for four to six cards. Made in batches of twenty.', price: 95, currency: 'EUR', price_display: '€ 95', category: 'Accessories', city: 'Lisbon', images: ['/card-2.jpg'] },
  { id: 'wrist-strap-nylon', designer_id: 'n-ferreira', title: 'Wrist strap, technical nylon', description: 'Camera or bag wrist strap in technical nylon webbing with a leather loop and brass clip. Adjustable length. One size.', price: 65, currency: 'EUR', price_display: '€ 65', category: 'Accessories', city: 'Lisbon', images: ['/card-3.jpg'] },
  { id: 'hand-knit-pullover', designer_id: 'mia-krause', title: 'Hand-knit pullover, undyed wool', description: 'Hand-knit from undyed Merino from a small farm in Sachsen. Relaxed fit, ribbed hem and cuffs, drop shoulder. Takes approximately three weeks per piece. One available now.', price: 520, currency: 'EUR', price_display: '€ 520', category: 'Tops', city: 'Berlin', images: ['/card-2.jpg'] },
  { id: 'oversized-cardigan-wool', designer_id: 'mia-krause', title: 'Oversized cardigan, raw fleece', description: 'Double-weight raw fleece wool. Four bone buttons, deep pockets. Oversized deliberately — designed to wear over a shirt or light jacket. One size.', price: 640, currency: 'EUR', price_display: '€ 640', category: 'Outerwear', city: 'Berlin', images: ['/card-1.jpg'] },
  { id: 'wool-scarf-natural', designer_id: 'mia-krause', title: 'Scarf, natural + charcoal', description: 'Hand-knit in natural and charcoal undyed wool. Long format, approx 220cm. Fringe ends. One of four.', price: 185, currency: 'EUR', price_display: '€ 185', category: 'Accessories', city: 'Berlin', images: ['/card-3.jpg'] },
  { id: 'technical-wide-trouser', designer_id: 'jihoon-park', title: 'Technical wide trouser', description: 'Wide-leg trouser in a four-way stretch technical fabric. Flat front, articulated knees, tapered at the ankle. Engineered for movement — not streetwear posturing.', price: 185000, currency: 'KRW', price_display: '₩ 185,000', category: 'Bottoms', city: 'Seoul', images: ['/card-4.jpg'] },
  { id: 'cargo-shorts-ripstop', designer_id: 'jihoon-park', title: 'Cargo shorts, ripstop', description: 'Six-pocket cargo shorts in Korean ripstop. Fitted waistband, utility pockets at thigh. Knee length. Sizes S–XL available.', price: 120000, currency: 'KRW', price_display: '₩ 120,000', category: 'Bottoms', city: 'Seoul', images: ['/card-2.jpg'] },
  { id: 'seamed-jogger-fleece', designer_id: 'jihoon-park', title: 'Seamed jogger, French fleece', description: 'French fleece jogger with exposed exterior seaming. Drawstring waist, no cuff — clean hem. Heavy enough to wear alone in cool weather.', price: 145000, currency: 'KRW', price_display: '₩ 145,000', category: 'Bottoms', city: 'Seoul', images: ['/card-1.jpg'] },
  { id: 'fisherman-pullover-aran', designer_id: 'saoirse-omurchu', title: 'Fisherman pullover, Aran wool', description: 'Hand-knit in traditional Aran stitch using undyed wool from a Co. Clare flock. Boxy fit, drop shoulder, ribbed cuffs and hem. Heavy — intended for real weather. One of two available; the other was kept.', price: 380, currency: 'EUR', price_display: '€ 380', category: 'Tops', city: 'Dublin', images: ['/card-3.jpg'] },
  { id: 'wool-balaclava-natural', designer_id: 'saoirse-omurchu', title: 'Balaclava, undyed natural wool', description: 'Hand-knit balaclava in a 2-ply undyed wool. Full face opening, snug at the neck. Made in an edition of six; this is the last. One size — stretches to fit.', price: 120, currency: 'EUR', price_display: '€ 120', category: 'Accessories', city: 'Dublin', images: ['/card-4.jpg'] },
  { id: 'cable-cardigan-oversized', designer_id: 'saoirse-omurchu', title: 'Cable-knit cardigan, oversized', description: 'Large-gauge cable cardigan in cream undyed wool. Four horn buttons, two deep patch pockets. Oversized deliberately — fits S through L, depending on preference. Knitting time: approximately five weeks.', price: 460, currency: 'EUR', price_display: '€ 460', category: 'Outerwear', city: 'Dublin', images: ['/card-1.jpg'] },
  { id: 'linen-blazer-unlined', designer_id: 'marco-de-luca', title: 'Unlined blazer, summer linen', description: 'Single-button blazer cut in an Italian linen from a mill in Biella. Completely unlined — no canvas, no padding. Soft shoulder, long lapel. Two-button cuffs. Neapolitan spalla camicia construction.', price: 680, currency: 'EUR', price_display: '€ 680', category: 'Outerwear', city: 'Naples', images: ['/card-2.jpg'] },
  { id: 'wide-cotton-trouser', designer_id: 'marco-de-luca', title: 'Wide trouser, cotton gabardine', description: 'High-rise, wide-leg trouser in a mid-weight cotton gabardine. Single pleat, side-adjusters, no belt loops. The cut is classic Neapolitan — high waist, long rise, full leg.', price: 285, currency: 'EUR', price_display: '€ 285', category: 'Bottoms', city: 'Naples', images: ['/card-4.jpg'] },
  { id: 'silk-pocket-square', designer_id: 'marco-de-luca', title: 'Pocket square, printed silk', description: 'Hand-rolled silk pocket square. The print is adapted from a 19th-century Neapolitan cartouche. Made in a run of twenty — this is one of the last.', price: 65, currency: 'EUR', price_display: '€ 65', category: 'Accessories', city: 'Naples', images: ['/card-3.jpg'] },
  { id: 'silk-georgette-blouse', designer_id: 'fatou-diallo', title: 'Draped blouse, silk georgette', description: 'Deadstock silk georgette sourced from the Sentier district. One-shoulder drape, no fastening. The weight does the work. Fits S–M. Dry clean only — she ships it clean.', price: 320, currency: 'EUR', price_display: '€ 320', category: 'Tops', city: 'Paris', images: ['/card-1.jpg'] },
  { id: 'wool-palazzo-highwaist', designer_id: 'fatou-diallo', title: 'Palazzo trouser, high-waist wool', description: 'High-waist wide-leg trouser in a deadstock French wool crepe. Deep waistband, side zip, no pockets — the silhouette demanded it. Midi length. Limited to two in this fabric.', price: 410, currency: 'EUR', price_display: '€ 410', category: 'Bottoms', city: 'Paris', images: ['/card-2.jpg'] },
  { id: 'leather-card-sleeve', designer_id: 'hyun-ji-seo', title: 'Card sleeve, vegetable-tanned leather', description: 'Slim card sleeve in natural vegetable-tanned leather from the Icheon tanneries. Four slots, hand-burnished edges, linen thread stitching. Will patinate to a deep honey with use.', price: 85000, currency: 'KRW', price_display: '₩ 85,000', category: 'Accessories', city: 'Seoul', images: ['/card-3.jpg'] },
  { id: 'waxed-canvas-crossbody', designer_id: 'hyun-ji-seo', title: 'Crossbody bag, waxed canvas', description: 'Structured crossbody in waxed Korean canvas with full-grain leather trim and solid brass hardware. One main compartment, two exterior pockets. Strap is adjustable and removable.', price: 320000, currency: 'KRW', price_display: '₩ 320,000', category: 'Accessories', city: 'Seoul', images: ['/card-4.jpg'] },
  { id: 'cotton-fisherman-shirt', designer_id: 'petros-papa', title: 'Fisherman shirt, natural-dye cotton', description: 'Oversized shirt in undyed Greek island cotton, dyed with walnut shell. The colour varies batch to batch — this one is a warm taupe. Long sleeves, wide collar, chest pocket. One size.', price: 195, currency: 'EUR', price_display: '€ 195', category: 'Tops', city: 'Athens', images: ['/card-1.jpg'] },
  { id: 'indigo-linen-pullover', designer_id: 'petros-papa', title: 'Hand-loomed pullover, indigo linen', description: 'Hand-loomed linen and cotton blend, dyed in natural indigo. Boxy fit, wide neck, dropped sleeve. Heavy enough to wear as an outer layer. The indigo will fade gradually — intentionally.', price: 280, currency: 'EUR', price_display: '€ 280', category: 'Tops', city: 'Athens', images: ['/card-2.jpg'] },
]

// ── Run ───────────────────────────────────────────────────────────────────────
console.log('\n── Off The Grid Seeder ──────────────────────────────────────────')
console.log(`   Supabase: ${SUPABASE_URL}`)
console.log('')

// Designers
console.log('Inserting designers...')
for (const d of designers) {
  await step(d.name, () =>
    supabase.from('designers').upsert(d, { onConflict: 'id' })
  )
}

// Listings
console.log('\nInserting listings...')
for (const l of listings) {
  await step(l.title, () =>
    supabase.from('listings').upsert(l, { onConflict: 'id' })
  )
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log('')
console.log('────────────────────────────────────────────────────────────────')
console.log(`  ${passed} passed   ${failed} failed`)
if (failed === 0) {
  console.log('  ✓ All seed data is live in the database.')
} else {
  console.log('  ✖ Some records failed. Check errors above.')
  process.exit(1)
}
console.log('')
