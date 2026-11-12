import { getStripe } from "@/lib/stripe";
import type { Stripe } from "@stripe/stripe-js";
import { useEffect, useRef, useState } from "react";
import type { CheckoutLoadError, CheckoutLoadErrorSource } from "./useCheckoutFunnel";

/**
 * How long checkout waits for the payment form (Stripe.js, the checkout
 * session and the Payment Element) before offering a retry. Stripe.js keeps
 * loading in the background, so a retry after a slow load picks it up.
 */
export const CONNECTION_TIMEOUT_MS = 15_000;

type ConnectionStatus = "connecting" | "ready" | "failed";

interface UseStripeConnectionProps {
  onReady: (attempt: number) => void;
  onFailure: (error: CheckoutLoadError) => void;
}

/**
 * Tracks one attempt at showing the payment form, from loading Stripe.js to
 * the Payment Element being ready. Each attempt ends once, in `ready` or
 * `failed`. `retry` starts a new attempt, which loads Stripe.js again if it
 * failed, and remounts the checkout under a new `attempt` key so Stripe
 * initialises the session again.
 */
export function useStripeConnection({ onReady, onFailure }: UseStripeConnectionProps) {
  const [attempt, setAttempt] = useState(1);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const settledAttempt = useRef(0);

  // Callbacks change on every render, and the effect below must only run per attempt
  const callbacks = useRef({ onReady, onFailure });
  callbacks.current = { onReady, onFailure };

  const settle = (forAttempt: number, outcome: "ready" | "failed", error?: Omit<CheckoutLoadError, "attempt">) => {
    if (settledAttempt.current >= forAttempt) {
      return;
    }
    settledAttempt.current = forAttempt;
    setStatus(outcome);

    if (outcome === "ready") {
      callbacks.current.onReady(forAttempt);
    } else if (error) {
      callbacks.current.onFailure({ ...error, attempt: forAttempt });
    }
  };
  const settleRef = useRef(settle);
  settleRef.current = settle;

  useEffect(() => {
    let isCurrent = true;
    const fail = (source: CheckoutLoadErrorSource, message?: string) => {
      if (isCurrent) {
        settleRef.current(attempt, "failed", { source, message });
      }
    };

    getStripe()
      .then((instance) => {
        if (!isCurrent) {
          return;
        }
        if (instance) {
          setStripe(instance);
        } else {
          fail("stripe_js", "Stripe.js not available");
        }
      })
      .catch((error: unknown) => fail("stripe_js", errorMessage(error)));

    const timer = setTimeout(() => fail("timeout"), CONNECTION_TIMEOUT_MS);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [attempt]);

  return {
    attempt,
    status,
    // Only handed out while the attempt is live, so a failed attempt's checkout unmounts
    stripe: status === "failed" ? null : stripe,
    markReady: () => settle(attempt, "ready"),
    fail: (source: CheckoutLoadErrorSource, message?: string) => settle(attempt, "failed", { source, message }),
    retry: () => {
      setStatus("connecting");
      setAttempt(attempt + 1);
    }
  };
}

function errorMessage(error: unknown): string | undefined {
  return error instanceof Error ? error.message : undefined;
}
