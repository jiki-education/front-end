"use client";

import { useTranslations } from "next-intl";
import { useExternalPremiumPrices } from "@/lib/hooks/useExternalPremiumPrices";
import { formatMonthlyPrice } from "@/lib/pricing";

/**
 * Renders the Premium monthly price.
 *
 * SSR / first paint shows the USD full price ($9.99) so the page is fully
 * usable on first byte. After hydration we hit the public /external/pricing
 * endpoint, which Cloudflare-geolocates the visitor and returns the PPP
 * price for their country (or USD if unmapped / no Cloudflare locally).
 */
export function MonthlyPrice() {
  const t = useTranslations("landing.monthlyPrice");
  const prices = useExternalPremiumPrices();

  return <>{prices ? formatMonthlyPrice(prices) : t("fallback")}</>;
}
