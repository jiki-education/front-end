import { handlePurchasePremium } from "../handlers";
import styles from "./actions.module.css";

export function NeverSubscribedActions() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.heading}>Start Your Subscription</h3>
        <p className={styles.description}>Choose a plan to unlock premium features</p>
      </div>

      <button onClick={() => handlePurchasePremium()} className={styles.button} data-variant="blue">
        Buy Premium (one-time)
      </button>

      <div className={styles.footer}>
        <p className={styles.footnote}>No active subscription</p>
      </div>
    </div>
  );
}
