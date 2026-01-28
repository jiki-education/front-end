import SearchIcon from "@/icons/search.svg";
import CrossIcon from "@/icons/cross.svg";
import { useRef } from "react";
import styles from "./ConceptsSearch.module.css";
import { EmptyState } from "./ErrorStates";

interface ConceptsSearchProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  debouncedSearchQuery: string;
  totalCount: number;
}

export default function ConceptsSearch({
  searchQuery,
  onSearchChange,
  onClearSearch,
  debouncedSearchQuery,
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

      {/* No Results State */}
      {debouncedSearchQuery && totalCount === 0 && <EmptyState debouncedSearchQuery={debouncedSearchQuery} />}
    </div>
  );
}
