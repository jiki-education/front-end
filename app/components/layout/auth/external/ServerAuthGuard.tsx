import type { ReactNode } from "react";
import { hasSessionCookie } from "../../../../lib/auth/server-storage";
import { ClientAuthGuard } from "./ClientAuthGuard";

interface ServerAuthGuardProps {
  children: ReactNode;
}

/**
 * Server-side guard for external/auth pages (login, signup, etc.).
 *
 * Checks for session cookie server-side and conditionally wraps children:
 * - No cookie: Renders children directly (user can see auth pages)
 * - Has cookie: Wraps children in ClientAuthGuard (validates and possibly redirects)
 *
 * Used in app/(external)/layout.tsx to protect auth pages from authenticated users.
 */
export async function ServerAuthGuard({ children }: ServerAuthGuardProps) {
  const hasCookie = await hasSessionCookie();

  if (!hasCookie) {
    return <>{children}</>;
  }

  return <ClientAuthGuard>{children}</ClientAuthGuard>;
}
