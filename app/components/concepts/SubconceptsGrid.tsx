"use client";

import { useEffect, useState } from "react";
import { ConceptCard } from "@/components/concepts";
import { ConceptCardsLoadingSkeleton } from "@/components/concepts";
import { fetchSubconcepts } from "@/lib/api/concepts";
import type { ConceptListItem } from "@/types/concepts";
import styles from "@/app/styles/modules/concepts.module.css";

interface SubconceptsGridProps {
  parentSlug: string;
}

export default function SubconceptsGrid({ parentSlug }: SubconceptsGridProps) {
  const [subconcepts, setSubconcepts] = useState<ConceptListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSubconcepts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const subconceptsData = await fetchSubconcepts(parentSlug);
        setSubconcepts(subconceptsData);
      } catch (err) {
        console.error("Error fetching subconcepts:", err);
        setError("Failed to load subconcepts");
      } finally {
        setIsLoading(false);
      }
    };

    void loadSubconcepts();
  }, [parentSlug]);

  if (isLoading) {
    return <ConceptCardsLoadingSkeleton />;
  }

  if (error) {
    return null;
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
            subConceptCount: subconcept.children_count
          }}
        />
      ))}
    </div>
  );
}
