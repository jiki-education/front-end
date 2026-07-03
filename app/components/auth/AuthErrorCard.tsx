import { useTranslations } from "next-intl";
import Link from "next/link";
import ShieldXIcon from "@/icons/shield-x.svg";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import styles from "./AuthForm.module.css";

interface AuthErrorCardProps {
  title: string;
  message: string;
  ctaHref: string;
  ctaText: string;
}

/**
 * Error message shown on auth pages when an operation fails
 * (expired confirmation link, failed OAuth sign-in, etc.).
 */
export function AuthErrorCard({ title, message, ctaHref, ctaText }: AuthErrorCardProps) {
  const t = useTranslations("auth.errorCard");
  const routes = useLocaleRoutes();
  return (
    <div className={styles.leftSide}>
      <div className={styles.formContainer}>
        <div className={styles.confirmationMessage}>
          <div className={styles.confirmationIconError}>
            <ShieldXIcon />
          </div>
          <h2>{title}</h2>
          <div className={styles.confirmationCard}>
            <p className={styles.confirmationCardText}>{message}</p>
            <Link
              href={ctaHref}
              className="ui-btn ui-btn-large ui-btn-primary"
              style={{ display: "inline-flex", width: "100%", textDecoration: "none" }}
            >
              {ctaText}
            </Link>
            <p className={styles.confirmationCardFooter}>
              {t("needHelpPrefix")}
              <Link href={routes.article("support")} className="ui-link">
                {t("contactSupport")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
