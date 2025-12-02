"use client";

import { useEffect } from "react";
import { useAuthStore } from "../../lib/auth/authStore";

/**
 * AuthProvider ensures authentication is checked once at app startup.
 * It prevents children from rendering until the initial auth check is complete,
 * avoiding duplicate checkAuth() calls and race conditions.
 */
export function LoggedOutAuthProvider() {
  const { setNoUser } = useAuthStore();

  useEffect(() => {
    setNoUser();
  }, [setNoUser]);

  return <></>;
}
