import type { ConceptListItem } from "@/types/concepts";
import ConceptCard from "./ConceptCard";
import { EmptyState } from "./ErrorStates";
import { InlineLoading } from "./LoadingStates";
import { mockConcepts } from "@/lib/data/mockConcepts";
import styles from "@/app/(external)/concepts/concepts.module.css";

interface ConceptsGridProps {
  concepts: ConceptListItem[];
  isLoading: boolean;
  debouncedSearchQuery: string;
  onClearSearch: () => void;
  isAuthenticated: boolean;
}

export default function ConceptsGrid({
  concepts,
  isLoading,
  debouncedSearchQuery,
  onClearSearch,
  isAuthenticated
}: ConceptsGridProps) {
  // Show mock concepts when authenticated, regardless of API data
  if (isAuthenticated) {
    return (
      <>
        {isLoading && <InlineLoading isAuthenticated={isAuthenticated} />}
        <div className={styles.conceptsGrid}>
          {mockConcepts.map((concept) => (
            <ConceptCard key={concept.slug} concept={concept} isAuthenticated={isAuthenticated} />
          ))}
        </div>
      </>
    );
  }

  // Original logic for non-authenticated users
  return (
    <>
      {isLoading && concepts.length > 0 && <InlineLoading isAuthenticated={isAuthenticated} />}

      {concepts.length === 0 && !isLoading ? (
        <EmptyState
          debouncedSearchQuery={debouncedSearchQuery}
          onClearSearch={onClearSearch}
          isAuthenticated={isAuthenticated}
        />
      ) : (
        <div className={styles.conceptsGrid}>
          {concepts.map((concept) => (
            <ConceptCard
              key={concept.slug}
              concept={{ ...concept, iconSrc: concept.iconSrc || "images/concept-icons/icon-default.png" }}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}
    </>
  );
}
