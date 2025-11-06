/**
 * useCheckoutSession Hook
 * Manages Stripe checkout session creation and state
 */

import { useState } from "react";
import { createCheckoutSession } from "@/lib/api/subscriptions";
import { createCheckoutReturnUrl } from "@/lib/subscriptions/checkout";
import type { MembershipTier } from "@/lib/pricing";

export interface UseCheckoutSessionResult {
  clientSecret: string | null;
  selectedTier: MembershipTier | null;
  isCreating: boolean;
  error: string | null;
  startCheckout: (tier: MembershipTier, pathname: string) => Promise<void>;
  cancelCheckout: () => void;
}

/**
 * Hook for managing Stripe checkout session lifecycle
 *
 * @returns Checkout session state and control functions
 *
 * @example
 * const { clientSecret, selectedTier, startCheckout, cancelCheckout } = useCheckoutSession();
 *
 * // Start checkout
 * await startCheckout("premium", "/subscribe");
 *
 * // Cancel checkout
 * cancelCheckout();
 */
export function useCheckoutSession(): UseCheckoutSessionResult {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout(tier: MembershipTier, pathname: string): Promise<void> {
    if (tier === "standard") {
      setError("Cannot create checkout for free tier");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const returnUrl = createCheckoutReturnUrl(pathname);
      const response = await createCheckoutSession(tier, returnUrl);
      setClientSecret(response.client_secret);
      setSelectedTier(tier);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create checkout session";
      setError(errorMessage);
      console.error("Checkout session creation failed:", err);
    } finally {
      setIsCreating(false);
    }
  }

  function cancelCheckout(): void {
    setClientSecret(null);
    setSelectedTier(null);
    setError(null);
  }

  return {
    clientSecret,
    selectedTier,
    isCreating,
    error,
    startCheckout,
    cancelCheckout
  };
}
