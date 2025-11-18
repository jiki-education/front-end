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
  onClearSearch: () => void;
  isAuthenticated: boolean;
}

export function EmptyState({ debouncedSearchQuery, onClearSearch, isAuthenticated }: EmptyStateProps) {
  const iconStyles = isAuthenticated ? "text-text-muted" : "text-gray-400";

  const textStyles = isAuthenticated ? "text-text-secondary" : "text-gray-600";

  const buttonStyles = isAuthenticated
    ? "text-link-primary hover:text-link-hover"
    : "text-blue-600 hover:text-blue-800";

  return (
    <div className="text-center py-12">
      <svg className={`mx-auto h-12 w-12 ${iconStyles} mb-4`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <p className={`${textStyles} text-lg`}>
        {debouncedSearchQuery
          ? `No concepts found for "${debouncedSearchQuery}"`
          : "No concepts available at the moment."}
      </p>
      {debouncedSearchQuery && (
        <button onClick={onClearSearch} className={`mt-4 ${buttonStyles} underline`}>
          Clear search
        </button>
      )}
    </div>
  );
}
