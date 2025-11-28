/**
 * Token Storage Utilities
 * Secure JWT token management for authentication
 */

import { setAccessTokenCookie, getAccessTokenCookie, removeAccessTokenCookie } from "@/lib/auth/cookie-storage";

const REFRESH_TOKEN_KEY = "jiki_refresh_token";

/**
 * Store JWT access token in cookie
 */
export function setAccessToken(token: string, expiryMs?: number): void {
  setAccessTokenCookie(token, expiryMs);
}

/**
 * Retrieve stored JWT access token from cookie
 */
export function getAccessToken(): string | null {
  return getAccessTokenCookie();
}

/**
 * Remove stored JWT access token
 * Note: Does not remove refresh token - caller must handle that explicitly
 */
export function removeAccessToken(): void {
  removeAccessTokenCookie();
}

/**
 * Check if access token exists and is valid
 * Validates JWT exp claim
 * Note: This is a pure function - it does NOT remove expired tokens
 */
export function hasValidToken(): boolean {
  const token = getAccessToken();
  if (!token) {
    return false;
  }

  // Check JWT exp claim
  const payload = parseJwtPayload(token);
  if (payload && payload.exp) {
    const expiryMs = payload.exp * 1000;
    if (Date.now() > expiryMs) {
      // Token has expired - just return false
      // Caller is responsible for token cleanup
      return false;
    }
  }

  return true;
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

/**
 * Store refresh token in localStorage (persists across browser sessions)
 */
export function setRefreshToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.error("Failed to store refresh token:", error);
  }
}

/**
 * Retrieve stored refresh token from localStorage
 */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error("Failed to retrieve refresh token:", error);
    return null;
  }
}

/**
 * Remove stored refresh token from localStorage
 */
export function removeRefreshToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error("Failed to remove refresh token:", error);
  }
}
