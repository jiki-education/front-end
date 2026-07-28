import styles from "./actions.module.css";

export function IncompletePaymentActions() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.heading} data-tone="yellow">
          Payment In Progress
        </h3>
        <p className={styles.description}>Your checkout session is awaiting payment confirmation</p>
      </div>

      <button disabled className={styles.button} data-variant="gray" title="Not implemented yet">
        Complete Payment
      </button>

      <button disabled className={styles.button} data-variant="red" title="Not implemented yet">
        Cancel Checkout
      </button>

      <div className={styles.footer}>
        <p className={styles.footnote}>Checkout initiated but not completed</p>
      </div>
    </div>
  );
}
