import { useTranslations } from "next-intl";
import styles from "./Exercism.module.css";
import shared from "./shared.module.css";

export function Exercism() {
  const t = useTranslations("landing.exercism");
  return (
    <section className={styles.exercism}>
      <div className={shared["lg-container"]}>
        <h2>{t("heading")}</h2>
        <p className={styles.intro}>
          {t.rich("intro", {
            strong: (chunks) => <strong className={styles.strong}>{chunks}</strong>
          })}
        </p>
        <ul>
          <li>
            <div className={styles.emoji}>
              <span className="ui-emoji">🧑‍💻</span>
            </div>
            <div className={styles.count}>{t("studentsCount")}</div>
            <div className={styles.title}>{t("studentsTitle")}</div>
            <p>{t("studentsDesc")}</p>
          </li>
          <li>
            <div className={styles.emoji}>👏</div>
            <div className={styles.count}>{t("testimonialsCount")}</div>
            <div className={styles.title}>{t("testimonialsTitle")}</div>
            <p>{t("testimonialsDesc")}</p>
          </li>
          <li>
            <div className={styles.emoji}>🧩</div>
            <div className={styles.count}>{t("exercisesCount")}</div>
            <div className={styles.title}>{t("exercisesTitle")}</div>
            <p>{t("exercisesDesc")}</p>
          </li>
          <li>
            <div className={styles.emoji}>👯</div>
            <div className={styles.count}>{t("mentoringCount")}</div>
            <div className={styles.title}>{t("mentoringTitle")}</div>
            <p>{t("mentoringDesc")}</p>
          </li>
        </ul>
      </div>
    </section>
  );
}
