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

  // Show nothing while auth is checking (loading spinner shown by ClientAuthInitializer above)
  // or while redirecting authenticated users to dashboard
  if (!hasCheckedAuth || isAuthenticated) {
    return null;
  }

  // Auth succeeded - render children
  return <>{children}</>;
}
