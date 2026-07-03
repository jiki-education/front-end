import { useTranslations } from "next-intl";
import settingsStyles from "../Settings.module.css";
import styles from "./CancelSection.module.css";

interface CancelSectionProps {
  onCancelClick: () => void;
}

export function CancelSection({ onCancelClick }: CancelSectionProps) {
  const t = useTranslations("settings.cancelSectionPanel");
  return (
    <div className={settingsStyles.settingItem}>
      <h3>{t("title")}</h3>
      <div className={styles.settingRow}>
        <p>{t("description")}</p>
        <button className="ui-btn ui-btn-small ui-btn-secondary ui-btn-gray" onClick={onCancelClick}>
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}
