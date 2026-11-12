import { checkoutEventProperties, trackEvent, type CheckoutTrigger } from "@/lib/analytics";
import { useEffect, useRef } from "react";

/**
 * Where the person was when they closed checkout: still waiting for the
 * payment form, looking at it, or looking at it after a failed payment.
 */
type CheckoutStage = "loading" | "form" | "after_failure";

/** Why the payment form couldn't be shown. */
export type CheckoutLoadErrorSource = "stripe_js" | "checkout" | "payment_element" | "timeout";

export interface CheckoutLoadError {
  source: CheckoutLoadErrorSource;
  message?: string;
  attempt: number;
}

export type CheckoutFunnel = ReturnType<typeof useCheckoutFunnel>;

// Stripe's messages are short, but they're free text, so they're capped
// before they go into analytics.
const MAX_MESSAGE_LENGTH = 200;

/**
 * Records the checkout funnel events sent from the browser. `checkout_started`
 * is recorded by the API when it creates the session.
 *
 * - `checkout_loaded`: the payment form is ready, with the time since the modal opened.
 * - `checkout_load_error`: the payment form couldn't be shown.
 * - `checkout_submitted`, `checkout_failed`: a payment attempt and its failure.
 * - `checkout_closed`: the modal was closed, with the stage it was at and how long it was open.
 *
 * Every event carries the trigger, and the submit, fail and close events carry
 * the payment method selected in the Payment Element once Stripe has reported one.
 */
export function useCheckoutFunnel({ trigger, priorError }: { trigger?: CheckoutTrigger; priorError?: string | null }) {
  const openedAt = useRef(0);
  const isLoaded = useRef(false);
  // A previous attempt's failure is already on screen, so the form counts as after a failure
  const hasFailed = useRef(Boolean(priorError));
  const paymentMethod = useRef<string | null>(null);

  useEffect(() => {
    openedAt.current = performance.now();
  }, []);

  const baseProperties = () => checkoutEventProperties(trigger);
  const paymentMethodProperties = () => (paymentMethod.current ? { payment_method: paymentMethod.current } : {});
  const elapsedMs = () => Math.round(performance.now() - openedAt.current);

  return {
    trackLoaded(attempt: number) {
      isLoaded.current = true;
      trackEvent("checkout_loaded", { ...baseProperties(), load_ms: elapsedMs(), attempt });
    },

    trackLoadError({ source, message, attempt }: CheckoutLoadError) {
      trackEvent("checkout_load_error", {
        ...baseProperties(),
        source,
        attempt,
        ...(message && { error_message: capMessage(message) })
      });
    },

    setPaymentMethod(type: string) {
      paymentMethod.current = type;
    },

    trackSubmitted() {
      trackEvent("checkout_submitted", { ...baseProperties(), ...paymentMethodProperties() });
    },

    trackFailed(errorProperties: Record<string, unknown>) {
      hasFailed.current = true;
      trackEvent("checkout_failed", { ...baseProperties(), ...paymentMethodProperties(), ...errorProperties });
    },

    trackClosed() {
      trackEvent("checkout_closed", {
        ...baseProperties(),
        ...paymentMethodProperties(),
        stage: stage(isLoaded.current, hasFailed.current),
        seconds_open: Math.round(elapsedMs() / 1000)
      });
    }
  };
}

export function capMessage(message: string): string {
  return message.slice(0, MAX_MESSAGE_LENGTH);
}

function stage(isLoaded: boolean, hasFailed: boolean): CheckoutStage {
  if (!isLoaded) {
    return "loading";
  }
  return hasFailed ? "after_failure" : "form";
}
