/* eslint-disable @next/next/no-img-element */
"use client";

import styles from "@/app/styles/components/modals.module.css";
import timelineStyles from "@/app/styles/components/exercise-timeline.module.css";

interface CompletedStepProps {
  exerciseTitle: string;
  exerciseIcon: string;
  onContinue: () => void;
}

export function CompletedStep({ exerciseTitle, exerciseIcon, onContinue }: CompletedStepProps) {
  return (
    <>
      <div className={timelineStyles.exerciseTimeline}>
        <div className={`${timelineStyles.timelineLine} ${timelineStyles.timelineLineGreen}`}></div>
        <div className={`${timelineStyles.timelineBox} ${timelineStyles.timelineBoxGreen}`}></div>
        <div className={`${timelineStyles.timelineLine} ${timelineStyles.timelineLineAnimate}`}></div>
        <div className={timelineStyles.exerciseIconBox}>
          <img src={exerciseIcon} alt="Exercise icon" />
          <div className={timelineStyles.exerciseIconGreenOverlay}></div>
        </div>
        <div
          className={`${timelineStyles.timelineLine} ${timelineStyles.timelineLineDashed} ${timelineStyles.timelineLineAnimateHalf}`}
        ></div>
        <div className={`${timelineStyles.timelineBox} ${timelineStyles.timelineBoxGrey}`}></div>
        <div className={`${timelineStyles.timelineLine} ${timelineStyles.timelineLineDashed}`}></div>
      </div>
      <h2 className={styles.modalTitle}>Exercise completed!</h2>
      <p className={styles.modalMessage}>
        Great work completing {exerciseTitle}! Ready to continue to the next exercise?
      </p>
      <div className={styles.modalButtonsDivider}></div>
      <div className={styles.modalButtons}>
        <button onClick={onContinue} className={styles.btnPrimary}>
          Continue
        </button>
      </div>
    </>
  );
}
