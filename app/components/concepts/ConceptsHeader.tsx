import styles from "@/app/styles/modules/concepts.module.css";
import FolderIcon from "@static/icons/folder.svg";
import Breadcrumb from "./Breadcrumb";

interface ConceptsHeaderProps {
  isAuthenticated: boolean;
  hideSearch?: boolean;
}

export default function ConceptsHeader({ isAuthenticated }: ConceptsHeaderProps) {
  const breadcrumbItems = [
    { label: "Library:", isLabel: true },
    { label: "All Concepts", isCurrent: true }
  ];

  return (
    <header>
      <Breadcrumb items={breadcrumbItems} />

      <h1 className={styles.pageHeading}>
        <FolderIcon className={styles.headingIcon} />
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
