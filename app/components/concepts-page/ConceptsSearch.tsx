interface ConceptsSearchProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  debouncedSearchQuery: string;
  isLoading: boolean;
  totalCount: number;
  isAuthenticated: boolean;
}

export default function ConceptsSearch({
  searchQuery,
  onSearchChange,
  onClearSearch,
  debouncedSearchQuery,
  isLoading,
  totalCount,
  isAuthenticated
}: ConceptsSearchProps) {
  const baseInputStyles = "block w-full pl-4 pr-10 py-3 border rounded-lg focus:ring-2 focus:outline-none";
  const inputStyles = isAuthenticated
    ? `${baseInputStyles} border-border-primary bg-bg-primary text-text-primary focus:ring-link-primary focus:border-link-primary`
    : `${baseInputStyles} border-gray-300 focus:ring-blue-500 focus:border-blue-500`;

  const buttonStyles = isAuthenticated
    ? "text-text-secondary hover:text-text-primary"
    : "text-gray-400 hover:text-gray-600";

  const textStyles = isAuthenticated ? "text-text-secondary" : "text-gray-600";

  return (
    <div className="mb-8">
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search concepts..."
          value={searchQuery}
          onChange={onSearchChange}
          className={inputStyles}
        />
        {searchQuery && (
          <button onClick={onClearSearch} className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className={`w-5 h-5 ${buttonStyles}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {debouncedSearchQuery && (
        <div className={`mt-2 text-sm ${textStyles}`}>
          {isLoading ? (
            <span>Searching...</span>
          ) : (
            <span>
              {totalCount} result{totalCount !== 1 ? "s" : ""} for &quot;
              {debouncedSearchQuery}&quot;
            </span>
          )}
        </div>
      )}

      {!debouncedSearchQuery && !isLoading && (
        <div className={`mt-2 text-sm ${textStyles}`}>
          {totalCount} concept{totalCount !== 1 ? "s" : ""} available
        </div>
      )}
    </div>
  );
}
