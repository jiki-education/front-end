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
  return (
    <section className={styles.sectionCard}>
      <h2>Unsubscribe from All Emails</h2>
      <p>
        Want to stop all email communications from Jiki? This will unsubscribe you from all marketing, notification, and
        reminder emails.
      </p>
      {success ? (
        <div className={styles.inlineSuccessMessage}>
          <CheckCircleIcon />
          <span>You&apos;ve been unsubscribed from all Jiki emails.</span>
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
          <BlockCircleIcon />
          {loading ? "Processing..." : "Unsubscribe from All Emails"}
        </button>
      )}
    </section>
  );
}
