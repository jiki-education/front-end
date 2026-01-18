"use client";

import styles from "@/app/styles/components/modals.module.css";

interface ConfirmationStepProps {
  onCancel: () => void;
  onCompleteExercise: () => void;
}

export function ConfirmationStep({ onCancel, onCompleteExercise }: ConfirmationStepProps) {
  return (
    <>
      <h2 className={styles.modalTitle}>Are you sure?</h2>
      <p className={styles.modalMessage}>
        Are you sure you want to mark this exercise as complete? You can always come back and improve your solution
        later.
      </p>
      <div className={styles.modalButtonsDivider}></div>
      <div className={styles.modalButtons}>
        <button onClick={onCancel} className={styles.btnSecondary}>
          Cancel
        </button>
        <button onClick={onCompleteExercise} className={styles.btnPrimary}>
          Yes, Complete
        </button>
      </div>
    </>
  );
}
