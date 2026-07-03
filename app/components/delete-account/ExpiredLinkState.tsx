import { useTranslations } from "next-intl";
import Link from "next/link";
import DeleteAccountLayout from "./DeleteAccountLayout";
import ErrorRobot from "./robots/ErrorRobot";
import styles from "./states.module.css";

export default function ExpiredLinkState() {
  const t = useTranslations("misc.deleteAccount");
  return (
    <DeleteAccountLayout>
      <ErrorRobot />
      <h1 className={styles.titleError}>{t("expiredTitle")}</h1>
      <p className={styles.subtitle}>{t("expiredSubtitle")}</p>
      <p className={styles.subtitleSecondary}>{t("expiredSecondary")}</p>
      <Link href="/" className={styles.homeLink}>
        {t("goHome")}
      </Link>
    </DeleteAccountLayout>
  );
}
