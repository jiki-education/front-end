/**
 * Pricing Configuration
 * Membership tiers, price formatting, and tier-inclusion logic.
 *
 * Tier display copy (names, descriptions, feature lists) lives in the message
 * catalog under `subscription.tiers.*` and is read via `useTranslations` at the
 * call site. Real prices come from the external pricing API (see
 * `useExternalPremiumPrices` / `PremiumPrice`), not from any hardcoded literal.
 */

import { currencyNumberFormat } from "./formatCurrency";

export type MembershipTier = "standard" | "premium";

export type BillingInterval = "monthly" | "annual";

export interface PremiumPrices {
  currency: string;
  monthly: number;
  annual: number;
  country_code: string | null;
}

// Prices arrive as minor units (e.g. cents/pence), so scale by the currency's
// fraction digits before formatting.
function currencyFractionDigits(currency: string): number {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).resolvedOptions().minimumFractionDigits ?? 2;
}

/**
 * Formats the monthly Premium price in the visitor's locale, e.g. "£6" or
 * "$9.99", using the currency's narrow symbol and no trailing zeroes.
 */
export function formatMonthlyPrice(prices: PremiumPrices): string {
  const currency = prices.currency.toUpperCase();
  const amount = prices.monthly / Math.pow(10, currencyFractionDigits(currency));

  return currencyNumberFormat({
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

// Helper to check if a tier includes another tier's features
export function tierIncludes(userTier: MembershipTier, requiredTier: MembershipTier): boolean {
  const tierOrder: MembershipTier[] = ["standard", "premium"];
  const userIndex = tierOrder.indexOf(userTier);
  const requiredIndex = tierOrder.indexOf(requiredTier);
  return userIndex >= requiredIndex;
}
