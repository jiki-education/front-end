"use client";

import { useTranslations } from "next-intl";
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
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  variant: _variant = "default",
  closeOnAction = true
}: ConfirmationModalProps) {
  const t = useTranslations("modals.confirmation");
  const tCommon = useTranslations("common");
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
      <h2 className={styles.modalTitle}>{title ?? t("defaultTitle")}</h2>
      <p className={styles.modalMessage}>{message ?? t("defaultMessage")}</p>
      <div className={styles.modalButtons}>
        <button onClick={handleCancel} className="ui-btn ui-btn-tertiary ui-btn-default whitespace-nowrap">
          {cancelText ?? tCommon("cancel")}
        </button>
        <button onClick={handleConfirm} className="ui-btn ui-btn-primary ui-btn-default whitespace-nowrap">
          {confirmText ?? tCommon("confirm")}
        </button>
      </div>
    </>
  );
}
