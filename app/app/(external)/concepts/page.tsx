"use client";

import { useAuth } from "@/lib/auth/hooks";
import Pagination from "@/components/ui/Pagination";
import { ConceptsHeader, ConceptsSearch, ConceptsGrid, ConceptsLayout } from "@/components/concepts-page";
import { ErrorState, ConceptCardsLoadingSkeleton } from "@/components/concepts-page";
import { useConcepts } from "@/lib/hooks/useConcepts";
import { useConceptsSearch } from "@/lib/hooks/useConceptsSearch";
import "./concepts.css";

export default function ConceptsPage() {
  const { isAuthenticated, isReady } = useAuth();
  const withSidebar = isReady && isAuthenticated;

  const { conceptsState, isLoading, error, loadConcepts } = useConcepts({
    isAuthenticated,
    isReady
  });

  const { searchQuery, debouncedSearchQuery, handleSearchChange, clearSearch } = useConceptsSearch(
    loadConcepts,
    isReady
  );

  const handlePageChange = (page: number) => {
    void loadConcepts(page, debouncedSearchQuery);
  };

  const retryLoad = () => void loadConcepts(1, debouncedSearchQuery);

  // Always render static structure
  return (
    <ConceptsLayout withSidebar={withSidebar}>
      <ConceptsHeader isAuthenticated={isAuthenticated} />

      <ConceptsSearch
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClearSearch={clearSearch}
        debouncedSearchQuery={debouncedSearchQuery}
        isLoading={isLoading}
        totalCount={conceptsState.totalCount}
        isAuthenticated={isAuthenticated}
      />

      {/* Show loading skeleton only for initial load or when no concepts exist */}
      {!isReady || (isLoading && conceptsState.concepts.length === 0) ? (
        <ConceptCardsLoadingSkeleton />
      ) : error && conceptsState.concepts.length === 0 ? (
        <ErrorState error={error} onRetry={retryLoad} withSidebar={withSidebar} />
      ) : (
        <>
          <ConceptsGrid
            concepts={conceptsState.concepts}
            isLoading={isLoading}
            debouncedSearchQuery={debouncedSearchQuery}
            onClearSearch={clearSearch}
            isAuthenticated={isAuthenticated}
          />

          {conceptsState.concepts.length > 0 && (
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
