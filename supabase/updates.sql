-- ============================================================
-- Off The Grid — incremental updates
-- Run this if you already ran schema.sql and seed.sql
-- Safe to run multiple times (idempotent)
-- ============================================================

-- 1. Add user_id to designers (links auth user → designer profile)
alter table designers add column if not exists user_id uuid references auth.users(id);
create index if not exists designers_user_id_idx on designers(user_id);

-- 2. Orders table
create table if not exists orders (
  id            uuid primary key default gen_random_uuid(),
  listing_id    text not null references listings(id),
  buyer_name    text not null,
  buyer_email   text not null,
  message       text,
  status        text not null default 'pending'
                check (status in ('pending','confirmed','shipped','completed','cancelled')),
  created_at    timestamptz not null default now()
);

alter table orders enable row level security;

-- Orders: anyone can create, anyone can read (UUID is unguessable)
create policy "orders_public_insert"
  on orders for insert with check (true);

create policy "orders_public_select"
  on orders for select using (true);

create index if not exists orders_listing_id_idx on orders(listing_id);

-- 3. Allow authenticated users to insert listings (for /dashboard/new-listing)
do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'listings' and policyname = 'listings_auth_insert'
  ) then
    create policy "listings_auth_insert"
      on listings for insert with check (auth.role() = 'authenticated');
  end if;
end$$;

-- 4. Allow authenticated users to update applications (for /admin approve/reject)
do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'applications' and policyname = 'applications_auth_update'
  ) then
    create policy "applications_auth_update"
      on applications for update using (auth.role() = 'authenticated');
  end if;
end$$;

-- 5. Storage bucket for listing images (public)
insert into storage.buckets (id, name, public)
  values ('listing-images', 'listing-images', true)
  on conflict (id) do nothing;

-- Allow authenticated uploads
create policy "listing_images_auth_upload"
  on storage.objects for insert
  with check (bucket_id = 'listing-images' and auth.role() = 'authenticated');

-- Allow public reads
create policy "listing_images_public_read"
  on storage.objects for select
  using (bucket_id = 'listing-images');
