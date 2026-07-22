import { useTranslations } from "next-intl";
import { PanelHeader } from "./PanelHeader";
import styles from "./ChatHeader.module.css";

export function ChatHeader() {
  const t = useTranslations("codingExercise.chatHeader");
  return (
    <div className={styles.chatHeader}>
      <PanelHeader title={t("title")} description={t("description")} />
    </div>
  );
}
