import { useTranslations } from "next-intl";
import { LibraryWrapper } from "./LibrarySection";
import styles from "./instructions-panel.module.css";

export default function LibraryEmptyState() {
  const t = useTranslations("codingExercise.instructionsPanel");
  return (
    <LibraryWrapper>
      <div className={styles.libraryPlaceholderBox}>{t("libraryEmpty")}</div>
    </LibraryWrapper>
  );
}
