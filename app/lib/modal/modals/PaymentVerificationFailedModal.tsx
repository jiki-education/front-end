"use client";

import { useTranslations } from "next-intl";
import { hideModal } from "../store";
import styles from "./PaymentProcessingModal.module.css";

interface PaymentVerificationFailedModalProps {
  onClose?: () => void;
}

export function PaymentVerificationFailedModal({ onClose }: PaymentVerificationFailedModalProps) {
  const t = useTranslations("modals.paymentVerificationFailed");
  const tCommon = useTranslations("common");
  const handleClose = () => {
    onClose?.();
    hideModal();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("title")}</h2>
      <p className={styles.description}>{t("description")}</p>
      <button onClick={handleClose} className="ui-btn ui-btn-primary ui-btn-large">
        {tCommon("close")}
      </button>
    </div>
  );
}
