-- Add support for multiple images in products table
ALTER TABLE public.products 
ADD COLUMN images text[] DEFAULT ARRAY[]::text[];

-- Update existing products to move image_url to images array
UPDATE public.products 
SET images = CASE 
  WHEN image_url IS NOT NULL THEN ARRAY[image_url]
  ELSE ARRAY[]::text[]
END;

-- Create delete blog product function
CREATE OR REPLACE FUNCTION public.delete_blog_product(p_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.blog_products WHERE id = p_id;
  RETURN FOUND;
END;
$$;

-- Create RLS policy for admin to delete blog products
CREATE POLICY "Admins can delete blog products"
ON public.blog_products
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.tipo = 'admin'
  )
);

-- Create RLS policy for admin to update blog products
CREATE POLICY "Admins can update blog products"
ON public.blog_products
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.tipo = 'admin'
  )
);

-- Create function to get user types distribution
CREATE OR REPLACE FUNCTION public.get_user_types()
RETURNS TABLE(tipo text, count bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.tipo, COUNT(*) as count
  FROM public.users u
  GROUP BY u.tipo;
$$;

-- Create function to get all users for admin
CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS TABLE(
  id uuid,
  email text,
  name text,
  tipo text,
  phone text,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.id, u.email, u.name, u.tipo, u.phone, u.created_at
  FROM public.users u
  ORDER BY u.created_at DESC;
$$;