import styles from "@/app/styles/modules/concepts.module.css";
import type { ConceptListItem } from "@/types/concepts";
import ConceptCard from "./ConceptCard";
import { InlineLoading } from "./LoadingStates";

interface ConceptsGridProps {
  concepts: ConceptListItem[];
  isLoading: boolean;
}

export default function ConceptsGrid({ concepts, isLoading }: ConceptsGridProps) {
  return (
    <>
      {isLoading && concepts.length > 0 && <InlineLoading />}

      <div className={styles.conceptsGrid}>
        {concepts.map((concept) => (
          <ConceptCard
            key={concept.slug}
            concept={{
              slug: concept.slug,
              title: concept.title,
              description: concept.description,
              subConceptCount: concept.children_count,
              userMayAccess: concept.user_may_access
            }}
          />
        ))}
      </div>
    </>
  );
}
