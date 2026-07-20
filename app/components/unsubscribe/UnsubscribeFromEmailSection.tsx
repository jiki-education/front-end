import { useTranslations } from "next-intl";
import EmailEnvelopeIcon from "@/icons/email-envelope.svg";
import CheckCircleIcon from "@/icons/check-circle.svg";
import AlertCircleIcon from "@/icons/alert-circle.svg";
import styles from "./UnsubscribePage.module.css";
import { formatKeyName } from "./utils";

interface UnsubscribeFromEmailSectionProps {
  emailKey: string;
  isSubscribed: boolean;
  loading: boolean;
  success: boolean;
  error: boolean;
  onUnsubscribe: () => void;
}

export default function UnsubscribeFromEmailSection({
  emailKey,
  isSubscribed,
  loading,
  success,
  error,
  onUnsubscribe
}: UnsubscribeFromEmailSectionProps) {
  const t = useTranslations("unsubscribe");
  const tCommon = useTranslations("common");
  const emailTypeName = formatKeyName(emailKey);
  const highlight = (chunks: React.ReactNode) => <span className={styles.emailTypeHighlight}>{chunks}</span>;

  if (!isSubscribed && !success) {
    return (
      <section className={styles.sectionCard}>
        <h2>{t("email.alreadyTitle")}</h2>
        <p>{t.rich("email.alreadyDescription", { emailType: emailTypeName, highlight })}</p>
      </section>
    );
  }

  return (
    <section className={styles.sectionCard}>
      <h2>{t("email.title")}</h2>
      <p>{t.rich("email.description", { emailType: emailTypeName, highlight })}</p>
      {success ? (
        <div className={styles.inlineSuccessMessage}>
          <CheckCircleIcon />
          <span>{t("email.success", { emailType: emailTypeName })}</span>
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
          <EmailEnvelopeIcon />
          {loading ? tCommon("processing") : t("email.button", { emailType: emailTypeName })}
        </button>
      )}
    </section>
  );
}
