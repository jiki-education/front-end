import { useTranslations } from "next-intl";
import Link from "next/link";
import EnvelopeIcon from "@/icons/envelope.svg";
import styles from "./AuthForm.module.css";

interface CheckInboxMessageProps {
  email: string;
}

export function CheckInboxMessage({ email }: CheckInboxMessageProps) {
  const t = useTranslations("auth.checkInbox");
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
              {t("hintPrefix")}
              <Link href={`/auth/resend-confirmation?email=${encodeURIComponent(email)}`} className="ui-link">
                {t("resendLink")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
