"use client";

import { useAuthStore } from "@/lib/auth/authStore";
import type { BillingInterval } from "@/lib/pricing";

export function PremiumPrice({ interval }: { interval: BillingInterval }) {
  const user = useAuthStore((state) => state.user);
  if (!user) {
    return <></>;
  }

  const { currency, monthly, annual } = user.premium_prices;
  const amountInCents = interval === "monthly" ? monthly : annual;

  const formatted = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amountInCents / 100);

  return <>{formatted}</>;
}

export function PremiumDailyPrice({ interval }: { interval: BillingInterval }) {
  const user = useAuthStore((state) => state.user);
  if (!user) {
    return <></>;
  }

  const { currency, monthly, annual } = user.premium_prices;
  const amountInCents = interval === "monthly" ? monthly : annual;
  const daysInPeriod = interval === "monthly" ? 30 : 365;
  const dailyCents = amountInCents / daysInPeriod;

  const currencyUpper = currency.toUpperCase();
  const fractionDigits = currencyHasCents(currencyUpper) ? 2 : 0;

  const formatted = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyUpper,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).format(dailyCents / 100);

  return <>{formatted}</>;
}

const ZERO_DECIMAL_CURRENCIES = new Set([
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
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF"
]);

function currencyHasCents(currency: string): boolean {
  return !ZERO_DECIMAL_CURRENCIES.has(currency);
}
