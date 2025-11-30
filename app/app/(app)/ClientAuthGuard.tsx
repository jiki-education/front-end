"use client";

import { useRequireAuth } from "@/lib/auth/hooks";

/**
 * Client-side authentication guard
 *
 * Only rendered when server-side auth check fails (expired/missing token)
 * Delegates all auth logic to useRequireAuth hook
 */
export function ClientAuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoading } = useRequireAuth();

  // Show loading spinner while auth is checking/refreshing
  if (isLoading) {
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
