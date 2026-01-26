"use client";

import { hideModal } from "@/lib/modal/store";
import TickCircleIcon from "@/icons/tick-circle.svg";
import styles from "./CancelSubscriptionModal.module.css";

interface CancelSubscriptionSuccessModalProps {
  premiumEndDate: string;
}

export function CancelSubscriptionSuccessModal({ premiumEndDate }: CancelSubscriptionSuccessModalProps) {
  const handleClose = () => {
    hideModal();
  };

  return (
    <div className={styles.content}>
      <div className={`${styles.icon} ${styles.iconSuccess}`}>
        <TickCircleIcon />
      </div>
      <h3 className={styles.title}>Subscription cancelled</h3>
      <p className={styles.message}>
        Your Premium subscription has been cancelled. You can continue enjoying all Premium features until your current
        billing period ends.
      </p>

      <div className={styles.confirmationDate}>
        <div className={styles.dateLabel}>Premium access until</div>
        <div className={styles.dateValue}>{premiumEndDate}</div>
      </div>

      <p className={styles.resubscribeNote}>Changed your mind? You can resubscribe anytime.</p>

      <div className={styles.buttons}>
        <button className="ui-btn ui-btn-default ui-btn-primary" onClick={handleClose}>
          Got it
        </button>
      </div>
    </div>
  );
}
