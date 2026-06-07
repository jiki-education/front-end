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

export function currencyFractionDigits(currency: string): number {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).resolvedOptions().minimumFractionDigits ?? 2;
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
  const digits = currencyFractionDigits(currencyUpper);
  const amount = amountInMinorUnits / Math.pow(10, digits);
  const formatted = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyUpper,
    currencyDisplay: "narrowSymbol",
    ...options
  }).format(amount);
  return disambiguate(currencyUpper, formatted);
}
