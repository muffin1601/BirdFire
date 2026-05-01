create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  phone text,
  full_name text,
  role text not null default 'customer',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, phone, full_name)
  values (
    new.id,
    new.email,
    new.phone,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '')
  )
  on conflict (id) do update
    set email = excluded.email,
        phone = excluded.phone,
        full_name = coalesce(nullif(excluded.full_name, ''), public.profiles.full_name),
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert or update of email, phone, raw_user_meta_data on auth.users
  for each row execute function public.handle_new_auth_user();

do $$
begin
  if to_regclass('public.cart_items') is not null then
    alter table public.cart_items enable row level security;

    drop policy if exists "cart_items_select_own" on public.cart_items;
    create policy "cart_items_select_own"
      on public.cart_items
      for select
      to authenticated
      using (auth.uid() = user_id);

    drop policy if exists "cart_items_insert_own" on public.cart_items;
    create policy "cart_items_insert_own"
      on public.cart_items
      for insert
      to authenticated
      with check (auth.uid() = user_id);

    drop policy if exists "cart_items_update_own" on public.cart_items;
    create policy "cart_items_update_own"
      on public.cart_items
      for update
      to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);

    drop policy if exists "cart_items_delete_own" on public.cart_items;
    create policy "cart_items_delete_own"
      on public.cart_items
      for delete
      to authenticated
      using (auth.uid() = user_id);
  end if;

  if to_regclass('public.favorites') is not null then
    alter table public.favorites enable row level security;

    drop policy if exists "favorites_select_own" on public.favorites;
    create policy "favorites_select_own"
      on public.favorites
      for select
      to authenticated
      using (auth.uid() = user_id);

    drop policy if exists "favorites_insert_own" on public.favorites;
    create policy "favorites_insert_own"
      on public.favorites
      for insert
      to authenticated
      with check (auth.uid() = user_id);

    drop policy if exists "favorites_delete_own" on public.favorites;
    create policy "favorites_delete_own"
      on public.favorites
      for delete
      to authenticated
      using (auth.uid() = user_id);
  end if;
end $$;
