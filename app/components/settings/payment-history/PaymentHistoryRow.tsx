import styles from "./PaymentHistory.module.css";
import type { Payment } from "./types";

interface PaymentHistoryRowProps {
  payment: Payment;
  onDownloadReceipt: (payment: Payment) => void;
}

export default function PaymentHistoryRow({ 
  payment, 
  onDownloadReceipt 
}: PaymentHistoryRowProps) {
  const formatAmount = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric"
    };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <tr className={styles.paymentRow}>
      <td className={styles.paymentDate}>{formatDate(payment.date)}</td>
      <td className={styles.paymentAmount}>{formatAmount(payment.amount)}</td>
      <td className={styles.paymentType}>{payment.type}</td>
      <td className={styles.paymentMethod}>{payment.method}</td>
      <td className={styles.paymentAction}>
        <button 
          className={`${styles.uiBtn} ${styles.uiBtnSmall} ${styles.uiBtnSecondary}`}
          onClick={() => onDownloadReceipt(payment)}
        >
          Download Receipt
        </button>
      </td>
    </tr>
  );
}