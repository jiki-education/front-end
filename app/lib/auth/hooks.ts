/**
 * Authentication hooks for managing auth state and redirects
 */

import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RequireAuthOptions {
  redirectTo?: string;
  redirectIfAuthenticated?: boolean;
  onAuthenticated?: () => void;
  onUnauthenticated?: () => void;
}

/**
 * Hook for pages that require authentication.
 * Handles auth checking and redirects in a centralized way.
 *
 * @param options Configuration options for auth behavior
 * @param options.redirectTo URL to redirect to when not authenticated (default: "/auth/login")
 * @param options.redirectIfAuthenticated If true, redirects to dashboard when authenticated
 * @param options.onAuthenticated Callback when user is authenticated (called once)
 * @param options.onUnauthenticated Callback when user is not authenticated (called once)
 *
 * Note: Callbacks are intentionally excluded from useEffect dependencies to prevent
 * infinite re-renders. They will only be called once per auth state change.
 *
 * @returns Object with auth state and loading status
 */
export function useRequireAuth(options: RequireAuthOptions = {}) {
  const { redirectTo = "/auth/login", redirectIfAuthenticated = false, onAuthenticated, onUnauthenticated } = options;

  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    setIsReady(true);

    if (redirectIfAuthenticated && isAuthenticated) {
      router.push("/dashboard");
      return;
    }

    if (!redirectIfAuthenticated && !isAuthenticated) {
      if (onUnauthenticated) {
        onUnauthenticated();
      }
      router.push(redirectTo);
      return;
    }

    if (isAuthenticated && onAuthenticated) {
      onAuthenticated();
    }
    // Excluding callback functions from dependencies to prevent infinite re-renders
    // when consumers pass inline functions. The callbacks are only used for side effects
    // and don't affect the core auth logic flow.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading, router, redirectTo, redirectIfAuthenticated]);

  return {
    isAuthenticated,
    isLoading: authLoading || !isReady,
    user,
    isReady: isReady && !authLoading
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
  const { isAuthenticated, isLoading, user } = useAuthStore();

  return {
    isAuthenticated,
    isLoading,
    user,
    isReady: !isLoading
  };
}
