import WalkthroughIcon from "@/icons/walkthrough.svg";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { LessonDisplayData } from "../types";
import { showVideoWalkthrough } from "@/lib/modal/app";
import styles from "./WalkthroughCard.module.css";

interface WalkthroughCardProps {
  lesson: LessonDisplayData;
  isCompleting?: boolean;
}

export function WalkthroughCard({ lesson, isCompleting }: WalkthroughCardProps) {
  const t = useTranslations("dashboard.exercisePath.walkthrough");
  // Mirrors progress reported by the walkthrough modal, so the card updates
  // without a dashboard refetch. Never regresses below the server-known value.
  const [livePercentage, setLivePercentage] = useState(0);
  const deepDiveVideo = lesson.deepDiveVideo;
  if (!deepDiveVideo) {
    return null;
  }
  const isLocked = !lesson.completed;
  const percentage = Math.max(lesson.deepDiveVideoWatchedPercentage, livePercentage);

  const getStateClass = () => {
    if (isLocked) {
      return styles.locked;
    }
    if (percentage === 100) {
      return styles.watched;
    }
    if (percentage > 0) {
      return styles.watching;
    }
    return styles.unwatched;
  };

  const openWalkthrough = () => {
    showVideoWalkthrough({
      video: deepDiveVideo,
      lessonSlug: lesson.lesson.slug,
      onProgress: (percentage) => setLivePercentage((prev) => Math.max(prev, percentage))
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLocked) {
      return;
    }
    openWalkthrough();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      if (isLocked) {
        return;
      }
      openWalkthrough();
    }
  };

  return (
    <div
      className={`${styles.walkthroughCard} ${getStateClass()}${isCompleting ? ` ${styles.animatingUnlock}` : ""}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={isLocked ? -1 : 0}
      data-walkthrough-card
    >
      <div className={styles.front}>
        <WalkthroughIcon className={styles.icon} />
        <div className={styles.progress}>
          <div className={styles.progressFill} style={{ width: `${percentage}%` }} />
        </div>
        <div className={styles.label}>{t("label")}</div>
      </div>
      <div className={styles.back}>
        <svg viewBox="0 0 24 24">
          <polygon points="5,3 19,12 5,21" />
        </svg>
        <div className={styles.backLabel}>{t("watch")}</div>
      </div>
    </div>
  );
}
