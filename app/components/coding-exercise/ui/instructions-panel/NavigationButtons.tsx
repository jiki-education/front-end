import InstructionsIcon from "@/icons/instructions.svg";
import FolderIcon from "@/icons/folder.svg";
import FunctionsIcon from "@/icons/functions.svg";
import styles from "./instructions-panel.module.css";

interface NavigationButtonsProps {
  activeSection: string;
  onNavigateToInstructions: () => void;
  onNavigateToFunctions: () => void;
  onNavigateToConceptLibrary: () => void;
  className?: string;
}

export default function NavigationButtons({
  activeSection,
  onNavigateToInstructions,
  onNavigateToFunctions,
  onNavigateToConceptLibrary,
  className = ""
}: NavigationButtonsProps) {
  return (
    <div className={`${styles.navigationButtons} ${className}`}>
      <button
        onClick={onNavigateToInstructions}
        className={`${styles.navigationButton} ${
          activeSection === "instructions" ? styles.navigationButtonActive : styles.navigationButtonInactive
        }`}
        title="Instructions"
      >
        <InstructionsIcon width={20} height={20} />
      </button>
      <button
        onClick={onNavigateToFunctions}
        className={`${styles.navigationButton} ${
          activeSection === "functions" ? styles.navigationButtonActive : styles.navigationButtonInactive
        }`}
        title="Functions"
      >
        <FunctionsIcon width={20} height={20} />
      </button>
      <button
        onClick={onNavigateToConceptLibrary}
        className={`${styles.navigationButton} ${
          activeSection === "concept-library" ? styles.navigationButtonActive : styles.navigationButtonInactive
        }`}
        title="Concept Library"
      >
        <FolderIcon width={20} height={20} />
      </button>
    </div>
  );
}
