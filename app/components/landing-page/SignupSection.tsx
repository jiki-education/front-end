import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import styles from "./SignupSection.module.css";
import shared from "./shared.module.css";

export function SignupSection() {
  const t = useTranslations("landing.signupSection");
  const routes = useLocaleRoutes();
  const strong = (chunks: React.ReactNode) => <strong className={styles.strong}>{chunks}</strong>;
  return (
    <section className={styles["signup-section"]}>
      <div className={styles["lhs-bg"]}></div>
      <div className={styles["rhs-bg"]}></div>
      <div className={`${shared["lg-container"]} ${styles.inner}`}>
        <h2 className={styles.heading}>{t.rich("heading", { strong })}</h2>
        <p className={styles.intro}>{t.rich("intro", { strong })}</p>
        <Link href={routes.authSignup()} className="ui-btn ui-btn-xlarge ui-btn-primary">
          {t("button")}
        </Link>
      </div>
    </section>
  );
}
