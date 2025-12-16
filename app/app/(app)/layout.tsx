import { ClientAuthGuard } from "../../components/layout/auth/internal/ClientAuthGuard";

/**
 * Internal App Layout with Client-Side Authentication
 *
 * AUTHENTICATION FLOW:
 * ===================
 *
 * All authenticated pages are wrapped in ClientAuthGuard:
 *
 * 1. CLIENT-SIDE GUARD (ClientAuthGuard):
 *    - Shows loading spinner while checking auth
 *    - Attempts token refresh if token is expired
 *    - On success → renders children
 *    - On failure → redirects based on route type:
 *      * External URL (e.g., /blog) → redirect to same URL (shows external version)
 *      * Internal URL (e.g., /dashboard) → redirect to /auth/login
 *
 * BENEFITS:
 * =========
 * - Single auth path through the entire app
 * - No server-side JWT parsing
 * - Pages don't need any auth checks (guaranteed ready when rendered)
 * - Consistent loading experience
 */
export default function AppLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ClientAuthGuard>{children}</ClientAuthGuard>;
}
