import WalkthroughIcon from "@/icons/walkthrough.svg";
import type { LessonDisplayData } from "../types";
import { showVideoWalkthrough } from "@/lib/modal/store";
import { useState, useEffect } from "react";
import styles from "./WalkthroughCard.module.css";

interface WalkthroughCardProps {
  lesson: LessonDisplayData;
  isUnlocking?: boolean;
}

export function WalkthroughCard({ lesson, isUnlocking }: WalkthroughCardProps) {
  const [animationDismissed, setAnimationDismissed] = useState(false);

  useEffect(() => {
    if (isUnlocking) {
      setAnimationDismissed(false);
    }
  }, [isUnlocking]);

  const walkthroughVideoData = lesson.lesson.walkthrough_video_data;
  if (!walkthroughVideoData || walkthroughVideoData.length === 0) {
    return null;
  }

  const isLocked = lesson.locked;
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
    if (isLocked) {
      return;
    }
    showVideoWalkthrough({ playbackId: walkthroughVideoData[0].id, lessonSlug: lesson.lesson.slug });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      if (isLocked) {
        return;
      }
      showVideoWalkthrough({ playbackId: walkthroughVideoData[0].id, lessonSlug: lesson.lesson.slug });
    }
  };

  const showUnlockAnimation = isUnlocking && !animationDismissed;

  const handleMouseEnter = () => {
    if (showUnlockAnimation) {
      setAnimationDismissed(true);
    }
  };

  return (
    <div
      className={`${styles.walkthroughCard} ${getStateClass()}${showUnlockAnimation ? ` ${styles.animatingUnlock}` : ""}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      role="button"
      tabIndex={isLocked ? -1 : 0}
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
