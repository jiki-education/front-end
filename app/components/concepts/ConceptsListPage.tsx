"use client";

import { ConceptsHeader, ConceptsSearch, ConceptsGrid, ConceptsLayout } from "@/components/concepts";
import { ErrorState, ConceptCardsLoadingSkeleton } from "@/components/concepts";
import { SignupCta } from "@/components/concepts/SignupCta";
import { useConcepts } from "@/lib/hooks/useConcepts";
import { useDelayedLoading } from "@/lib/hooks/useDelayedLoading";
import { useAuthStore } from "@/lib/auth/authStore";
import styles from "@/app/styles/modules/concepts.module.css";

export default function ConceptsListPage() {
  const { concepts, unlockedCount, totalCount, isLoading, error, searchQuery, handleSearch } = useConcepts();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const showSkeleton = useDelayedLoading(isLoading, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    void handleSearch(e.target.value);
  };

  const clearSearch = () => {
    void handleSearch("");
  };

  const showEmptyState = unlockedCount === 0 && concepts.length > 0;

  return (
    <ConceptsLayout>
      <ConceptsHeader />

      {showEmptyState || isLoading ? (
        <p className={styles.conceptsDescription}>Here you can review and revisit the concepts you&apos;ve learned.</p>
      ) : (
        <ConceptsSearch
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onClearSearch={clearSearch}
          totalCount={totalCount}
        />
      )}

      {showSkeleton ? (
        <ConceptCardsLoadingSkeleton />
      ) : error && concepts.length === 0 ? (
        <ErrorState error={error} onRetry={() => window.location.reload()} />
      ) : (
        <ConceptsGrid concepts={concepts} showEmptyState={showEmptyState} />
      )}
      {!isAuthenticated && <SignupCta />}
    </ConceptsLayout>
  );
}
