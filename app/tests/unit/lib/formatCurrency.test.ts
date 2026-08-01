/**
 * Tests for currency formatting of Stripe minor-unit amounts.
 */

import { currencyFractionDigits, formatCurrency } from "@/lib/formatCurrency";

// formatCurrency formats in the runtime's default locale (Intl locale
// `undefined`). Pin it to en-US so the assertions below don't depend on the
// machine's system locale.
const OriginalNumberFormat = Intl.NumberFormat;
beforeAll(() => {
  jest
    .spyOn(Intl, "NumberFormat")
    .mockImplementation((locales, options) => new OriginalNumberFormat(locales ?? "en-US", options));
});
afterAll(() => {
  jest.restoreAllMocks();
});

const PRICE_OPTIONS = { minimumFractionDigits: 0, maximumFractionDigits: 2 };

describe("formatCurrency", () => {
  it("scales a two-decimal currency by 100", () => {
    expect(formatCurrency(799, "gbp", PRICE_OPTIONS)).toContain("7.99");
  });

  it("does not scale a Stripe zero-decimal currency", () => {
    const result = formatCurrency(500, "jpy", PRICE_OPTIONS);
    expect(result).toContain("500");
    expect(result).not.toContain("5.00");
  });

  it("scales a Stripe three-decimal currency by 1000", () => {
    expect(formatCurrency(1500, "kwd", { minimumFractionDigits: 3, maximumFractionDigits: 3 })).toContain("1.500");
  });

  it("scales a Stripe hundredfold zero-decimal currency by 100 (HUF)", () => {
    const result = formatCurrency(149900, "huf", PRICE_OPTIONS);
    expect(result).toContain("1,499");
    expect(result).not.toContain("149,900");
  });

  // Intl/CLDR reports these as zero-decimal, but Stripe still bills them in
  // 1/100ths. Trusting Intl for the divisor rendered them 100x too high.
  it.each([
    ["rsd", 39900, "399"],
    ["isk", 39900, "399"],
    ["all", 39900, "399"]
  ])("scales %s by 100 despite Intl reporting it as zero-decimal", (currency, amount, expected) => {
    const result = formatCurrency(amount, currency, PRICE_OPTIONS);
    expect(result).toContain(expected);
    expect(result).not.toContain("39,900");
  });

  it("accepts a lowercase currency code", () => {
    expect(formatCurrency(1050, "eur", PRICE_OPTIONS)).toContain("10.5");
  });

  it("disambiguates dollar-family currencies", () => {
    expect(formatCurrency(599, "sgd", PRICE_OPTIONS)).toMatch(/S\$/);
    expect(formatCurrency(599, "usd", PRICE_OPTIONS)).not.toMatch(/US\$/);
  });
});

describe("currencyFractionDigits", () => {
  it("reports display digits for a two-decimal currency", () => {
    expect(currencyFractionDigits("GBP")).toBe(2);
  });

  it("reports zero display digits for HUF despite Intl reporting two", () => {
    expect(currencyFractionDigits("HUF")).toBe(0);
  });

  // RSD is billed in 1/100ths but displayed whole, so display digits and the
  // minor-unit exponent deliberately diverge.
  it("reports zero display digits for RSD", () => {
    expect(currencyFractionDigits("RSD")).toBe(0);
  });
});
