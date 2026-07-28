import { handleCancelSubscription, handleOpenPortal } from "../handlers";
import styles from "./actions.module.css";

export function ActivePremiumActions({ refreshUser }: { refreshUser: () => Promise<void> }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.heading} data-tone="green">
          Active Premium
        </h3>
        <p className={styles.description}>Full access to premium features</p>
      </div>

      <button onClick={handleOpenPortal} className={styles.button} data-variant="gray">
        Update Payment Details
      </button>

      <button onClick={() => handleCancelSubscription(refreshUser)} className={styles.button} data-variant="red">
        Cancel Subscription
      </button>

      <div className={styles.footer}>
        <p className={styles.footnote}>Tier change happens immediately via API. Cancellation happens at period end.</p>
      </div>
    </div>
  );
}
