export interface Payment {
  id: string;
  date: string;
  amount: number;
  type: "Recurring" | "One-time";
  method: "Stripe" | "PayPal" | "Other";
  receiptUrl?: string;
}
