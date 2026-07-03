import { useTranslations } from "next-intl";
import DeleteAccountLayout from "./DeleteAccountLayout";
import ErrorRobot from "./robots/ErrorRobot";
import styles from "./states.module.css";

export default function ErrorState() {
  const t = useTranslations("misc.deleteAccount");
  return (
    <DeleteAccountLayout>
      <ErrorRobot />
      <h1 className={styles.titleError}>{t("errorTitle")}</h1>
      <p className={styles.subtitle}>{t("errorSubtitle")}</p>
    </DeleteAccountLayout>
  );
}
