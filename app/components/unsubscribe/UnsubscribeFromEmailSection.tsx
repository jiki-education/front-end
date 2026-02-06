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
  const emailTypeName = formatKeyName(emailKey);

  if (!isSubscribed && !success) {
    return (
      <section className={styles.sectionCard}>
        <h2>Already Unsubscribed</h2>
        <p>
          You are not currently subscribed to <span className={styles.emailTypeHighlight}>{emailTypeName}</span> emails.
        </p>
      </section>
    );
  }

  return (
    <section className={styles.sectionCard}>
      <h2>Unsubscribe from This Email</h2>
      <p>
        No longer want to receive this type of email? Click below to unsubscribe from{" "}
        <span className={styles.emailTypeHighlight}>{emailTypeName}</span> emails.
      </p>
      {success ? (
        <div className={styles.inlineSuccessMessage}>
          <CheckCircleIcon />
          <span>You&apos;ve been unsubscribed from {emailTypeName}.</span>
        </div>
      ) : error ? (
        <div className={styles.inlineErrorMessage}>
          <AlertCircleIcon />
          <span>Failed to update your preferences. Please try again.</span>
        </div>
      ) : (
        <button
          className={`ui-btn ui-btn-default ui-btn-danger ${styles.actionButton} ${loading ? "ui-btn-loading" : ""}`}
          onClick={onUnsubscribe}
          disabled={loading}
        >
          <EmailEnvelopeIcon />
          {loading ? "Processing..." : `Unsubscribe from ${emailTypeName}`}
        </button>
      )}
    </section>
  );
}
