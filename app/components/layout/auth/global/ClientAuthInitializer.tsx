"use client";

import { useAuthStore } from "@/lib/auth/authStore";
import { useEffect, useRef, type ReactNode } from "react";

interface ClientAuthProviderProps {
  children: ReactNode;
}

/**
 * Client-side initializer that validates the access token via API.
 *
 * Used by ServerAuthProvider when an access token cookie exists server-side.
 * Makes an API call to validate the token and populate the auth store with
 * user data. Shows a loading spinner until validation completes to prevent
 * flash of unauthenticated content (FOUC).
 */
export function ClientAuthInitializer({ children }: ClientAuthProviderProps) {
  const { checkAuth, hasCheckedAuth } = useAuthStore();
  const initRef = useRef(false);

  useEffect(() => {
    // Ref guard prevents duplicate checkAuth() calls from:
    // 1. React Strict Mode double-mounting (development)
    // 2. Zustand selector instability causing dependency array changes
    // 3. Rapid parent re-renders before store state updates
    // Works in concert with ServerAuthProvider routing and store-level guards
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
