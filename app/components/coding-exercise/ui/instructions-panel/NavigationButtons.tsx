import FileIcon from "@/icons/file.svg";
import FolderIcon from "@/icons/folder.svg";
import SearchIcon from "@/icons/search.svg";

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
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={onNavigateToInstructions}
        className={`p-2 rounded-md transition-colors ${
          activeSection === "instructions" 
            ? "bg-blue-100 text-blue-600" 
            : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        }`}
        title="Instructions"
      >
        <FileIcon width={16} height={16} />
      </button>
      <button
        onClick={onNavigateToFunctions}
        className={`p-2 rounded-md transition-colors ${
          activeSection === "functions" 
            ? "bg-blue-100 text-blue-600" 
            : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        }`}
        title="Functions"
      >
        <FolderIcon width={16} height={16} />
      </button>
      <button
        onClick={onNavigateToConceptLibrary}
        className={`p-2 rounded-md transition-colors ${
          activeSection === "concept-library" 
            ? "bg-blue-100 text-blue-600" 
            : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        }`}
        title="Concept Library"
      >
        <SearchIcon width={16} height={16} />
      </button>
    </div>
  );
}