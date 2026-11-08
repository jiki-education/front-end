"use client";

import { useEffect } from "react";
import { useAuthStore } from "../../../../lib/auth/authStore";

/**
 * Client-side initializer that sets the auth store to logged-out state.
 *
 * Used by ServerAuthProvider when no access token cookie is present server-side.
 * Synchronously initializes the store without making an API call, allowing
 * immediate rendering of public pages.
 *
 * Only the FIRST mount may do this. "The server saw no cookie" was true when the
 * HTML was generated, but this component can mount again later without a new
 * request: ClientLocaleProvider unmounts and remounts the whole tree when it
 * swaps catalogs, which happens right after a login whose account locale differs
 * from the page's. Re-running setNoUser then overwrote a store that a successful
 * login had just populated, and the dashboard guard bounced the user between the
 * landing page and /dashboard indefinitely.
 */
export function ClientLoggedOutAuthInitializer() {
  useEffect(() => {
    const { hasCheckedAuth, setNoUser } = useAuthStore.getState();
    if (!hasCheckedAuth) {
      setNoUser();
    }
  }, []);

  return <></>;
}
