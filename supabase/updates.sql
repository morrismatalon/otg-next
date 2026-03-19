-- ============================================================
-- Off The Grid — incremental updates
-- Run this if you already ran schema.sql and seed.sql
-- Safe to run multiple times (idempotent)
-- ============================================================

-- 1. Add user_id to designers (links auth user → designer profile)
alter table designers add column if not exists user_id uuid references auth.users(id);
create index if not exists designers_user_id_idx on designers(user_id);

-- 2. Orders table (with Stripe columns)
create table if not exists orders (
  id                    uuid primary key default gen_random_uuid(),
  listing_id            text not null references listings(id),
  buyer_name            text not null,
  buyer_email           text not null,
  message               text,
  stripe_session_id     text unique,
  stripe_payment_intent text,
  status                text not null default 'pending'
                        check (status in ('pending','confirmed','shipped','completed','cancelled')),
  created_at            timestamptz not null default now()
);

alter table orders enable row level security;

create policy "orders_public_insert"
  on orders for insert with check (true);

create policy "orders_public_select"
  on orders for select using (true);

create index if not exists orders_listing_id_idx         on orders(listing_id);
create index if not exists orders_stripe_session_id_idx  on orders(stripe_session_id);

-- 3. Add Stripe columns to existing orders table (idempotent)
alter table orders add column if not exists stripe_session_id     text unique;
alter table orders add column if not exists stripe_payment_intent text;

-- 4. Add email to applications
alter table applications add column if not exists email text;

-- 5. Allow authenticated users to insert listings
do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'listings' and policyname = 'listings_auth_insert'
  ) then
    create policy "listings_auth_insert"
      on listings for insert with check (auth.role() = 'authenticated');
  end if;
end$$;

-- 6. Allow authenticated users to update their own listings
do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'listings' and policyname = 'listings_auth_update'
  ) then
    create policy "listings_auth_update"
      on listings for update using (
        designer_id in (
          select id from designers where user_id = auth.uid()
        )
      );
  end if;
end$$;

-- 7. Allow authenticated users to delete their own listings
do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'listings' and policyname = 'listings_auth_delete'
  ) then
    create policy "listings_auth_delete"
      on listings for delete using (
        designer_id in (
          select id from designers where user_id = auth.uid()
        )
      );
  end if;
end$$;

-- 8. Allow authenticated users to update applications (for approve/reject)
do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'applications' and policyname = 'applications_auth_update'
  ) then
    create policy "applications_auth_update"
      on applications for update using (auth.role() = 'authenticated');
  end if;
end$$;

-- 9. Allow service role to insert designers (for admin approval flow)
do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'designers' and policyname = 'designers_admin_insert'
  ) then
    create policy "designers_admin_insert"
      on designers for insert with check (auth.role() = 'service_role');
  end if;
end$$;

-- 10. Storage bucket for listing images
insert into storage.buckets (id, name, public)
  values ('listing-images', 'listing-images', true)
  on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'objects' and policyname = 'listing_images_auth_upload'
  ) then
    create policy "listing_images_auth_upload"
      on storage.objects for insert
      with check (bucket_id = 'listing-images' and auth.role() = 'authenticated');
  end if;
end$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'objects' and policyname = 'listing_images_public_read'
  ) then
    create policy "listing_images_public_read"
      on storage.objects for select
      using (bucket_id = 'listing-images');
  end if;
end$$;
