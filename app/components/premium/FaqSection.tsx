import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { useTranslations } from "next-intl";
import Link from "next/link";
import styles from "./PremiumPage.module.css";
import { FAQ_ITEMS } from "./pricing.data";

export default function FaqSection() {
  const t = useTranslations("premium.faq");
  const routes = useLocaleRoutes();
  return (
    <div className={styles["faq-section"]}>
      <div className={styles["faq-inner"]}>
        <h2 className={styles["faq-title"]}>{t("title")}</h2>
        <div className={styles["faq-list"]}>
          {FAQ_ITEMS.map((item) => {
            const question = t(item.questionKey as Parameters<typeof t>[0]);
            return (
              <details key={item.questionKey} className={styles["faq-item"]}>
                <summary>{question}</summary>
                <div className={styles["faq-answer"]}>
                  <p>
                    {t.rich(item.answerKey as Parameters<typeof t.rich>[0], {
                      link: (chunks) => <Link href={routes.article("support")}>{chunks}</Link>
                    })}
                  </p>
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </div>
  );
}
