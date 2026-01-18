import Link from "next/link";
import SubConceptIcon from "@static/icons/subconcept.svg";
import styles from "@/app/styles/modules/concepts.module.css";
import { assembleClassNames } from "@/lib/assemble-classnames";
import { ConceptIcon } from "@/components/ConceptIcon";

interface ConceptCardData {
  slug: string;
  title: string;
  description: string;
  subConceptCount?: number;
}

interface ConceptCardProps {
  concept: ConceptCardData;
  isAuthenticated: boolean;
  smallVersion?: boolean;
}

export default function ConceptCard({ concept, smallVersion = false }: ConceptCardProps) {
  return (
    <Link
      className={assembleClassNames(styles.conceptCard, smallVersion && styles.small)}
      href={`/concepts/${concept.slug || ""}`}
    >
      <div className={styles.conceptIcon}>
        <ConceptIcon slug={concept.slug} width={100} height={100} />
      </div>
      <div className={styles.conceptContent}>
        <div className={styles.conceptTitle}>{concept.title}</div>
        <div className={styles.conceptDescription}>{concept.description}</div>
        {concept.subConceptCount && (
          <div className={styles.subConceptCount}>
            <SubConceptIcon />
            <span>{concept.subConceptCount} sub-concepts</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export type { ConceptCardData };
