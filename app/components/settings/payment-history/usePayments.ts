import { useEffect, useState } from "react";
import { fetchPayments, type ApiPayment } from "@/lib/api/payments";
import type { Payment } from "./types";

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  // Validate the date
  if (isNaN(date.getTime())) {
    console.error(`Invalid date string: ${dateString}`);
    return "Date unavailable";
  }

  return date
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    })
    .replace(/\//g, "-");
}

function formatAmount(amountInCents: number): number {
  // Validate the amount
  if (!Number.isFinite(amountInCents)) {
    console.error(`Invalid amount: ${amountInCents}`);
    return 0;
  }

  if (amountInCents < 0) {
    console.error(`Negative amount: ${amountInCents}`);
    return 0;
  }

  return amountInCents / 100;
}

function mapApiPaymentToPayment(apiPayment: ApiPayment): Payment {
  return {
    id: apiPayment.id,
    date: formatDate(apiPayment.paid_at),
    amount: formatAmount(apiPayment.amount_in_cents),
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
