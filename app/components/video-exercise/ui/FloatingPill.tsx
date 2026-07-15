import Tooltip from "@/components/ui/Tooltip";
import { useTranslations } from "next-intl";
import { ProgressRing } from "./ProgressRing";
import styles from "../VideoExercise.module.css";

interface FloatingPillProps {
  videoWatched: boolean;
  videoProgress: number;
  showCheckmark: boolean;
  isAlreadyCompleted: boolean;
  lessonTitle: string;
  isMarking: boolean;
  onContinue: () => void;
}

export function FloatingPill({
  videoWatched,
  videoProgress,
  showCheckmark,
  isAlreadyCompleted,
  lessonTitle,
  isMarking,
  onContinue
}: FloatingPillProps) {
  const t = useTranslations("videoExercise");
  const tCommon = useTranslations("common");

  return (
    <div className={`${styles.floatingPill} ${!videoWatched ? styles.floatingPillDisabled : ""}`}>
      <div className={styles.pillInfo}>
        <ProgressRing
          progress={videoProgress}
          isComplete={videoWatched}
          showCheckmark={showCheckmark}
          isAlreadyCompleted={isAlreadyCompleted}
        />
        <div className={styles.pillText}>
          <span className={styles.label}>{videoWatched ? t("pill.complete") : t("pill.progress")}</span>
          <span className={styles.value}>
            {videoWatched
              ? t.rich("pill.finished", {
                  name: lessonTitle,
                  title: (chunks) => (
                    <span className={`${styles.videoTitle} ${styles.videoTitleComplete}`}>{chunks}</span>
                  )
                })
              : t.rich("pill.watching", {
                  name: lessonTitle,
                  title: (chunks) => <span className={styles.videoTitle}>{chunks}</span>
                })}
          </span>
        </div>
      </div>

      <div className={styles.continueWrapper}>
        <Tooltip content={t("pill.finishTooltip")} disabled={videoWatched}>
          <button
            className={`ui-btn ui-btn-default ${
              videoWatched ? "ui-btn-primary ui-btn-green" : "ui-btn-secondary ui-btn-gray"
            } ${isMarking ? "ui-btn-loading" : ""}`}
            onClick={onContinue}
            disabled={!videoWatched || isMarking}
          >
            {isMarking ? tCommon("saving") : tCommon("continue")}
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
