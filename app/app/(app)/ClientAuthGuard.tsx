"use client";

import { isExternalUrl } from "@/lib/routing/external-urls";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "../../lib/auth/authStore";
import { getAccessToken } from "../../lib/auth/storage";

/**
 * Client-side authentication guard
 *
 * Only rendered when server-side auth check succeeds
 */
export function ClientAuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hasCheckedAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Handle unauthenticated redirect in useEffect (not during render)
  useEffect(() => {
    if (hasCheckedAuth && !isAuthenticated) {
      // If there is an external version of this page, we'll redirect
      // the user there. Because the access token will have been deleted
      // above, we can safely do this as we won't hit an infinite loop.
      if (isExternalUrl(pathname) && !getAccessToken()) {
        router.push(pathname); // Reload same page → shows external version
      } else {
        router.push("/auth/login"); // Redirect to login
      }
    }
  }, [isAuthenticated, hasCheckedAuth, pathname, router]);

  // Show loading spinner while auth is checking/refreshing or redirecting
  if (!hasCheckedAuth) {
    return <LoadingSpinner />;
  }
  // Auth succeeded - render children
  return <>{children}</>;
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  );
}
