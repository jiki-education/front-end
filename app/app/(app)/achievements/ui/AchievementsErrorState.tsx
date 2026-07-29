import { PageHeader } from "@/components/ui-kit/PageHeader";
import { useTranslations } from "next-intl";
import MedalIcon from "@/icons/medal.svg";
import styles from "./AchievementsErrorState.module.css";

interface AchievementsErrorStateProps {
  error: string;
}

export function AchievementsErrorState({ error }: AchievementsErrorStateProps) {
  const t = useTranslations("achievements");
  const tCommon = useTranslations("common");
  return (
    <PageHeader icon={<MedalIcon />} title={t("title")} description={t("description")}>
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.message}>{t("error", { error })}</p>
          <button onClick={() => window.location.reload()} className={styles.button}>
            {tCommon("retry")}
          </button>
        </div>
      </div>
    </PageHeader>
  );
}
