-- ============================================================
-- EMA BAKERY DISTRIBUTION MANAGEMENT SYSTEM
-- Module: Salesperson Management
-- Migration: 004_salesperson_schema.sql
-- Author: Enterprise System Architecture
-- ============================================================

-- ============================================================
-- STEP 1: CREATE SEQUENCE FOR EMPLOYEE CODE
-- ============================================================

CREATE SEQUENCE IF NOT EXISTS public.salesperson_employee_code_seq START 1;

-- ============================================================
-- STEP 2: CREATE salesperson_profiles TABLE
-- ============================================================

CREATE TABLE public.salesperson_profiles (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_code    VARCHAR(20) NOT NULL UNIQUE,
  first_name       VARCHAR(100) NOT NULL,
  last_name        VARCHAR(100) NOT NULL,
  date_joined      DATE        NOT NULL DEFAULT CURRENT_DATE,
  status           VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  designation      VARCHAR(100) NOT NULL,
  mobile_number    VARCHAR(20) NOT NULL,
  email_address    VARCHAR(255) UNIQUE,
  address          VARCHAR(500),
  credit_limit     NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (credit_limit >= 0),
  current_balance  NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.salesperson_profiles IS
  'Centralized registry of all sales representatives operating within the distribution network.';

COMMENT ON COLUMN public.salesperson_profiles.employee_code IS
  'Auto-generated sequential unique identifier (e.g., SP-000001).';

COMMENT ON COLUMN public.salesperson_profiles.current_balance IS
  'Running account balance for the salesperson (can be negative for overpayments/credits).';

-- ============================================================
-- STEP 3: INDEXES
-- ============================================================

CREATE INDEX idx_salesperson_employee_code ON public.salesperson_profiles (employee_code);
CREATE INDEX idx_salesperson_status ON public.salesperson_profiles (status);
CREATE INDEX idx_salesperson_email ON public.salesperson_profiles (email_address);
CREATE INDEX idx_salesperson_mobile ON public.salesperson_profiles (mobile_number);

-- ============================================================
-- STEP 4: TRIGGERS
-- ============================================================

-- Apply updated_at trigger (function created in 001_authentication_schema.sql)
CREATE TRIGGER trg_salesperson_profiles_updated_at
  BEFORE UPDATE ON public.salesperson_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Trigger function to auto-generate employee_code on insert
CREATE OR REPLACE FUNCTION public.generate_salesperson_employee_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.employee_code IS NULL OR NEW.employee_code = '' THEN
    NEW.employee_code := 'SP-' || LPAD(nextval('public.salesperson_employee_code_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_salesperson_generate_employee_code
  BEFORE INSERT ON public.salesperson_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_salesperson_employee_code();

-- ============================================================
-- STEP 5: ENABLE RLS
-- ============================================================

ALTER TABLE public.salesperson_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 6: RLS POLICIES FOR salesperson_profiles
-- ============================================================

-- View Permission (Salesperson.View)
CREATE POLICY "salesperson_profiles: authorized roles can read"
  ON public.salesperson_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid()
        AND up.role IN ('system_administrator', 'operations_manager', 'finance_officer', 'read_only_user')
        AND up.status = 'active'
    )
  );

-- Create Permission (Salesperson.Create)
CREATE POLICY "salesperson_profiles: authorized roles can insert"
  ON public.salesperson_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid()
        AND up.role IN ('system_administrator', 'operations_manager')
        AND up.status = 'active'
    )
  );

-- Update Permission (Salesperson.Update)
CREATE POLICY "salesperson_profiles: authorized roles can update"
  ON public.salesperson_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid()
        AND up.role IN ('system_administrator', 'operations_manager')
        AND up.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid()
        AND up.role IN ('system_administrator', 'operations_manager')
        AND up.status = 'active'
    )
  );

-- Delete Permission (Salesperson.Delete)
CREATE POLICY "salesperson_profiles: authorized roles can delete"
  ON public.salesperson_profiles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid()
        AND up.role IN ('system_administrator', 'operations_manager')
        AND up.status = 'active'
    )
  );
