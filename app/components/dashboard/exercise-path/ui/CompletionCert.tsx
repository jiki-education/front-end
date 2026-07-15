import TrophyIcon from "@/icons/trophy.svg";
import { useTranslations } from "next-intl";
import styles from "./CompletionCert.module.css";

interface CompletionCertProps {
  completedCount: number;
  totalCount: number;
}

export function CompletionCert({ completedCount, totalCount }: CompletionCertProps) {
  const t = useTranslations("dashboard.exercisePath.completionCert");
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className={`${styles.card} ${percentage === 100 ? styles.complete : ""}`}>
      <div className={styles.badge}>
        <TrophyIcon />
      </div>
      <div className={styles.outer}>
        <div className={styles.inner}>
          <div className={styles.title}>{t("title")}</div>
          <div className={styles.subtitle}>{t("description")}</div>
          <div className={styles.bar}>
            <div className={styles.barFill} style={{ width: `${percentage}%` }} />
          </div>
          <div className={styles.barText}>{t("progress", { percentage })}</div>
        </div>
      </div>
    </div>
  );
}
