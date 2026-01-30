import { useState, useEffect, useCallback, useRef } from "react";
import lunr from "lunr";
import { useDebounce } from "./useDebounce";

interface SearchIndex {
  index: lunr.Index;
  articles: Array<{ slug: string; title: string; excerpt: string }>;
}

interface UseArticlesSearchResult {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: string[] | null; // null = no search, empty array = no matches
  isLoading: boolean;
}

export function useArticlesSearch(locale: string): UseArticlesSearchResult {
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
      const response = await fetch(`/static/search/articles-${locale}.json`);
      const data = await response.json();
      const index = lunr.Index.load(data.index);
      indexRef.current = { index, articles: data.articles };
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
        // First try exact/stemmed search, then fall back to wildcard for partial matches
        let results = searchIndex.index.search(debouncedQuery);
        if (results.length === 0) {
          // Try wildcard for partial prefix matches
          results = searchIndex.index.search(`${debouncedQuery}*`);
        }
        setSearchResults(results.map((r) => r.ref));
      } catch {
        // If search fails (e.g., invalid query), return empty results
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
