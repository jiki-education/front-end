"use client";

/**
 * Token Refresh Module
 * Standalone refresh logic using Server Actions
 */

import { refreshTokenAction } from "@/lib/auth/actions";

// Refresh state management - centralized to prevent race conditions
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * Refresh access token using Server Action
 * The Server Action reads the refresh token from httpOnly cookie and updates the access token cookie
 */
export async function refreshAccessToken(): Promise<string | null> {
  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  // Set refreshing state and create promise
  isRefreshing = true;
  refreshPromise = performRefresh();

  try {
    return await refreshPromise;
  } finally {
    // Always reset state when done
    isRefreshing = false;
    refreshPromise = null;
  }
}

/**
 * Perform the actual refresh via Server Action
 */
async function performRefresh(): Promise<string | null> {
  try {
    const result = await refreshTokenAction();

    if (!result.success) {
      return null;
    }

    // Token already updated in httpOnly cookie by Server Action
    // Return placeholder to indicate success
    return "refreshed";
  } catch {
    return null;
  }
}

/**
 * Check if currently refreshing (useful for debugging/testing)
 */
export function isCurrentlyRefreshing(): boolean {
  return isRefreshing;
}
