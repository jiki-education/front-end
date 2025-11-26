import SearchIcon from "../../public/icons/search.svg";
import { useRef } from "react";

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
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClearSearch = () => {
    onClearSearch();
  };
  return (
    <div>
      <div className="ui-search-input">
        <SearchIcon />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search concepts..."
          value={searchQuery}
          onChange={onSearchChange}
        />
        {searchQuery && (
          <button onClick={handleClearSearch} type="button">
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
    </div>
  );
}
