import "../app.css";
import { ClientAuthGuard } from "../../components/layout/auth/internal/ClientAuthGuard";
import { CheckoutReturnHandler } from "@/components/checkout/CheckoutReturnHandler";
import { WelcomeModalHandler } from "@/components/WelcomeModalHandler";
import { AppModalRegistrar } from "@/lib/modal/AppModalRegistrar";

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
 *    - On failure → redirects to /auth/login (or, for /dashboard, to the landing
 *      page, which is its public equivalent)
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
  return (
    <ClientAuthGuard>
      <AppModalRegistrar />
      {children}
      <CheckoutReturnHandler />
      <WelcomeModalHandler />
    </ClientAuthGuard>
  );
}
