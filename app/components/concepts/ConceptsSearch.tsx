import SearchIcon from "@/icons/search.svg";
import CrossIcon from "@/icons/cross.svg";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import styles from "./ConceptsSearch.module.css";
import { EmptyState } from "./ErrorStates";

interface ConceptsSearchProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  totalCount: number;
}

export default function ConceptsSearch({
  searchQuery,
  onSearchChange,
  onClearSearch,
  totalCount
}: ConceptsSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("concepts.list");

  return (
    <div>
      <div className={`ui-search-input ${styles.searchBar} ${searchQuery ? styles.hasValue : ""}`}>
        <SearchIcon />
        <input
          ref={inputRef}
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={onSearchChange}
        />
        <button onClick={onClearSearch} type="button" className={styles.searchClearBtn}>
          <CrossIcon />
        </button>
      </div>

      {searchQuery && totalCount === 0 && <EmptyState debouncedSearchQuery={searchQuery} />}
    </div>
  );
}
