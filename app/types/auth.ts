/**
 * Authentication Types
 * Type definitions for authentication system
 */

import type { MembershipTier } from "@/lib/pricing";
import type { SubscriptionStatus, SubscriptionDetails } from "./subscription";

export interface User {
  handle: string;
  email: string;
  name: string | null;
  membership_type: MembershipTier;
  subscription_status: SubscriptionStatus;
  subscription: SubscriptionDetails | null;
  provider: string;
  email_confirmed: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  password_confirmation: string;
  name?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  reset_password_token: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  message?: string;
}

export interface ApiError {
  error: {
    type: string;
    message: string;
    errors?: Record<string, string[]>;
  };
}

export interface RailsAuthResponse {
  user?: User;
  message?: string;
  error?: {
    type: string;
    message: string;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
