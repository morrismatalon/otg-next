-- ============================================================
-- Off The Grid — database schema
-- Run in Supabase SQL Editor: Database > SQL Editor > New query
-- ============================================================

-- designers
create table if not exists designers (
  id            text primary key,
  name          text not null,
  studio_number text not null,
  location      text not null,
  city          text not null,
  country       text not null,
  specialty     text not null,
  categories    text[] not null default '{}',
  commissions   boolean not null default false,
  bio           text not null default '',
  instagram     text,
  verified      boolean not null default true,
  created_at    timestamptz not null default now()
);

-- listings
create table if not exists listings (
  id            text primary key,
  designer_id   text not null references designers(id) on delete cascade,
  title         text not null,
  description   text not null default '',
  price         numeric(10,2) not null,
  currency      text not null default 'JPY',
  price_display text not null,
  category      text not null,
  city          text not null,
  images        text[] not null default '{}',
  created_at    timestamptz not null default now()
);

-- applications
create table if not exists applications (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  studio_name     text not null,
  business_type   text not null,
  instagram       text,
  location        text not null,
  customer_volume text not null,
  status          text not null default 'pending'
                  check (status in ('pending','approved','rejected')),
  created_at      timestamptz not null default now()
);

-- Row Level Security
alter table designers    enable row level security;
alter table listings     enable row level security;
alter table applications enable row level security;

create policy "designers_public_read"
  on designers for select using (true);

create policy "listings_public_read"
  on listings for select using (true);

create policy "applications_public_insert"
  on applications for insert with check (true);

create policy "applications_auth_read"
  on applications for select using (auth.role() = 'authenticated');

-- Indexes
create index if not exists listings_designer_id_idx on listings(designer_id);
create index if not exists listings_category_idx    on listings(category);
create index if not exists designers_city_idx       on designers(city);
