/**
 * Tests for pricing configuration
 */

import {
  getPricingTier,
  tierIncludes,
  getAllTiers,
  formatMonthlyPrice,
  PRICING_TIERS,
  type MembershipTier,
  type PremiumPrices
} from "@/lib/pricing";

describe("PRICING_TIERS", () => {
  it("defines standard tier correctly", () => {
    expect(PRICING_TIERS.standard).toEqual({
      id: "standard",
      name: "Free",
      price: 0,
      description: "Perfect for getting started",
      features: ["Access to free courses", "Basic coding exercises", "Community support", "1 AI help per month"]
    });
  });

  it("defines premium tier correctly", () => {
    expect(PRICING_TIERS.premium).toEqual({
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
    });
  });

  // Max tier removed - only standard and premium now

  it("has prices in ascending order", () => {
    expect(PRICING_TIERS.standard.price).toBeLessThan(PRICING_TIERS.premium.price);
  });
});

describe("getPricingTier", () => {
  it("returns standard tier", () => {
    const tier = getPricingTier("standard");
    expect(tier.id).toBe("standard");
    expect(tier.price).toBe(0);
  });

  it("returns premium tier", () => {
    const tier = getPricingTier("premium");
    expect(tier.id).toBe("premium");
    expect(tier.price).toBe(3.99);
  });

  // Max tier removed - only standard and premium now
});

describe("tierIncludes", () => {
  it("standard tier includes standard features", () => {
    expect(tierIncludes("standard", "standard")).toBe(true);
  });

  it("standard tier does not include premium features", () => {
    expect(tierIncludes("standard", "premium")).toBe(false);
  });

  // Max tier removed - only standard and premium now

  it("premium tier includes standard features", () => {
    expect(tierIncludes("premium", "standard")).toBe(true);
  });

  it("premium tier includes premium features", () => {
    expect(tierIncludes("premium", "premium")).toBe(true);
  });

  // Max tier removed - only standard and premium now

  // Max tier removed - only standard and premium now

  // Test all tier combinations for completeness
  const tiers: MembershipTier[] = ["standard", "premium"];
  tiers.forEach((userTier) => {
    tiers.forEach((requiredTier) => {
      const tierOrder = { standard: 0, premium: 1 };
      const expected = tierOrder[userTier] >= tierOrder[requiredTier];

      it(`${userTier} ${expected ? "includes" : "does not include"} ${requiredTier}`, () => {
        expect(tierIncludes(userTier, requiredTier)).toBe(expected);
      });
    });
  });
});

describe("getAllTiers", () => {
  it("returns all tiers in correct order", () => {
    const tiers = getAllTiers();
    expect(tiers).toHaveLength(2);
    expect(tiers[0].id).toBe("standard");
    expect(tiers[1].id).toBe("premium");
  });

  it("returns tier objects with all required properties", () => {
    const tiers = getAllTiers();
    tiers.forEach((tier) => {
      expect(tier).toHaveProperty("id");
      expect(tier).toHaveProperty("name");
      expect(tier).toHaveProperty("price");
      expect(tier).toHaveProperty("description");
      expect(tier).toHaveProperty("features");
      expect(Array.isArray(tier.features)).toBe(true);
    });
  });

  it("returns the same objects as PRICING_TIERS", () => {
    const tiers = getAllTiers();
    expect(tiers[0]).toBe(PRICING_TIERS.standard);
    expect(tiers[1]).toBe(PRICING_TIERS.premium);
  });
});

describe("formatMonthlyPrice", () => {
  function prices(overrides: Partial<PremiumPrices>): PremiumPrices {
    return { currency: "usd", monthly: 999, annual: 9900, country_code: "US", ...overrides };
  }

  it("formats a two-decimal currency by scaling minor units", () => {
    // 799 pence -> £7.99
    const result = formatMonthlyPrice(prices({ currency: "gbp", monthly: 799 }));
    expect(result).toContain("£");
    expect(result).toContain("7.99");
  });

  it("formats a zero-decimal currency without dividing by 100", () => {
    // JPY has no minor unit, so 500 stays 500, not 5.00
    const result = formatMonthlyPrice(prices({ currency: "jpy", monthly: 500 }));
    expect(result).toContain("500");
    expect(result).not.toContain("5.00");
  });

  it("drops trailing zeroes on a whole amount", () => {
    // £6, not £6.00
    const result = formatMonthlyPrice(prices({ currency: "gbp", monthly: 600 }));
    expect(result).toContain("6");
    expect(result).not.toContain(".00");
  });

  it("accepts a lowercase currency code", () => {
    // 1050 cents -> €10.50
    const result = formatMonthlyPrice(prices({ currency: "eur", monthly: 1050 }));
    expect(result).toContain("10.5");
  });

  it("uses the narrow currency symbol rather than the code", () => {
    const result = formatMonthlyPrice(prices({ currency: "usd", monthly: 999 }));
    expect(result).toContain("$");
    expect(result).not.toContain("USD");
  });
});
