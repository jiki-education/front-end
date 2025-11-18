"use client";

import { useAuth } from "@/lib/auth/hooks";
import Pagination from "@/components/ui/Pagination";
import { ConceptsHeader, ConceptsSearch, ConceptsGrid, ConceptsLayout } from "@/components/concepts-page";
import { LoadingSkeleton, ErrorState } from "@/components/concepts-page";
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

  // Show loading skeleton only for initial load
  if (!isReady || (isLoading && conceptsState.concepts.length === 0 && !debouncedSearchQuery)) {
    return withSidebar ? (
      <ConceptsLayout withSidebar={true}>
        <LoadingSkeleton withSidebar={true} />
      </ConceptsLayout>
    ) : (
      <LoadingSkeleton withSidebar={false} />
    );
  }

  // Show error state only when there are no concepts and no search
  if (error && conceptsState.concepts.length === 0 && !debouncedSearchQuery) {
    return (
      <ConceptsLayout withSidebar={withSidebar}>
        <ErrorState error={error} onRetry={retryLoad} withSidebar={withSidebar} />
      </ConceptsLayout>
    );
  }

  // Always render main content structure to prevent remounting
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
    </ConceptsLayout>
  );
}
