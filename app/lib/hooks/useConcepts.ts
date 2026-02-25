import { useState, useEffect, useCallback } from "react";
import { getTopLevelConcepts, searchConcepts as searchConceptsAction } from "@/lib/concepts/actions";
import { fetchUnlockedConceptSlugs } from "@/lib/api/concept-unlocks";
import { useAuthStore } from "@/lib/auth/authStore";
import type { ConceptMeta, ConceptForDisplay } from "@/types/concepts";

export function useConcepts() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [allConcepts, setAllConcepts] = useState<ConceptMeta[]>([]);
  const [unlockedSlugs, setUnlockedSlugs] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedConcepts, setDisplayedConcepts] = useState<ConceptMeta[]>([]);

  // Load concept data and unlock state
  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        setError(null);

        const [concepts, slugs] = await Promise.all([
          getTopLevelConcepts(),
          isAuthenticated ? fetchUnlockedConceptSlugs() : Promise.resolve([])
        ]);

        setAllConcepts(concepts);
        setDisplayedConcepts(concepts);
        setUnlockedSlugs(new Set(slugs));
      } catch {
        setError("Failed to load concepts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, [isAuthenticated]);

  // Handle search
  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);
      if (!query.trim()) {
        setDisplayedConcepts(allConcepts);
        return;
      }
      try {
        const results = await searchConceptsAction(query, null);
        setDisplayedConcepts(results);
      } catch {
        setDisplayedConcepts(allConcepts);
      }
    },
    [allConcepts]
  );

  const concepts: ConceptForDisplay[] = displayedConcepts.map((c) => ({
    ...c,
    isUnlocked: !isAuthenticated || unlockedSlugs.has(c.slug)
  }));

  return {
    concepts,
    unlockedCount: unlockedSlugs.size,
    totalCount: displayedConcepts.length,
    isLoading,
    error,
    searchQuery,
    handleSearch
  };
}
