"use client";

import { useEffect, useState } from "react";
import { ConceptCard } from "@/components/concepts";
import { ConceptCardsLoadingSkeleton } from "@/components/concepts";
import { getChildren } from "@/lib/concepts/actions";
import type { ConceptMeta } from "@/types/concepts";
import styles from "@/app/styles/modules/concepts.module.css";

interface SubconceptsGridProps {
  parentSlug: string;
}

export default function SubconceptsGrid({ parentSlug }: SubconceptsGridProps) {
  const [subconcepts, setSubconcepts] = useState<ConceptMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSubconcepts = async () => {
      try {
        setIsLoading(true);
        const data = await getChildren(parentSlug);
        setSubconcepts(data);
      } catch (err) {
        console.error("Error fetching subconcepts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    void loadSubconcepts();
  }, [parentSlug]);

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
            subConceptCount: subconcept.childrenCount
          }}
        />
      ))}
    </div>
  );
}
