import WalkthroughIcon from "@/icons/walkthrough.svg";
import type { LessonDisplayData } from "../types";
import { showVideoWalkthrough } from "@/lib/modal/store";
import styles from "./WalkthroughCard.module.css";

interface WalkthroughCardProps {
  lesson: LessonDisplayData;
  isCompleting?: boolean;
}

export function WalkthroughCard({ lesson, isCompleting }: WalkthroughCardProps) {
  const walkthroughVideoData = lesson.lesson.walkthrough_video_data;
  if (!walkthroughVideoData?.length) {
    return null;
  }
  const isLocked = !lesson.completed;
  const percentage = lesson.walkthroughVideoWatchedPercentage;

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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLocked || !walkthroughVideoData.length) {
      return;
    }
    showVideoWalkthrough({ playbackId: walkthroughVideoData[0].id, lessonSlug: lesson.lesson.slug });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      if (isLocked || !walkthroughVideoData.length) {
        return;
      }
      showVideoWalkthrough({ playbackId: walkthroughVideoData[0].id, lessonSlug: lesson.lesson.slug });
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
        <div className={styles.label}>Walkthrough</div>
      </div>
      <div className={styles.back}>
        <svg viewBox="0 0 24 24">
          <polygon points="5,3 19,12 5,21" />
        </svg>
        <div className={styles.backLabel}>Watch</div>
      </div>
    </div>
  );
}
