import ConceptCard from "@/components/concepts-page/ConceptCard";
import type { ConceptCardData } from "@/components/concepts-page/ConceptCard";
import styles from "./instructions-panel.module.css";

interface ConceptLibraryProps {
  concepts: ConceptCardData[];
  className?: string;
}

export default function ConceptLibrary({ concepts, className = "" }: ConceptLibraryProps) {
  return (
    <div className={`${styles.conceptsContainer} ${className}`}>
      <h3 className={styles.conceptsTitle}>Concept Library</h3>
      <div className={styles.conceptsList}>
        {concepts.map((concept, index) => (
          <ConceptCard key={index} concept={concept} isAuthenticated={false} />
        ))}
      </div>
    </div>
  );
}
