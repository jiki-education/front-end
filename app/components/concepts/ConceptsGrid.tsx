import styles from "@/app/styles/modules/concepts.module.css";
import type { ConceptListItem } from "@/types/concepts";
import ConceptCard from "./ConceptCard";
import { InlineLoading } from "./LoadingStates";
import EmptyState from "@/components/ui/EmptyState";
import FolderIcon from "@/icons/folder.svg";

interface ConceptsGridProps {
  concepts: ConceptListItem[];
  isLoading: boolean;
}

export default function ConceptsGrid({ concepts, isLoading }: ConceptsGridProps) {
  const allConceptsLocked = concepts.length > 0 && concepts.every((concept) => concept.user_may_access === false);

  if (allConceptsLocked) {
    return (
      <EmptyState
        icon={FolderIcon}
        title="No concepts yet"
        body="Complete lessons to unlock new Concepts. Each concept you master in your lessons becomes available for you to review here."
      />
    );
  }

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
