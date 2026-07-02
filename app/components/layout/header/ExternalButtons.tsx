import { useTranslations } from "next-intl";
import Link from "next/link";
import styles from "./external.module.css";

export default function ExternalButtons() {
  const t = useTranslations("layout.externalHeader");

  return (
    <>
      <div className="flex items-center gap-4 text-gray-700 max-[719px]:hidden">
        <Link href="https://jiki.io/blog/the-backstory-of-jiki" className={styles.navLink}>
          {t("aboutJiki")}
        </Link>
        <Link href="/concepts" className={styles.navLink}>
          {t("codingConcepts")}
        </Link>
        <Link href="/premium" className={styles.navLink}>
          {t("premium")}
        </Link>
        <Link href="/testimonials" className={styles.navLink}>
          {t("testimonials")}
        </Link>
      </div>

      <div className="flex items-center gap-12 ml-auto">
        <Link href="/auth/login" className="ui-btn ui-btn-small ui-btn-secondary">
          {t("login")}
        </Link>
        <Link href="/auth/signup" className="ui-btn ui-btn-small ui-btn-primary">
          {t("signUp")}
        </Link>
      </div>
    </>
  );
}
