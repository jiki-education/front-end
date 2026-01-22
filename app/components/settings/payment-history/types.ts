export interface Payment {
  id: string;
  date: string;
  amount: number;
  type: "Recurring" | "One-time";
  method: "Stripe" | "PayPal" | "Other";
  receiptUrl?: string;
}

export interface PaymentHistoryProps {
  payments?: Payment[];
  isLoading?: boolean;
  onDownloadReceipt?: (payment: Payment) => void;
  className?: string;
}