/**
 * Secure Cookie Storage for Authentication Tokens
 * Provides cookie-based storage with proper security flags
 */

export const ACCESS_TOKEN_COOKIE_NAME = "jiki_access_token";
export const REFRESH_TOKEN_COOKIE_NAME = "jiki_refresh_token";

interface CookieOptions {
  expires?: Date;
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

/**
 * Set a secure cookie with proper security flags
 */
function setSecureCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof window === "undefined") {
    return;
  }

  const defaults: CookieOptions = {
    path: "/",
    secure: window.location.protocol === "https:",
    sameSite: "strict"
  };

  const finalOptions = { ...defaults, ...options };

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (finalOptions.expires) {
    cookieString += `; Expires=${finalOptions.expires.toUTCString()}`;
  }

  if (finalOptions.maxAge) {
    cookieString += `; Max-Age=${finalOptions.maxAge}`;
  }

  if (finalOptions.path) {
    cookieString += `; Path=${finalOptions.path}`;
  }

  if (finalOptions.domain) {
    cookieString += `; Domain=${finalOptions.domain}`;
  }

  if (finalOptions.secure) {
    cookieString += "; Secure";
  }

  if (finalOptions.sameSite) {
    cookieString += `; SameSite=${finalOptions.sameSite}`;
  }

  try {
    document.cookie = cookieString;
  } catch (error) {
    console.error("Failed to set secure cookie:", error);
  }
}

/**
 * Get cookie value by name
 */
function getCookie(name: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const encodedName = encodeURIComponent(name);
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
      const trimmed = cookie.trim();
      if (trimmed.startsWith(`${encodedName}=`)) {
        const value = trimmed.substring(encodedName.length + 1);
        return decodeURIComponent(value);
      }
    }

    return null;
  } catch (error) {
    console.error("Failed to get cookie:", error);
    return null;
  }
}

/**
 * Delete a cookie by setting it to expire in the past
 */
function deleteCookie(name: string, options: Pick<CookieOptions, "path" | "domain"> = {}): void {
  if (typeof window === "undefined") {
    return;
  }

  const defaults = {
    path: "/"
  };

  const finalOptions = { ...defaults, ...options };

  try {
    setSecureCookie(name, "", {
      ...finalOptions,
      expires: new Date(0) // Set to epoch to delete
    });
  } catch (error) {
    console.error("Failed to delete cookie:", error);
  }
}

/**
 * Store refresh token in secure cookie
 * Uses 30-day expiry to match backend token lifetime
 */
export function setRefreshTokenCookie(token: string): void {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  setSecureCookie(REFRESH_TOKEN_COOKIE_NAME, token, {
    expires: thirtyDaysFromNow,
    sameSite: "strict" // CSRF protection
  });
}

/**
 * Retrieve refresh token from secure cookie
 */
export function getRefreshTokenCookie(): string | null {
  return getCookie(REFRESH_TOKEN_COOKIE_NAME);
}

/**
 * Remove refresh token cookie (for logout)
 */
export function removeRefreshTokenCookie(): void {
  deleteCookie(REFRESH_TOKEN_COOKIE_NAME);
}

/**
 * Check if refresh token cookie exists and is not empty
 */
export function hasRefreshTokenCookie(): boolean {
  const token = getRefreshTokenCookie();
  return token !== null && token.trim() !== "";
}

/**
 * Store access token in cookie
 * Cookie lasts 1 year - JWT inside can expire and will be refreshed automatically
 */
export function setAccessTokenCookie(token: string): void {
  const options: CookieOptions = {
    sameSite: "strict", // CSRF protection
    // Don't set cookie expiration based on JWT expiration!
    // The JWT can be expired inside the cookie - we'll refresh it
    // Instead, use a long maxAge (1 year) to keep user logged in
    maxAge: 365 * 24 * 60 * 60 // 1 year in seconds
  };

  setSecureCookie(ACCESS_TOKEN_COOKIE_NAME, token, options);
}

/**
 * Retrieve access token from cookie
 */
export function getAccessTokenCookie(): string | null {
  return getCookie(ACCESS_TOKEN_COOKIE_NAME);
}

/**
 * Remove access token cookie (for logout)
 */
export function removeAccessTokenCookie(): void {
  deleteCookie(ACCESS_TOKEN_COOKIE_NAME);
}

/**
 * Check if access token cookie exists and is not empty
 */
export function hasAccessTokenCookie(): boolean {
  const token = getAccessTokenCookie();
  return token !== null && token.trim() !== "";
}
