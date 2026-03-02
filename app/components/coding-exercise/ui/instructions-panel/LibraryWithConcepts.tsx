import type { ConceptCardData } from "@/components/concepts/ConceptCard";
import ConceptCard from "@/components/concepts/ConceptCard";
import { LibraryWrapper } from "./LibrarySection";
import styles from "./instructions-panel.module.css";

interface LibraryWithConceptsProps {
  concepts: ConceptCardData[];
}

export default function LibraryWithConcepts({ concepts }: LibraryWithConceptsProps) {
  return (
    <LibraryWrapper>
      <p className={styles.libraryDescriptionWithButton}>
        These are the key concepts used in this exercise - feel free to refresh yourself on anything!
      </p>
      <div className={styles.conceptsList}>
        {concepts.map((concept, index) => (
          <ConceptCard smallVersion key={index} concept={concept} />
        ))}
      </div>
      <OpenConceptLibraryButton />
    </LibraryWrapper>
  );
}

function OpenConceptLibraryButton() {
  return <button className="ui-btn ui-btn-small ui-btn-tertiary w-full">Open Concept Library</button>;
}

export { OpenConceptLibraryButton };
