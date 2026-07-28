import { PageHeader } from "@/components/ui-kit/PageHeader";
import { useTranslations } from "next-intl";
import MedalIcon from "@/icons/medal.svg";
import styles from "./AchievementsLoadingState.module.css";

export function AchievementsLoadingState() {
  const t = useTranslations("achievements");
  return (
    <PageHeader icon={<MedalIcon />} title={t("title")} description={t("description")}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.spinner}></div>
          <p className={styles.message}>{t("loading")}</p>
        </div>
      </div>
    </PageHeader>
  );
}
