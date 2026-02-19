"use client";

import Lottie from "react-lottie-player";
import { hideModal } from "../store";
import styles from "./PaymentProcessingModal.module.css";
import paymentProcessingAnimation from "@/public/static/animations/payment-processing.json";

interface PaymentProcessingModalProps {
  onClose?: () => void;
}

export function PaymentProcessingModal({ onClose }: PaymentProcessingModalProps) {
  const handleClose = () => {
    onClose?.();
    hideModal();
  };

  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <Lottie animationData={paymentProcessingAnimation} play loop={false} style={{ height: 72, width: 72 }} />
      </div>
      <h2 className={styles.title}>Payment Processing</h2>
      <p className={styles.description}>
        Thank you. We&apos;re waiting for your payment provider to send us the funds. Once they do we&apos;ll upgrade
        your plan to Premium and send you an email.
      </p>
      <button onClick={handleClose} className="ui-btn ui-btn-primary ui-btn-large">
        Continue using Jiki
      </button>
    </div>
  );
}
