"use client";

import { useTranslations } from "next-intl";
import { hideModal } from "../store";
import styles from "./ExerciseSuccessModal.module.css";

interface ExerciseSuccessModalProps {
  title?: string;
  message?: string;
  buttonText?: string;
}

export function ExerciseSuccessModal({ title, message, buttonText }: ExerciseSuccessModalProps) {
  const t = useTranslations("modals.exerciseSuccess");
  const tCommon = useTranslations("common");
  return (
    <div className={styles.body}>
      <h2 className={styles.title}>{title ?? t("defaultTitle")}</h2>
      <div className={styles.message}>
        <p>{message ?? t("defaultMessage")}</p>
      </div>
      <div className={styles.buttonRow}>
        <button onClick={hideModal} className={styles.button}>
          {buttonText ?? tCommon("continue")}
        </button>
      </div>
    </div>
  );
}
