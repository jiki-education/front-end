"use client";

import { useAuthStore } from "@/lib/auth/authStore";
import type { BillingInterval } from "@/lib/pricing";

function fractionDigits(currency: string): number {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).resolvedOptions().minimumFractionDigits ?? 2;
}

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

export function PremiumPrice({ interval }: { interval: BillingInterval }) {
  const user = useAuthStore((state) => state.user);
  if (!user) {
    return <></>;
  }

  const { currency, monthly, annual } = user.premium_prices;
  const currencyUpper = currency.toUpperCase();
  const smallestUnit = interval === "monthly" ? monthly : annual;
  const divisor = Math.pow(10, fractionDigits(currencyUpper));
  const amount = smallestUnit / divisor;

  const formatted = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyUpper,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);

  return <>{disambiguate(currencyUpper, formatted)}</>;
}

export function PremiumDailyPrice({ interval }: { interval: BillingInterval }) {
  const user = useAuthStore((state) => state.user);
  if (!user) {
    return <></>;
  }

  const { currency, monthly, annual } = user.premium_prices;
  const currencyUpper = currency.toUpperCase();
  const smallestUnit = interval === "monthly" ? monthly : annual;
  const divisor = Math.pow(10, fractionDigits(currencyUpper));
  const amount = smallestUnit / divisor;
  const daysInPeriod = interval === "monthly" ? 30 : 365;
  const dailyAmount = amount / daysInPeriod;

  const digits = fractionDigits(currencyUpper);

  const formatted = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyUpper,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(dailyAmount);

  return <>{disambiguate(currencyUpper, formatted)}</>;
}
