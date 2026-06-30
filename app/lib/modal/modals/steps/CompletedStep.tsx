"use client";

import { LessonIcon } from "@/components/icons/LessonIcon";
import { useTranslations } from "next-intl";
import styles from "@/app/styles/components/modals.module.css";
import timelineStyles from "@/app/styles/components/exercise-timeline.module.css";

interface CompletedStepProps {
  exerciseTitle: string;
  exerciseSlug: string;
  isProject?: boolean;
  onContinue: () => void;
  onTidyCode: () => void;
}

export function CompletedStep({
  exerciseTitle,
  exerciseSlug,
  isProject = false,
  onContinue,
  onTidyCode
}: CompletedStepProps) {
  const t = useTranslations("modals.exerciseCompletion.completed");
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
      <p className={styles.modalMessage}>
        {isProject ? t("messageProject", { title: exerciseTitle }) : t("messageExercise", { title: exerciseTitle })}
      </p>
      <div className={styles.modalButtonsDivider}></div>
      <div className={styles.modalButtons}>
        <button onClick={onTidyCode} className="ui-btn ui-btn-tertiary ui-btn-large flex-1">
          {t("tidyCode")}
        </button>
        <button onClick={onContinue} className="ui-btn ui-btn-primary ui-btn-large flex-1">
          {t("continue")}
        </button>
      </div>
    </>
  );
}
