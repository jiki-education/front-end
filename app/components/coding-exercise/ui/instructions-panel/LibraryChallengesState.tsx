import { useTranslations } from "next-intl";
import { LibraryWrapper } from "./LibrarySection";
import { OpenConceptLibraryButton } from "./LibraryWithConcepts";
import styles from "./instructions-panel.module.css";

export default function LibraryChallengesState() {
  const t = useTranslations("codingExercise.instructionsPanel");
  return (
    <LibraryWrapper>
      <div className={styles.libraryPlaceholderBox}>{t("libraryChallenges")}</div>
      <OpenConceptLibraryButton />
    </LibraryWrapper>
  );
}
