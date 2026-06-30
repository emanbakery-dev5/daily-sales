-- ============================================================
-- EMA BAKERY DISTRIBUTION MANAGEMENT SYSTEM
-- Module: User Management
-- Migration: 003_user_management_schema.sql
-- Author: Enterprise System Architecture
-- ============================================================

-- ============================================================
-- STEP 1: CREATE user_custom_permissions TABLE
-- ============================================================

CREATE TABLE public.user_custom_permissions (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission   TEXT        NOT NULL,
  granted      BOOLEAN     NOT NULL DEFAULT true,
  assigned_by  UUID        NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, permission)
);

COMMENT ON TABLE public.user_custom_permissions IS
  'Stores fine-grained, per-user permission overrides. If granted=true, adds a permission. If granted=false, explicitly revokes a permission otherwise granted by the user role.';

COMMENT ON COLUMN public.user_custom_permissions.permission IS
  'The permission string identifier (e.g., "User.Create").';

-- ============================================================
-- STEP 2: INDEXES & TRIGGERS
-- ============================================================

CREATE INDEX idx_user_custom_permissions_user_id
  ON public.user_custom_permissions (user_id);

-- Apply updated_at trigger (function created in 001_authentication_schema.sql)
CREATE TRIGGER trg_user_custom_permissions_updated_at
  BEFORE UPDATE ON public.user_custom_permissions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- STEP 3: ENABLE RLS
-- ============================================================

ALTER TABLE public.user_custom_permissions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 4: RLS POLICIES FOR user_custom_permissions
-- ============================================================

-- User can read their own custom permissions
CREATE POLICY "user_custom_permissions: owner can read own"
  ON public.user_custom_permissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- System Administrator can read all custom permissions
CREATE POLICY "user_custom_permissions: admin can read all"
  ON public.user_custom_permissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid()
        AND up.role = 'system_administrator'
        AND up.status = 'active'
    )
  );

-- System Administrator can insert custom permissions
CREATE POLICY "user_custom_permissions: admin can insert"
  ON public.user_custom_permissions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid()
        AND up.role = 'system_administrator'
        AND up.status = 'active'
    )
  );

-- System Administrator can update custom permissions
CREATE POLICY "user_custom_permissions: admin can update"
  ON public.user_custom_permissions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid()
        AND up.role = 'system_administrator'
        AND up.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid()
        AND up.role = 'system_administrator'
        AND up.status = 'active'
    )
  );

-- System Administrator can delete custom permissions
CREATE POLICY "user_custom_permissions: admin can delete"
  ON public.user_custom_permissions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid()
        AND up.role = 'system_administrator'
        AND up.status = 'active'
    )
  );

-- ============================================================
-- STEP 5: ADDITIONAL RLS POLICIES FOR user_profiles
-- ============================================================
-- These extend the RLS policies in 001_authentication_schema.sql
-- to explicitly allow System Administrators full CRUD capabilities.

-- System Administrator can update all profiles
CREATE POLICY "user_profiles: admin can update all profiles"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid()
        AND up.role = 'system_administrator'
        AND up.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid()
        AND up.role = 'system_administrator'
        AND up.status = 'active'
    )
  );

-- System Administrator can delete all profiles
CREATE POLICY "user_profiles: admin can delete all profiles"
  ON public.user_profiles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid()
        AND up.role = 'system_administrator'
        AND up.status = 'active'
    )
  );
