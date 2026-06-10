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
  onClose?: () => void;
  variant?: "default" | "danger";
}

export function ConfirmationModal({
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  onClose = hideModal,
  variant: _variant = "default"
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
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
