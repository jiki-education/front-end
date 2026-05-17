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
  avatar_url: string | null;
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

export interface SignupAttribution {
  referrer: string | null;
  landing_path: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  captured_at: string;
}

export interface SignupData {
  email: string;
  password: string;
  password_confirmation: string;
  name?: string;
  attribution?: SignupAttribution | null;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  reset_password_token: string;
  password: string;
  password_confirmation: string;
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
