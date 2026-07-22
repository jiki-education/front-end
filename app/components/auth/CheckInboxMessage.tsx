import { useTranslations } from "next-intl";
import Link from "next/link";
import EnvelopeIcon from "@/icons/envelope.svg";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import styles from "./AuthForm.module.css";

interface CheckInboxMessageProps {
  email: string;
}

export function CheckInboxMessage({ email }: CheckInboxMessageProps) {
  const t = useTranslations("auth.checkInbox");
  const routes = useLocaleRoutes();
  return (
    <div className={styles.leftSide}>
      <div className={styles.formContainer}>
        <div className={styles.confirmationMessage}>
          <div className={styles.confirmationIcon}>
            <EnvelopeIcon />
          </div>
          <h2>{t("heading")}</h2>
          <div className={styles.confirmationCard}>
            <p className={styles.confirmationText}>{t("sentTo")}</p>
            <p className={styles.confirmationEmail}>{email}</p>
            <p className={styles.confirmationHint}>
              {t.rich("hint", {
                link: (chunks) => (
                  <Link
                    href={`${routes.authResendConfirmation()}?email=${encodeURIComponent(email)}`}
                    className="ui-link"
                  >
                    {chunks}
                  </Link>
                )
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
