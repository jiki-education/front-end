"use client";

import { hideModal } from "../store";
import styles from "@/app/styles/components/modals.module.css";

interface ConfirmationModalProps {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: "default" | "danger";
}

export function ConfirmationModal({
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default"
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm?.();
    hideModal();
  };

  const handleCancel = () => {
    onCancel?.();
    hideModal();
  };


  return (
    <>
      <h2 className={styles.modalTitle}>Are you sure?</h2>
      <p className={styles.modalMessage}>{message}</p>
      <div className={styles.modalButtonsDivider}></div>
      <div className={styles.modalButtons}>
        <button onClick={handleCancel} className={styles.btnSecondary}>
          {cancelText}
        </button>
        <button onClick={handleConfirm} className={styles.btnPrimary}>
          {confirmText}
        </button>
      </div>
    </>
  );
}
