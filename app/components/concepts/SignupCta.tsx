import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import styles from "./SignupCta.module.css";

export function SignupCta() {
  const routes = useLocaleRoutes();
  const t = useTranslations("concepts.signupCta");
  return (
    <div className={styles.wrapper}>
      <div className={styles.cta}>
        <h2 className={styles.title}>{t("title")}</h2>
        <p className={styles.subtitle}>{t("subtitle")}</p>
        <Link href={routes.authSignup()} className={styles.button}>
          {t("button")}
        </Link>
      </div>
    </div>
  );
}
