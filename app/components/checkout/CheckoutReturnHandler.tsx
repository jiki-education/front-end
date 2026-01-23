"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth/authStore";
import { extractAndClearCheckoutSessionId } from "@/lib/subscriptions/verification";
import { verifyCheckoutSession } from "@/lib/api/subscriptions";
import { showModal } from "@/lib/modal";
import toast from "react-hot-toast";

/**
 * Global handler for Stripe checkout returns
 *
 * Detects checkout_return=true in URL params, verifies the session,
 * shows appropriate modal, and refreshes user data.
 *
 * Add this component to the app layout to handle checkout returns on any page.
 */
export function CheckoutReturnHandler() {
  const { refreshUser } = useAuthStore();

  useEffect(() => {
    const sessionId = extractAndClearCheckoutSessionId();

    if (!sessionId) {
      return;
    }

    async function verifyAndShowModal(id: string) {
      try {
        const result = await verifyCheckoutSession(id);

        if (result.payment_status === "paid") {
          showModal("subscription-success-modal", { tier: result.tier });
        } else {
          // payment_status === "unpaid" with subscription_status === "incomplete"
          // means async payment is processing
          showModal("payment-processing-modal", { tier: result.tier });
        }

        await refreshUser();
      } catch (error) {
        console.error("Failed to verify checkout session:", error);
        toast.error("Failed to verify payment. Please check your subscription status in Settings.");
      }
    }

    void verifyAndShowModal(sessionId);
  }, [refreshUser]);

  // This component renders nothing - it just handles the checkout return
  return null;
}
