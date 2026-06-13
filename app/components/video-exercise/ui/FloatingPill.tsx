import Tooltip from "@/components/ui/Tooltip";
import { ProgressRing } from "./ProgressRing";
import styles from "../VideoExercise.module.css";

interface FloatingPillProps {
  videoWatched: boolean;
  videoProgress: number;
  showCheckmark: boolean;
  isAlreadyCompleted: boolean;
  lessonTitle: string;
  isMarking: boolean;
  canSkip: boolean;
  onContinue: () => void;
}

export function FloatingPill({
  videoWatched,
  videoProgress,
  showCheckmark,
  isAlreadyCompleted,
  lessonTitle,
  isMarking,
  canSkip,
  onContinue
}: FloatingPillProps) {
  const continueEnabled = videoWatched || canSkip;
  const continueLabel = !videoWatched && canSkip ? "Skip" : "Continue";

  return (
    <div className={`${styles.floatingPill} ${!continueEnabled ? styles.floatingPillDisabled : ""}`}>
      <div className={styles.pillInfo}>
        <ProgressRing
          progress={videoProgress}
          isComplete={videoWatched}
          showCheckmark={showCheckmark}
          isAlreadyCompleted={isAlreadyCompleted}
        />
        <div className={styles.pillText}>
          <span className={styles.label}>{videoWatched ? "Lesson Complete" : "Lesson Progress"}</span>
          <span className={styles.value}>
            {videoWatched ? "Finished" : "Watching"}{" "}
            <span className={`${styles.videoTitle} ${videoWatched ? styles.videoTitleComplete : ""}`}>
              {lessonTitle}
            </span>
          </span>
        </div>
      </div>

      <div className={styles.continueWrapper}>
        <Tooltip content="Finish watching to continue" disabled={continueEnabled}>
          <button
            className={`ui-btn ui-btn-default ${
              videoWatched ? "ui-btn-primary ui-btn-green" : "ui-btn-secondary ui-btn-gray"
            } ${isMarking ? "ui-btn-loading" : ""}`}
            onClick={onContinue}
            disabled={!continueEnabled || isMarking}
          >
            {isMarking ? "Saving..." : continueLabel}
            {!isMarking && (
              <svg viewBox="0 0 24 24" className={styles.buttonIcon}>
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
              </svg>
            )}
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
