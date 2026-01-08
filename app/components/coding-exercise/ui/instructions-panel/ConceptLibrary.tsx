import type { ConceptCardData } from "@/components/concepts/ConceptCard";
import ConceptCard from "@/components/concepts/ConceptCard";
import ExternalLinkIcon from "@/icons/external-link.svg";
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
          <ConceptCard key={index} concept={concept} isAuthenticated={false} />
        ))}
      </div>

      <a className={styles.openConceptLibraryBtn} href="">
        <span className="underline">Open Concept Library</span>
        <ExternalLinkIcon />
      </a>
    </div>
  );
}
