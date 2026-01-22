import PaymentHistoryTable from "./PaymentHistoryTable";
import styles from "./PaymentHistory.module.css";
import settingsStyles from "../Settings.module.css";
import type { PaymentHistoryProps } from "./types";

// Mock data for demonstration - will be replaced with API data
const mockPayments = [
  {
    id: "1",
    date: "2026-01-15",
    amount: 9.99,
    type: "Recurring" as const,
    method: "Stripe" as const
  },
  {
    id: "2",
    date: "2025-12-15",
    amount: 9.99,
    type: "Recurring" as const,
    method: "Stripe" as const
  },
  {
    id: "3",
    date: "2025-11-15",
    amount: 9.99,
    type: "Recurring" as const,
    method: "Stripe" as const
  }
];

export default function PaymentHistory({ 
  payments = mockPayments,
  isLoading = false,
  onDownloadReceipt = (payment) => {
    console.log("Download receipt for payment:", payment);
    // TODO: Implement actual receipt download
  },
  className = ""
}: PaymentHistoryProps) {
  return (
    <div className={`${settingsStyles.settingItem} ${className}`} style={{ marginBottom: 0 }}>
      <h3>Payment History</h3>
      <p>View and download receipts for your past payments.</p>
      
      {isLoading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <span>Loading payment history...</span>
        </div>
      ) : (
        <PaymentHistoryTable 
          payments={payments}
          onDownloadReceipt={onDownloadReceipt}
        />
      )}
    </div>
  );
}