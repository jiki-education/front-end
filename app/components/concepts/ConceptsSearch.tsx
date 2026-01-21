import SearchIcon from "@static/icons/search.svg";
import CrossIcon from "@/icons/cross.svg";
import { useRef } from "react";
import styles from "./ConceptsSearch.module.css";
import { EmptyState } from "./ErrorStates";

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
      <div className={`ui-search-input ${styles.searchBar} ${searchQuery ? styles.hasValue : ""}`}>
        <SearchIcon />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search concepts..."
          value={searchQuery}
          onChange={onSearchChange}
        />
        <button onClick={handleClearSearch} type="button" className={styles.searchClearBtn}>
          <CrossIcon />
        </button>
      </div>

      {/* Search Results Info */}
      {debouncedSearchQuery && totalCount > 0 && (
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

      {/* No Results State */}
      {debouncedSearchQuery && totalCount === 0 && !isLoading && (
        <EmptyState debouncedSearchQuery={debouncedSearchQuery} />
      )}
    </div>
  );
}
