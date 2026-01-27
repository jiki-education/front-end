import type { ConceptCardData } from "@/components/concepts/ConceptCard";
import ConceptCard from "@/components/concepts/ConceptCard";
import styles from "./instructions-panel.module.css";

interface ConceptLibraryProps {
  concepts: ConceptCardData[];
  className?: string;
}

export default function ConceptLibrary({ concepts, className = "" }: ConceptLibraryProps) {
  return (
    <div className={`${styles.conceptsContainer} ${className}`}>
      <h2 className={styles.conceptsTitle}>Library</h2>
      <p className={styles.sectionInfo}>Key concepts used in this exercise.</p>
      <div className={styles.conceptsList}>
        {concepts.map((concept, index) => (
          <ConceptCard smallVersion key={index} concept={concept} />
        ))}
      </div>

      <a className="ui-btn ui-btn-default w-full ui-btn-gray ui-btn-secondary" href="">
        Open Concept Library
      </a>
    </div>
  );
}
