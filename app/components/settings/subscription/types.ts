/**
 * Comprehensive TypeScript types for subscription management system
 * Updated to match real Jiki system types
 */

import type { MembershipTier } from "@/lib/pricing";
import type { User } from "@/types/auth";
import type { SubscriptionStatus } from "@/types/subscription";

// Re-export real system types
export type { MembershipTier, User, SubscriptionStatus };

// Subscription state for UI logic
export type SubscriptionState =
  | "never_subscribed"
  | "incomplete_payment"
  | "active_premium"
  | "cancelling_scheduled"
  | "payment_failed_grace"
  | "payment_failed_expired"
  | "previously_subscribed"
  | "incomplete_expired";

// Updated to match real user subscription structure
export interface SubscriptionData {
  tier?: MembershipTier;
  status?: SubscriptionStatus;
  nextBillingDate?: string;
  cancellationDate?: string;
  graceEndDate?: string;
  lastPaymentAttempt?: string;
  previousTier?: Exclude<MembershipTier, "standard">;
  lastActiveDate?: string;
}

export interface SubscriptionActions {
  onUpgradeToPremium: () => void | Promise<void>;
  onUpdatePayment: () => void | Promise<void>;
  onCancel: () => void | Promise<void>;
  onReactivate: () => void | Promise<void>;
  onRetryPayment: () => void | Promise<void>;
  onResubscribeToPremium: () => void | Promise<void>;
  onCompletePayment: () => void | Promise<void>;
  onTryPremiumAgain: () => void | Promise<void>;
}

export interface SubscriptionStateProps {
  isLoading?: boolean;
}

// Error handling types
export interface SubscriptionError {
  code: string;
  message: string;
  recoverable: boolean;
}
