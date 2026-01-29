import Link from "next/link";
import EnvelopeIcon from "@/icons/envelope.svg";
import styles from "./AuthForm.module.css";

interface CheckInboxMessageProps {
  email: string;
}

export function CheckInboxMessage({ email }: CheckInboxMessageProps) {
  return (
    <div className={styles.leftSide}>
      <div className={styles.formContainer}>
        <div className={styles.confirmationMessage}>
          <div className={styles.confirmationIcon}>
            <EnvelopeIcon />
          </div>
          <h2>Check your inbox</h2>
          <div className={styles.confirmationCard}>
            <p className={styles.confirmationText}>We&apos;ve sent a confirmation email to</p>
            <p className={styles.confirmationEmail}>{email}</p>
            <p className={styles.confirmationHint}>
              Click the link in the email to activate your account. Didn&apos;t receive it?{" "}
              <Link href={`/auth/resend-confirmation?email=${encodeURIComponent(email)}`} className="ui-link">
                Resend email
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
