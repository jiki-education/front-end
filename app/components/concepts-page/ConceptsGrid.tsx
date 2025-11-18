import type { ConceptListItem } from "@/types/concepts";
import ConceptCard from "./ConceptCard";
import { EmptyState } from "./ErrorStates";
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
  onClearSearch,
  isAuthenticated
}: ConceptsGridProps) {
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
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {concepts.map((concept) => (
            <ConceptCard key={concept.slug} concept={concept} isAuthenticated={isAuthenticated} />
          ))}
        </div>
      )}
    </>
  );
}
