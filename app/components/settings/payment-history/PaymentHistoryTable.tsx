import { useTranslations } from "next-intl";
import PaymentHistoryRow from "./PaymentHistoryRow";
import styles from "./PaymentHistory.module.css";
import type { Payment } from "./types";

interface PaymentHistoryTableProps {
  payments: Payment[];
  onDownloadReceipt: (payment: Payment) => void;
}

export default function PaymentHistoryTable({ payments, onDownloadReceipt }: PaymentHistoryTableProps) {
  const t = useTranslations("settings.paymentHistory");
  if (payments.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>{t("empty")}</p>
      </div>
    );
  }

  return (
    <table className={styles.paymentHistoryTable}>
      <thead>
        <tr>
          <th>{t("columnDate")}</th>
          <th>{t("columnAmount")}</th>
          <th>{t("columnType")}</th>
          <th>{t("columnMethod")}</th>
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
