"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { CheckoutIncompleteError } from "@/lib/api/client";
import { useAuthStore } from "@/lib/auth/authStore";
import { extractAndClearCheckoutSessionId } from "@/lib/subscriptions/verification";
import { verifyPurchaseCheckout } from "@/lib/api/premiumPurchases";
import { handlePurchasePremium } from "@/lib/subscriptions/handlers";
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
  const { refreshUser, hasCheckedAuth, isAuthenticated } = useAuthStore();
  const t = useTranslations("checkout");

  useEffect(() => {
    if (!hasCheckedAuth || !isAuthenticated) {
      return;
    }

    const sessionId = extractAndClearCheckoutSessionId();
    if (!sessionId) {
      return;
    }

    // A checkout that never completed (declined / abandoned / expired, surfaced as
    // CheckoutIncompleteError) is an expected outcome. Reopen checkout in place with the
    // decline shown, without reporting it. The confirming modal stays up until
    // handlePurchasePremium swaps in checkout.
    const reopenCheckout = async (declineCode: string | null) => {
      try {
        await refreshUser();
        await handlePurchasePremium({ priorError: declineMessage(t, declineCode) });
      } catch {
        // handlePurchasePremium already toasted + logged; fall back to the failure modal
        // so the confirming spinner doesn't hang.
        showPaymentVerificationFailed();
      }
    };

    // Open the confirming modal immediately so there's no blank gap while
    // verifyPurchaseCheckout resolves.
    showPaymentConfirming();

    void verifyPurchaseCheckout(sessionId)
      .then((result) => {
        if (result.payment_state === "paid") {
          showWelcomeToPremium();
        } else {
          showPaymentProcessing();
        }
        void refreshUser();
      })
      .catch((error) => {
        if (error instanceof CheckoutIncompleteError) {
          void reopenCheckout(error.declineCode);
          return;
        }
        // Genuine /internal failures are reported centrally by the API client;
        // here we only fall back to the failure modal so the spinner doesn't hang.
        showPaymentVerificationFailed();
      });
  }, [hasCheckedAuth, isAuthenticated, refreshUser, t]);

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
