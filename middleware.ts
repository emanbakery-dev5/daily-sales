/**
 * Next.js Middleware — Session Refresh & Route Protection
 * ============================================================
 * Runs on every matching request BEFORE it reaches any page or
 * Server Action. Responsibilities:
 *
 *   1. Refresh Supabase session tokens (keep cookies current).
 *   2. Redirect unauthenticated users from protected routes → /login.
 *   3. Redirect authenticated users from public-only routes → /dashboard.
 *
 * Public routes (accessible without authentication):
 *   /login, /forgot-password, /reset-password, /session-expired,
 *   /403, /404, and all static assets.
 *
 * Aligned with:
 *   - docs/functional-specification/AUTHENTICATION.md §23, §24
 *   - @supabase/ssr recommended middleware pattern
 * ============================================================
 */

import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Routes that do NOT require authentication
const PUBLIC_ROUTES = [
  "/login",
  "/forgot-password",
  "/reset-password",
  "/session-expired",
  "/403",
  "/404",
];

// Routes that authenticated users should not visit (redirect → /dashboard)
const AUTH_ONLY_ROUTES = ["/login", "/forgot-password"];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
}

function isAuthOnlyRoute(pathname: string): boolean {
  return AUTH_ONLY_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  // ── Step 1: Create Supabase client that can mutate cookies ──
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Write cookies to both the outgoing request and response
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // ── Step 2: Refresh session (IMPORTANT — do not remove) ─────
  // This call refreshes the access token if expired, using the
  // refresh token stored in cookies.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ── Step 3: Route protection ─────────────────────────────────

  // Authenticated user trying to access login/forgot-password
  // → redirect to dashboard
  if (user && isAuthOnlyRoute(pathname)) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Unauthenticated user trying to access a protected route
  // → redirect to /login with a `redirectTo` query param
  if (!user && !isPublicRoute(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

// ── Middleware matcher ───────────────────────────────────────
// Excludes Next.js internals and static files from middleware.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
