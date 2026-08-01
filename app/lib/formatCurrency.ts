// Dollar-family currencies where "narrowSymbol" collapses to "$" and loses
// the disambiguating prefix. Intl's "symbol" form is locale-dependent
// (en-US renders SGD as "SGD 1.99", not "S$1.99"), so we prepend the
// prefix ourselves to guarantee disambiguation in every locale.
const DOLLAR_PREFIX: Record<string, string> = {
  SGD: "S",
  CAD: "CA",
  AUD: "A",
  HKD: "HK",
  NZD: "NZ",
  MXN: "MX"
};

// Stripe special-case currencies: displayed as zero-decimal, but the `amount`
// field is still multiplied by 100. See https://docs.stripe.com/currencies#special-cases
const STRIPE_HUNDREDFOLD_ZERO_DECIMAL = new Set(["HUF", "TWD", "UGX"]);

// Currencies Stripe bills in whole units - `amount: 500` means 500 yen, not 5.00.
// See https://docs.stripe.com/currencies#zero-decimal
const STRIPE_ZERO_DECIMAL = new Set([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "JPY",
  "KMF",
  "KRW",
  "MGA",
  "PYG",
  "RWF",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF"
]);

// Currencies Stripe bills in thousandths - `amount: 1500` means KD 1.500.
const STRIPE_THREE_DECIMAL = new Set(["BHD", "JOD", "KWD", "OMR", "TND"]);

// Decimal places used when *displaying* an amount (e.g. "Ft 1,499" → 0 for HUF).
// Do NOT use this to convert Stripe minor units → display units; use minorUnitExponent.
export function currencyFractionDigits(currency: string): number {
  // Intl reports HUF/TWD/UGX as 2-decimal per ISO 4217, but the sub-units
  // (fillér, etc.) are obsolete and amounts are always shown whole.
  if (STRIPE_HUNDREDFOLD_ZERO_DECIMAL.has(currency)) return 0;
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).resolvedOptions().minimumFractionDigits ?? 2;
}

// Power of 10 to convert Stripe's `amount` field into the displayed value.
//
// Driven by Stripe's own table rather than by Intl, because the two disagree:
// Intl/CLDR reports RSD, ISK, ALL and a dozen others as zero-decimal (their
// sub-units are long obsolete for display) while Stripe still bills them in
// 1/100ths. Deriving the divisor from Intl rendered those prices 100x too
// high, e.g. 39900 RSD showing as "RSD 39,900" rather than "RSD 399".
function minorUnitExponent(currency: string): number {
  if (STRIPE_ZERO_DECIMAL.has(currency)) return 0;
  if (STRIPE_THREE_DECIMAL.has(currency)) return 3;
  return 2;
}

// Intl.NumberFormat in currency style with "narrowSymbol", falling back to
// "symbol" on engines that reject narrowSymbol (older/niche browsers throw a
// RangeError, which would otherwise take down the whole page render since we
// format prices during render).
export function currencyNumberFormat(options: Intl.NumberFormatOptions): Intl.NumberFormat {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currencyDisplay: "narrowSymbol", ...options });
  } catch {
    return new Intl.NumberFormat(undefined, { style: "currency", currencyDisplay: "symbol", ...options });
  }
}

function disambiguate(currency: string, formatted: string): string {
  const prefix = DOLLAR_PREFIX[currency];
  if (!prefix) return formatted;
  // Only prepend if the formatter rendered a bare "$" — if Intl already
  // produced "S$" / "CA$" for the user's locale, leave it alone.
  const idx = formatted.indexOf("$");
  if (idx === -1) return formatted;
  const charBefore = idx > 0 ? formatted[idx - 1] : "";
  if (/[A-Z]/.test(charBefore)) return formatted;
  return formatted.slice(0, idx) + prefix + formatted.slice(idx);
}

export function formatCurrency(
  amountInMinorUnits: number,
  currency: string,
  options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }
): string {
  const currencyUpper = currency.toUpperCase();
  const amount = amountInMinorUnits / Math.pow(10, minorUnitExponent(currencyUpper));
  const formatted = currencyNumberFormat({
    currency: currencyUpper,
    ...options
  }).format(amount);
  return disambiguate(currencyUpper, formatted);
}
