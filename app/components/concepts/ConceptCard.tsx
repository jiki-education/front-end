import Link from "next/link";
import Image from "next/image";
import SubConceptIcon from "@static/icons/subconcept.svg";
import styles from "@/app/styles/modules/concepts.module.css";
import { assembleClassNames } from "@/lib/assemble-classnames";

interface ConceptCardData {
  slug: string;
  title: string;
  description: string;
  iconSrc: string;
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
        <Image src={"/" + concept.iconSrc} alt={concept.title} width={24} height={24} unoptimized />
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
