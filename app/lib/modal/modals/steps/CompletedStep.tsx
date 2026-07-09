"use client";

import { LessonIcon } from "@/components/icons/LessonIcon";
import { useTranslations } from "next-intl";
import styles from "@/app/styles/components/modals.module.css";
import timelineStyles from "@/app/styles/components/exercise-timeline.module.css";

interface CompletedStepProps {
  exerciseTitle: string;
  exerciseSlug: string;
  isProject?: boolean;
  outstandingBonusCount?: number;
  onContinue: () => void;
  onTidyCode: () => void;
  onSolveBonuses: () => void;
}

export function CompletedStep({
  exerciseTitle,
  exerciseSlug,
  isProject = false,
  outstandingBonusCount = 0,
  onContinue,
  onTidyCode,
  onSolveBonuses
}: CompletedStepProps) {
  const t = useTranslations("modals.exerciseCompletion.completed");
  const hasOutstandingBonuses = outstandingBonusCount > 0;
  return (
    <>
      <div className={timelineStyles.exerciseTimeline}>
        <div className={`${timelineStyles.timelineLine} ${timelineStyles.timelineLineGreen}`}></div>
        <div className={`${timelineStyles.timelineBox} ${timelineStyles.timelineBoxGreen}`}></div>
        <div className={`${timelineStyles.timelineLine} ${timelineStyles.timelineLineAnimate}`}></div>
        <div className={timelineStyles.exerciseIconBox}>
          <LessonIcon slug={exerciseSlug} />
          <div className={timelineStyles.exerciseIconGreenOverlay}></div>
        </div>
        <div
          className={`${timelineStyles.timelineLine} ${timelineStyles.timelineLineDashed} ${timelineStyles.timelineLineAnimateHalf}`}
        ></div>
        <div className={`${timelineStyles.timelineBox} ${timelineStyles.timelineBoxGrey}`}></div>
        <div className={`${timelineStyles.timelineLine} ${timelineStyles.timelineLineDashed}`}></div>
      </div>
      <h2 className={styles.modalTitle}>{isProject ? t("titleProject") : t("titleExercise")}</h2>
      <p className={styles.modalMessage}>{t("greatWork", { title: exerciseTitle })}</p>
      <p className={styles.modalMessage}>
        {isProject
          ? t("readyProject")
          : hasOutstandingBonuses
            ? t.rich("bonusPrompt", {
                count: outstandingBonusCount,
                strong: (chunks) => <strong style={{ fontWeight: 600 }}>{chunks}</strong>
              })
            : t("readyExercise")}
      </p>
      <div className={styles.modalButtonsDivider}></div>
      <div className={styles.modalButtons}>
        <button
          onClick={hasOutstandingBonuses ? onSolveBonuses : onTidyCode}
          className={`ui-btn ui-btn-large flex-1 ${hasOutstandingBonuses ? "ui-btn-primary" : "ui-btn-tertiary"}`}
        >
          {hasOutstandingBonuses ? t("solveBonuses", { count: outstandingBonusCount }) : t("tidyCode")}
        </button>
        <button
          onClick={onContinue}
          className={`ui-btn ui-btn-large flex-1 ${hasOutstandingBonuses ? "ui-btn-secondary" : "ui-btn-primary"}`}
        >
          {hasOutstandingBonuses ? t("moveOn") : t("continue")}
        </button>
      </div>
    </>
  );
}
