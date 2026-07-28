"use client";

import {
  showPaymentConfirming,
  showPaymentProcessing,
  showPaymentVerificationFailed,
  showWelcomeToPremium
} from "@/lib/modal/app";
import styles from "./page.module.css";

export default function SubscriptionModalTest() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Payment Flow Modals</h1>
      <p className={styles.intro}>Test the payment processing and welcome to premium modals for styling.</p>

      <div className={styles.grid}>
        {/* Payment Confirming Modal */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Payment Confirming</h2>
          <p className={styles.cardDescription}>
            Shown immediately on return from Stripe, while we verify the session. Non-dismissible.
          </p>
          <button onClick={() => showPaymentConfirming()} className={styles.showButton} data-color="blue">
            Show Payment Confirming
          </button>
        </div>

        {/* Payment Verification Failed Modal */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Verification Failed</h2>
          <p className={styles.cardDescription}>
            Shown when verifyCheckoutSession itself errors (network/server failure), distinct from a successful
            &quot;unpaid&quot; response.
          </p>
          <button
            onClick={() =>
              showPaymentVerificationFailed({
                onClose: () => console.debug("Verification failed modal closed")
              })
            }
            className={styles.showButton}
            data-color="red"
          >
            Show Verification Failed
          </button>
        </div>

        {/* Payment Processing Modal */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Payment Processing</h2>
          <p className={styles.cardDescription}>
            Shown when payment is pending confirmation from the provider (e.g., PayPal, BACS).
          </p>
          <button
            onClick={() =>
              showPaymentProcessing({
                onClose: () => console.debug("Payment processing modal closed")
              })
            }
            className={styles.showButton}
            data-color="amber"
          >
            Show Payment Processing
          </button>
        </div>

        {/* Welcome to Premium Modal */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Welcome to Premium</h2>
          <p className={styles.cardDescription}>
            Shown after successful payment confirmation. The &quot;Welcome to Premium&quot; success state.
          </p>
          <button onClick={() => showWelcomeToPremium()} className={styles.showButton} data-color="green">
            Show Welcome Modal
          </button>
        </div>
      </div>

      {/* Flow Diagram */}
      <div className={styles.flowCard}>
        <h3 className={styles.flowTitle}>Payment Flow</h3>
        <div className={styles.flowRow}>
          <div className={styles.flowChip} data-color="blue">
            Checkout Form
          </div>
          <span className={styles.flowArrow}>→</span>
          <div className={styles.flowChip} data-color="blue">
            Payment Confirming
          </div>
          <span className={styles.flowArrow}>→</span>
          <div className={styles.flowChip} data-color="green">
            Welcome to Premium
          </div>
        </div>
        <p className={styles.flowNote}>
          Confirming opens immediately on return from Stripe. Then transitions to Welcome (paid), Payment Processing
          (unpaid/pending), or Verification Failed (verify call errored).
        </p>
      </div>
    </div>
  );
}
