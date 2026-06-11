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
  // When false, the modal does not call hideModal after onConfirm/onCancel —
  // the caller owns dismissal. Used by nested dialogs (e.g. WelcomeModal) that
  // need to stay mounted on cancel.
  closeOnAction?: boolean;
}

export function ConfirmationModal({
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant: _variant = "default",
  closeOnAction = true
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm?.();
    if (closeOnAction) hideModal();
  };

  const handleCancel = () => {
    onCancel?.();
    if (closeOnAction) hideModal();
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
