import { useTranslations } from "next-intl";
import DeleteAccountLayout from "./DeleteAccountLayout";
import SadRobot from "./robots/SadRobot";
import styles from "./states.module.css";

export default function DeletedState() {
  const t = useTranslations("misc.deleteAccount");
  return (
    <DeleteAccountLayout>
      <SadRobot />
      <h1 className={styles.title}>{t("deletedTitle")}</h1>
      <p className={styles.subtitle}>{t("deletedSubtitle")}</p>
    </DeleteAccountLayout>
  );
}
