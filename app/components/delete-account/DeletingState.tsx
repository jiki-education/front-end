import AnimatedDots from "@/components/ui/AnimatedDots";
import { useTranslations } from "next-intl";
import DeleteAccountLayout from "./DeleteAccountLayout";
import styles from "./states.module.css";

export default function DeletingState() {
  const t = useTranslations("misc.deleteAccount");
  return (
    <DeleteAccountLayout>
      <div className={styles.spinner} />
      <h1 className={styles.title}>{t("deletingTitle")}</h1>
      <p className={styles.subtitle}>
        {t("deletingSubtitle")}
        <AnimatedDots />
      </p>
    </DeleteAccountLayout>
  );
}
