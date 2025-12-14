/**
 * Token Storage Utilities
 * JWT parsing utilities for server-side use
 *
 * Note: Tokens are now stored in httpOnly cookies and cannot be accessed from client-side JavaScript.
 * All token management is handled by Server Actions in @/lib/auth/actions.ts
 */

/**
 * Parse JWT payload (without verification)
 * Note: This doesn't validate the token, only decodes it
 * For server-side use only
 */
export function parseJwtPayload(token: string): Record<string, any> | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

/**
 * Get token expiry from JWT payload
 * For server-side use only
 */
export function getTokenExpiry(token: string): number | null {
  const payload = parseJwtPayload(token);
  if (!payload || !payload.exp) {
    return null;
  }

  // JWT exp is in seconds, convert to milliseconds
  return payload.exp * 1000;
}
