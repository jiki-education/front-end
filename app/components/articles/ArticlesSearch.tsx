"use client";

import SearchIcon from "@/icons/search.svg";
import CrossIcon from "@/icons/cross.svg";
import styles from "./ArticlesSearch.module.css";

interface ArticlesSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  searchResults: string[] | null;
}

export default function ArticlesSearch({
  searchQuery,
  onSearchChange,
  onClearSearch,
  searchResults
}: ArticlesSearchProps) {
  const showNoResults = searchQuery && searchResults !== null && searchResults.length === 0;

  return (
    <div>
      <div className={`ui-search-input ${styles.searchBar} ${searchQuery ? styles.hasValue : ""}`}>
        <SearchIcon />
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button onClick={onClearSearch} type="button" className={styles.searchClearBtn}>
          <CrossIcon />
        </button>
      </div>

      {showNoResults && (
        <div className={styles.noResults}>
          <p className={styles.noResultsTitle}>0 results for &ldquo;{searchQuery}&rdquo;</p>
          <p className={styles.noResultsMessage}>Try a different search term or browse the articles.</p>
        </div>
      )}
    </div>
  );
}
