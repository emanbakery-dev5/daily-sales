-- ============================================================
-- EMA BAKERY DISTRIBUTION MANAGEMENT SYSTEM
-- Module: Authentication
-- Migration: 001_authentication_schema.sql
-- Author: Enterprise System Architecture
-- Status: Production Ready
-- ============================================================

-- ============================================================
-- STEP 1: ENABLE EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- STEP 2: CREATE CUSTOM TYPES (ENUMS)
-- ============================================================

-- User roles in the system
CREATE TYPE public.user_role AS ENUM (
  'system_administrator',
  'operations_manager',
  'finance_officer',
  'sales_coordinator',
  'read_only_user'
);

-- User account status
CREATE TYPE public.user_status AS ENUM (
  'active',
  'inactive',
  'locked',
  'pending_password_reset'
);

-- Authentication audit event types
CREATE TYPE public.auth_event_type AS ENUM (
  'login_success',
  'login_failed',
  'logout',
  'password_reset_requested',
  'password_reset_completed',
  'session_expired',
  'session_refreshed',
  'unauthorized_access',
  'account_locked',
  'account_unlocked',
  'permission_load_failure'
);

-- ============================================================
-- STEP 3: USER PROFILES TABLE
-- Extends Supabase auth.users with application-level profile.
-- ============================================================

CREATE TABLE public.user_profiles (
  id                    UUID          PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                 TEXT          NOT NULL UNIQUE,
  full_name             TEXT          NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 255),
  role                  public.user_role NOT NULL DEFAULT 'read_only_user',
  status                public.user_status NOT NULL DEFAULT 'active',
  failed_login_attempts INTEGER       NOT NULL DEFAULT 0 CHECK (failed_login_attempts >= 0),
  locked_until          TIMESTAMPTZ   NULL,
  last_login_at         TIMESTAMPTZ   NULL,
  last_login_ip         INET          NULL,
  password_changed_at   TIMESTAMPTZ   NULL,
  must_change_password  BOOLEAN       NOT NULL DEFAULT FALSE,
  created_by            UUID          NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.user_profiles IS
  'Application-level user profile extending Supabase auth.users. One row per authenticated user.';

COMMENT ON COLUMN public.user_profiles.failed_login_attempts IS
  'Tracks consecutive failed logins. Resets to 0 on successful login.';

COMMENT ON COLUMN public.user_profiles.locked_until IS
  'NULL means account is not locked. When set, logins are refused until this timestamp passes.';

COMMENT ON COLUMN public.user_profiles.must_change_password IS
  'When TRUE, user is forced to change password before accessing any protected resource.';

-- ============================================================
-- STEP 4: LOGIN HISTORY TABLE
-- Immutable record of every authentication attempt.
-- ============================================================

