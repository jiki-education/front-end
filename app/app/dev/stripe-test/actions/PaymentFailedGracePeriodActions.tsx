import { handleCancelSubscription, handleOpenPortal } from "../handlers";
import styles from "./actions.module.css";

export function PaymentFailedGracePeriodActions({ refreshUser }: { refreshUser: () => Promise<void> }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.heading} data-tone="red">
          Payment Failed - Grace Period
        </h3>
        <p className={styles.description}>Update your payment method within 7 days to maintain access</p>
      </div>

      <button onClick={handleOpenPortal} className={styles.button} data-variant="red">
        Update Payment Method
      </button>

      <button onClick={() => handleCancelSubscription(refreshUser)} className={styles.button} data-variant="gray">
        Cancel Subscription
      </button>

      <div className={styles.footer}>
        <p className={styles.footnote}>You still have access during the grace period</p>
      </div>
    </div>
  );
}
