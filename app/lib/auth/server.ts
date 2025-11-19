/**
 * Server-Side Authentication Utilities
 * For use in Server Components and middleware
 */

import { cookies } from "next/headers";
import { parseJwtPayload } from "./storage";

export interface ServerAuthState {
  isAuthenticated: boolean;
  userId: number | null;
  token: string | null;
}

/**
 * Get authentication state from server-side cookie
 * Treats expired JWT as authenticated (client will handle refresh)
 *
 * @returns Server auth state with authentication status and user info
 */
export async function getServerAuth(): Promise<ServerAuthState> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("jiki_access_token")?.value || null;

  if (!accessToken) {
    return { isAuthenticated: false, userId: null, token: null };
  }

  try {
    const payload = parseJwtPayload(accessToken);

    if (!payload) {
      return { isAuthenticated: false, userId: null, token: null };
    }

    // User has a JWT (even if expired) - treat as authenticated
    // Client-side will handle token refresh automatically
    return {
      isAuthenticated: true,
      userId: payload.user_id || null,
      token: accessToken
    };
  } catch (error) {
    console.error("Failed to parse JWT in server auth:", error);
    return { isAuthenticated: false, userId: null, token: null };
  }
}
