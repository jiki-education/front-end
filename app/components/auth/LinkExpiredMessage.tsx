import Link from "next/link";
import ShieldXIcon from "@/icons/shield-x.svg";
import styles from "./AuthForm.module.css";

export function LinkExpiredMessage() {
  return (
    <div className={styles.leftSide}>
      <div className={styles.formContainer}>
        <div className={styles.confirmationMessage}>
          <div className={styles.confirmationIconError}>
            <ShieldXIcon />
          </div>
          <h2>Link expired</h2>
          <div className={styles.confirmationCard}>
            <p className={styles.confirmationCardText}>
              This confirmation link is no longer valid. Request a new one to continue.
            </p>
            <Link
              href="/auth/resend-confirmation"
              className="ui-btn ui-btn-large ui-btn-primary"
              style={{ display: "inline-flex", width: "100%", textDecoration: "none" }}
            >
              Resend confirmation email
            </Link>
            <p className={styles.confirmationCardFooter}>
              Need help?{" "}
              <Link href="/articles/support" className="ui-link">
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
