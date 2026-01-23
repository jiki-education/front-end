import { useState, useCallback } from "react";
import { fetchConcepts } from "@/lib/api/concepts";
import type { ConceptListItem } from "@/types/concepts";

interface ConceptsState {
  concepts: ConceptListItem[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export function useConcepts() {
  const [conceptsState, setConceptsState] = useState<ConceptsState>({
    concepts: [],
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConcepts = useCallback(async (page: number = 1, title?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchConcepts({
        page,
        title: title || undefined
      });

      setConceptsState({
        concepts: response.results,
        currentPage: response.meta.current_page,
        totalPages: response.meta.total_pages,
        totalCount: response.meta.total_count
      });
    } catch (err) {
      setError("Failed to load concepts. Please try again later.");
      console.error("Error fetching concepts:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    conceptsState,
    isLoading,
    error,
    loadConcepts
  };
}
