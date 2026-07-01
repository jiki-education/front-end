import { useTranslations } from "next-intl";
import Link from "next/link";
import styles from "./PremiumPage.module.css";
import { FAQ_ITEMS } from "./pricing.data";

export default function FaqSection() {
  const t = useTranslations("premium.faq");
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
                    {item.answerLinkKeyPrefix ? (
                      <>
                        {t(`${item.answerLinkKeyPrefix}Prefix` as Parameters<typeof t>[0])}
                        <Link href="/articles/support">
                          {t(`${item.answerLinkKeyPrefix}Link` as Parameters<typeof t>[0])}
                        </Link>
                        {t(`${item.answerLinkKeyPrefix}Suffix` as Parameters<typeof t>[0])}
                      </>
                    ) : (
                      t(item.answerKey as Parameters<typeof t>[0])
                    )}
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
