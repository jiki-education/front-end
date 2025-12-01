"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isExternalUrl } from "@/lib/routing/external-urls";
import { removeAccessToken } from "@/lib/auth/storage";
import { useAuthStore } from "../../lib/auth/authStore";

/**
 * Client-side authentication guard
 *
 * Only rendered when server-side auth check fails (expired/missing token)
 * Delegates all auth logic to useRequireAuth hook
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Handle unauthenticated redirect in useEffect (not during render)
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      removeAccessToken();

      if (isExternalUrl(pathname)) {
        router.push(pathname); // Reload same page → shows external version
      } else {
        router.push("/auth/login"); // Redirect to login
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Show loading spinner while auth is checking/refreshing or redirecting
  if (isLoading || !isAuthenticated) {
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
