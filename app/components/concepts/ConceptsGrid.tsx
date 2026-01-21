import styles from "@/app/styles/modules/concepts.module.css";
import { mockConcepts } from "@/lib/data/mockConcepts";
import type { ConceptListItem } from "@/types/concepts";
import ConceptCard from "./ConceptCard";
import { InlineLoading } from "./LoadingStates";

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
  onClearSearch: _onClearSearch,
  isAuthenticated
}: ConceptsGridProps) {
  if (isAuthenticated && !debouncedSearchQuery) {
    return (
      <>
        {isLoading && <InlineLoading isAuthenticated={isAuthenticated} />}
        <div className={styles.conceptsGrid}>
          {mockConcepts.map((concept) => (
            <ConceptCard key={concept.slug} concept={concept} />
          ))}
        </div>
      </>
    );
  }

  // Show actual search results or regular concepts
  return (
    <>
      {isLoading && concepts.length > 0 && <InlineLoading isAuthenticated={isAuthenticated} />}

      <div className={styles.conceptsGrid}>
        {concepts.map((concept) => (
          <ConceptCard key={concept.slug} concept={concept} />
        ))}
      </div>
    </>
  );
}
