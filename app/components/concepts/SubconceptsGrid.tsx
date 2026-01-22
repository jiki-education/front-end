"use client";

import { useEffect, useState } from "react";
import { ConceptCard } from "@/components/concepts";
import { Breadcrumb, ConceptCardsLoadingSkeleton } from "@/components/concepts";
import { fetchConcept, fetchSubconcepts } from "@/lib/api/concepts";
import type { ConceptDetail, ConceptListItem } from "@/types/concepts";
import styles from "@/app/styles/modules/concepts.module.css";

interface SubconceptsGridProps {
  slug: string;
}

export default function SubconceptsGrid({ slug }: SubconceptsGridProps) {
  const [parentConcept, setParentConcept] = useState<ConceptDetail | null>(null);
  const [subconcepts, setSubconcepts] = useState<ConceptListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [conceptData, subconceptsData] = await Promise.all([fetchConcept(slug), fetchSubconcepts(slug)]);

        setParentConcept(conceptData);
        setSubconcepts(subconceptsData);
      } catch (err) {
        console.error("Error fetching subconcepts:", err);
        setError("Failed to load subconcepts");
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, [slug]);

  if (isLoading) {
    return <ConceptCardsLoadingSkeleton />;
  }

  if (error || !parentConcept) {
    return null;
  }

  return (
    <>
      <Breadcrumb conceptTitle={parentConcept.title} ancestors={parentConcept.ancestors} />

      <header>
        <h1 className={styles.pageHeading}>
          <svg
            className={`${styles.headingIcon} w-8 h-8`}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7h18M8 12h8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {parentConcept.title}
        </h1>
      </header>

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
    </>
  );
}
