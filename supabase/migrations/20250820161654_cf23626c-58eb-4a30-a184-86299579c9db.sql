-- RPC para obter todos os pedidos com detalhes
CREATE OR REPLACE FUNCTION public.get_all_orders()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  total numeric,
  status text,
  created_at timestamp with time zone,
  user_name text,
  user_email text,
  items jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.user_id,
    o.total,
    o.status,
    o.created_at,
    u.name as user_name,
    u.email as user_email,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'product_name', p.name,
          'quantity', oi.quantity,
          'unit_price', oi.unit_price
        )
      ) FILTER (WHERE oi.id IS NOT NULL),
      '[]'::jsonb
    ) as items
  FROM orders o
  LEFT JOIN users u ON o.user_id = u.id
  LEFT JOIN order_items oi ON o.id = oi.order_id
  LEFT JOIN products p ON oi.product_id = p.id
  GROUP BY o.id, o.user_id, o.total, o.status, o.created_at, u.name, u.email
  ORDER BY o.created_at DESC;
END;
$$;

-- RPC para obter usuários com suas assinaturas IPTV
CREATE OR REPLACE FUNCTION public.get_users_with_subscriptions()
RETURNS TABLE(
  id uuid,
  email text,
  name text,
  tipo text,
  phone text,
  created_at timestamp with time zone,
  subscription_plan text,
  subscription_status text,
  next_payment_date date
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.name,
    u.tipo,
    u.phone,
    u.created_at,
    ip.name as subscription_plan,
    us.status as subscription_status,
    us.next_payment_date
  FROM users u
  LEFT JOIN user_subscriptions us ON u.id = us.user_id AND us.status = 'active'
  LEFT JOIN iptv_plans ip ON us.plan_id = ip.id
  ORDER BY u.created_at DESC;
END;
$$;

-- RPC para obter dados de clientes por plano (para gráfico)
CREATE OR REPLACE FUNCTION public.get_clients_by_plan()
RETURNS TABLE(
  plan_name text,
  client_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(ip.name, 'Sem Plano') as plan_name,
    COUNT(DISTINCT u.id) as client_count
  FROM users u
  LEFT JOIN user_subscriptions us ON u.id = us.user_id AND us.status = 'active'
  LEFT JOIN iptv_plans ip ON us.plan_id = ip.id
  WHERE u.tipo = 'cliente'
  GROUP BY ip.name
  ORDER BY client_count DESC;
END;
$$;