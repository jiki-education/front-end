import { useEffect, useState } from "react";
import { fetchExternalPricing } from "@/lib/api/externalPricing";
import type { PremiumPrices } from "@/lib/pricing";
import { reportError } from "@/lib/reportError";

/**
 * Loads the visitor's geolocated Premium pricing from the public
 * /external/pricing endpoint after hydration. Returns null until it resolves,
 * so callers render a fallback in the meantime.
 *
 * The underlying request is memoised, so multiple mounts on the same page share
 * a single fetch. Pass `enabled: false` to skip the fetch entirely (e.g. when an
 * authenticated user's prices are already known).
 */
export function useExternalPremiumPrices({ enabled = true }: { enabled?: boolean } = {}): PremiumPrices | null {
  const [prices, setPrices] = useState<PremiumPrices | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    let cancelled = false;
    fetchExternalPricing()
      .then((data) => {
        if (!cancelled) {
          setPrices(data.premium_prices);
        }
      })
      .catch((error: unknown) => {
        // A rejected fetch (blocked by an extension, dropped connection, or the
        // visitor navigating away) throws a TypeError. That's expected ambient
        // noise and the fallback already covers it, so don't report it.
        // A bad HTTP status throws a plain Error and is worth surfacing.
        if (error instanceof TypeError) {
          return;
        }
        reportError(error);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return prices;
}
