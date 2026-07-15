import { useTranslations } from "next-intl";
import BlockCircleIcon from "@/icons/block-circle.svg";
import CheckCircleIcon from "@/icons/check-circle.svg";
import AlertCircleIcon from "@/icons/alert-circle.svg";
import styles from "./UnsubscribePage.module.css";

interface UnsubscribeFromAllSectionProps {
  loading: boolean;
  success: boolean;
  error: boolean;
  onUnsubscribe: () => void;
}

export default function UnsubscribeFromAllSection({
  loading,
  success,
  error,
  onUnsubscribe
}: UnsubscribeFromAllSectionProps) {
  const t = useTranslations("unsubscribe");
  const tCommon = useTranslations("common");
  return (
    <section className={styles.sectionCard}>
      <h2>{t("all.title")}</h2>
      <p>{t("all.description")}</p>
      {success ? (
        <div className={styles.inlineSuccessMessage}>
          <CheckCircleIcon />
          <span>{t("all.success")}</span>
        </div>
      ) : error ? (
        <div className={styles.inlineErrorMessage}>
          <AlertCircleIcon />
          <span>{t("updateError")}</span>
        </div>
      ) : (
        <button
          className={`ui-btn ui-btn-default ui-btn-danger ${styles.actionButton} ${loading ? "ui-btn-loading" : ""}`}
          onClick={onUnsubscribe}
          disabled={loading}
        >
          <BlockCircleIcon />
          {loading ? tCommon("processing") : t("all.button")}
        </button>
      )}
    </section>
  );
}
