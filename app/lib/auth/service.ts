"use client";

/**
 * Authentication Service
 * API integration for authentication endpoints
 *
 * Note: Login/signup/logout are now handled by Server Actions in @/lib/auth/actions.ts
 * This file contains only the remaining API integration functions
 */

import { api } from "@/lib/api";
import type { PasswordReset, PasswordResetRequest, User } from "@/types/auth";

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
 * Resend confirmation instructions
 * POST /auth/confirmation
 */
export async function resendConfirmation(email: string): Promise<void> {
  await api.post("/auth/confirmation", { user: { email } });
}

/**
 * Confirm email address with token
 * GET /auth/confirmation?confirmation_token=TOKEN
 * Returns the user (auto-logged in via session cookie)
 */
export async function confirmEmail(token: string): Promise<User> {
  const response = await api.get<{ user: User }>(`/auth/confirmation?confirmation_token=${encodeURIComponent(token)}`);
  return response.data.user;
}

/**
 * Get current user from /internal/me endpoint
 * GET /internal/me
 */
export async function getCurrentUser(useRetries: boolean = true): Promise<User> {
  const response = await api.get<{ user: User }>("/internal/me", undefined, useRetries);
  return response.data.user;
}