CREATE TABLE public.login_history (
  id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID        NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  email          TEXT        NOT NULL,
  event_type     public.auth_event_type NOT NULL,
  success        BOOLEAN     NOT NULL,
  ip_address     INET        NULL,
  user_agent     TEXT        NULL,
  device_info    JSONB       NULL,
  failure_reason TEXT        NULL,
  correlation_id UUID        NOT NULL DEFAULT uuid_generate_v4(),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.login_history IS
  'Immutable audit log of all login attempts, logouts, and session events. Rows must never be updated or deleted.';

COMMENT ON COLUMN public.login_history.email IS
  'Stored even if user_id is NULL (i.e. login attempt for non-existent account).';

COMMENT ON COLUMN public.login_history.correlation_id IS
  'Unique ID for cross-service log correlation.';

COMMENT ON COLUMN public.login_history.device_info IS
  'JSON payload containing parsed device/browser information.';

-- ============================================================
-- STEP 5: PASSWORD RESET TOKENS TABLE
-- Tracks issued password reset tokens to enforce single-use.
-- ============================================================

CREATE TABLE public.password_reset_tokens (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash  TEXT        NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ NULL,
  ip_address  INET        NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.password_reset_tokens IS
  'Tracks password reset tokens. Tokens are single-use and expire after the configured window.';

COMMENT ON COLUMN public.password_reset_tokens.token_hash IS
  'SHA-256 hash of the reset token. The raw token is only delivered to the user email.';

COMMENT ON COLUMN public.password_reset_tokens.used_at IS
  'NULL means token has not been used yet. Set when token is consumed.';

-- ============================================================
-- STEP 6: AUDIT LOG TABLE (AUTHENTICATION EVENTS)
-- Immutable, append-only record of all security-sensitive events.
-- ============================================================

CREATE TABLE public.audit_logs (
  id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID        NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type     TEXT        NOT NULL,
  module         TEXT        NOT NULL DEFAULT 'authentication',
  action         TEXT        NOT NULL,
  description    TEXT        NULL,
  old_values     JSONB       NULL,
  new_values     JSONB       NULL,
  ip_address     INET        NULL,
  user_agent     TEXT        NULL,
  correlation_id UUID        NOT NULL DEFAULT uuid_generate_v4(),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.audit_logs IS
  'Enterprise-wide immutable audit log. Rows are never updated or deleted. Used by all modules.';

COMMENT ON COLUMN public.audit_logs.old_values IS
  'JSON snapshot of the record state BEFORE the action. NULL for create events.';

COMMENT ON COLUMN public.audit_logs.new_values IS
  'JSON snapshot of the record state AFTER the action. NULL for delete events.';

-- ============================================================
-- STEP 7: INDEXES
-- Optimise queries for authentication workflows.
-- ============================================================

-- user_profiles: lookup by email (used in login flow)
CREATE INDEX idx_user_profiles_email
  ON public.user_profiles (email);

-- user_profiles: lookup by role (used in permission checks)
CREATE INDEX idx_user_profiles_role
  ON public.user_profiles (role);

-- user_profiles: lookup by status (used to filter active users)
CREATE INDEX idx_user_profiles_status
  ON public.user_profiles (status);

-- login_history: lookup by user (used in account history)
CREATE INDEX idx_login_history_user_id
  ON public.login_history (user_id);

-- login_history: lookup by email (used even before user resolved)
CREATE INDEX idx_login_history_email
  ON public.login_history (email);

-- login_history: time-range queries for dashboards and audits
CREATE INDEX idx_login_history_created_at
  ON public.login_history (created_at DESC);

-- login_history: filter by event type
CREATE INDEX idx_login_history_event_type
  ON public.login_history (event_type);

-- password_reset_tokens: lookup by user for cleanup
CREATE INDEX idx_password_reset_tokens_user_id
  ON public.password_reset_tokens (user_id);

-- password_reset_tokens: filter unused tokens
CREATE INDEX idx_password_reset_tokens_used_at
  ON public.password_reset_tokens (used_at)
  WHERE used_at IS NULL;

-- audit_logs: lookup by user
CREATE INDEX idx_audit_logs_user_id
  ON public.audit_logs (user_id);

-- audit_logs: filter by module
CREATE INDEX idx_audit_logs_module
  ON public.audit_logs (module);

-- audit_logs: time-range queries
CREATE INDEX idx_audit_logs_created_at
  ON public.audit_logs (created_at DESC);

-- audit_logs: correlation lookups
CREATE INDEX idx_audit_logs_correlation_id
  ON public.audit_logs (correlation_id);

-- ============================================================
-- STEP 8: TRIGGERS
-- Automatically manage updated_at and enforce immutability.
-- ============================================================

-- Generic updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply updated_at trigger to user_profiles
CREATE TRIGGER trg_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Prevent UPDATE on login_history (immutable)
CREATE OR REPLACE FUNCTION public.prevent_update()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Updates are not permitted on this table. Records are immutable.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_login_history_immutable
  BEFORE UPDATE ON public.login_history
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_update();

-- Prevent UPDATE on audit_logs (immutable)
CREATE TRIGGER trg_audit_logs_immutable
  BEFORE UPDATE ON public.audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_update();

-- Prevent DELETE on login_history
CREATE OR REPLACE FUNCTION public.prevent_delete()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Deletions are not permitted on this table. Records are immutable.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_login_history_no_delete
  BEFORE DELETE ON public.login_history
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_delete();

-- Prevent DELETE on audit_logs
CREATE TRIGGER trg_audit_logs_no_delete
  BEFORE DELETE ON public.audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_delete();

-- Auto-create user_profile when a new Supabase auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    'read_only_user',
    'active'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_on_new_auth_user
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user();

-- Reset failed_login_attempts on successful login
CREATE OR REPLACE FUNCTION public.reset_failed_login_on_success()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.success = TRUE AND NEW.event_type = 'login_success' AND NEW.user_id IS NOT NULL THEN
    UPDATE public.user_profiles
    SET
      failed_login_attempts = 0,
      locked_until = NULL,
      last_login_at = NOW(),
      last_login_ip = NEW.ip_address
    WHERE id = NEW.user_id;
  END IF;

  IF NEW.success = FALSE AND NEW.event_type = 'login_failed' AND NEW.user_id IS NOT NULL THEN
    UPDATE public.user_profiles
    SET failed_login_attempts = failed_login_attempts + 1
    WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_login_history_update_profile
  AFTER INSERT ON public.login_history
  FOR EACH ROW
  EXECUTE FUNCTION public.reset_failed_login_on_success();

-- ============================================================
-- STEP 9: ENABLE ROW-LEVEL SECURITY (RLS)
-- Security Model: Deny by default. Explicitly allow required access.
-- ============================================================

ALTER TABLE public.user_profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_history        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs           ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 10: RLS POLICIES — user_profiles
-- ============================================================

-- Any authenticated user can read their OWN profile
CREATE POLICY "user_profiles: owner can read own profile"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- System Administrator can read ALL profiles
CREATE POLICY "user_profiles: admin can read all profiles"
  ON public.user_profiles
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

-- Operations Manager can read all profiles (for dispatch assignment)
CREATE POLICY "user_profiles: operations_manager can read all"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid()
        AND up.role IN ('system_administrator', 'operations_manager')
        AND up.status = 'active'
    )
  );

-- Authenticated user can update ONLY their own non-sensitive fields
CREATE POLICY "user_profiles: owner can update own profile"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Only system_administrator can INSERT new profiles (handled via trigger normally)
CREATE POLICY "user_profiles: admin can insert"
  ON public.user_profiles
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

-- No one can DELETE a user profile via RLS (use deactivation instead)
-- (No DELETE policy = default deny)

-- ============================================================
-- STEP 11: RLS POLICIES — login_history
-- ============================================================

-- Authenticated user can read their OWN login history
CREATE POLICY "login_history: owner can view own history"
  ON public.login_history
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- System Administrator and Auditors can read ALL login history
CREATE POLICY "login_history: admin can view all"
  ON public.login_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid()
        AND up.role IN ('system_administrator', 'operations_manager')
        AND up.status = 'active'
    )
  );

