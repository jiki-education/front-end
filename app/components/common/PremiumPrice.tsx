"use client";

import { useAuthStore } from "@/lib/auth/authStore";
import { currencyFractionDigits, formatCurrency } from "@/lib/formatCurrency";
import type { BillingInterval } from "@/lib/pricing";

export function PremiumPrice({ interval }: { interval: BillingInterval }) {
  const user = useAuthStore((state) => state.user);
  if (!user) {
    return <></>;
  }

  const { currency, monthly, annual } = user.premium_prices;
  const smallestUnit = interval === "monthly" ? monthly : annual;

  return <>{formatCurrency(smallestUnit, currency, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</>;
}

export function PremiumDailyPrice({ interval }: { interval: BillingInterval }) {
  const user = useAuthStore((state) => state.user);
  if (!user) {
    return <></>;
  }

  const { currency, monthly, annual } = user.premium_prices;
  const smallestUnit = interval === "monthly" ? monthly : annual;
  const daysInPeriod = interval === "monthly" ? 30 : 365;
  const digits = currencyFractionDigits(currency.toUpperCase());

  return (
    <>
      {formatCurrency(smallestUnit / daysInPeriod, currency, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      })}
    </>
  );
}
