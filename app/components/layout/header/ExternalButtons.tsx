import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import styles from "./external.module.css";

export default function ExternalButtons() {
  const t = useTranslations("layout.externalHeader");
  const routes = useLocaleRoutes();

  return (
    <>
      <div className="flex items-center gap-4 text-gray-700 max-[719px]:hidden">
        <Link href="https://jiki.io/blog/the-backstory-of-jiki" className={styles.navLink}>
          {t("aboutJiki")}
        </Link>
        <Link href={routes.concepts()} className={styles.navLink}>
          {t("codingConcepts")}
        </Link>
        <Link href={routes.premium()} className={styles.navLink}>
          {t("premium")}
        </Link>
        <Link href={routes.testimonials()} className={styles.navLink}>
          {t("testimonials")}
        </Link>
      </div>

      <div className="flex items-center gap-12 ml-auto">
        <Link href={routes.authLogin()} className="ui-btn ui-btn-small ui-btn-secondary">
          {t("login")}
        </Link>
        <Link href={routes.authSignup()} className="ui-btn ui-btn-small ui-btn-primary">
          {t("signUp")}
        </Link>
      </div>
    </>
  );
}
