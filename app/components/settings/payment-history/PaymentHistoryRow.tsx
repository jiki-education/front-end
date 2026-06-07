import styles from "./PaymentHistory.module.css";
import type { Payment } from "./types";

interface PaymentHistoryRowProps {
  payment: Payment;
  onDownloadReceipt: (payment: Payment) => void;
}

export default function PaymentHistoryRow({ payment, onDownloadReceipt }: PaymentHistoryRowProps) {
  const formatAmount = (amountInCents: number, currency: string) => {
    const currencyUpper = currency.toUpperCase();
    const fractionDigits =
      new Intl.NumberFormat(undefined, { style: "currency", currency: currencyUpper }).resolvedOptions()
        .minimumFractionDigits ?? 2;
    const amount = amountInCents / Math.pow(10, fractionDigits);
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyUpper,
      currencyDisplay: "narrowSymbol"
    }).format(amount);
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
      <td className={styles.paymentAmount}>{formatAmount(payment.amountInCents, payment.currency)}</td>
      <td className={styles.paymentType}>{payment.type}</td>
      <td className={styles.paymentMethod}>{payment.method}</td>
      <td className={styles.paymentAction}>
        <button className="ui-btn ui-btn-small ui-btn-secondary ui-btn-gray" onClick={() => onDownloadReceipt(payment)}>
          Download Receipt
        </button>
      </td>
    </tr>
  );
}
