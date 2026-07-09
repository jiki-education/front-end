/**
 * Pricing Configuration
 * Defines subscription tiers, pricing, and features
 */

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

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

export interface PricingTier {
  id: MembershipTier;
  name: string;
  price: number; // Monthly price in dollars
  description: string;
  features: string[];
  highlighted?: boolean; // For UI emphasis
}

// Pricing tier definitions
export const PRICING_TIERS: Record<MembershipTier, PricingTier> = {
  standard: {
    id: "standard",
    name: "Free",
    price: 0,
    description: "Perfect for getting started",
    features: ["Access to free courses", "Basic coding exercises", "Community support", "1 AI help per month"]
  },
  premium: {
    id: "premium",
    name: "Premium",
    price: 3.99,
    description: "Unlock advanced features",
    features: [
      "All Free features",
      "Unlimited AI help",
      "Access to all exercises",
      "Certificates",
      "Ad-free experience"
    ],
    highlighted: true
  }
};

// Helper to get tier by ID
export function getPricingTier(tier: MembershipTier): PricingTier {
  return PRICING_TIERS[tier];
}

// Helper to check if a tier includes another tier's features
export function tierIncludes(userTier: MembershipTier, requiredTier: MembershipTier): boolean {
  const tierOrder: MembershipTier[] = ["standard", "premium"];
  const userIndex = tierOrder.indexOf(userTier);
  const requiredIndex = tierOrder.indexOf(requiredTier);
  return userIndex >= requiredIndex;
}

// Get all tiers in order
export function getAllTiers(): PricingTier[] {
  return [PRICING_TIERS.standard, PRICING_TIERS.premium];
}
