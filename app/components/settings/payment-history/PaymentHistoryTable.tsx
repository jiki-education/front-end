import PaymentHistoryRow from "./PaymentHistoryRow";
import styles from "./PaymentHistory.module.css";
import type { Payment } from "./types";

interface PaymentHistoryTableProps {
  payments: Payment[];
  onDownloadReceipt: (payment: Payment) => void;
}

export default function PaymentHistoryTable({ payments, onDownloadReceipt }: PaymentHistoryTableProps) {
  if (payments.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No payment history available.</p>
      </div>
    );
  }

  return (
    <table className={styles.paymentHistoryTable}>
      <thead>
        <tr>
          <th>Date</th>
          <th>Amount</th>
          <th>Type</th>
          <th>Method</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {payments.map((payment) => (
          <PaymentHistoryRow key={payment.id} payment={payment} onDownloadReceipt={onDownloadReceipt} />
        ))}
      </tbody>
    </table>
  );
}
