import type { ReactNode } from "react";
import { hasServersideAccessToken } from "../../../../lib/auth/server-storage";
import { ClientAuthGuard } from "./ClientAuthGuard";

interface ServerAuthGuardProps {
  children: ReactNode;
}

/**
 * Server-side guard for external/auth pages (login, signup, etc.).
 *
 * Checks for access token cookie server-side and conditionally wraps children:
 * - No token: Renders children directly (user can see auth pages)
 * - Has token: Wraps children in ClientAuthGuard (validates and possibly redirects)
 *
 * Used in app/(external)/layout.tsx to protect auth pages from authenticated users.
 */
export async function ServerAuthGuard({ children }: ServerAuthGuardProps) {
  const hasToken = await hasServersideAccessToken();

  if (!hasToken) {
    return <>{children}</>;
  }

  return <ClientAuthGuard>{children}</ClientAuthGuard>;
}
