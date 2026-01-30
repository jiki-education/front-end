"use client";

import { hideModal } from "../store";
import styles from "./WelcomeToPremiumModal.module.css";

interface WelcomeToPremiumModalProps {
  onClose?: () => void;
}

export function WelcomeToPremiumModal({ onClose }: WelcomeToPremiumModalProps) {
  const handleClose = () => {
    onClose?.();
    hideModal();
  };

  return (
    <div className={styles.container}>
      <span className={styles.badge}>
        <svg viewBox="0 0 24 24" fill="none" className={styles.badgeIcon}>
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill="currentColor"
          />
        </svg>
        Premium Member
      </span>

      <h2 className={styles.title}>
        Welcome to <span className={styles.highlight}>Premium!</span>
      </h2>

      <p className={styles.description}>
        Great, you now have all the benefits included in the Premium Plan! Unlimited chats with Jiki on all lessons, and
        so much more awaits you.
      </p>

      <div className={styles.actions}>
        <button onClick={handleClose} className="ui-btn ui-btn-primary ui-btn-purple ui-btn-large">
          Continue
        </button>
      </div>
    </div>
  );
}
