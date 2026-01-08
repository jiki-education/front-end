import Image from "next/image";
import NavigationButtons from "./NavigationButtons";
import styles from "./instructions-panel.module.css";

interface ExerciseData {
  title: string;
  progress: string;
  level: string;
  icon: string;
}

interface DynamicHeaderProps {
  isExpanded: boolean;
  activeSection: string;
  exerciseData: ExerciseData;
  onNavigateToInstructions: () => void;
  onNavigateToFunctions: () => void;
  onNavigateToConceptLibrary: () => void;
  getSectionTitle: () => string;
}

export default function DynamicHeader({
  isExpanded,
  activeSection,
  exerciseData,
  onNavigateToInstructions,
  onNavigateToFunctions,
  onNavigateToConceptLibrary,
  getSectionTitle
}: DynamicHeaderProps) {
  return (
    <div className={`${styles.dynamicHeader} ${isExpanded ? styles.expandedHeader : styles.collapsedHeader}`}>
      {isExpanded ? (
        /* Expanded Header */
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-16">
            <Image
              src={exerciseData.icon}
              alt="Exercise Icon"
              width={80}
              height={80}
              className={styles.exerciseIconImage}
            />

            <div className="flex flex-col gap-4">
              <h1 className={styles.exerciseTitle}>{exerciseData.title}</h1>
              <p className={styles.exerciseInfoText}>
                Exercise {exerciseData.progress} • {exerciseData.level}
              </p>
            </div>
          </div>

          {/* Navigation buttons - center aligned */}
          <NavigationButtons
            activeSection={activeSection}
            onNavigateToInstructions={onNavigateToInstructions}
            onNavigateToFunctions={onNavigateToFunctions}
            onNavigateToConceptLibrary={onNavigateToConceptLibrary}
            className={styles.navigationButtonsExpanded}
          />

          {/* Bottom row: Exercise title */}
        </div>
      ) : (
        /* Collapsed Header */
        <div className={styles.collapsedGrid}>
          {/* LHS - Dynamic section title */}
          <h2 className={styles.sectionTitle}>{getSectionTitle()}</h2>

          {/* RHS - Navigation buttons */}
          <NavigationButtons
            activeSection={activeSection}
            onNavigateToInstructions={onNavigateToInstructions}
            onNavigateToFunctions={onNavigateToFunctions}
            onNavigateToConceptLibrary={onNavigateToConceptLibrary}
          />
        </div>
      )}
    </div>
  );
}

export type { ExerciseData };
