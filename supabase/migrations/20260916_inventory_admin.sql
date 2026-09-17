-- KREA ONE: inventario por producto + color + talla y acceso privado de administración.
-- Ejecutar una sola vez en Supabase SQL Editor. No incluye ninguna secret key.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  color_id text not null,
  size text not null,
  stock integer not null check (stock >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, color_id, size)
);

create index if not exists inventory_product_variant_idx
  on public.inventory (product_id, color_id, size);

create index if not exists inventory_stock_idx
  on public.inventory (stock);

create table if not exists public.inventory_history (
  id bigint generated always as identity primary key,
  inventory_id uuid references public.inventory (id) on delete set null,
  product_id text not null,
  color_id text not null,
  size text not null,
  previous_stock integer,
  new_stock integer,
  admin_id uuid references auth.users (id) on delete set null,
  changed_at timestamptz not null default now()
);

create or replace function public.set_inventory_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists inventory_set_updated_at on public.inventory;
create trigger inventory_set_updated_at
before update on public.inventory
for each row execute function public.set_inventory_updated_at();

create or replace function public.create_profile_for_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists auth_user_profile on auth.users;
create trigger auth_user_profile
after insert on auth.users
for each row execute function public.create_profile_for_user();

create or replace function public.is_inventory_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

create or replace function public.record_inventory_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' and old.stock is distinct from new.stock then
    insert into public.inventory_history (
      inventory_id, product_id, color_id, size, previous_stock, new_stock, admin_id
    ) values (
      new.id, new.product_id, new.color_id, new.size, old.stock, new.stock, auth.uid()
    );
  end if;
  return new;
end;
$$;

drop trigger if exists inventory_history_after_update on public.inventory;
create trigger inventory_history_after_update
after update on public.inventory
for each row execute function public.record_inventory_change();

-- Migra exactamente las cantidades actuales de src/data/content.js.
-- ON CONFLICT conserva cualquier valor que ya haya sido editado en Supabase.
insert into public.inventory (product_id, color_id, size, stock) values
  ('short', 'pink-dolly', 'XS', 1),
  ('short', 'pink-dolly', 'S', 2),
  ('short', 'pink-dolly', 'M', 2),
  ('short', 'blue-dolly', 'XS', 1),
  ('short', 'blue-dolly', 'S', 2),
  ('short', 'blue-dolly', 'M', 2),
  ('sports-bra', 'pink-dolly', 'XS', 1),
  ('sports-bra', 'pink-dolly', 'S', 2),
  ('sports-bra', 'pink-dolly', 'M', 2),
  ('sports-bra', 'blue-dolly', 'XS', 1),
  ('sports-bra', 'blue-dolly', 'S', 2),
  ('sports-bra', 'blue-dolly', 'M', 2),
  ('leggings', 'pink-dolly', 'XS', 1),
  ('leggings', 'pink-dolly', 'S', 2),
  ('leggings', 'pink-dolly', 'M', 2),
  ('leggings', 'blue-dolly', 'XS', 1),
  ('leggings', 'blue-dolly', 'S', 2),
  ('leggings', 'blue-dolly', 'M', 2),
  ('top', 'pink-dolly', 'XS', 1),
  ('top', 'pink-dolly', 'S', 2),
  ('top', 'pink-dolly', 'M', 2),
  ('top', 'blue-dolly', 'XS', 1),
  ('top', 'blue-dolly', 'S', 2),
  ('top', 'blue-dolly', 'M', 2),
  ('one-piece', 'pink-dolly', 'XS', 1),
  ('one-piece', 'pink-dolly', 'S', 1),
  ('one-piece', 'pink-dolly', 'M', 2),
  ('capri', 'contrast-wine', 'S', 1),
  ('capri', 'contrast-wine', 'M', 1)
on conflict (product_id, color_id, size) do nothing;

alter table public.profiles enable row level security;
alter table public.inventory enable row level security;
alter table public.inventory_history enable row level security;

revoke all on public.profiles from anon, authenticated;
revoke all on public.inventory from anon, authenticated;
revoke all on public.inventory_history from anon, authenticated;

grant select on public.inventory to anon, authenticated;
grant select on public.profiles to authenticated;
grant select, insert, update, delete on public.inventory to authenticated;
grant select on public.inventory_history to authenticated;
grant execute on function public.is_inventory_admin() to authenticated;

drop policy if exists "profiles_read_own" on public.profiles;
create policy "profiles_read_own"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "inventory_public_read" on public.inventory;
create policy "inventory_public_read"
on public.inventory for select
to anon, authenticated
using (true);

drop policy if exists "inventory_admin_manage" on public.inventory;
create policy "inventory_admin_manage"
on public.inventory for all
to authenticated
using ((select public.is_inventory_admin()))
with check ((select public.is_inventory_admin()));

drop policy if exists "inventory_history_admin_read" on public.inventory_history;
create policy "inventory_history_admin_read"
on public.inventory_history for select
to authenticated
using ((select public.is_inventory_admin()));
