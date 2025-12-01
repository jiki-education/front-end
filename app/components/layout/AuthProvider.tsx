import { type ReactNode } from "react";
import { hasServersideAccessToken } from "../../lib/auth/server-storage";
import { ClientAuthProvider } from "../layout/ClientAuthProvider";
import { LoggedOutAuthProvider } from "./LoggedOutAuthProvider";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider ensures authentication is checked once at app startup.
 * It prevents children from rendering until the initial auth check is complete,
 * avoiding duplicate checkAuth() calls and race conditions.
 */
export async function AuthProvider({ children }: AuthProviderProps) {
  // If we don't have a serverside access token then we know we're logged out
  // So we called the LoggedOutAuthProvider, which sets the store correctly
  // clientside and then we render the children directly.
  const hasToken = await hasServersideAccessToken();
  if (!hasToken) {
    return (
      <>
        <LoggedOutAuthProvider />
        {children}
      </>
    );
  }

  // Otherwise, we MIGHT be logged in, so we deal with stuff clientside
  return <ClientAuthProvider>{children}</ClientAuthProvider>;
}
