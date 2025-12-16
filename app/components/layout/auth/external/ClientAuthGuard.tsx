"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "../../../../lib/auth/authStore";

/**
 * Client-side guard that redirects authenticated users from public auth pages.
 *
 * Used by ServerAuthGuard when a token is detected server-side. Waits for
 * global auth initialization to complete, then redirects authenticated users
 * to the dashboard (preventing them from seeing login/signup pages).
 */
export function ClientAuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hasCheckedAuth } = useAuthStore();
  const router = useRouter();

  // Handle unexpected authenticated user by redirecting
  // them back to the dashboard
  useEffect(() => {
    if (hasCheckedAuth && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, hasCheckedAuth, router]);

  // Show loading spinner while auth is checking/refreshing or redirecting
  if (!hasCheckedAuth) {
    return null;
  }

  // Auth succeeded - render children
  return <>{children}</>;
}
