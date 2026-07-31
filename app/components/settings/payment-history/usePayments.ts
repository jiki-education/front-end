import { useEffect, useState } from "react";
import { fetchPayments, type ApiPayment } from "@/lib/api/payments";
import type { Payment } from "./types";

function sanitizeAmount(amountInCents: number): number {
  if (!Number.isFinite(amountInCents)) {
    console.error(`Invalid amount: ${amountInCents}`);
    return 0;
  }

  if (amountInCents < 0) {
    console.error(`Negative amount: ${amountInCents}`);
    return 0;
  }

  return amountInCents;
}

function mapApiPaymentToPayment(apiPayment: ApiPayment): Payment {
  return {
    id: apiPayment.id,
    // Raw ISO timestamp; PaymentHistoryRow formats it in the active locale (and
    // falls back to a localized label if it can't be parsed).
    date: apiPayment.paid_at,
    amountInCents: sanitizeAmount(apiPayment.amount_in_cents),
    currency: apiPayment.currency,
    type: "Recurring",
    method: "Stripe",
    receiptUrl: apiPayment.external_receipt_url
  };
}

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPayments() {
      try {
        setIsLoading(true);
        setError(null);
        const apiPayments = await fetchPayments();

        if (!cancelled) {
          const mappedPayments = apiPayments.map(mapApiPaymentToPayment);
          setPayments(mappedPayments);
        }
      } catch (err) {
        if (!cancelled) {
          if (err instanceof Error) {
            console.error("Failed to fetch payments:", err);
            setError(err.message);
          } else {
            console.error("Unexpected error fetching payments:", err);
            setError("An unexpected error occurred");
          }
          setPayments([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadPayments();

    return () => {
      cancelled = true;
    };
  }, []);

  return { payments, isLoading, error };
}
