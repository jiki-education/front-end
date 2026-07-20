import ClockIcon from "@/icons/clock.svg";
import { useTranslations } from "next-intl";
import styles from "./ComingSoonCard.module.css";

export function ComingSoonCard() {
  const t = useTranslations("dashboard.exercisePath.comingSoon");
  return (
    <div className={styles.card}>
      <div className={styles.badge}>
        <ClockIcon />
      </div>
      <div className={styles.outer}>
        <div className={styles.inner}>
          <div className={styles.title}>{t("title")}</div>
          <div className={styles.subtitle}>{t("description")}</div>
        </div>
      </div>
    </div>
  );
}
