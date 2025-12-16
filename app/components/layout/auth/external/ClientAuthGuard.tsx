"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "../../../../lib/auth/authStore";

/**
 * Client-side authentication guard
 *
 * Only rendered when server-side auth check succeeds
 */
export function ClientAuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hasCheckedAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Handle unexpected authenticated user by redirecting
  // them back to the dashboard
  useEffect(() => {
    if (hasCheckedAuth && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, hasCheckedAuth, pathname, router]);

  // Show loading spinner while auth is checking/refreshing or redirecting
  if (!hasCheckedAuth) {
    return null;
  }

  // Auth succeeded - render children
  return <>{children}</>;
}
