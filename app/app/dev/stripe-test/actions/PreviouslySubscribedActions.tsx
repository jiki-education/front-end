import { handleSubscribe } from "../handlers";
import styles from "./actions.module.css";

export function PreviouslySubscribedActions({ userEmail }: { userEmail: string }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.heading}>Re-Subscribe</h3>
        <p className={styles.description}>Your previous subscription has ended. Subscribe again to regain access</p>
      </div>

      <button
        onClick={() => handleSubscribe({ interval: "monthly", userEmail })}
        className={styles.button}
        data-variant="blue"
      >
        Re-subscribe to Premium - $3/month
      </button>

      <div className={styles.footer}>
        <p className={styles.footnote}>Previously subscribed, no active subscription</p>
      </div>
    </div>
  );
}
