interface LoadingSkeletonProps {
  withSidebar: boolean;
}

export function LoadingSkeleton({ withSidebar }: LoadingSkeletonProps) {
  const containerClasses = withSidebar ? "ml-[260px] p-6" : "container mx-auto max-w-7xl px-4 py-12";

  return (
    <div className={containerClasses}>
      <div className="animate-pulse">
        <div className="mb-12">
          <div className="mb-4 h-12 w-64 bg-gray-200 rounded"></div>
          <div className="h-6 w-96 bg-gray-200 rounded"></div>
          <div className="mt-6 h-10 w-80 bg-gray-200 rounded"></div>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-3 h-6 w-3/4 bg-gray-200 rounded"></div>
              <div className="mb-4 space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface InlineLoadingProps {
  isAuthenticated: boolean;
}

export function InlineLoading({ isAuthenticated }: InlineLoadingProps) {
  const textStyles = isAuthenticated ? "text-info-text bg-info-bg" : "text-blue-600 bg-blue-50";

  return (
    <div className="mb-4 text-center">
      <div className={`inline-flex items-center px-4 py-2 text-sm ${textStyles} rounded-lg`}>
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        Loading...
      </div>
    </div>
  );
}

export function ConceptCardsLoadingSkeleton() {
  return (
    <div className="concepts-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="concept-card animate-pulse">
          <div className="concept-icon">
            <div className="w-24 h-24 bg-gray-200 rounded"></div>
          </div>
          <div className="concept-content">
            <div className="concept-title">
              <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
            </div>
            <div className="concept-description">
              <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded mb-3"></div>
            </div>
            <div className="h-6 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
