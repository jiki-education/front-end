"use client";

import { isExternalUrl } from "@/lib/routing/external-urls";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "../../lib/auth/authStore";

/**
 * Client-side authentication guard
 *
 * Only rendered when server-side auth check succeeds
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hasCheckedAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Handle unauthenticated redirect in useEffect (not during render)
  useEffect(() => {
    if (hasCheckedAuth && !isAuthenticated) {
      // If there is an external version of this page, redirect there
      if (pathname === "/dashboard") {
        router.push("/");
        return;
      }
      if (isExternalUrl(pathname)) {
        router.push(pathname);
        return; // Reload same page → shows external version
      }
      router.push("/auth/login"); // Redirect to login
    }
  }, [isAuthenticated, hasCheckedAuth, pathname, router]);

  // Show loading spinner while auth is checking/refreshing or redirecting
  if (!hasCheckedAuth || !isAuthenticated) {
    return null;
  }
  // Auth succeeded - render children
  return <>{children}</>;
}
