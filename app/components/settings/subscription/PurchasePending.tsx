import { useTranslations } from "next-intl";
import styles from "./PurchasePending.module.css";

// Shown instead of the upsell while a Premium purchase paid by a delayed
// method (e.g. a bank debit) is still clearing, so the user can't pay twice.
export default function PurchasePending({ className = "" }: { className?: string }) {
  const t = useTranslations("settings.purchasePending");

  return (
    <div className={`${styles.purchasePending} ${className}`} role="status">
      <h2 className={styles.title}>{t("title")}</h2>
      <p className={styles.description}>{t("description")}</p>
    </div>
  );
}
