-- Migration: Fix RLS for Ecommerce Tables and Storage
-- Created: 2026-05-02

-- Enable RLS on all relevant tables
alter table if exists public.brands enable row level security;
alter table if exists public.categories enable row level security;
alter table if exists public.collections enable row level security;
alter table if exists public.products enable row level security;
alter table if exists public.product_images enable row level security;

-- Helper Function for Admin Check (to keep policies clean)
-- This function checks if the current user has the 'admin' role in the profiles table.
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
    and profiles.is_active = true
  );
end;
$$ language plpgsql security definer;

-- 1. Brands Policies
drop policy if exists "Allow public read for brands" on public.brands;
create policy "Allow public read for brands" on public.brands for select using (true);

drop policy if exists "Allow admins to manage brands" on public.brands;
create policy "Allow admins to manage brands" on public.brands for all to authenticated 
  using (public.is_admin()) 
  with check (public.is_admin());

-- 2. Categories Policies
drop policy if exists "Allow public read for categories" on public.categories;
create policy "Allow public read for categories" on public.categories for select using (true);

drop policy if exists "Allow admins to manage categories" on public.categories;
create policy "Allow admins to manage categories" on public.categories for all to authenticated 
  using (public.is_admin()) 
  with check (public.is_admin());

-- 3. Collections Policies
drop policy if exists "Allow public read for collections" on public.collections;
create policy "Allow public read for collections" on public.collections for select using (true);

drop policy if exists "Allow admins to manage collections" on public.collections;
create policy "Allow admins to manage collections" on public.collections for all to authenticated 
  using (public.is_admin()) 
  with check (public.is_admin());

-- 4. Products Policies
drop policy if exists "Allow public read for products" on public.products;
create policy "Allow public read for products" on public.products for select using (true);

drop policy if exists "Allow admins to manage products" on public.products;
create policy "Allow admins to manage products" on public.products for all to authenticated 
  using (public.is_admin()) 
  with check (public.is_admin());

-- 5. Product Images Policies
drop policy if exists "Allow public read for product_images" on public.product_images;
create policy "Allow public read for product_images" on public.product_images for select using (true);

drop policy if exists "Allow admins to manage product_images" on public.product_images;
create policy "Allow admins to manage product_images" on public.product_images for all to authenticated 
  using (public.is_admin()) 
  with check (public.is_admin());

-- 6. Storage Policies
-- Bucket: brand-logos
drop policy if exists "Public access to brand logos" on storage.objects;
create policy "Public access to brand logos" on storage.objects for select using ( bucket_id = 'brand-logos' );

drop policy if exists "Admin manage brand logos" on storage.objects;
create policy "Admin manage brand logos" on storage.objects for all to authenticated 
  using ( bucket_id = 'brand-logos' and public.is_admin() ) 
  with check ( bucket_id = 'brand-logos' and public.is_admin() );

-- Bucket: product-images (Assuming this exists)
drop policy if exists "Public access to product images" on storage.objects;
create policy "Public access to product images" on storage.objects for select using ( bucket_id = 'product-images' );

drop policy if exists "Admin manage product images" on storage.objects;
create policy "Admin manage product images" on storage.objects for all to authenticated 
  using ( bucket_id = 'product-images' and public.is_admin() ) 
  with check ( bucket_id = 'product-images' and public.is_admin() );

-- Bucket: category-images
drop policy if exists "Public access to category images" on storage.objects;
create policy "Public access to category images" on storage.objects for select using ( bucket_id = 'category-images' );

drop policy if exists "Admin manage category images" on storage.objects;
create policy "Admin manage category images" on storage.objects for all to authenticated 
  using ( bucket_id = 'category-images' and public.is_admin() ) 
  with check ( bucket_id = 'category-images' and public.is_admin() );
