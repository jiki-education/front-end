import { type ReactNode } from "react";
import { hasAuthenticationCookie } from "../../../../lib/auth/server-storage";
import { ClientAuthInitializer } from "./ClientAuthInitializer";
import { ClientLoggedOutAuthInitializer } from "./ClientLoggedOutAuthInitializer";

interface ServerAuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider ensures authentication is checked once at app startup.
 * It prevents children from rendering until the initial auth check is complete,
 * avoiding duplicate checkAuth() calls and race conditions.
 */
export async function ServerAuthProvider({ children }: ServerAuthProviderProps) {
  // If we don't have a session cookie then we know we're logged out.
  // Render ClientLoggedOutAuthInitializer which sets the store correctly
  // clientside, then render the children directly.
  const hasCookie = await hasAuthenticationCookie();

  if (!hasCookie) {
    return (
      <>
        <ClientLoggedOutAuthInitializer />
        {children}
      </>
    );
  }

  // Otherwise, we MIGHT be logged in, so we deal with stuff clientside
  return <ClientAuthInitializer>{children}</ClientAuthInitializer>;
}
