"use client";

import { useEffect, useState } from "react";
import { fetchExternalPricing } from "@/lib/api/externalPricing";
import type { PremiumPrices } from "@/lib/pricing";

const FALLBACK = "$9.99";

function fractionDigits(currency: string): number {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).resolvedOptions().minimumFractionDigits ?? 2;
}

function format(prices: PremiumPrices): string {
  const currency = prices.currency.toUpperCase();
  const amount = prices.monthly / Math.pow(10, fractionDigits(currency));
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Renders the Premium monthly price.
 *
 * SSR / first paint shows the USD full price ($9.99) so the page is fully
 * usable on first byte. After hydration we hit the public /external/pricing
 * endpoint, which Cloudflare-geolocates the visitor and returns the PPP
 * price for their country (or USD if unmapped / no Cloudflare locally).
 */
export function MonthlyPrice() {
  const [prices, setPrices] = useState<PremiumPrices | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchExternalPricing()
      .then((data) => {
        if (!cancelled) setPrices(data.premium_prices);
      })
      .catch(() => {
        // Swallow: keep showing the USD fallback if the call fails.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <>{prices ? format(prices) : FALLBACK}</>;
}
