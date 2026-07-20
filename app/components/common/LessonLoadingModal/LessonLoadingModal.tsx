import { useTranslations } from "next-intl";
import styles from "./LessonLoadingModal.module.css";

export default function LessonLoadingModal() {
  const t = useTranslations("lesson.loadingModal");

  return (
    <div className={styles.container}>
      <div className={styles.processingVisual}>
        <div className={styles.outerRing} />
        <div className={styles.middleRing} />

        <div className={styles.innerCircle}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M20 21a8 8 0 0 0-16 0" />
          </svg>
        </div>
      </div>

      <div className={styles.loadingText}>
        <div className={styles.loadingTitle}>
          {t("title")}
          <span className={styles.ellipsis}>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>
        <div className={styles.loadingSubtitle}>{t("subtitle")}</div>
      </div>
    </div>
  );
}
