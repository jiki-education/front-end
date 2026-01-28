import type { VideoSource } from "@/types/lesson";
import styles from "../VideoExercise.module.css";

interface NoVideoPlaceholderProps {
  videoSource: VideoSource | undefined;
}

export function NoVideoPlaceholder({ videoSource }: NoVideoPlaceholderProps) {
  return (
    <div className={styles.noVideoPlaceholder}>
      <div className={styles.noVideoContent}>
        <svg className={styles.noVideoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className={styles.noVideoText}>No video source available</p>
        {videoSource && <p className={styles.noVideoHost}>Host: {videoSource.host}</p>}
      </div>
    </div>
  );
}
