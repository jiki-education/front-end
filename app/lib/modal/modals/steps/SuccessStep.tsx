"use client";

import { useTranslations } from "next-intl";
import Lottie from "react-lottie-player";
import styles from "@/app/styles/components/modals.module.css";
import checkmarkAnimationData from "@/public/static/animations/checkmark.json";

interface SuccessStepProps {
  onCompleteExercise: () => void;
  isChallenge?: boolean;
  outstandingBonusCount?: number;
}

export function SuccessStep({ onCompleteExercise, isChallenge = false, outstandingBonusCount = 0 }: SuccessStepProps) {
  const t = useTranslations("modals.exerciseCompletion.success");
  const hasOutstandingBonuses = outstandingBonusCount > 0;
  return (
    <>
      <div className={styles.modalCheckmark}>
        <Lottie animationData={checkmarkAnimationData} play loop={false} style={{ height: 144, width: 144 }} />
      </div>
      <h2 className={styles.modalTitle}>{hasOutstandingBonuses ? t("titleBonus") : t("title")}</h2>
      <p className={styles.modalMessage}>{isChallenge ? t("messageChallenge") : t("messageExercise")}</p>
      <div className={styles.modalButtonsDivider}></div>
      <div className={styles.modalButtons}>
        <button onClick={onCompleteExercise} className="ui-btn ui-btn-primary ui-btn-large flex-1">
          {isChallenge ? t("completeChallenge") : t("completeExercise")}
        </button>
      </div>
    </>
  );
}
