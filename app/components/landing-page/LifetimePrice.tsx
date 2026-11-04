"use client";

import { useExternalPremiumPrices } from "@/lib/hooks/useExternalPremiumPrices";
import { formatPremiumPrice } from "@/lib/pricing";
import styles from "./LifetimePrice.module.css";

/**
 * Renders the one-off Premium price.
 *
 * SSR / first paint shows a skeleton placeholder rather than a hardcoded price,
 * so a possibly-wrong value is never shown. After hydration we hit the public
 * /external/pricing endpoint, which Cloudflare-geolocates the visitor and
 * returns the PPP price for their country (or USD if unmapped / no Cloudflare
 * locally). No-JS visitors keep seeing the skeleton.
 */
export function LifetimePrice() {
  const prices = useExternalPremiumPrices();

  if (!prices) {
    return <span className={styles.skeleton} aria-hidden="true" data-testid="lifetime-price-skeleton" />;
  }

  return <>{formatPremiumPrice(prices)}</>;
}
