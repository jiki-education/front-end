import { handleOpenPortal } from "../handlers";
import styles from "./CustomerPortal.module.css";

export function CustomerPortal() {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Update Payment Details</h2>
      <p className={styles.description}>
        Open the Stripe Customer Portal to update payment methods, view invoices subscriptions.
      </p>
      <button onClick={handleOpenPortal} className={styles.button}>
        Open Customer Portal
      </button>
    </div>
  );
}
