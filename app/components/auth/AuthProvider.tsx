"use client";

import { useAuthStore } from "@/stores/authStore";
import { useEffect, useRef, type ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider ensures authentication is checked once at app startup.
 * It prevents children from rendering until the initial auth check is complete,
 * avoiding duplicate checkAuth() calls and race conditions.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { checkAuth, hasCheckedAuth, isLoading } = useAuthStore();
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
  if (!hasCheckedAuth && isLoading) {
    return null; // Or a loading spinner if preferred
  }

  return <>{children}</>;
}
