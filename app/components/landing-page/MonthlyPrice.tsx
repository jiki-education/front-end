"use client";

import { useExternalPremiumPrices } from "@/lib/hooks/useExternalPremiumPrices";
import { formatMonthlyPrice } from "@/lib/pricing";
import styles from "./MonthlyPrice.module.css";

/**
 * Renders the Premium monthly price.
 *
 * SSR / first paint shows a skeleton placeholder rather than a hardcoded price,
 * so a possibly-wrong value is never shown. After hydration we hit the public
 * /external/pricing endpoint, which Cloudflare-geolocates the visitor and
 * returns the PPP price for their country (or USD if unmapped / no Cloudflare
 * locally). No-JS visitors keep seeing the skeleton.
 */
export function MonthlyPrice() {
  const prices = useExternalPremiumPrices();

  if (!prices) {
    return <span className={styles.skeleton} aria-hidden="true" data-testid="monthly-price-skeleton" />;
  }

  return <>{formatMonthlyPrice(prices)}</>;
}
