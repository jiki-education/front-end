import { handleSubscribe, handleOpenPortal } from "../handlers";
import styles from "./actions.module.css";

export function PaymentFailedGraceExpiredActions({ userEmail }: { userEmail: string }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.heading} data-tone="red">
          Payment Failed - Access Revoked
        </h3>
        <p className={styles.description}>Grace period expired. Update payment or start new subscription</p>
      </div>

      <button onClick={handleOpenPortal} className={styles.button} data-variant="red">
        Update Payment Method
      </button>

      <button
        onClick={() => handleSubscribe({ interval: "monthly", userEmail })}
        className={styles.button}
        data-variant="blue"
      >
        Start New Premium Subscription
      </button>

      <div className={styles.footer}>
        <p className={styles.footnote}>Downgraded to standard tier</p>
      </div>
    </div>
  );
}
