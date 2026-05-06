-- =============================================================================
-- Aroma Tales · Supabase schema
--
-- Run this once in the Supabase SQL editor (or via `supabase db execute`).
-- It is safe to re-run: every statement uses IF NOT EXISTS / CREATE OR REPLACE.
-- =============================================================================

create extension if not exists "pgcrypto";

-- ---------- products ----------------------------------------------------------
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null unique,
  category     text not null check (category in ('Men', 'Women', 'Unisex')),
  price        numeric(10,2) not null check (price >= 0),
  description  text not null,
  image        text not null,
  in_stock     boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists products_sort_order_idx on public.products (sort_order);

-- ---------- cart_items --------------------------------------------------------
create table if not exists public.cart_items (
  id          uuid primary key default gen_random_uuid(),
  session_id  text not null,
  product_id  uuid not null references public.products (id) on delete cascade,
  quantity    integer not null default 1 check (quantity > 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (session_id, product_id)
);

create index if not exists cart_items_session_idx on public.cart_items (session_id);

-- ---------- orders ------------------------------------------------------------
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  order_number    text not null unique,
  session_id      text not null,
  customer        jsonb not null,
  payment_method  text not null default 'COD' check (payment_method in ('COD', 'Online')),
  subtotal        numeric(10,2) not null,
  shipping        numeric(10,2) not null default 0,
  total           numeric(10,2) not null,
  status          text not null default 'Pending'
                  check (status in ('Pending','Confirmed','Processing','Shipped','Delivered','Cancelled')),
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists orders_session_idx on public.orders (session_id);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- ---------- order_items -------------------------------------------------------
create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders (id) on delete cascade,
  product_id  uuid not null references public.products (id),
  quantity    integer not null check (quantity > 0),
  price       numeric(10,2) not null,
  created_at  timestamptz not null default now()
);

create index if not exists order_items_order_idx on public.order_items (order_id);

-- ---------- updated_at triggers ----------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_cart_items_updated_at on public.cart_items;
create trigger set_cart_items_updated_at
before update on public.cart_items
for each row execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

-- ---------- Row Level Security -----------------------------------------------
-- The Express server connects with the SERVICE ROLE key, which bypasses RLS.
-- Enabling RLS here protects the tables from accidental anonymous access if
-- you ever expose Supabase directly to the browser.
alter table public.products    enable row level security;
alter table public.cart_items  enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- Allow anonymous read of the catalogue if you ever want to call Supabase from
-- the frontend directly. Remove if you only ever go through the API.
drop policy if exists "products are public" on public.products;
create policy "products are public"
  on public.products for select
  using (true);

-- ---------- profiles (linked to Supabase Auth) --------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  role        text not null default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz	not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

-- Auto-create profile on sign-up (role defaults to user; promote admins in SQL):
-- update public.profiles set role = 'admin' where id = '<user-uuid>';
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------- orders: optional link to logged-in customer -----------------------
alter table public.orders
  add column if not exists user_id uuid references auth.users (id) on delete set null;

create index if not exists orders_user_id_idx on public.orders (user_id);

-- ---------- product images (public bucket; uploads go through API + service role)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read"
  on storage.objects for select
  using (bucket_id = 'product-images');
