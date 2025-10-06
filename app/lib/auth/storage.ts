/**
 * Token Storage Utilities
 * Secure JWT token management for authentication
 */

const TOKEN_KEY = "jiki_auth_token";
const TOKEN_EXPIRY_KEY = "jiki_auth_expiry";

/**
 * Store JWT token and optional expiry
 */
export function setToken(token: string, expiryMs?: number): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    // Store in sessionStorage for security (doesn't persist across tabs)
    // Use localStorage if you need cross-tab persistence
    sessionStorage.setItem(TOKEN_KEY, token);

    if (expiryMs) {
      sessionStorage.setItem(TOKEN_EXPIRY_KEY, expiryMs.toString());
    }
  } catch (error) {
    console.error("Failed to store token:", error);
  }
}

/**
 * Retrieve stored JWT token
 */
export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const token = sessionStorage.getItem(TOKEN_KEY);

    // Check if token is expired
    if (token && isTokenExpired()) {
      removeToken();
      return null;
    }

    return token;
  } catch (error) {
    console.error("Failed to retrieve token:", error);
    return null;
  }
}

/**
 * Remove stored JWT token
 */
export function removeToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
  } catch (error) {
    console.error("Failed to remove token:", error);
  }
}

/**
 * Check if token exists and is valid
 * Validates both stored expiry and JWT exp claim
 */
export function hasValidToken(): boolean {
  const token = getToken();
  if (!token) {
    return false;
  }

  // Check stored expiry first
  if (isTokenExpired()) {
    return false;
  }

  // Also check JWT exp claim for additional validation
  const payload = parseJwtPayload(token);
  if (payload && payload.exp) {
    const expiryMs = payload.exp * 1000;
    if (Date.now() > expiryMs) {
      // Token has expired according to JWT claim
      removeToken();
      return false;
    }
  }

  return true;
}

/**
 * Check if token is expired
 */
export function isTokenExpired(): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  try {
    const expiryStr = sessionStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiryStr) {
      return false;
    } // No expiry set, assume valid

    const expiry = parseInt(expiryStr, 10);
    return Date.now() > expiry;
  } catch (error) {
    console.error("Failed to check token expiry:", error);
    return true; // Assume expired on error
  }
}

/**
 * Parse JWT payload (without verification)
 * Note: This doesn't validate the token, only decodes it
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
    console.error("Failed to parse JWT:", error);
    return null;
  }
}

/**
 * Get token expiry from JWT payload
 */
export function getTokenExpiry(token: string): number | null {
  const payload = parseJwtPayload(token);
  if (!payload || !payload.exp) {
    return null;
  }

  // JWT exp is in seconds, convert to milliseconds
  return payload.exp * 1000;
}
