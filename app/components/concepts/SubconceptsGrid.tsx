"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { ConceptCard } from "@/components/concepts";
import { ConceptCardsLoadingSkeleton } from "@/components/concepts";
import { getChildren } from "@/lib/api/concepts";
import { getUnlockedConceptSet, isUnlocked } from "@/lib/api/concept-unlocks";
import { useAuthStore } from "@/lib/auth/authStore";
import type { ConceptMeta } from "@/types/concepts";
import styles from "@/app/styles/modules/concepts.module.css";

interface SubconceptsGridProps {
  parentSlug: string;
  initialSubconcepts?: ConceptMeta[];
}

export default function SubconceptsGrid({ parentSlug, initialSubconcepts = [] }: SubconceptsGridProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const locale = useLocale();
  // Logged-out visitors are seeded with the server-rendered children (all
  // unlocked); authenticated users fetch their unlock state, so they start empty.
  const seeded = initialSubconcepts.length > 0 && !isAuthenticated;
  const [subconcepts, setSubconcepts] = useState<ConceptMeta[]>(seeded ? initialSubconcepts : []);
  const [unlockedSlugs, setUnlockedSlugs] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(!seeded);

  useEffect(() => {
    // Logged-out visitors already have the children from the server.
    if (!isAuthenticated && initialSubconcepts.length > 0) {
      setIsLoading(false);
      return;
    }

    const loadSubconcepts = async () => {
      try {
        setIsLoading(true);
        const data = await getChildren(parentSlug, locale);
        setSubconcepts(data);
        setUnlockedSlugs(await getUnlockedConceptSet(data, isAuthenticated));
      } catch (err) {
        console.error("Error fetching subconcepts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    void loadSubconcepts();
  }, [parentSlug, isAuthenticated, initialSubconcepts.length, locale]);

  if (isLoading) {
    return <ConceptCardsLoadingSkeleton />;
  }

  return (
    <div className={styles.conceptsGrid}>
      {subconcepts.map((subconcept) => (
        <ConceptCard
          key={subconcept.slug}
          concept={{
            slug: subconcept.slug,
            title: subconcept.title,
            description: subconcept.description,
            subConceptCount: subconcept.childrenCount,
            userMayAccess: isUnlocked(unlockedSlugs, subconcept.slug, isAuthenticated)
          }}
        />
      ))}
    </div>
  );
}
