"use client";

import Pagination from "@/components/ui/Pagination";
import { ConceptsHeader, ConceptsSearch, ConceptsGrid, ConceptsLayout } from "@/components/concepts";
import { ErrorState, ConceptCardsLoadingSkeleton } from "@/components/concepts";
import { useConcepts } from "@/lib/hooks/useConcepts";
import { useConceptsSearch } from "@/lib/hooks/useConceptsSearch";
import { useDelayedLoading } from "@/lib/hooks/useDelayedLoading";
import styles from "@/app/styles/modules/concepts.module.css";

export default function ConceptsListPage() {
  const { conceptsState, isLoading, error, loadConcepts } = useConcepts();
  const shouldShowSkeleton = useDelayedLoading(isLoading && conceptsState.concepts.length === 0);

  const { searchQuery, debouncedSearchQuery, handleSearchChange, clearSearch } = useConceptsSearch(loadConcepts);

  const handlePageChange = (page: number) => {
    void loadConcepts(page, debouncedSearchQuery);
  };

  const retryLoad = () => void loadConcepts(1, debouncedSearchQuery);

  const allConceptsLocked =
    conceptsState.concepts.length > 0 && conceptsState.concepts.every((c) => c.user_may_access === false);

  return (
    <ConceptsLayout>
      <ConceptsHeader />

      {allConceptsLocked ? (
        <p className={styles.conceptsDescription}>Here you can review and revisit the concepts you&apos;ve learned.</p>
      ) : (
        <ConceptsSearch
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onClearSearch={clearSearch}
          debouncedSearchQuery={debouncedSearchQuery}
          isLoading={isLoading}
          totalCount={conceptsState.totalCount}
        />
      )}

      {shouldShowSkeleton ? (
        <ConceptCardsLoadingSkeleton />
      ) : error && conceptsState.concepts.length === 0 ? (
        <ErrorState error={error} onRetry={retryLoad} />
      ) : (
        <>
          <ConceptsGrid concepts={conceptsState.concepts} isLoading={isLoading} />

          {conceptsState.concepts.length > 0 && conceptsState.concepts.some((c) => c.user_may_access !== false) && (
            <Pagination
              currentPage={conceptsState.currentPage}
              totalPages={conceptsState.totalPages}
              onPageChange={handlePageChange}
              className="mt-12"
            />
          )}
        </>
      )}
    </ConceptsLayout>
  );
}
