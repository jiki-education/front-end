import FileIcon from "@/icons/file.svg";
import FolderIcon from "@/icons/folder.svg";
import ProjectIcon from "@/icons/projects.svg";
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
        <FileIcon width={16} height={16} />
      </button>
      <button
        onClick={onNavigateToFunctions}
        className={`${styles.navigationButton} ${
          activeSection === "functions" ? styles.navigationButtonActive : styles.navigationButtonInactive
        }`}
        title="Functions"
      >
        <ProjectIcon width={16} height={16} />
      </button>
      <button
        onClick={onNavigateToConceptLibrary}
        className={`${styles.navigationButton} ${
          activeSection === "concept-library" ? styles.navigationButtonActive : styles.navigationButtonInactive
        }`}
        title="Concept Library"
      >
        <FolderIcon width={16} height={16} />
      </button>
    </div>
  );
}
