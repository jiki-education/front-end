import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { getConcept, getAncestors, getConcepts } from "@/lib/api/concepts";
import { fetchUnlockedConceptSlugs, expandUnlocked } from "@/lib/api/concept-unlocks";
import { useAuthStore } from "@/lib/auth/authStore";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import type { ConceptMeta, ConceptAncestor } from "@/types/concepts";

interface ConceptResolution {
  concept: ConceptMeta | null;
  ancestors: ConceptAncestor[];
  isLoading: boolean;
  error: string | null;
}

interface UseConceptResolutionOptions {
  initialConcept?: ConceptMeta | null;
  initialAncestors?: ConceptAncestor[];
}

/**
 * Resolves a concept and its breadcrumb so the detail page can decide which view
 * (group vs leaf) to render. Lightweight on purpose: leaf-specific data lives in
 * useConceptDetailData, inside ConceptLeafView.
 *
 * Logged-out visitors are seeded from server-fetched props and render immediately
 * (SSR). For authenticated users this also enforces the redirect away from a
 * locked *category* — leaf concepts keep that check inside useConceptDetailData,
 * so we avoid fetching unlock state twice.
 */
export function useConceptResolution(
  slug: string,
  { initialConcept = null, initialAncestors = [] }: UseConceptResolutionOptions = {}
): ConceptResolution {
  const router = useRouter();
  const locale = useLocale();
  const conceptsPath = useLocaleRoutes().concepts();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const seeded = initialConcept !== null && !isAuthenticated;

  const [concept, setConcept] = useState<ConceptMeta | null>(seeded ? initialConcept : null);
  const [ancestors, setAncestors] = useState<ConceptAncestor[]>(seeded ? initialAncestors : []);
  const [isLoading, setIsLoading] = useState(!seeded);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated && initialConcept !== null) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setError(null);
        const [conceptData, ancestorData] = await Promise.all([getConcept(slug, locale), getAncestors(slug, locale)]);
        if (cancelled) {
          return;
        }

        if (!conceptData) {
          setError("Concept not found.");
          setIsLoading(false);
          return;
        }

        // Categories are never returned by the unlock API directly, so a logged-in
        // user viewing a category whose subtree is entirely locked is redirected.
        if (isAuthenticated && conceptData.category) {
          const [allConcepts, rawUnlocked] = await Promise.all([getConcepts(locale), fetchUnlockedConceptSlugs()]);
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (cancelled) {
            return;
          }
          if (!expandUnlocked(allConcepts, rawUnlocked).has(slug)) {
            router.push(conceptsPath);
            return;
          }
        }

        setConcept(conceptData);
        setAncestors(ancestorData);
        setIsLoading(false);
      } catch {
        if (!cancelled) {
          setError("Failed to load concept. Please try again later.");
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [slug, isAuthenticated, initialConcept, router, conceptsPath, locale]);

  return { concept, ancestors, isLoading, error };
}
