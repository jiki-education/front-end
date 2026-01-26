"use client";

import { hideModal, showModal } from "@/lib/modal/store";
import ExclamationCircleIcon from "@/icons/exclamation-circle.svg";
import TickCircleIcon from "@/icons/tick-circle.svg";
import styles from "./CancelSubscriptionModal.module.css";

interface CancelSubscriptionConfirmModalProps {
  onConfirmCancel: () => Promise<void>;
  premiumEndDate: string;
}

export function CancelSubscriptionConfirmModal({
  onConfirmCancel,
  premiumEndDate
}: CancelSubscriptionConfirmModalProps) {
  const handleKeepSubscription = () => {
    hideModal();
  };

  const handleCancelSubscription = async () => {
    await onConfirmCancel();
    showModal("cancel-subscription-success-modal", { premiumEndDate });
  };

  return (
    <div className={styles.content}>
      <div className={`${styles.icon} ${styles.iconWarning}`}>
        <ExclamationCircleIcon />
      </div>
      <h3 className={styles.title}>Cancel your subscription?</h3>
      <p className={styles.message}>
        We&apos;d hate to see you go! If you cancel, you&apos;ll lose access to Premium at the end of your current
        billing period.
      </p>

      <BenefitsPanel />

      <div className={styles.buttons}>
        <button className="ui-btn ui-btn-default ui-btn-primary ui-btn-purple" onClick={handleKeepSubscription}>
          Keep my subscription
        </button>
        <button className="ui-btn ui-btn-default ui-btn-tertiary" onClick={handleCancelSubscription}>
          Cancel subscription
        </button>
      </div>
    </div>
  );
}

const BENEFITS = [
  "Unlimited AI help from Jiki",
  "All projects and learning paths",
  "Completion certificates",
  "Ad-free experience"
];

function BenefitsPanel() {
  return (
    <div className={styles.benefitsPanel}>
      <h4 className={styles.benefitsTitle}>You&apos;re currently enjoying:</h4>
      {BENEFITS.map((benefit) => (
        <div key={benefit} className={styles.benefitItem}>
          <TickCircleIcon />
          <span>{benefit}</span>
        </div>
      ))}
    </div>
  );
}
