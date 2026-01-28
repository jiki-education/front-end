"use client";

import Pagination from "@/components/ui/Pagination";
import { ConceptsHeader, ConceptsSearch, ConceptsGrid, ConceptsLayout } from "@/components/concepts";
import { ErrorState, ConceptCardsLoadingSkeleton } from "@/components/concepts";
import { useConcepts } from "@/lib/hooks/useConcepts";
import { useConceptsSearch } from "@/lib/hooks/useConceptsSearch";
import styles from "@/app/styles/modules/concepts.module.css";

export default function ConceptsListPage() {
  const { conceptsState, isLoading, error, loadConcepts } = useConcepts();
  const { searchQuery, debouncedSearchQuery, handleSearchChange, clearSearch } = useConceptsSearch(loadConcepts);

  const handlePageChange = (page: number) => {
    void loadConcepts(page, debouncedSearchQuery);
  };

  const retryLoad = () => void loadConcepts(1, debouncedSearchQuery);

  // Show empty state only if there are no unlocked concepts globally
  const showEmptyState = conceptsState.unlockedCount === 0 && conceptsState.concepts.length > 0;

  return (
    <ConceptsLayout>
      <ConceptsHeader />

      {showEmptyState ? (
        <p className={styles.conceptsDescription}>Here you can review and revisit the concepts you&apos;ve learned.</p>
      ) : (
        <ConceptsSearch
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onClearSearch={clearSearch}
          debouncedSearchQuery={debouncedSearchQuery}
          totalCount={conceptsState.totalCount}
        />
      )}

      {isLoading ? (
        <ConceptCardsLoadingSkeleton />
      ) : error && conceptsState.concepts.length === 0 ? (
        <ErrorState error={error} onRetry={retryLoad} />
      ) : (
        <>
          <ConceptsGrid concepts={conceptsState.concepts} showEmptyState={showEmptyState} />

          {conceptsState.concepts.length > 0 && conceptsState.unlockedCount > 0 && (
            <Pagination
              currentPage={conceptsState.currentPage}
              totalPages={conceptsState.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </ConceptsLayout>
  );
}
