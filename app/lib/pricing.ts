/**
 * Pricing Configuration
 * Defines subscription tiers, pricing, and features
 */

export type MembershipTier = "standard" | "premium" | "max";

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
    name: "Standard",
    price: 0,
    description: "Perfect for getting started",
    features: ["Access to free courses", "Basic coding exercises", "Community support"]
  },
  premium: {
    id: "premium",
    name: "Premium",
    price: 3,
    description: "Unlock advanced features",
    features: ["All Standard features", "Access to premium courses", "Advanced coding exercises", "Priority support"],
    highlighted: true
  },
  max: {
    id: "max",
    name: "Max",
    price: 10,
    description: "Everything you need to master coding",
    features: [
      "All Premium features",
      "Unlimited AI assistance",
      "One-on-one mentorship",
      "Career guidance",
      "Certification programs"
    ]
  }
};

// Helper to get tier by ID
export function getPricingTier(tier: MembershipTier): PricingTier {
  return PRICING_TIERS[tier];
}

// Helper to check if a tier includes another tier's features
export function tierIncludes(userTier: MembershipTier, requiredTier: MembershipTier): boolean {
  const tierOrder: MembershipTier[] = ["standard", "premium", "max"];
  const userIndex = tierOrder.indexOf(userTier);
  const requiredIndex = tierOrder.indexOf(requiredTier);
  return userIndex >= requiredIndex;
}

// Get all tiers in order
export function getAllTiers(): PricingTier[] {
  return [PRICING_TIERS.standard, PRICING_TIERS.premium, PRICING_TIERS.max];
}
