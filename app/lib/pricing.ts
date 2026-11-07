/**
 * Pricing Configuration
 * Membership tiers, price formatting, and tier-inclusion logic.
 *
 * Tier display copy (names, descriptions, feature lists) lives in the message
 * catalog under `subscription.tiers.*` and is read via `useTranslations` at the
 * call site. Real prices come from the external pricing API (see
 * `useExternalPremiumPrices` / `PremiumPrice`), not from any hardcoded literal.
 */

import { formatCurrency } from "./formatCurrency";

export type MembershipTier = "standard" | "premium";

// What a new member pays for Premium: one lifetime amount in the visitor's
// local currency. The API also still sends `monthly` and `annual` for the
// legacy subscription Prices, but nothing displays them: a subscriber's own
// price comes from `user.subscription` (see `SubscriptionDetails`).
export interface PremiumPrices {
  currency: string;
  lifetime: number;
  country_code: string | null;
}

/**
 * Formats the one-off Premium price in the visitor's locale, e.g. "£24.99" or
 * "$29.99", using the currency's narrow symbol and no trailing zeroes.
 *
 * Prices arrive as Stripe minor units (e.g. cents/pence); formatCurrency owns
 * the conversion to display units.
 */
export function formatPremiumPrice(prices: PremiumPrices): string {
  return formatPrice(prices.lifetime, prices.currency);
}

/**
 * Formats any Premium amount (a lifetime price or a legacy subscription's
 * renewal amount) the same way as `formatPremiumPrice`.
 */
export function formatPrice(amountInMinorUnits: number, currency: string): string {
  return formatCurrency(amountInMinorUnits, currency, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

// Helper to check if a tier includes another tier's features
export function tierIncludes(userTier: MembershipTier, requiredTier: MembershipTier): boolean {
  const tierOrder: MembershipTier[] = ["standard", "premium"];
  const userIndex = tierOrder.indexOf(userTier);
  const requiredIndex = tierOrder.indexOf(requiredTier);
  return userIndex >= requiredIndex;
}
