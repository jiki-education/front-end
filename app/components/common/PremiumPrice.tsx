"use client";

import { useAuthStore } from "@/lib/auth/authStore";
import type { BillingInterval } from "@/lib/pricing";

function fractionDigits(currency: string): number {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).resolvedOptions().minimumFractionDigits ?? 2;
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

  return <>{formatted}</>;
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

  return <>{formatted}</>;
}
