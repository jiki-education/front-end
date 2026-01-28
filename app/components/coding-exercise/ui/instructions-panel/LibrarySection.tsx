import type { ConceptCardData } from "@/components/concepts/ConceptCard";
import LibraryWithConcepts from "./LibraryWithConcepts";
import LibraryEmptyState from "./LibraryEmptyState";
import LibraryProjectsState from "./LibraryProjectsState";
import styles from "./instructions-panel.module.css";

type LibraryState = "loading" | "with-concepts" | "empty" | "projects";

interface LibrarySectionProps {
  concepts: ConceptCardData[];
  isLoading: boolean;
  isProject: boolean;
  className?: string;
}

export default function LibrarySection({ concepts, isLoading, isProject, className = "" }: LibrarySectionProps) {
  const state = getLibraryState({ concepts, isLoading, isProject });

  return (
    <div className={className}>
      {state === "loading" && <LibraryLoading />}
      {state === "with-concepts" && <LibraryWithConcepts concepts={concepts} />}
      {state === "empty" && <LibraryEmptyState />}
      {state === "projects" && <LibraryProjectsState />}
    </div>
  );
}

function LibraryLoading() {
  return (
    <LibraryWrapper>
      <p className={styles.libraryDescription}>Loading concepts...</p>
    </LibraryWrapper>
  );
}

function LibraryWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.conceptsContainer}>
      <h2 className={styles.conceptsTitle}>Library</h2>
      {children}
    </div>
  );
}

function getLibraryState({
  concepts,
  isLoading,
  isProject
}: {
  concepts: ConceptCardData[];
  isLoading: boolean;
  isProject: boolean;
}): LibraryState {
  if (isLoading) {
    return "loading";
  }
  if (concepts.length > 0) {
    return "with-concepts";
  }
  if (isProject) {
    return "projects";
  }
  return "empty";
}

export { LibraryWrapper };
