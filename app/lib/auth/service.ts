/**
 * Authentication Service
 * API integration for authentication endpoints
 */

import { api } from "@/lib/api";
import { getTokenExpiry, setToken, setRefreshToken } from "@/lib/auth/storage";
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
 * Google OAuth login
 * POST /auth/google
 */
export async function googleLogin(credential: string): Promise<User> {
  const response = await api.post<AuthResponse>("/auth/google", { token: credential });

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
 * This now uses the standalone refresh module to avoid circular dependencies
 */
export async function refreshAccessToken(): Promise<string | null> {
  const { refreshAccessToken: performRefresh } = await import("@/lib/auth/refresh");
  return performRefresh();
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
 * Get current user from /internal/me endpoint
 * GET /internal/me
 */
export async function getCurrentUser(): Promise<User> {
  const response = await api.get<{ user: User }>("/internal/me");
  return response.data.user;
}

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
