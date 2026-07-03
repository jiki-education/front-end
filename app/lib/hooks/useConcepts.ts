import { useState, useEffect, useCallback } from "react";
import { useLocale } from "next-intl";
import { getTopLevelConcepts, getConcepts, searchConcepts as searchConceptsAction } from "@/lib/api/concepts";
import { getUnlockedConceptSet, isUnlocked } from "@/lib/api/concept-unlocks";
import { useAuthStore } from "@/lib/auth/authStore";
import type { ConceptMeta, ConceptForDisplay } from "@/types/concepts";

export function useConcepts(initialConcepts: ConceptMeta[] = []) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const locale = useLocale();
  const hasInitial = initialConcepts.length > 0;
  // Only seed logged-out visitors with the server-rendered list (all unlocked).
  // Seeding authenticated users would briefly render every concept as locked
  // before their unlock data arrives, so they start empty and in the loading
  // state instead. This is the initial-render value only; the effect below runs
  // client-side after hydration.
  const seeded = hasInitial && !isAuthenticated;
  const [allConcepts, setAllConcepts] = useState<ConceptMeta[]>(seeded ? initialConcepts : []);
  const [unlockedSlugs, setUnlockedSlugs] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(!seeded);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedConcepts, setDisplayedConcepts] = useState<ConceptMeta[]>(seeded ? initialConcepts : []);

  // Load concept data and unlock state. This runs on the client only; the
  // server render for logged-out visitors is produced from the seeded state above.
  useEffect(() => {
    // Logged-out visitors already have the full list from the server, and the
    // unlock API only applies when authenticated, so there's nothing to fetch.
    if (!isAuthenticated && hasInitial) {
      setIsLoading(false);
      return;
    }

    async function load() {
      try {
        setIsLoading(true);
        setError(null);

        const [topConcepts, fullConcepts] = await Promise.all([getTopLevelConcepts(locale), getConcepts(locale)]);

        setAllConcepts(topConcepts);
        setDisplayedConcepts(topConcepts);
        setUnlockedSlugs(await getUnlockedConceptSet(fullConcepts, isAuthenticated));
      } catch {
        setError("Failed to load concepts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, [isAuthenticated, hasInitial, locale]);

  // Handle search
  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);
      if (!query.trim()) {
        setDisplayedConcepts(allConcepts);
        return;
      }
      try {
        const results = await searchConceptsAction(query, null, locale);
        setDisplayedConcepts(results);
      } catch {
        setDisplayedConcepts(allConcepts);
      }
    },
    [allConcepts, locale]
  );

  const concepts: ConceptForDisplay[] = displayedConcepts.map((c) => ({
    ...c,
    isUnlocked: isUnlocked(unlockedSlugs, c.slug, isAuthenticated)
  }));

  return {
    concepts,
    unlockedCount: isAuthenticated ? unlockedSlugs.size : displayedConcepts.length,
    totalCount: displayedConcepts.length,
    isLoading,
    error,
    searchQuery,
    handleSearch
  };
}
