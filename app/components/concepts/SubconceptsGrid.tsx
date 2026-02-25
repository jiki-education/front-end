"use client";

import { useEffect, useState } from "react";
import { ConceptCard } from "@/components/concepts";
import { ConceptCardsLoadingSkeleton } from "@/components/concepts";
import { getChildren } from "@/lib/api/concepts";
import { fetchUnlockedConceptSlugs } from "@/lib/api/concept-unlocks";
import { useAuthStore } from "@/lib/auth/authStore";
import type { ConceptMeta } from "@/types/concepts";
import styles from "@/app/styles/modules/concepts.module.css";

interface SubconceptsGridProps {
  parentSlug: string;
}

export default function SubconceptsGrid({ parentSlug }: SubconceptsGridProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [subconcepts, setSubconcepts] = useState<ConceptMeta[]>([]);
  const [unlockedSlugs, setUnlockedSlugs] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSubconcepts = async () => {
      try {
        setIsLoading(true);
        const [data, slugs] = await Promise.all([
          getChildren(parentSlug),
          isAuthenticated ? fetchUnlockedConceptSlugs() : Promise.resolve([])
        ]);
        setSubconcepts(data);
        setUnlockedSlugs(new Set(slugs));
      } catch (err) {
        console.error("Error fetching subconcepts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    void loadSubconcepts();
  }, [parentSlug, isAuthenticated]);

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
            userMayAccess: !isAuthenticated || unlockedSlugs.has(subconcept.slug)
          }}
        />
      ))}
    </div>
  );
}
