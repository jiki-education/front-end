"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/auth/authStore";
import { fetchExternalPricing } from "@/lib/api/externalPricing";
import type { PremiumPrices } from "@/lib/pricing";
import { reportError } from "@/lib/reportError";

function fractionDigits(currency: string): number {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).resolvedOptions().minimumFractionDigits ?? 2;
}

function formatMonthly(prices: PremiumPrices): string {
  const currencyUpper = prices.currency.toUpperCase();
  const divisor = Math.pow(10, fractionDigits(currencyUpper));
  const amount = prices.monthly / divisor;

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyUpper,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

export function PublicPremiumPrice() {
  const t = useTranslations("premium.publicPrice");
  const user = useAuthStore((state) => state.user);
  const [publicPrices, setPublicPrices] = useState<PremiumPrices | null>(null);

  useEffect(() => {
    if (user) {
      return;
    }
    let cancelled = false;
    fetchExternalPricing()
      .then((res) => {
        if (!cancelled) {
          setPublicPrices(res.premium_prices);
        }
      })
      .catch(reportError);
    return () => {
      cancelled = true;
    };
  }, [user]);

  const prices = user?.premium_prices ?? publicPrices;
  if (!prices) {
    return <>{t("unavailable")}</>;
  }

  return <>{formatMonthly(prices)}</>;
}
