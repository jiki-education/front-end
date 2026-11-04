export interface Payment {
  id: string;
  date: string;
  amountInCents: number;
  currency: string;
  type: "Recurring" | "One-time";
  revokedReason: "refunded" | "disputed" | null;
  method: "Stripe" | "PayPal" | "Other";
  receiptUrl?: string;
}
