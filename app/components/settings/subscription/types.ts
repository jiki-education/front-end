/**
 * Subscription management system types
 */

import type { MembershipTier } from "@/lib/pricing";
import type { User } from "@/types/auth";
import type { SubscriptionStatus } from "@/types/subscription";

// Re-export real system types
export type { MembershipTier, User, SubscriptionStatus };

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
