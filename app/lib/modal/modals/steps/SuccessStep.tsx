"use client";

import { useTranslations } from "next-intl";
import Lottie from "react-lottie-player";
import styles from "@/app/styles/components/modals.module.css";
import checkmarkAnimationData from "@/public/static/animations/checkmark.json";

interface SuccessStepProps {
  onCompleteExercise: () => void;
  isProject?: boolean;
}

export function SuccessStep({ onCompleteExercise, isProject = false }: SuccessStepProps) {
  const t = useTranslations("modals.exerciseCompletion.success");
  return (
    <>
      <div className={styles.modalCheckmark}>
        <Lottie animationData={checkmarkAnimationData} play loop={false} style={{ height: 144, width: 144 }} />
      </div>
      <h2 className={styles.modalTitle}>{t("title")}</h2>
      <p className={styles.modalMessage}>{isProject ? t("messageProject") : t("messageExercise")}</p>
      <div className={styles.modalButtonsDivider}></div>
      <div className={styles.modalButtons}>
        <button onClick={onCompleteExercise} className="ui-btn ui-btn-primary ui-btn-large flex-1">
          {isProject ? t("completeProject") : t("completeExercise")}
        </button>
      </div>
    </>
  );
}
