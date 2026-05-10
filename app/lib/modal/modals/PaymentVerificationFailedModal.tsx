"use client";

import { hideModal } from "../store";
import styles from "./PaymentProcessingModal.module.css";

interface PaymentVerificationFailedModalProps {
  onClose?: () => void;
}

export function PaymentVerificationFailedModal({ onClose }: PaymentVerificationFailedModalProps) {
  const handleClose = () => {
    onClose?.();
    hideModal();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>We couldn&apos;t confirm your payment</h2>
      <p className={styles.description}>
        Something went wrong while checking with Stripe. Try refreshing the page in a moment &mdash; if Premium still
        isn&apos;t active, contact support.
      </p>
      <button onClick={handleClose} className="ui-btn ui-btn-primary ui-btn-large">
        Close
      </button>
    </div>
  );
}
