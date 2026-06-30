import { useTranslations } from "next-intl";
import styles from "./AuthForm.module.css";

export function EmailConfirmedMessage() {
  const t = useTranslations("auth.emailConfirmed");
  return (
    <div className={styles.leftSide}>
      <div className={styles.formContainer}>
        <div className={styles.confirmationMessage}>
          <div className={styles.confirmationIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2>{t("heading")}</h2>
          <div className={styles.confirmationCard}>
            <p className={styles.confirmationCardText} style={{ marginBottom: 0 }}>
              {t("message")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
