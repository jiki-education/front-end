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
}

export function ConfirmationModal({
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  variant: _variant = "default"
}: ConfirmationModalProps) {
  const t = useTranslations("modals.confirmation");
  const tCommon = useTranslations("common");
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
      <h2 className={styles.modalTitle}>{title ?? t("defaultTitle")}</h2>
      <p className={styles.modalMessage}>{message ?? t("defaultMessage")}</p>
      <div className={styles.modalButtons}>
        <button onClick={handleCancel} className={`ui-btn ui-btn-tertiary ui-btn-default ${styles.buttonNowrap}`}>
          {cancelText ?? tCommon("cancel")}
        </button>
        <button onClick={handleConfirm} className={`ui-btn ui-btn-primary ui-btn-default ${styles.buttonNowrap}`}>
          {confirmText ?? tCommon("confirm")}
        </button>
      </div>
    </>
  );
}
