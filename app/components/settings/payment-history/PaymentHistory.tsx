import { useTranslations } from "next-intl";
import PaymentHistoryTable from "./PaymentHistoryTable";
import styles from "./PaymentHistory.module.css";
import settingsStyles from "../Settings.module.css";
import { usePayments } from "./usePayments";

export default function PaymentHistory({ className = "" }: { className?: string }) {
  const t = useTranslations("settings.paymentHistory");
  const { payments, isLoading, error } = usePayments();

  const handleDownloadReceipt = (payment: { receiptUrl?: string }) => {
    if (payment.receiptUrl) {
      window.open(payment.receiptUrl, "_blank");
    }
  };
  return (
    <div className={`${settingsStyles.settingItem} ${className}`}>
      <h3>{t("title")}</h3>
      <p>{t("subtitle")}</p>

      {isLoading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <span>{t("loading")}</span>
        </div>
      ) : error ? (
        <div className={styles.errorState}>
          <p>{t("error")}</p>
        </div>
      ) : payments.length === 0 ? (
        <div className={styles.emptyState}>
          <p>{t("empty")}</p>
        </div>
      ) : (
        <PaymentHistoryTable payments={payments} onDownloadReceipt={handleDownloadReceipt} />
      )}
    </div>
  );
}
