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

  return <span className="ui-premium-price">{formatted}</span>;
}
