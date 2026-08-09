"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { CheckoutIncompleteError } from "@/lib/api/client";
import { useAuthStore } from "@/lib/auth/authStore";
import type { BillingInterval } from "@/lib/pricing";
import { extractAndClearCheckoutSessionId } from "@/lib/subscriptions/verification";
import { verifyCheckoutSession } from "@/lib/api/subscriptions";
import { handleSubscribe } from "@/lib/subscriptions/handlers";
import {
  showPaymentConfirming,
  showPaymentProcessing,
  showPaymentVerificationFailed,
  showWelcomeToPremium
} from "@/lib/modal/app";

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
  const t = useTranslations("checkout");

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
    const reopenCheckout = async (interval: BillingInterval, declineCode: string | null) => {
      try {
        await refreshUser();
        await handleSubscribe({
          interval,
          userEmail: user?.email,
          priorError: declineMessage(t, declineCode)
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
          void reopenCheckout(result.interval, result.decline_code ?? null);
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
          void reopenCheckout(error.interval, error.declineCode);
          return;
        }
        // Genuine /internal failures are reported centrally by the API client;
        // here we only fall back to the failure modal so the spinner doesn't hang.
        showPaymentVerificationFailed();
      });
  }, [hasCheckedAuth, isAuthenticated, refreshUser, user, t]);

  return null;
}

/**
 * Stripe sends a stable `decline_code`, not prose, so the banner copy comes from
 * the catalog. A code with no entry falls back to the generic line. That covers a
 * code Stripe adds later, and deliberately covers the fraud-signalling codes
 * (`fraudulent`, `lost_card`, `stolen_card`, `pickup_card`, `merchant_blacklist`,
 * `security_violation`), which Stripe advises never telling the cardholder apart
 * from a plain decline.
 */
function declineMessage(t: ReturnType<typeof useTranslations<"checkout">>, code: string | null): string {
  if (!code) {
    return t("declineDefault");
  }
  const key = `declineCodes.${code}`;
  return t.has(key as Parameters<typeof t.has>[0]) ? t(key as Parameters<typeof t>[0]) : t("declineDefault");
}
