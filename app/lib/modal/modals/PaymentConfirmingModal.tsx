"use client";

import { useTranslations } from "next-intl";
import Lottie from "react-lottie-player";
import styles from "./PaymentProcessingModal.module.css";
import paymentProcessingAnimation from "@/public/static/animations/payment-processing.json";

export function PaymentConfirmingModal() {
  const t = useTranslations("modals.paymentConfirming");
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <Lottie animationData={paymentProcessingAnimation} play loop style={{ height: 72, width: 72 }} />
      </div>
      <h2 className={styles.title}>{t("title")}</h2>
      <p className={styles.description}>{t("description")}</p>
    </div>
  );
}
