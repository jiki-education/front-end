import { handleReactivateSubscription } from "../handlers";
import styles from "./actions.module.css";

export function CancellingScheduledActions({ refreshUser }: { refreshUser: () => Promise<void> }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.heading} data-tone="orange">
          Cancellation Scheduled
        </h3>
        <p className={styles.description}>Your subscription will end at the current period end</p>
      </div>

      <button onClick={() => handleReactivateSubscription(refreshUser)} className={styles.button} data-variant="green">
        Resume Subscription
      </button>

      <div className={styles.footer}>
        <p className={styles.footnote}>You keep access until period end. Resume happens immediately via API.</p>
      </div>
    </div>
  );
}
