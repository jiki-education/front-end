"use client";

import { useTranslations } from "next-intl";
import Lottie from "react-lottie-player";
import { hideModal } from "../store";
import styles from "./PaymentProcessingModal.module.css";
import paymentProcessingAnimation from "@/public/static/animations/payment-processing.json";

interface PaymentProcessingModalProps {
  onClose?: () => void;
}

export function PaymentProcessingModal({ onClose }: PaymentProcessingModalProps) {
  const t = useTranslations("modals.paymentProcessing");
  const handleClose = () => {
    onClose?.();
    hideModal();
  };

  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <Lottie animationData={paymentProcessingAnimation} play loop={false} style={{ height: 72, width: 72 }} />
      </div>
      <h2 className={styles.title}>{t("title")}</h2>
      <p className={styles.description}>{t("description")}</p>
      <button onClick={handleClose} className="ui-btn ui-btn-primary ui-btn-large">
        {t("continue")}
      </button>
    </div>
  );
}
