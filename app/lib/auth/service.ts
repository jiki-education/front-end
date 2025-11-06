/**
 * Authentication Service
 * API integration for authentication endpoints
 */

import { api } from "@/lib/api";
import { getTokenExpiry, setToken, setRefreshToken, getRefreshToken, removeRefreshToken } from "@/lib/auth/storage";
import type {
  AuthResponse,
  LoginCredentials,
  PasswordReset,
  PasswordResetRequest,
  SignupData,
  User
} from "@/types/auth";

/**
 * Extract JWT token from Authorization header
 */
function extractTokenFromHeaders(headers: Headers): string | null {
  const authHeader = headers.get("Authorization") || headers.get("authorization");
  if (!authHeader) {
    return null;
  }

  // Format: "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    return null;
  }

  return parts[1];
}

/**
 * User login
 * POST /auth/login
 */
export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await api.post<AuthResponse>("/auth/login", { user: credentials });

  // Try to extract JWT access token from response headers first
  let accessToken = extractTokenFromHeaders(response.headers);

  // If not in headers, check response body
  if (!accessToken) {
    accessToken = response.data.token || response.data.jwt || response.data.access_token || null;
  }

  // Extract refresh token from response body
  const refreshToken = response.data.refresh_token;

  // Store access token (short-lived, sessionStorage)
  if (accessToken) {
    const expiry = getTokenExpiry(accessToken);
    setToken(accessToken, expiry || undefined);
  }

  // Store refresh token (long-lived, localStorage)
  if (refreshToken) {
    setRefreshToken(refreshToken);
  }

  return response.data.user;
}

/**
 * User signup
 * POST /auth/signup
 */
export async function signup(userData: SignupData): Promise<User> {
  const response = await api.post<AuthResponse>("/auth/signup", { user: userData });

  // Try to extract JWT access token from response headers first
  let accessToken = extractTokenFromHeaders(response.headers);

  // If not in headers, check response body
  if (!accessToken) {
    accessToken = response.data.token || response.data.jwt || response.data.access_token || null;
  }

  // Extract refresh token from response body
  const refreshToken = response.data.refresh_token;

  // Store access token (short-lived, sessionStorage)
  if (accessToken) {
    const expiry = getTokenExpiry(accessToken);
    setToken(accessToken, expiry || undefined);
  }

  // Store refresh token (long-lived, localStorage)
  if (refreshToken) {
    setRefreshToken(refreshToken);
  }

  return response.data.user;
}

/**
 * User logout
 * DELETE /auth/logout
 */
export async function logout(): Promise<void> {
  try {
    await api.delete("/auth/logout");
  } catch (error) {
    // Log error but don't throw - we still want to clear local state
    console.error("Logout API call failed:", error);
  }

  // Always clear local tokens regardless of API response
  const { removeToken } = await import("@/lib/auth/storage");
  removeToken(); // This now also clears refresh token
}

/**
 * Refresh access token using refresh token
 * POST /auth/refresh
 */
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    console.error("No refresh token available");
    return null;
  }

  try {
    const response = await api.post<{ message?: string; access_token?: string }>("/auth/refresh", {
      refresh_token: refreshToken
    });

    // Extract new access token from response headers
    let newAccessToken = extractTokenFromHeaders(response.headers);
    if (!newAccessToken) {
      newAccessToken = response.data.access_token || null;
    }

    if (newAccessToken) {
      const expiry = getTokenExpiry(newAccessToken);
      setToken(newAccessToken, expiry || undefined);
      return newAccessToken;
    }

    return null;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    // If refresh fails, clear all tokens (invalid refresh token)
    const { removeToken } = await import("@/lib/auth/storage");
    removeToken();
    removeRefreshToken();
    return null;
  }
}

/**
 * Request password reset
 * POST /auth/password
 */
export async function requestPasswordReset(data: PasswordResetRequest): Promise<void> {
  await api.post("/auth/password", { user: data });
}

/**
 * Complete password reset
 * PATCH /auth/password
 */
export async function resetPassword(data: PasswordReset): Promise<void> {
  await api.patch("/auth/password", { user: data });
}

/**
 * Get current user
 * This function has been removed to avoid circular dependencies.
 * User data should be accessed directly from the auth store.
 */

/**
 * Validate current token
 * Checks JWT expiry client-side and validates token structure
 */
export async function validateToken(): Promise<boolean> {
  try {
    const { getToken, parseJwtPayload } = await import("@/lib/auth/storage");
    const token = getToken();

    if (!token) {
      return false;
    }

    // Parse JWT to check expiry
    const payload = parseJwtPayload(token);
    if (!payload) {
      return false;
    }

    // Check if token has expired (exp is in seconds)
    if (payload.exp) {
      const expiryMs = payload.exp * 1000;
      if (Date.now() > expiryMs) {
        return false;
      }
    }

    // Token structure is valid and not expired
    return true;
  } catch (error) {
    console.error("Token validation failed:", error);
    return false;
  }
}
