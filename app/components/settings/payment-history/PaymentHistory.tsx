import PaymentHistoryTable from "./PaymentHistoryTable";
import styles from "./PaymentHistory.module.css";
import settingsStyles from "../Settings.module.css";
import { usePayments } from "./usePayments";

export default function PaymentHistory({ className = "" }: { className?: string }) {
  const { payments, isLoading, error } = usePayments();

  const handleDownloadReceipt = (payment: { receiptUrl?: string }) => {
    if (payment.receiptUrl) {
      window.open(payment.receiptUrl, "_blank");
    }
  };
  return (
    <div className={`${settingsStyles.settingItem} ${className}`} style={{ marginBottom: 0 }}>
      <h3>Payment History</h3>
      <p>View and download receipts for your past payments.</p>

      {isLoading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <span>Loading payment history...</span>
        </div>
      ) : error ? (
        <div className={styles.errorState}>
          <p>Unable to load payment history. Please try again later.</p>
        </div>
      ) : payments.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No payment history available.</p>
        </div>
      ) : (
        <PaymentHistoryTable payments={payments} onDownloadReceipt={handleDownloadReceipt} />
      )}
    </div>
  );
}
