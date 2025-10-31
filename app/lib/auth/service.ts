/**
 * Authentication Service
 * API integration for authentication endpoints
 */

import { api } from "@/lib/api";
import { getTokenExpiry, setToken } from "@/lib/auth/storage";
import type {
  AuthResponse,
  EmailConfirmationResponse,
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
 * POST /v1/auth/login
 */
export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await api.post<AuthResponse>("/auth/login", { user: credentials });

  // Try to extract JWT from response headers first
  let token = extractTokenFromHeaders(response.headers);

  // If not in headers, check response body
  if (!token) {
    token = response.data.token || response.data.jwt || response.data.access_token || null;
  }

  if (token) {
    const expiry = getTokenExpiry(token);
    setToken(token, expiry || undefined);
  }

  return response.data.user;
}

/**
 * User signup
 * POST /v1/auth/signup
 */
export async function signup(userData: SignupData): Promise<User> {
  const response = await api.post<AuthResponse>("/auth/signup", { user: userData });

  // Try to extract JWT from response headers first
  let token = extractTokenFromHeaders(response.headers);

  // If not in headers, check response body
  if (!token) {
    token = response.data.token || response.data.jwt || response.data.access_token || null;
  }

  if (token) {
    const expiry = getTokenExpiry(token);
    setToken(token, expiry || undefined);
  }

  return response.data.user;
}

/**
 * User logout
 * DELETE /v1/auth/logout
 */
export async function logout(): Promise<void> {
  try {
    await api.delete("/auth/logout");
  } catch (error) {
    // Log error but don't throw - we still want to clear local state
    console.error("Logout API call failed:", error);
  }

  // Always clear local token regardless of API response
  const { removeToken } = await import("@/lib/auth/storage");
  removeToken();
}

/**
 * Request password reset
 * POST /v1/auth/password
 */
export async function requestPasswordReset(data: PasswordResetRequest): Promise<void> {
  await api.post("/auth/password", { user: data });
}

/**
 * Complete password reset
 * PATCH /v1/auth/password
 */
export async function resetPassword(data: PasswordReset): Promise<void> {
  await api.patch("/auth/password", { user: data });
}

/**
 * Confirm email address
 * GET /v1/auth/confirmation?confirmation_token=token
 */
export async function confirmEmail(token: string): Promise<EmailConfirmationResponse> {
  const response = await api.get<EmailConfirmationResponse>("/auth/confirmation", {
    params: { confirmation_token: token }
  });
  return response.data;
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
