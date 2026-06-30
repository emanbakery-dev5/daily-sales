/**
 * Supabase Admin / Service-Role Client
 * ============================================================
 * Creates a Supabase client authenticated with the SERVICE_ROLE
 * key, which bypasses Row-Level Security (RLS).
 *
 * USE ONLY FOR:
 *   - Writing to audit_logs  (service_role INSERT policy)
 *   - Writing to login_history (service_role INSERT policy)
 *   - Privileged user management operations
 *
 * NEVER:
 *   - Import this in any file that is accessible from the browser
 *   - Return data fetched via this client directly to the client
 *   - Log or expose the SERVICE_ROLE_KEY
 * ============================================================
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database.types";

export function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "[AdminClient] NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.",
    );
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      // Disable auto-refresh — the admin client is stateless per request
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
