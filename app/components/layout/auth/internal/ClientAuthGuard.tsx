"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { useAuthStore } from "../../../../lib/auth/authStore";

/**
 * Client-side guard that redirects unauthenticated users from protected pages.
 *
 * Used in app/(app)/layout.tsx to protect authenticated routes. Waits for global
 * auth initialization to complete, then sends unauthenticated users to /auth/login
 * (or, for /dashboard, to the landing page — its public equivalent).
 *
 * (app) routes are always protected and never have a public twin at the same URL
 * (pages that serve both auth states live in the (hybrid) group and branch on the
 * cookie themselves), so there is no "reload to reveal the public version" case.
 */
export function ClientAuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hasCheckedAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const routes = useLocaleRoutes();

  // Handle unauthenticated redirect in useEffect (not during render)
  useEffect(() => {
    if (hasCheckedAuth && !isAuthenticated) {
      // /dashboard's public equivalent is the landing page, not a same-URL twin.
      if (pathname === "/dashboard") {
        router.push(routes.home());
        return;
      }
      router.push(routes.authLogin());
    }
  }, [isAuthenticated, hasCheckedAuth, pathname, router, routes]);

  // Show nothing while auth is checking (loading spinner shown by ClientAuthInitializer above)
  // or while redirecting unauthenticated users
  if (!hasCheckedAuth || !isAuthenticated) {
    return null;
  }
  // Auth succeeded - render children
  return <>{children}</>;
}
