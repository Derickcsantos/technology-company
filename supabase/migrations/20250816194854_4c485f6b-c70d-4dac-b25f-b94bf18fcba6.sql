-- Enable INSERT on users table for registration
CREATE POLICY "Allow user registration" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

-- Add better charts data functions
CREATE OR REPLACE FUNCTION get_monthly_revenue()
RETURNS TABLE(month text, revenue numeric) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TO_CHAR(DATE_TRUNC('month', created_at), 'Mon YYYY') as month,
    COALESCE(SUM(total), 0) as revenue
  FROM orders 
  WHERE created_at >= NOW() - INTERVAL '12 months'
  GROUP BY DATE_TRUNC('month', created_at)
  ORDER BY DATE_TRUNC('month', created_at);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_growth()
RETURNS TABLE(month text, users bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TO_CHAR(DATE_TRUNC('month', created_at), 'Mon YYYY') as month,
    COUNT(*) as users
  FROM users 
  WHERE created_at >= NOW() - INTERVAL '12 months'
  GROUP BY DATE_TRUNC('month', created_at)
  ORDER BY DATE_TRUNC('month', created_at);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;