import { useState, useEffect, useCallback, useRef } from "react";
import lunr from "lunr";
import { useDebounce } from "./useDebounce";
import { getGuidesSearchIndex } from "@/lib/api/content-search";

interface SearchIndex {
  index: lunr.Index;
  items: Array<{ slug: string; title: string; excerpt: string }>;
}

interface UseGuidesSearchResult {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: string[] | null; // null = no search, empty array = no matches
  isLoading: boolean;
}

export function useGuidesSearch(locale: string): UseGuidesSearchResult {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const indexRef = useRef<SearchIndex | null>(null);
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Load search index on demand
  const loadIndex = useCallback(async (): Promise<SearchIndex> => {
    if (indexRef.current) {
      return indexRef.current;
    }

    setIsLoading(true);
    try {
      const data = await getGuidesSearchIndex(locale);
      const index = lunr.Index.load(data.index);
      indexRef.current = { index, items: data.items };
      return indexRef.current;
    } finally {
      setIsLoading(false);
    }
  }, [locale]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults(null);
      return;
    }

    const performSearch = async () => {
      const searchIndex = await loadIndex();

      try {
        let results = searchIndex.index.search(debouncedQuery);
        if (results.length === 0) {
          results = searchIndex.index.search(`${debouncedQuery}*`);
        }
        setSearchResults(results.map((r) => r.ref));
      } catch {
        setSearchResults([]);
      }
    };

    void performSearch();
  }, [debouncedQuery, loadIndex]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading
  };
}
