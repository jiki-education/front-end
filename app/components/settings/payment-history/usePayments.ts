import { useEffect, useState } from "react";
import { fetchPayments, type ApiPayment } from "@/lib/api/payments";
import type { Payment } from "./types";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    })
    .replace(/\//g, "-");
}

function formatAmount(amountInCents: number): number {
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
    async function loadPayments() {
      try {
        setIsLoading(true);
        setError(null);
        const apiPayments = await fetchPayments();
        const mappedPayments = apiPayments.map(mapApiPaymentToPayment);
        setPayments(mappedPayments);
      } catch (err) {
        if (err instanceof Error) {
          console.error("Failed to fetch payments:", err);
          setError(err.message);
        } else {
          console.error("Unexpected error fetching payments:", err);
          setError("An unexpected error occurred");
        }
        setPayments([]);
      } finally {
        setIsLoading(false);
      }
    }

    void loadPayments();
  }, []);

  return { payments, isLoading, error };
}
