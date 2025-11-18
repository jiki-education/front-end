import SearchIcon from "../../public/icons/search.svg";
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
  totalCount
}: ConceptsSearchProps) {
  return (
    <div>
      <div className="search-bar">
        <SearchIcon className="search-icon" />
        <input type="text" placeholder="Search concepts..." value={searchQuery} onChange={onSearchChange} />
        {searchQuery && (
          <button
            onClick={onClearSearch}
            style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Info */}
      {debouncedSearchQuery && (
        <div style={{ marginTop: "8px", fontSize: "14px", color: "var(--color-gray-500)" }}>
          {isLoading ? (
            <span>Searching...</span>
          ) : (
            <span>
              {totalCount} result{totalCount !== 1 ? "s" : ""} for &quot;{debouncedSearchQuery}&quot;
            </span>
          )}
        </div>
      )}

      {/* Total Count */}
      {!debouncedSearchQuery && !isLoading && (
        <div style={{ marginTop: "8px", fontSize: "14px", color: "var(--color-gray-500)" }}>
          {totalCount} concept{totalCount !== 1 ? "s" : ""} available
        </div>
      )}
    </div>
  );
}
