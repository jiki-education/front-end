import { getApiUrl } from "./config";
import type { PremiumPrices } from "@/lib/pricing";

export interface ExternalPricingResponse {
  premium_prices: PremiumPrices;
}

/**
 * Fetch public (unauthenticated) Premium pricing for the visitor.
 * Country is detected by Cloudflare on the API side; falls back to USD.
 */
export async function fetchExternalPricing(): Promise<ExternalPricingResponse> {
  const res = await fetch(getApiUrl("/external/pricing"));
  if (!res.ok) {
    throw new Error(`Failed to fetch external pricing (${res.status})`);
  }
  return (await res.json()) as ExternalPricingResponse;
}
