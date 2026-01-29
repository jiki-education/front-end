import styles from "./AuthForm.module.css";

export function ConfirmingEmailMessage() {
  return (
    <div className={styles.leftSide}>
      <div className={styles.formContainer}>
        <div className={styles.confirmationMessage}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h2>Confirming your email...</h2>
          <p className={styles.confirmationCardText} style={{ marginBottom: 0 }}>
            Please wait while we confirm your email address.
          </p>
        </div>
      </div>
    </div>
  );
}
