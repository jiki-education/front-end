import { ClientAuthGuard } from "../../components/layout/auth/internal/ClientAuthGuard";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher/LocaleSwitcher";
import { TranslatathonBanner } from "@/components/i18n/TranslatathonBanner";
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
      <TranslatathonBanner />
      {/* STAGING-ONLY: hand-testing affordance for the full locale set. It sits
          in the layout rather than on the dashboard so it reaches the lesson and
          settings pages too, which are the app-internal pages a translator
          otherwise cannot see in their own language. Belongs to this branch and
          must not reach production. */}
      <LocaleSwitcher />
      {children}
      <CheckoutReturnHandler />
      <WelcomeModalHandler />
    </ClientAuthGuard>
  );
}
