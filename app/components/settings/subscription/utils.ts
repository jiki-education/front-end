/**
 * Subscription state detection utilities
 * Extracted from stripe branch test implementation
 */

import type { User } from "@/types/auth";

export type SubscriptionState =
  | "never_subscribed"
  | "incomplete_payment"
  | "active_premium"
  | "active_max"
  | "cancelling_scheduled"
  | "payment_failed_grace"
  | "payment_failed_expired"
  | "previously_subscribed"
  | "incomplete_expired";

/**
 * Determines the current subscription state based on user data
 * This logic is copied exactly from the stripe branch implementation
 */
export function getSubscriptionState(user: User): SubscriptionState {
  // eslint-disable-next-line @typescript-eslint/naming-convention -- API uses snake_case
  const { subscription_status, membership_type } = user;

  // Active subscriptions
  if (subscription_status === "active") {
    if (membership_type === "premium") {
      return "active_premium";
    }
    if (membership_type === "max") {
      return "active_max";
    }
    // Handle edge case: active status with standard tier
    // TypeScript infers this must be "standard" since premium/max are already handled
    console.warn(
      "Detected user with active subscription status but standard tier. " +
        "This may indicate a data sync issue between Stripe and the application. " +
        "Treating as previously subscribed.",
      { subscription_status, membership_type, user_id: user.id }
    );
    return "previously_subscribed";
  }

  // Cancelling (scheduled for end of period)
  if (subscription_status === "cancelling") {
    return "cancelling_scheduled";
  }

  // Payment failed with grace period
  if (user.subscription?.in_grace_period) {
    return "payment_failed_grace";
  }

  // Payment failed, grace period expired
  if (subscription_status === "payment_failed") {
    return "payment_failed_expired";
  }

  // Previously subscribed (canceled)
  if (subscription_status === "canceled") {
    return "previously_subscribed";
  }

  // Incomplete payment (awaiting confirmation)
  if (subscription_status === "incomplete") {
    return "incomplete_payment";
  }

  // Incomplete payment expired (session abandoned/expired)
  if (subscription_status === "incomplete_expired") {
    return "incomplete_expired";
  }

  // Default fallback for truly never subscribed users
  return "never_subscribed";
}