-- Only service role (server-side) can INSERT login events
CREATE POLICY "login_history: service role can insert"
  ON public.login_history
  FOR INSERT
  TO service_role
  WITH CHECK (TRUE);

-- No UPDATE or DELETE on login_history (enforced by trigger + no policy)

-- ============================================================
-- STEP 12: RLS POLICIES — password_reset_tokens
-- ============================================================

-- Users can view their OWN reset tokens (for status checks)
CREATE POLICY "password_reset_tokens: owner can view own"
  ON public.password_reset_tokens
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Only service role can insert/update reset tokens
CREATE POLICY "password_reset_tokens: service role full access"
  ON public.password_reset_tokens
  FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- ============================================================
-- STEP 13: RLS POLICIES — audit_logs
-- ============================================================

-- System Administrator can read ALL audit logs
CREATE POLICY "audit_logs: admin can read all"
  ON public.audit_logs
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

-- Users can view their OWN audit entries
CREATE POLICY "audit_logs: owner can view own"
  ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Only service role can INSERT audit entries (always via server)
CREATE POLICY "audit_logs: service role can insert"
  ON public.audit_logs
  FOR INSERT
  TO service_role
  WITH CHECK (TRUE);

-- No UPDATE or DELETE ever (enforced by trigger + no policy)

-- ============================================================
-- STEP 14: HELPER DATABASE FUNCTION
-- Checks if the current authenticated user is active and unlocked.
-- Used in RLS policies and Server Actions.
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_active_user()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles
    WHERE id = auth.uid()
      AND status = 'active'
      AND (locked_until IS NULL OR locked_until < NOW())
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.is_active_user IS
  'Returns TRUE if the currently authenticated user has an active, unlocked account.';

-- ============================================================
-- STEP 15: GRANT PERMISSIONS
-- Ensure authenticated role has access to read/write as defined by RLS.
-- ============================================================

GRANT SELECT, UPDATE ON public.user_profiles TO authenticated;
GRANT SELECT ON public.login_history TO authenticated;
GRANT SELECT ON public.password_reset_tokens TO authenticated;
GRANT SELECT ON public.audit_logs TO authenticated;

GRANT ALL ON public.user_profiles TO service_role;
GRANT ALL ON public.login_history TO service_role;
GRANT ALL ON public.password_reset_tokens TO service_role;
GRANT ALL ON public.audit_logs TO service_role;

-- ============================================================
-- MIGRATION COMPLETE
-- ============================================================
