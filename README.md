# Off The Grid

A marketplace exclusively for independent fashion designers — sole traders, self-employed individuals, and very small studios. Every designer is manually verified. No brands. No resellers.

Built with Next.js 16, Supabase, Stripe, and Resend.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Database & auth | Supabase (Postgres + RLS + Auth) |
| Payments | Stripe Checkout (hosted) |
| Email | Resend |
| Styles | CSS Modules + CSS custom properties |
| Deployment | Vercel |

---

## Local setup

```bash
git clone https://github.com/morrismatalon/otg-next.git
cd otg-next
npm install
```

Copy `.env.local` and fill in the values (see **Environment variables** below):

```bash
cp .env.local .env.local.bak  # already pre-filled with placeholders
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

---

## Environment variables

All variables live in `.env.local`. The file is already checked in with placeholder values — replace them before running.

| Variable | Required | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Seeding / admin | Supabase → Project Settings → API → service_role |
| `STRIPE_SECRET_KEY` | Yes | Stripe Dashboard → Developers → API Keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe Dashboard → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe Dashboard → Developers → Webhooks (see below) |
| `RESEND_API_KEY` | Approval emails | resend.com → API Keys |
| `RESEND_FROM_EMAIL` | Approval emails | Your verified Resend sending address |
| `NEXT_PUBLIC_SITE_URL` | Yes | Your site URL, no trailing slash (e.g. `https://yoursite.vercel.app`) |
| `ADMIN_EMAIL` | Yes | The email address that can access `/admin` |

For Vercel: add all of the above under **Project → Settings → Environment Variables**.

---

## Database setup

Run these SQL files in order in the **Supabase SQL Editor** (Dashboard → SQL Editor → New query):

1. `supabase/schema.sql` — creates all tables and RLS policies
2. `supabase/updates.sql` — adds columns, indexes, and additional policies (idempotent)
3. `supabase/seed-final.sql` — inserts 5 verified designers and 12 listings

Or seed programmatically (requires `SUPABASE_SERVICE_ROLE_KEY`):

```bash
npm run seed
```

---

## Stripe webhook setup

The webhook receives `checkout.session.completed` events and writes confirmed orders to Supabase. Without it, orders will not be stored after payment.

### Local development (Stripe CLI)

1. Install the [Stripe CLI](https://docs.stripe.com/stripe-cli)
2. Log in:

```bash
stripe login
```

3. Forward webhooks to your local dev server:

```bash
stripe listen --forward-to localhost:3001/api/stripe/webhook
```

4. Copy the **webhook signing secret** printed by the CLI (starts with `whsec_`) and set it in `.env.local`:

```
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Production (Stripe Dashboard)

1. Go to **Stripe Dashboard → Developers → Webhooks → Add endpoint**
2. Set the endpoint URL: `https://your-domain.vercel.app/api/stripe/webhook`
3. Under **Events to listen to**, select: `checkout.session.completed`
4. Click **Add endpoint**
5. On the endpoint detail page, click **Reveal** under **Signing secret**
6. Copy the `whsec_...` value
7. Add it to Vercel: **Project → Settings → Environment Variables → STRIPE_WEBHOOK_SECRET**
8. Redeploy (or push a commit — Vercel picks up the new env var on next build)

---

## Test checkout flow

Use Stripe test mode to simulate a complete purchase without real money.

### Prerequisites

- `STRIPE_SECRET_KEY` must be a **test key** (starts with `sk_test_`)
- Stripe CLI must be running and forwarding to your local server
- At least one listing must exist in the database (run `npm run seed` first)

### Steps

1. Start the dev server and Stripe CLI in two terminals:

```bash
# Terminal 1
npm run dev

# Terminal 2
stripe listen --forward-to localhost:3001/api/stripe/webhook
```

2. Go to `/browse` and click any listing
3. Click **Buy** on the listing detail page
4. Enter any name, email address, and optional message → click **Proceed to checkout**
5. On the Stripe-hosted checkout page, use the test card:

| Field | Value |
|---|---|
| Card number | `4242 4242 4242 4242` |
| Expiry | Any future date, e.g. `12/26` |
| CVC | Any 3 digits, e.g. `123` |
| Name | Any name |
| Postcode | Any postcode |

6. Click **Pay** — Stripe redirects to `/orders/success`
7. Check the Stripe CLI terminal — you should see `checkout.session.completed` received and processed
8. Check Supabase: **Table Editor → orders** — a confirmed order row should appear

### Other test cards

| Scenario | Card number |
|---|---|
| Payment succeeds | `4242 4242 4242 4242` |
| Payment declined | `4000 0000 0000 0002` |
| Requires 3D Secure auth | `4000 0025 0000 3155` |
| Insufficient funds | `4000 0000 0000 9995` |

---

## Admin panel

The admin panel at `/admin` shows all applications and lets you approve or reject them. Approving automatically creates a designer record and sends the applicant their studio number via email.

### Setup

1. Sign up at `/auth/sign-up` using the email address set in `ADMIN_EMAIL`
2. Navigate to `/admin`

To change the admin email without touching code: update `ADMIN_EMAIL` in your environment variables (`.env.local` locally, Vercel settings in production) and restart/redeploy.

---

## npm scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run seed` | Seed 11 designers and 34 listings (requires `SUPABASE_SERVICE_ROLE_KEY`) |
| `npm run test:flow` | E2E test: sign-up → application → listing → checkout data verification |

---

## Project structure

```
app/
  admin/            Application review dashboard (auth-protected, admin only)
  apply/            Seller application form
  auth/             Sign-in, sign-up, callback
  browse/           Listing grid with category and city filters
  checkout/[id]/    Stripe checkout initiation
  dashboard/        Seller studio dashboard (auth-protected)
  designers/        Public designer directory
  listings/[id]/    Individual listing detail page
  orders/           Order confirmation pages
  privacy/          Privacy policy
  studio/[id]/      Public designer profile page
  terms/            Terms of use
  api/
    stripe/webhook/ Stripe webhook handler (checkout.session.completed)

components/         Shared UI components
lib/
  config.ts         SITE_URL constant (single source of truth)
  constants.ts      ADMIN_EMAIL constant (reads from env)
  data.ts           All Supabase data-fetching functions
  stripe.ts         Lazy Stripe initialisation + toStripeAmount() helper
  supabase/         Server, client, and build Supabase clients
styles/             CSS Modules (one per component/page)
supabase/
  schema.sql        Full database schema
  updates.sql       Incremental migrations (idempotent, safe to re-run)
  seed-final.sql    5 designers + 12 listings — paste into Supabase SQL Editor
scripts/
  seed.mjs          Programmatic seeder (all 11 designers, 34 listings)
  test-flow.mjs     E2E test script
```
