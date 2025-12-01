"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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

  // Handle authenticated redirect in useEffect (not during render)
  useEffect(() => {
    // TODO: We want to redirect to the last page the person viewed at some stage!
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading spinner while auth is checking/refreshing or redirecting
  if (isLoading || isAuthenticated) {
    return <LoadingSpinner />;
  }

  // Not authenticated - render children (external/public content)
  return <>{children}</>;
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  );
}
