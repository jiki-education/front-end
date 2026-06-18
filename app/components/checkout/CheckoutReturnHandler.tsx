"use client";

import { useEffect } from "react";
import { CheckoutIncompleteError } from "@/lib/api/client";
import { useAuthStore } from "@/lib/auth/authStore";
import type { BillingInterval } from "@/lib/pricing";
import { extractAndClearCheckoutSessionId } from "@/lib/subscriptions/verification";
import { verifyCheckoutSession } from "@/lib/api/subscriptions";
import { handleSubscribe } from "@/lib/subscriptions/handlers";
import { reportError } from "@/lib/reportError";
import {
  showPaymentConfirming,
  showPaymentProcessing,
  showPaymentVerificationFailed,
  showWelcomeToPremium
} from "@/lib/modal/app";

const DEFAULT_DECLINE_MESSAGE = "Your last payment didn't go through. Please try again with a different card.";

/**
 * Global handler for Stripe checkout returns
 *
 * Detects checkout_return=true in URL params, verifies the session,
 * shows appropriate modal, and refreshes user data.
 *
 * Add this component to the app layout to handle checkout returns on any page.
 */
export function CheckoutReturnHandler() {
  const { user, refreshUser, hasCheckedAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!hasCheckedAuth || !isAuthenticated) {
      return;
    }

    const sessionId = extractAndClearCheckoutSessionId();
    if (!sessionId) {
      return;
    }

    // A failed payment — whether the session never completed (declined / abandoned /
    // expired, surfaced as CheckoutIncompleteError) or completed and the first charge
    // then failed (payment_state "failed") — is an expected outcome, not a bug. Reopen
    // checkout in place with the decline shown and the original plan selected, without
    // reporting it. The confirming modal stays up until handleSubscribe swaps in checkout.
    const reopenCheckout = async (interval: BillingInterval, declineReason: string | null) => {
      try {
        await refreshUser();
        await handleSubscribe({
          interval,
          userEmail: user?.email,
          priorError: declineReason ?? DEFAULT_DECLINE_MESSAGE
        });
      } catch {
        // handleSubscribe already toasted + logged; fall back to the failure modal so
        // the confirming spinner doesn't hang.
        showPaymentVerificationFailed();
      }
    };

    // Open the confirming modal immediately so there's no blank gap while
    // verifyCheckoutSession resolves.
    showPaymentConfirming();

    void verifyCheckoutSession(sessionId)
      .then((result) => {
        if (result.payment_state === "failed") {
          void reopenCheckout(result.interval, result.decline_reason ?? null);
          return;
        }
        if (result.payment_state === "paid") {
          showWelcomeToPremium();
        } else {
          showPaymentProcessing();
        }
        void refreshUser();
      })
      .catch((error) => {
        if (error instanceof CheckoutIncompleteError) {
          void reopenCheckout(error.interval, error.declineReason);
          return;
        }
        reportError(error);
        showPaymentVerificationFailed();
      });
  }, [hasCheckedAuth, isAuthenticated, refreshUser, user]);

  return null;
}
