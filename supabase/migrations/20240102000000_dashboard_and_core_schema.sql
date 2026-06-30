-- ============================================================
-- EMA BAKERY DISTRIBUTION MANAGEMENT SYSTEM
-- Module: Dashboard & Core Schema (Milestones 3, 5)
-- Migration: 002_dashboard_and_core_schema.sql
-- ============================================================

-- ============================================================
-- STEP 1: HELPER FUNCTIONS FOR RLS
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_auth_user_role()
RETURNS public.user_role AS $$
  SELECT role FROM public.user_profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================
-- STEP 2: CORE TABLES
-- ============================================================

-- Salespersons
CREATE TABLE public.salespersons (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID        NOT NULL REFERENCES public.user_profiles(id),
  active              BOOLEAN     NOT NULL DEFAULT TRUE,
  credit_limit        NUMERIC     NOT NULL DEFAULT 0.00,
  outstanding_balance NUMERIC     NOT NULL DEFAULT 0.00,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categories
CREATE TABLE public.product_categories (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT        NOT NULL UNIQUE,
  active      BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Products
CREATE TABLE public.products (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID        NOT NULL REFERENCES public.product_categories(id),
  name        TEXT        NOT NULL UNIQUE,
  price       NUMERIC     NOT NULL DEFAULT 0.00,
  active      BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Dispatches
CREATE TABLE public.dispatches (
  id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  salesperson_id UUID        NOT NULL REFERENCES public.salespersons(id),
  status         TEXT        NOT NULL DEFAULT 'draft',
  total_amount   NUMERIC     NOT NULL DEFAULT 0.00,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payments
CREATE TABLE public.payments (
  id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  salesperson_id UUID        NOT NULL REFERENCES public.salespersons(id),
  amount         NUMERIC     NOT NULL DEFAULT 0.00,
  status         TEXT        NOT NULL DEFAULT 'draft',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Recent Activities (Unified Log for Dashboard Feed)
CREATE TABLE public.recent_activities (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID        NOT NULL REFERENCES public.user_profiles(id),
  action      TEXT        NOT NULL,
  description TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- STEP 3: DASHBOARD VIEWS
-- ============================================================

-- KPI Metrics View
CREATE OR REPLACE VIEW public.dashboard_kpi_metrics AS
WITH today_stats AS (
  SELECT 
    (SELECT COUNT(*) FROM public.dispatches WHERE DATE(created_at) = CURRENT_DATE) as today_dispatches,
    (SELECT COALESCE(SUM(total_amount), 0) FROM public.dispatches WHERE DATE(created_at) = CURRENT_DATE) as today_revenue,
    (SELECT COALESCE(SUM(outstanding_balance), 0) FROM public.salespersons) as total_outstanding_balance,
    (SELECT COALESCE(SUM(amount), 0) FROM public.payments WHERE DATE(created_at) = CURRENT_DATE AND status = 'posted') as payments_received_today,
    (SELECT COUNT(*) FROM public.salespersons WHERE active = TRUE) as active_salespersons,
    (SELECT COUNT(*) FROM public.products WHERE active = TRUE) as active_products
),
yesterday_stats AS (
  SELECT 
    (SELECT COUNT(*) FROM public.dispatches WHERE DATE(created_at) = CURRENT_DATE - INTERVAL '1 day') as yesterday_dispatches,
    (SELECT COALESCE(SUM(total_amount), 0) FROM public.dispatches WHERE DATE(created_at) = CURRENT_DATE - INTERVAL '1 day') as yesterday_revenue,
    (SELECT COALESCE(SUM(amount), 0) FROM public.payments WHERE DATE(created_at) = CURRENT_DATE - INTERVAL '1 day' AND status = 'posted') as yesterday_payments
)
SELECT 
  t.today_dispatches,
  y.yesterday_dispatches,
  t.today_revenue,
  y.yesterday_revenue,
  t.total_outstanding_balance,
  t.payments_received_today,
  y.yesterday_payments,
  t.active_salespersons,
  t.active_products
FROM today_stats t CROSS JOIN yesterday_stats y;

-- Outstanding Balances View
CREATE OR REPLACE VIEW public.dashboard_outstanding_balances AS
SELECT 
  s.id as salesperson_id,
  u.full_name as salesperson_name,
  s.outstanding_balance
FROM public.salespersons s
JOIN public.user_profiles u ON u.id = s.user_id
WHERE s.outstanding_balance > 0
ORDER BY s.outstanding_balance DESC
LIMIT 10;

-- Recent Activity View
CREATE OR REPLACE VIEW public.dashboard_recent_activity AS
SELECT 
  a.id,
  a.action,
  a.description,
  u.full_name as user_name,
  a.created_at
FROM public.recent_activities a
JOIN public.user_profiles u ON u.id = a.user_id
ORDER BY a.created_at DESC
LIMIT 50;

-- ============================================================
-- STEP 4: DASHBOARD RPCS (For Charts filtering)
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_dashboard_revenue_trend(start_date DATE, end_date DATE)
RETURNS TABLE (date DATE, revenue NUMERIC) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(created_at) as date,
    SUM(total_amount) as revenue
  FROM public.dispatches
  WHERE DATE(created_at) >= start_date AND DATE(created_at) <= end_date
  GROUP BY DATE(created_at)
  ORDER BY date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_dashboard_dispatch_trend(start_date DATE, end_date DATE)
RETURNS TABLE (date DATE, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(created_at) as date,
    COUNT(*) as count
  FROM public.dispatches
  WHERE DATE(created_at) >= start_date AND DATE(created_at) <= end_date
  GROUP BY DATE(created_at)
  ORDER BY date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================
-- STEP 5: ROW-LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.salespersons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recent_activities ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read base tables (Dashboard View permission is global)
CREATE POLICY "Allow read access to authenticated users" ON public.salespersons FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to authenticated users" ON public.product_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to authenticated users" ON public.products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to authenticated users" ON public.dispatches FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to authenticated users" ON public.payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to authenticated users" ON public.recent_activities FOR SELECT TO authenticated USING (true);

-- System Administrators can do everything
CREATE POLICY "Admin full access" ON public.salespersons TO authenticated USING (public.get_auth_user_role() = 'system_administrator');
CREATE POLICY "Admin full access" ON public.product_categories TO authenticated USING (public.get_auth_user_role() = 'system_administrator');
CREATE POLICY "Admin full access" ON public.products TO authenticated USING (public.get_auth_user_role() = 'system_administrator');
CREATE POLICY "Admin full access" ON public.dispatches TO authenticated USING (public.get_auth_user_role() = 'system_administrator');
CREATE POLICY "Admin full access" ON public.payments TO authenticated USING (public.get_auth_user_role() = 'system_administrator');
CREATE POLICY "Admin full access" ON public.recent_activities TO authenticated USING (public.get_auth_user_role() = 'system_administrator');
