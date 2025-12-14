import type { ReactNode } from "react";
import { hasServersideAccessToken } from "../../lib/auth/server-storage";
import { ClientAuthGuard } from "./ClientAuthGuard";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider ensures authentication is checked once at app startup.
 * It prevents children from rendering until the initial auth check is complete,
 * avoiding duplicate checkAuth() calls and race conditions.
 */
export async function AuthGuard({ children }: AuthProviderProps) {
  const hasToken = await hasServersideAccessToken();

  if (!hasToken) {
    return <>{children}</>;
  }

  return <ClientAuthGuard>{children}</ClientAuthGuard>;
}
