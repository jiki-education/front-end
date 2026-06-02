import styles from "./AuthForm.module.css";

interface AuthPendingMessageProps {
  title: string;
  description: string;
}

/**
 * Spinner message shown on auth pages while an async operation
 * (email confirmation, OAuth sign-in, etc.) is in flight.
 */
export function AuthPendingMessage({ title, description }: AuthPendingMessageProps) {
  return (
    <div className={styles.leftSide}>
      <div className={styles.formContainer}>
        <div className={styles.confirmationMessage}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h2>{title}</h2>
          <p className={styles.confirmationCardText} style={{ marginBottom: 0 }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
