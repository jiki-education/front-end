import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { ClientAuthProvider } from "../layout/ClientAuthProvider";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider ensures authentication is checked once at app startup.
 * It prevents children from rendering until the initial auth check is complete,
 * avoiding duplicate checkAuth() calls and race conditions.
 */
export async function AuthProvider({ children }: AuthProviderProps) {
  const cookieStore = await cookies();
  const hasCookies = cookieStore.get("jiki_refresh_token");

  if (!hasCookies) {
    return <>{children}</>;
  }

  return <ClientAuthProvider>{children}</ClientAuthProvider>;
}
