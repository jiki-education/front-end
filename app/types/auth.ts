/**
 * Authentication Types
 * Type definitions for authentication system
 */

import type { MembershipTier, PremiumPrices } from "@/lib/pricing";
import type { SubscriptionStatus, SubscriptionDetails } from "./subscription";

export interface User {
  handle: string;
  email: string;
  name: string | null;
  membership_type: MembershipTier;
  subscription_status: SubscriptionStatus;
  subscription: SubscriptionDetails | null;
  premium_prices: PremiumPrices;
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

// 2FA Response Types
export interface TwoFactorSetupRequired {
  status: "2fa_setup_required";
  provisioning_uri: string;
}

export interface TwoFactorRequired {
  status: "2fa_required";
}

export interface LoginSuccess {
  status: "success";
  user: User;
}

export type LoginResponse = LoginSuccess | TwoFactorSetupRequired | TwoFactorRequired;

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
