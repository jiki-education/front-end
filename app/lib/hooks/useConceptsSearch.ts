import { useState, useEffect } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";

export function useConceptsSearch(loadConcepts: (page: number, title?: string) => void, isReady: boolean) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (isReady) {
      loadConcepts(1, debouncedSearchQuery);
    }
  }, [isReady, debouncedSearchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return {
    searchQuery,
    debouncedSearchQuery,
    handleSearchChange,
    clearSearch
  };
}
