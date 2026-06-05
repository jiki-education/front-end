"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth/authStore";
import { extractAndClearCheckoutSessionId } from "@/lib/subscriptions/verification";
import { verifyCheckoutSession } from "@/lib/api/subscriptions";
import { reportError } from "@/lib/reportError";
import {
  showPaymentConfirming,
  showPaymentProcessing,
  showPaymentVerificationFailed,
  showWelcomeToPremium
} from "@/lib/modal";

/**
 * Global handler for Stripe checkout returns
 *
 * Detects checkout_return=true in URL params, verifies the session,
 * shows appropriate modal, and refreshes user data.
 *
 * Add this component to the app layout to handle checkout returns on any page.
 */
export function CheckoutReturnHandler() {
  const { refreshUser, hasCheckedAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!hasCheckedAuth || !isAuthenticated) {
      return;
    }

    const sessionId = extractAndClearCheckoutSessionId();
    if (!sessionId) {
      return;
    }

    // Open the confirming modal immediately so there's no blank gap while
    // verifyCheckoutSession resolves.
    showPaymentConfirming();

    void verifyCheckoutSession(sessionId)
      .then((result) => {
        if (result.payment_status === "paid") {
          showWelcomeToPremium();
        } else {
          showPaymentProcessing();
        }
        void refreshUser();
      })
      .catch((error) => {
        reportError(error);
        showPaymentVerificationFailed();
      });
  }, [hasCheckedAuth, isAuthenticated, refreshUser]);

  return null;
}
