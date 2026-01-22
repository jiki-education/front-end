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

// State-specific prop interfaces
export interface NeverSubscribedProps extends SubscriptionStateProps {
  onUpgradeToPremium: SubscriptionActions["onUpgradeToPremium"];
}

export interface ActiveSubscriptionProps extends SubscriptionStateProps {
  nextBillingDate?: string;
  onUpdatePayment: SubscriptionActions["onUpdatePayment"];
  onCancel: SubscriptionActions["onCancel"];
}

export type ActivePremiumProps = ActiveSubscriptionProps;

export interface CancellingScheduledProps extends SubscriptionStateProps {
  cancellationDate: string;
  tier: Exclude<MembershipTier, "standard">;
  onReactivate: SubscriptionActions["onReactivate"];
  onUpdatePayment: SubscriptionActions["onUpdatePayment"];
}

export interface PaymentFailedGraceProps extends SubscriptionStateProps {
  tier: Exclude<MembershipTier, "standard">;
  graceEndDate: string;
  lastPaymentAttempt?: string;
  onUpdatePayment: SubscriptionActions["onUpdatePayment"];
  onRetryPayment: SubscriptionActions["onRetryPayment"];
}

export interface PaymentFailedExpiredProps extends SubscriptionStateProps {
  previousTier: Exclude<MembershipTier, "standard">;
  onResubscribeToPremium: SubscriptionActions["onResubscribeToPremium"];
}

export interface PreviouslySubscribedProps extends SubscriptionStateProps {
  previousTier: Exclude<MembershipTier, "standard">;
  lastActiveDate?: string;
  onResubscribeToPremium: SubscriptionActions["onResubscribeToPremium"];
}

export interface IncompletePaymentProps extends SubscriptionStateProps {
  tier: Exclude<MembershipTier, "standard">;
  onCompletePayment: SubscriptionActions["onCompletePayment"];
}

export interface IncompleteExpiredProps extends SubscriptionStateProps {
  onTryPremiumAgain: SubscriptionActions["onTryPremiumAgain"];
}

// Error handling types
export interface SubscriptionError {
  code: string;
  message: string;
  recoverable: boolean;
}

// API response types
export interface SubscriptionApiResponse {
  state: SubscriptionState;
  data: SubscriptionData;
  error?: SubscriptionError;
}

// Plan information types
export interface PlanInfo {
  id: string;
  name: string;
  price: string;
  priceAmount: number;
  currency: string;
  interval: "month" | "year";
  features: string[];
}

export interface PlansConfig {
  premium: PlanInfo;
}

export const PLANS: PlansConfig = {
  premium: {
    id: "premium",
    name: "Premium",
    price: "$3.99",
    priceAmount: 3.99,
    currency: "USD",
    interval: "month",
    features: ["Unlimited AI help", "Access to all exercises", "Certificates", "Ad-free experience"]
  }
} as const;
