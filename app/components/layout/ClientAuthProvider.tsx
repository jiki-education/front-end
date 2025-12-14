"use client";

import { useAuthStore } from "@/lib/auth/authStore";
import { useEffect, useRef, type ReactNode } from "react";

interface ClientAuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider ensures authentication is checked once at app startup.
 * It prevents children from rendering until the initial auth check is complete,
 * avoiding duplicate checkAuth() calls and race conditions.
 */
export function ClientAuthProvider({ children }: ClientAuthProviderProps) {
  const { checkAuth, hasCheckedAuth } = useAuthStore();
  const initRef = useRef(false);

  useEffect(() => {
    // Use ref to ensure we only initialize once, avoiding race conditions
    if (!initRef.current && !hasCheckedAuth) {
      initRef.current = true;
      void checkAuth();
    }
  }, [checkAuth, hasCheckedAuth]);

  // Wait for initial auth check to complete before rendering children
  // Use the store's hasCheckedAuth as the single source of truth
  if (!hasCheckedAuth) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  );
}
