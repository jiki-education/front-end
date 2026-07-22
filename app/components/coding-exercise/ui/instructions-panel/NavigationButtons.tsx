import { useTranslations } from "next-intl";
import InstructionsIcon from "@/icons/instructions.svg";
import FolderIcon from "@/icons/folder.svg";
import FunctionsIcon from "@/icons/functions.svg";
import styles from "./instructions-panel.module.css";

interface NavigationButtonsProps {
  activeSection: string;
  hasFunctions: boolean;
  onNavigateToInstructions: () => void;
  onNavigateToFunctions: () => void;
  onNavigateToConceptLibrary: () => void;
  className?: string;
}

export default function NavigationButtons({
  activeSection,
  hasFunctions,
  onNavigateToInstructions,
  onNavigateToFunctions,
  onNavigateToConceptLibrary,
  className = ""
}: NavigationButtonsProps) {
  const t = useTranslations("codingExercise.instructionsPanel");
  return (
    <div className={`${styles.navigationButtons} ${className}`}>
      <button
        onClick={onNavigateToInstructions}
        className={`${styles.navigationButton} ${
          activeSection === "instructions" ? styles.navigationButtonActive : styles.navigationButtonInactive
        }`}
        title={t("instructionsTitle")}
      >
        <InstructionsIcon width={20} height={20} />
      </button>
      {hasFunctions && (
        <button
          onClick={onNavigateToFunctions}
          className={`${styles.navigationButton} ${
            activeSection === "functions" ? styles.navigationButtonActive : styles.navigationButtonInactive
          }`}
          title={t("functionsTitle")}
        >
          <FunctionsIcon width={20} height={20} />
        </button>
      )}
      <button
        onClick={onNavigateToConceptLibrary}
        className={`${styles.navigationButton} ${
          activeSection === "concept-library" ? styles.navigationButtonActive : styles.navigationButtonInactive
        }`}
        title={t("conceptLibraryTitle")}
      >
        <FolderIcon width={20} height={20} />
      </button>
    </div>
  );
}
