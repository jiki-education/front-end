import type { MembershipTier } from "@/lib/pricing";

/**
 * English-only tier display copy for the /dev Stripe test harness.
 *
 * /dev routes are never localized, so they keep a small local map rather than
 * depending on the catalog-bound `subscription.tiers.*` messages used by the
 * real subscription UI.
 */
export const DEV_TIER_DISPLAY: Record<MembershipTier, { name: string; description: string }> = {
  standard: { name: "Free", description: "Perfect for getting started" },
  premium: { name: "Premium", description: "Unlock advanced features" }
};
