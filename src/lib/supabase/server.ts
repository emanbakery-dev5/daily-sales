/**
 * Supabase Server-Side Client
 * ============================================================
 * Creates a cookie-based Supabase client for use in:
 *   - Next.js Server Actions ('use server')
 *   - Next.js Route Handlers
 *   - Middleware (use createSupabaseMiddlewareClient instead)
 *
 * This client operates under the ANON key with RLS enforced.
 * The session is read from and written to HTTP-only cookies,
 * preventing any client-side token exposure.
 * ============================================================
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/types/database.types";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll() can be called from a Server Component where cookies
            // cannot be set. This is safe to ignore — middleware handles
            // session refresh separately.
          }
        },
      },
    },
  );
}
