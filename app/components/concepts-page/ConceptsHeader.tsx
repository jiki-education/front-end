import Breadcrumb from "./Breadcrumb";
import FolderIcon from "../../public/icons/folder.svg";

interface ConceptsHeaderProps {
  isAuthenticated: boolean;
}

export default function ConceptsHeader({ isAuthenticated }: ConceptsHeaderProps) {
  const breadcrumbItems = [
    { label: "Library:", isLabel: true },
    { label: "All Concepts", isCurrent: true }
  ];

  return (
    <header>
      <Breadcrumb items={breadcrumbItems} />

      <h1 className="page-heading">
        <FolderIcon className="heading-icon" />
        Concept Library
      </h1>

      {!isAuthenticated && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">Sign up to track your progress and unlock personalized content!</p>
        </div>
      )}
    </header>
  );
}
