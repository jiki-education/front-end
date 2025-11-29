/**
 * Token Refresh Module
 * Standalone refresh logic that doesn't depend on the API client to avoid circular dependencies
 */

import { getRefreshToken, setAccessToken, removeRefreshToken } from "@/lib/auth/storage";
import { getApiUrl } from "@/lib/api/config";

interface RefreshResponse {
  message?: string;
  access_token?: string;
}

// Refresh state management - centralized to prevent race conditions
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

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
 * Refresh access token using refresh token
 * This is a standalone implementation that doesn't use the API client
 * to avoid circular dependencies
 */
export async function refreshAccessToken(): Promise<string | null> {
  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    console.error("No refresh token available");
    return null;
  }

  // Set refreshing state and create promise
  isRefreshing = true;
  refreshPromise = performRefresh(refreshToken);

  try {
    return await refreshPromise;
  } finally {
    // Always reset state when done
    isRefreshing = false;
    refreshPromise = null;
  }
}

/**
 * Perform the actual refresh request
 */
async function performRefresh(refreshToken: string): Promise<string | null> {
  try {
    const url = getApiUrl("/auth/refresh");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        refresh_token: refreshToken
      })
    });

    if (!response.ok) {
      console.error("Refresh token request failed:", response.status, response.statusText);
      // Only remove refresh token if it's invalid (401 Unauthorized)
      // For other errors (5xx, network issues), keep tokens for retry
      if (response.status === 401) {
        console.error("Refresh token invalid or expired");
        removeRefreshToken();
      } else {
        console.error("Refresh failed with status", response.status, "- keeping tokens for retry");
      }
      return null;
    }

    // Parse response
    let data: RefreshResponse;
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      console.error("Invalid response content type from refresh endpoint");
      return null;
    }

    // Extract new access token from response headers first
    let newAccessToken = extractTokenFromHeaders(response.headers);

    // If not in headers, check response body
    if (!newAccessToken) {
      newAccessToken = data.access_token || null;
    }

    if (newAccessToken) {
      // Store new access token
      setAccessToken(newAccessToken);
      return newAccessToken;
    }

    console.error("No access token in refresh response");
    return null;
  } catch (error) {
    // Network error or other exception - keep tokens, might work on retry
    console.error("Network error during token refresh, keeping tokens:", error);
    return null;
  }
}

/**
 * Check if currently refreshing (useful for debugging/testing)
 */
export function isCurrentlyRefreshing(): boolean {
  return isRefreshing;
}
