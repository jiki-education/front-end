/**
 * Tests for pricing configuration
 */

import { tierIncludes, formatMonthlyPrice, type MembershipTier, type PremiumPrices } from "@/lib/pricing";

describe("tierIncludes", () => {
  it("standard tier includes standard features", () => {
    expect(tierIncludes("standard", "standard")).toBe(true);
  });

  it("standard tier does not include premium features", () => {
    expect(tierIncludes("standard", "premium")).toBe(false);
  });

  it("premium tier includes standard features", () => {
    expect(tierIncludes("premium", "standard")).toBe(true);
  });

  it("premium tier includes premium features", () => {
    expect(tierIncludes("premium", "premium")).toBe(true);
  });

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

describe("formatMonthlyPrice", () => {
  // formatMonthlyPrice formats in the runtime's default locale (Intl locale
  // `undefined`). Pin it to en-US here so the dot-decimal assertions below don't
  // depend on the machine's system locale (e.g. hu-HU renders "7,99 £").
  const OriginalNumberFormat = Intl.NumberFormat;
  beforeAll(() => {
    jest
      .spyOn(Intl, "NumberFormat")
      .mockImplementation((locales, options) => new OriginalNumberFormat(locales ?? "en-US", options));
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

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
