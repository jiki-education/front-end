import { getApiUrl } from "./config";
import type { PremiumPrices } from "@/lib/pricing";

export interface ExternalPricingResponse {
  premium_prices: PremiumPrices;
}

let cached: Promise<ExternalPricingResponse> | null = null;

/**
 * Fetch public (unauthenticated) Premium pricing for the visitor.
 * Country is detected by Cloudflare on the API side; falls back to USD.
 *
 * The result is memoised so that multiple <MonthlyPrice /> instances on the
 * same page share a single request. A failed request is not cached, so a later
 * mount can retry.
 */
export function fetchExternalPricing(): Promise<ExternalPricingResponse> {
  cached ??= performFetch().catch((error: unknown) => {
    cached = null;
    throw error;
  });
  return cached;
}

async function performFetch(): Promise<ExternalPricingResponse> {
  const res = await fetch(getApiUrl("/external/pricing"));
  if (!res.ok) {
    throw new Error(`Failed to fetch external pricing (${res.status})`);
  }
  return (await res.json()) as ExternalPricingResponse;
}
