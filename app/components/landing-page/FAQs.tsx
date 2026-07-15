import { useTranslations } from "next-intl";
import { MonthlyPrice } from "./MonthlyPrice";
import styles from "./FAQs.module.css";

export function FAQs() {
  const t = useTranslations("landing.faqs");
  const tCommon = useTranslations("common");
  const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;
  return (
    <section className={styles.faqs}>
      <div className={styles.background}></div>
      <div className={styles.container}>
        <h2>{t("heading")}</h2>
        <p className={styles.intro}>
          {t("introPrefix")}
          <a href="mailto:hello@jiki.io">{t("introLink")}</a>
        </p>
        <div className={styles.faq}>
          <h4>{t("q1")}</h4>
          <p>{t.rich("q1a1", { strong })}</p>
          <p>
            {t.rich("q1a2Prefix", { strong })}
            <strong>
              <MonthlyPrice />
              {tCommon("perMonth")}
            </strong>
            {t("q1a2Suffix")}
          </p>
          <ul>
            <li>{t.rich("q1Item1", { strong })}</li>
            <li>{t.rich("q1Item2", { strong })}</li>
            <li>{t.rich("q1Item3", { strong })}</li>
            <li>{t.rich("q1Item4", { strong })}</li>
            <li>{t.rich("q1Item5", { strong })}</li>
            <li>{t.rich("q1Item6", { strong })}</li>
            <li>{t.rich("q1Item7", { strong })}</li>
          </ul>
        </div>
        <div className={styles.faq}>
          <h4>{t("q2")}</h4>
          <p>{t.rich("q2a", { strong })}</p>
        </div>
        <div className={styles.faq}>
          <h4>{t("q3")}</h4>
          <p>{t("q3a1")}</p>
          <p>{t("q3a2")}</p>
        </div>
        <div className={styles.faq}>
          <h4>{t("q4")}</h4>
          <p>{t("q4a1")}</p>
          <p>{t.rich("q4a2", { strong })}</p>
        </div>
        <div className={styles.faq}>
          <h4>{t("q5")}</h4>
          <p>{t("q5a1")}</p>
          <p>{t("q5a2")}</p>
        </div>
      </div>
    </section>
  );
}
