-- RPCs seguras para criação e analytics + políticas de Storage (corrigido)

-- Criar produto (e-commerce)
create or replace function public.create_product(
  p_name text,
  p_description text,
  p_price numeric,
  p_category_id uuid,
  p_image_url text
) returns public.products
language plpgsql
security definer
set search_path = public
as $$
declare
  new_product products;
begin
  insert into public.products(name, description, price, category_id, image_url)
  values (p_name, p_description, p_price, p_category_id, p_image_url)
  returning * into new_product;
  return new_product;
end;
$$;

grant execute on function public.create_product(text, text, numeric, uuid, text) to anon, authenticated;

-- Criar produto do blog
create or replace function public.create_blog_product(
  p_title text,
  p_description text,
  p_price numeric,
  p_image_url text,
  p_external_link text
) returns public.blog_products
language sql
security definer
set search_path = public
as $$
  insert into public.blog_products(title, description, price, image_url, external_link)
  values (p_title, p_description, p_price, p_image_url, p_external_link)
  returning *;
$$;

grant execute on function public.create_blog_product(text, text, numeric, text, text) to anon, authenticated;

-- Totais (ignoram RLS)
create or replace function public.get_total_users()
returns bigint
language sql
security definer
set search_path = public
as $$
  select count(*) from public.users;
$$;

grant execute on function public.get_total_users() to anon, authenticated;

create or replace function public.get_total_orders()
returns bigint
language sql
security definer
set search_path = public
as $$
  select count(*) from public.orders;
$$;

grant execute on function public.get_total_orders() to anon, authenticated;

create or replace function public.get_total_revenue()
returns numeric
language sql
security definer
set search_path = public
as $$
  select coalesce(sum(total), 0) from public.orders;
$$;

grant execute on function public.get_total_revenue() to anon, authenticated;

-- Pedidos por mês
create or replace function public.get_monthly_orders()
returns table(month text, orders bigint)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select to_char(date_trunc('month', created_at), 'Mon YYYY') as month,
         count(*) as orders
  from public.orders
  where created_at >= now() - interval '12 months'
  group by date_trunc('month', created_at)
  order by date_trunc('month', created_at);
end;
$$;

grant execute on function public.get_monthly_orders() to anon, authenticated;

-- Garantir execução nas funções existentes
grant execute on function public.get_monthly_revenue() to anon, authenticated;
grant execute on function public.get_user_growth() to anon, authenticated;

-- Políticas de Storage usando blocos condicionais
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public can read product-images'
  ) THEN
    CREATE POLICY "Public can read product-images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public can read blog-images'
  ) THEN
    CREATE POLICY "Public can read blog-images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'blog-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Anyone can upload to product-images'
  ) THEN
    CREATE POLICY "Anyone can upload to product-images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'product-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Anyone can upload to blog-images'
  ) THEN
    CREATE POLICY "Anyone can upload to blog-images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'blog-images');
  END IF;
END
$$;