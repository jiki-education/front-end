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

export type BillingInterval = "monthly" | "annual";

export interface PremiumPrices {
  currency: string;
  monthly: number;
  annual: number;
  country_code: string | null;
}

/**
 * Formats the monthly Premium price in the visitor's locale, e.g. "£6" or
 * "$9.99", using the currency's narrow symbol and no trailing zeroes.
 *
 * Prices arrive as Stripe minor units (e.g. cents/pence); formatCurrency owns
 * the conversion to display units.
 */
export function formatMonthlyPrice(prices: PremiumPrices): string {
  return formatCurrency(prices.monthly, prices.currency, {
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
