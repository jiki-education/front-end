"use client";

import Pagination from "@/components/ui/Pagination";
import { ConceptsHeader, ConceptsSearch, ConceptsGrid, ConceptsLayout } from "@/components/concepts";
import { ErrorState, ConceptCardsLoadingSkeleton } from "@/components/concepts";
import { useConcepts } from "@/lib/hooks/useConcepts";
import { useConceptsSearch } from "@/lib/hooks/useConceptsSearch";
import { useState, useEffect } from "react";

interface ConceptsListPageProps {
  authenticated: boolean;
}

export default function ConceptsListPage({ authenticated }: ConceptsListPageProps) {
  const [isReady, setIsReady] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  // Hydration protection - delays rendering of auth-dependent UI until client mount
  useEffect(() => {
    setIsReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const withSidebar = isReady && authenticated;

  const { conceptsState, isLoading, error, loadConcepts } = useConcepts({
    isAuthenticated: authenticated,
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
    <ConceptsLayout>
      <ConceptsHeader isAuthenticated={authenticated} />

      <ConceptsSearch
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClearSearch={clearSearch}
        debouncedSearchQuery={debouncedSearchQuery}
        isLoading={isLoading}
        totalCount={conceptsState.totalCount}
        isAuthenticated={authenticated}
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
            isAuthenticated={authenticated}
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
