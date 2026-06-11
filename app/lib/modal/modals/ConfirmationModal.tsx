"use client";

import { hideModal } from "../store";
import styles from "@/app/styles/components/confirmation-modal.module.css";

interface ConfirmationModalProps {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: "default" | "danger";
}

// If a caller provides onConfirm / onCancel, that callback fully owns dismissal
// (it may call hideModal, navigate away, or — like WelcomeModal — leave the
// outer dialog open). If the caller omits the callback, we fall back to
// hideModal so the default "fire and forget" usage still closes the modal.
export function ConfirmationModal({
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant: _variant = "default"
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      hideModal();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      hideModal();
    }
  };

  return (
    <>
      <h2 className={styles.modalTitle}>{title}</h2>
      <p className={styles.modalMessage}>{message}</p>
      <div className={styles.modalButtons}>
        <button onClick={handleCancel} className="ui-btn ui-btn-tertiary ui-btn-default whitespace-nowrap">
          {cancelText}
        </button>
        <button onClick={handleConfirm} className="ui-btn ui-btn-primary ui-btn-default whitespace-nowrap">
          {confirmText}
        </button>
      </div>
    </>
  );
}
