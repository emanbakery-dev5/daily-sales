/**
 * Supabase Browser Client
 * ============================================================
 * Creates a singleton Supabase client for use in Client
 * Components ('use client') only.
 *
 * Session management (cookies) is handled server-side.
 * This client is provided for:
 *   - Reading auth state reactively (onAuthStateChange)
 *   - Future client-side real-time subscriptions
 *
 * Do NOT perform data mutations here; use Server Actions.
 * ============================================================
 */

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types/database.types";

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
