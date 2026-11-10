import { useTranslations } from "next-intl";
import { LifetimePrice } from "./LifetimePrice";
import { FAQItem } from "./faqs/FAQItem";
import styles from "./FAQs.module.css";

export function FAQs() {
  const t = useTranslations("landing.faqs");
  const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;

  return (
    <section className={styles.faqs}>
      <div className={styles.container}>
        <h2 className={styles.heading}>{t("heading")}</h2>
        <p className={styles.intro}>
          {t.rich("intro", {
            link: (chunks) => (
              <a className={styles.introLink} href="mailto:hello@jiki.io">
                {chunks}
              </a>
            )
          })}
        </p>

        <FAQItem question={t("q1")}>
          <p>{t.rich("q1a1", { strong })}</p>
          <p>
            {t.rich("q1a2", {
              strong,
              price: () => (
                <strong>
                  <LifetimePrice />
                </strong>
              )
            })}
          </p>
          <ul>
            <li>{t.rich("q1Item2", { strong })}</li>
            <li>{t.rich("q1Item3", { strong })}</li>
            <li>{t.rich("q1Item4", { strong })}</li>
            <li>{t.rich("q1Item5", { strong })}</li>
            <li>{t.rich("q1Item6", { strong })}</li>
            <li>{t.rich("q1Item7", { strong })}</li>
          </ul>
        </FAQItem>

        <FAQItem question={t("q2")}>
          <p>{t.rich("q2a", { strong })}</p>
        </FAQItem>

        <FAQItem question={t("q3")}>
          <p>{t("q3a1")}</p>
          <p>{t("q3a2")}</p>
        </FAQItem>

        <FAQItem question={t("q4")}>
          <p>{t("q4a1")}</p>
        </FAQItem>

        <FAQItem question={t("q5")}>
          <p>{t("q5a1")}</p>
          <p>{t("q5a2")}</p>
        </FAQItem>
      </div>
    </section>
  );
}
