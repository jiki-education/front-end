import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";

export function useConceptsSearch(loadConcepts: (page: number, title?: string) => void) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    loadConcepts(1, debouncedSearchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return {
    searchQuery,
    debouncedSearchQuery,
    handleSearchChange,
    clearSearch
  };
}
