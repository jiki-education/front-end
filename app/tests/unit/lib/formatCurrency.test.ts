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

  it("leaves USD as a bare dollar amount", () => {
    expect(formatCurrency(2999, "usd", PRICE_OPTIONS)).toBe("$29.99");
  });

  it.each([
    ["uyu", 89900, "$899 UYU"],
    ["mxn", 59900, "$599 MXN"],
    ["ars", 199900, "$1,999 ARS"],
    ["clp", 11990, "$11,990 CLP"],
    ["cop", 4990000, "$49,900 COP"],
    ["cad", 3999, "$39.99 CAD"],
    ["aud", 3999, "$39.99 AUD"],
    ["nzd", 3999, "$39.99 NZD"],
    ["sgd", 3999, "$39.99 SGD"],
    ["hkd", 14800, "$148 HKD"]
  ])("adds the ISO code after a non-USD dollar amount (%s)", (currency, amount, expected) => {
    expect(formatCurrency(amount, currency, PRICE_OPTIONS)).toBe(expected);
  });

  it.each([
    ["eur", 1999],
    ["gbp", 2499],
    ["jpy", 4800],
    ["brl", 5990]
  ])("does not add an ISO code to a currency with its own symbol (%s)", (currency, amount) => {
    expect(formatCurrency(amount, currency, PRICE_OPTIONS)).not.toMatch(/[A-Z]{3}$/);
  });
});

describe("currencyFractionDigits", () => {
  it("reports display digits for a two-decimal currency", () => {
    expect(currencyFractionDigits("GBP")).toBe(2);
  });

  it("reports zero display digits for HUF despite Intl reporting two", () => {
    expect(currencyFractionDigits("HUF")).toBe(0);
  });

  // Not asserted here: currencies like RSD, whose Intl answer depends on the
  // engine's CLDR version (recent ICU says 0, older ICU says 2). That variance
  // is exactly why minorUnitExponent must not be derived from Intl - see the
  // formatCurrency cases above, which stay correct on either.
});
