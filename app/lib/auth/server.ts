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
 * Checks JWT validity and expiry
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

    // Check if token is expired
    if (payload.exp && Date.now() > payload.exp * 1000) {
      return { isAuthenticated: false, userId: null, token: null };
    }

    // Check if sub exists (required for valid token)
    if (!payload.sub) {
      return { isAuthenticated: false, userId: null, token: null };
    }

    // Token is valid and not expired
    return {
      isAuthenticated: true,
      userId: parseInt(payload.sub, 10),
      token: accessToken
    };
  } catch (error) {
    console.error("Failed to parse JWT in server auth:", error);
    return { isAuthenticated: false, userId: null, token: null };
  }
}
