"use client";

import Lottie from "react-lottie-player";
import styles from "@/app/styles/components/modals.module.css";
import checkmarkAnimationData from "@/public/static/animations/checkmark.json";

interface SuccessStepProps {
  onTidyCode: () => void;
  onShowConfirmation: () => void;
}

export function SuccessStep({ onTidyCode, onShowConfirmation }: SuccessStepProps) {
  return (
    <>
      <div className={styles.modalCheckmark}>
        <Lottie animationData={checkmarkAnimationData} play loop={false} style={{ height: 144, width: 144 }} />
      </div>
      <h2 className={styles.modalTitle}>All tests passed!</h2>
      <p className={styles.modalMessage}>
        Great work! You&apos;re ready to complete this exercise and move on to the next challenge.
      </p>
      <div className={styles.modalButtonsDivider}></div>
      <div className={styles.modalButtons}>
        <button onClick={onTidyCode} className={styles.btnSecondary}>
          Tidy code first
        </button>
        <button onClick={onShowConfirmation} className={styles.btnPrimary}>
          Complete Exercise
        </button>
      </div>
    </>
  );
}
