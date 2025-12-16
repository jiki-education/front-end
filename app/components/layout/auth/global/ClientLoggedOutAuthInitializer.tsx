"use client";

import { useEffect } from "react";
import { useAuthStore } from "../../../../lib/auth/authStore";

/**
 * Client-side initializer that sets the auth store to logged-out state.
 *
 * Used by ServerAuthProvider when no access token cookie is present server-side.
 * Synchronously initializes the store without making an API call, allowing
 * immediate rendering of public pages.
 */
export function ClientLoggedOutAuthInitializer() {
  const { setNoUser } = useAuthStore();

  useEffect(() => {
    setNoUser();
  }, [setNoUser]);

  return <></>;
}
