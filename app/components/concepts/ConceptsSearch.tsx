import SearchIcon from "@static/icons/search.svg";
import { useRef } from "react";
import styles from "./ConceptsSearch.module.css";

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
        <button
          onClick={handleClearSearch}
          type="button"
          className={styles.searchClearBtn}
          style={{ backgroundColor: "#cbd5e1" }}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
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
