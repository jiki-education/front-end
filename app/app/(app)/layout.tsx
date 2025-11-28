import { getServerAuth } from "@/lib/auth/server";
import { ClientAuthGuard } from "./ClientAuthGuard";

/**
 * Internal App Layout with Hybrid Authentication
 *
 * AUTHENTICATION FLOW:
 * ===================
 *
 * This layout uses a hybrid server/client auth strategy to optimize UX:
 *
 * 1. SERVER-SIDE CHECK (getServerAuth):
 *    - Reads jiki_access_token cookie
 *    - Parses JWT and checks expiry
 *    - If valid & not expired → render immediately (NO SPINNER)
 *    - If expired/missing → delegate to client-side guard
 *
 * 2. CLIENT-SIDE GUARD (ClientAuthGuard):
 *    - Only runs when server auth check fails
 *    - Shows loading spinner
 *    - Attempts token refresh via existing refresh token flow
 *    - On success → hides spinner, shows content
 *    - On failure → redirects based on route type:
 *      * External URL (e.g., /blog) → redirect to same URL (shows external version)
 *      * Internal URL (e.g., /dashboard) → redirect to /auth/login
 *
 * BENEFITS:
 * =========
 * - Valid token: SSR, no spinner, instant render ✅
 * - Expired token: Brief spinner during refresh attempt
 * - No token: Brief spinner then redirect
 * - Logged out users on external routes: Fast SSR cached version (middleware rewrites)
 *
 * FLOW EXAMPLES:
 * ==============
 *
 * Scenario 1: Valid JWT
 *   Request → Middleware (has cookie, pass through) → Server (token valid) → Render ✅
 *
 * Scenario 2: Expired JWT with valid refresh token
 *   Request → Middleware (has cookie, pass through) → Server (token expired)
 *   → ClientAuthGuard (spinner) → Refresh succeeds → Render ✅
 *
 * Scenario 3: Expired JWT, refresh fails, external URL
 *   Request → Middleware (has cookie, pass through) → Server (token expired)
 *   → ClientAuthGuard (spinner) → Refresh fails → Delete cookie → Redirect to /blog
 *   → Second request → Middleware (no cookie) → Rewrite to /external/blog ✅
 *
 * Scenario 4: No JWT, external URL
 *   Request → Middleware (no cookie) → Rewrite to /external/blog → Fast SSR ✅
 */
export default async function AppLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = await getServerAuth();

  // Fast path: Valid JWT on server → render immediately (no spinner)
  if (auth.isAuthenticated) {
    return <>{children}</>;
  }

  // Slow path: Invalid/missing/expired JWT → client validates with spinner
  return <ClientAuthGuard>{children}</ClientAuthGuard>;
}
