import NoResultsIcon from "@/icons/no-results.svg";
import styles from "@/components/concepts/ConceptsSearch.module.css";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  withSidebar: boolean;
}

export function ErrorState({ error, onRetry, withSidebar }: ErrorStateProps) {
  if (withSidebar) {
    return (
      <div className="ml-[260px] p-6">
        <div className="text-center">
          <div className="mb-4 text-error-text text-lg">{error}</div>
          <button
            onClick={onRetry}
            className="rounded-md bg-button-primary-bg px-4 py-2 text-button-primary-text hover:opacity-90 focus-ring"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="text-center">
        <div className="mb-4 text-red-600 text-lg">{error}</div>
        <button onClick={onRetry} className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Try Again
        </button>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  debouncedSearchQuery: string;
}

export function EmptyState({ debouncedSearchQuery }: EmptyStateProps) {
  if (!debouncedSearchQuery) {
    return null;
  }

  return (
    <div className={styles.noResults}>
      <NoResultsIcon className={styles.noResultsIcon} />
      <div className={styles.noResultsTitle}>
        0 results for &quot;<span className={styles.noResultsQuery}>{debouncedSearchQuery}</span>&quot;
      </div>
      <div className={styles.noResultsMessage}>Try a different search term or browse the library.</div>
    </div>
  );
}
