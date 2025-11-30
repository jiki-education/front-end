/**
 * Authentication hooks for managing auth state and redirects
 */

import { useAuthStore } from "@/stores/authStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isExternalUrl } from "@/lib/routing/external-urls";
import { removeAccessToken } from "@/lib/auth/storage";

interface RequireAuthOptions {
  redirectTo?: string;
  redirectIfAuthenticated?: boolean;
}

/**
 * Hook for pages that require authentication.
 * Handles auth checking and redirects in a centralized way.
 *
 * @param options Configuration options for auth behavior
 * @param options.redirectTo URL to redirect to when not authenticated (default: "/auth/login")
 * @param options.redirectIfAuthenticated If true, redirects to dashboard when authenticated
 *
 * @returns Object with auth state and loading status
 */
export function useRequireAuth(options: RequireAuthOptions = {}) {
  const { redirectTo = "/auth/login", redirectIfAuthenticated = false } = options;

  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading: authLoading, user, hasCheckedAuth } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for auth loading to complete AND for hasCheckedAuth to be true
    // This prevents race conditions during page refresh where auth state might
    // briefly appear as unauthenticated before the actual auth check completes
    if (authLoading) {
      return;
    }

    // Only proceed with redirects after auth has been properly checked
    // This is crucial for preventing redirect loops on page refresh
    if (!hasCheckedAuth) {
      return;
    }

    setIsReady(true);

    // Use Case 1: Login/Signup pages - redirect authenticated users away
    // If user is already logged in and visits /auth/login, send them to dashboard
    if (redirectIfAuthenticated && isAuthenticated) {
      router.push("/dashboard");
      return;
    }

    // Use Case 2: Protected pages - redirect unauthenticated users
    // If user is NOT logged in and visits a protected page, handle redirect
    if (!redirectIfAuthenticated && !isAuthenticated) {
      // Clear stale token before redirecting
      removeAccessToken();

      // Redirect based on URL type
      if (isExternalUrl(pathname)) {
        router.push(pathname); // Reload same page → shows external version
      } else {
        router.push(redirectTo); // Redirect to login
      }
      return;
    }
  }, [isAuthenticated, authLoading, hasCheckedAuth, router, redirectTo, redirectIfAuthenticated, pathname]);

  return {
    isAuthenticated,
    isLoading: authLoading || !hasCheckedAuth || !isReady,
    user,
    isReady: isReady && !authLoading && hasCheckedAuth
  };
}

/**
 * Hook for pages that should redirect if user is already authenticated
 * (e.g., login, signup pages)
 */
export function useRedirectIfAuthenticated(_redirectTo = "/dashboard") {
  return useRequireAuth({
    redirectIfAuthenticated: true
  });
}

/**
 * Hook to get current auth status without any redirects.
 * Relies on AuthProvider having already checked authentication status.
 *
 * @returns Current auth state from the store
 */
export function useAuth() {
  const { isAuthenticated, isLoading, user, hasCheckedAuth } = useAuthStore();

  return {
    isAuthenticated,
    isLoading,
    user,
    hasCheckedAuth,
    isReady: !isLoading && hasCheckedAuth
  };
}
