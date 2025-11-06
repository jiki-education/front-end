/**
 * Tests for pricing configuration
 */

import { getPricingTier, tierIncludes, getAllTiers, PRICING_TIERS, type MembershipTier } from "@/lib/pricing";

describe("PRICING_TIERS", () => {
  it("defines standard tier correctly", () => {
    expect(PRICING_TIERS.standard).toEqual({
      id: "standard",
      name: "Standard",
      price: 0,
      description: "Perfect for getting started",
      features: ["Access to free courses", "Basic coding exercises", "Community support"]
    });
  });

  it("defines premium tier correctly", () => {
    expect(PRICING_TIERS.premium).toEqual({
      id: "premium",
      name: "Premium",
      price: 3,
      description: "Unlock advanced features",
      features: ["All Standard features", "Access to premium courses", "Advanced coding exercises", "Priority support"],
      highlighted: true
    });
  });

  it("defines max tier correctly", () => {
    expect(PRICING_TIERS.max).toEqual({
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
    });
  });

  it("has prices in ascending order", () => {
    expect(PRICING_TIERS.standard.price).toBeLessThan(PRICING_TIERS.premium.price);
    expect(PRICING_TIERS.premium.price).toBeLessThan(PRICING_TIERS.max.price);
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
    expect(tier.price).toBe(3);
  });

  it("returns max tier", () => {
    const tier = getPricingTier("max");
    expect(tier.id).toBe("max");
    expect(tier.price).toBe(10);
  });
});

describe("tierIncludes", () => {
  it("standard tier includes standard features", () => {
    expect(tierIncludes("standard", "standard")).toBe(true);
  });

  it("standard tier does not include premium features", () => {
    expect(tierIncludes("standard", "premium")).toBe(false);
  });

  it("standard tier does not include max features", () => {
    expect(tierIncludes("standard", "max")).toBe(false);
  });

  it("premium tier includes standard features", () => {
    expect(tierIncludes("premium", "standard")).toBe(true);
  });

  it("premium tier includes premium features", () => {
    expect(tierIncludes("premium", "premium")).toBe(true);
  });

  it("premium tier does not include max features", () => {
    expect(tierIncludes("premium", "max")).toBe(false);
  });

  it("max tier includes standard features", () => {
    expect(tierIncludes("max", "standard")).toBe(true);
  });

  it("max tier includes premium features", () => {
    expect(tierIncludes("max", "premium")).toBe(true);
  });

  it("max tier includes max features", () => {
    expect(tierIncludes("max", "max")).toBe(true);
  });

  // Test all tier combinations for completeness
  const tiers: MembershipTier[] = ["standard", "premium", "max"];
  tiers.forEach((userTier) => {
    tiers.forEach((requiredTier) => {
      const tierOrder = { standard: 0, premium: 1, max: 2 };
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
    expect(tiers).toHaveLength(3);
    expect(tiers[0].id).toBe("standard");
    expect(tiers[1].id).toBe("premium");
    expect(tiers[2].id).toBe("max");
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
    expect(tiers[2]).toBe(PRICING_TIERS.max);
  });
});
