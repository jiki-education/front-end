/**
 * How a user holds (or doesn't hold) Premium, which decides what the
 * settings page shows them.
 */

import type { User } from "@/types/auth";

export type MembershipKind =
  // Bought Premium outright. Nothing to renew or cancel.
  | "lifetime"
  // A legacy Stripe subscription that is still live (active, incomplete,
  // payment_failed or cancelling). These members keep the subscription UI.
  | "subscription"
  // Premium from somewhere other than Stripe, e.g. an Exercism membership.
  | "premium"
  // No Premium. Includes former subscribers whose subscription has ended.
  | "free";

export function getMembershipKind(user: User): MembershipKind {
  if (user.lifetime_premium) {
    return "lifetime";
  }
  if (user.subscription) {
    return "subscription";
  }
  if (user.membership_type === "premium") {
    return "premium";
  }
  return "free";
}
