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
      <CompletionTimeline exerciseSlug={exerciseSlug} />
      <h2 className={styles.modalTitle}>{isProject ? t("titleProject") : t("titleExercise")}</h2>
      <p className={styles.modalMessage}>{t("greatWork", { title: exerciseTitle })}</p>
      <CompletionMessage isProject={isProject} outstandingBonusCount={outstandingBonusCount} />
      <div className={styles.modalButtonsDivider}></div>
      <div className={styles.modalButtons}>
        {hasOutstandingBonuses ? (
          <BonusActions
            outstandingBonusCount={outstandingBonusCount}
            onSolveBonuses={onSolveBonuses}
            onMoveOn={onContinue}
          />
        ) : (
          <DefaultActions onTidyCode={onTidyCode} onContinue={onContinue} />
        )}
      </div>
    </>
  );
}

function CompletionTimeline({ exerciseSlug }: { exerciseSlug: string }) {
  return (
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
  );
}

function CompletionMessage({
  isProject,
  outstandingBonusCount
}: {
  isProject: boolean;
  outstandingBonusCount: number;
}) {
  const t = useTranslations("modals.exerciseCompletion.completed");

  if (isProject) {
    return <p className={styles.modalMessage}>{t("readyProject")}</p>;
  }

  if (outstandingBonusCount > 0) {
    return (
      <p className={styles.modalMessage}>
        {t.rich("bonusPrompt", {
          count: outstandingBonusCount,
          strong: (chunks) => <strong style={{ fontWeight: 600 }}>{chunks}</strong>
        })}
      </p>
    );
  }

  return <p className={styles.modalMessage}>{t("readyExercise")}</p>;
}

function BonusActions({
  outstandingBonusCount,
  onSolveBonuses,
  onMoveOn
}: {
  outstandingBonusCount: number;
  onSolveBonuses: () => void;
  onMoveOn: () => void;
}) {
  const t = useTranslations("modals.exerciseCompletion.completed");
  return (
    <>
      <button onClick={onSolveBonuses} className="ui-btn ui-btn-primary ui-btn-large flex-1">
        {t("solveBonuses", { count: outstandingBonusCount })}
      </button>
      <button onClick={onMoveOn} className="ui-btn ui-btn-secondary ui-btn-large flex-1">
        {t("moveOn")}
      </button>
    </>
  );
}

function DefaultActions({ onTidyCode, onContinue }: { onTidyCode: () => void; onContinue: () => void }) {
  const t = useTranslations("modals.exerciseCompletion.completed");
  return (
    <>
      <button onClick={onTidyCode} className="ui-btn ui-btn-tertiary ui-btn-large flex-1">
        {t("tidyCode")}
      </button>
      <button onClick={onContinue} className="ui-btn ui-btn-primary ui-btn-large flex-1">
        {t("continue")}
      </button>
    </>
  );
}
