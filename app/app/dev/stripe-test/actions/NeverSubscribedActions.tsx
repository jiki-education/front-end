import { handleSubscribe } from "../handlers";
import styles from "./actions.module.css";

export function NeverSubscribedActions({ userEmail }: { userEmail: string }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.heading}>Start Your Subscription</h3>
        <p className={styles.description}>Choose a plan to unlock premium features</p>
      </div>

      <button
        onClick={() => handleSubscribe({ interval: "monthly", userEmail })}
        className={styles.button}
        data-variant="blue"
      >
        Subscribe to Premium - $3/month
      </button>

      <div className={styles.footer}>
        <p className={styles.footnote}>No active subscription</p>
      </div>
    </div>
  );
}
