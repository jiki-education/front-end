import { handleSubscribe } from "../handlers";
import styles from "./actions.module.css";

export function IncompleteExpiredActions({ userEmail }: { userEmail: string }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.heading} data-tone="gray">
          Checkout Expired
        </h3>
        <p className={styles.description}>Your previous checkout session expired. Start a new checkout</p>
      </div>

      <button
        onClick={() => handleSubscribe({ interval: "monthly", userEmail })}
        className={styles.button}
        data-variant="blue"
      >
        Start Fresh Checkout - Premium
      </button>

      <div className={styles.footer}>
        <p className={styles.footnote}>Checkout session abandoned or expired</p>
      </div>
    </div>
  );
}
