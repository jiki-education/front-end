import Image from "next/image";
import NavigationButtons from "./NavigationButtons";

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
    <div className={`flex-shrink-0 border-b border-gray-200 bg-white transition-all duration-300 ${
      isExpanded ? "px-6 py-6" : "px-6 py-4"
    }`}>
      {isExpanded ? (
        /* Expanded Header */
        <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
          {/* Exercise Icon - spans 2 rows */}
          <div className="row-span-2">
            <Image
              src={exerciseData.icon}
              alt="Exercise Icon"
              width={64}
              height={64}
              className="rounded-lg"
            />
          </div>
          
          {/* Top row: Exercise info */}
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-600">
              Exercise {exerciseData.progress} - {exerciseData.level}
            </p>
          </div>
          
          {/* Navigation buttons - center aligned */}
          <NavigationButtons
            activeSection={activeSection}
            onNavigateToInstructions={onNavigateToInstructions}
            onNavigateToFunctions={onNavigateToFunctions}
            onNavigateToConceptLibrary={onNavigateToConceptLibrary}
            className="row-span-2"
          />
          
          {/* Bottom row: Exercise title */}
          <div>
            <h1 className="text-xl font-bold text-gray-900">{exerciseData.title}</h1>
          </div>
        </div>
      ) : (
        /* Collapsed Header */
        <div className="flex items-center justify-between">
          {/* LHS - Dynamic section title */}
          <h2 className="text-lg font-semibold text-gray-900">{getSectionTitle()}</h2>
          
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