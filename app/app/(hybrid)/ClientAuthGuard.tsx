"use client";

import { useAuthStore } from "../../lib/auth/authStore";

/**
 * Client-side authentication guard
 *
 * Only rendered when server-side auth check finishes
 */
export function ClientAuthGuard({ children }: { children: React.ReactNode }) {
  const { hasCheckedAuth } = useAuthStore();

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
