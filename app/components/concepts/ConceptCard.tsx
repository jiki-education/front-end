import Link from "next/link";
import SubConceptIcon from "@static/icons/subconcept.svg";
import LockedIcon from "@static/icons/locked.svg";
import styles from "@/app/styles/modules/concepts.module.css";
import { assembleClassNames } from "@/lib/assemble-classnames";
import { ConceptIcon } from "@/components/icons/ConceptIcon";

interface ConceptCardData {
  slug: string;
  title: string;
  description: string;
  subConceptCount?: number;
  userMayAccess?: boolean;
}

interface ConceptCardProps {
  concept: ConceptCardData;
  smallVersion?: boolean;
}

export default function ConceptCard({ concept, smallVersion = false }: ConceptCardProps) {
  const isLocked = concept.userMayAccess === false;

  const cardContent = (
    <>
      <div className={styles.conceptIcon}>
        <ConceptIcon slug={concept.slug} width={100} height={100} />
      </div>
      <div className={styles.conceptContent}>
        <div className={styles.conceptTitle}>{concept.title}</div>
        <div className={styles.conceptDescription}>{concept.description}</div>
        {(concept.subConceptCount ?? 0) > 0 && (
          <div className={styles.subConceptCount}>
            <SubConceptIcon />
            <span>{concept.subConceptCount} sub-concepts</span>
          </div>
        )}
      </div>
      {isLocked && <LockedIcon className={styles.lockedIcon} />}
    </>
  );

  if (isLocked) {
    return (
      <div className={assembleClassNames(styles.conceptCard, styles.locked, smallVersion && styles.small)}>
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      className={assembleClassNames(styles.conceptCard, smallVersion && styles.small)}
      href={`/concepts/${concept.slug || ""}`}
    >
      {cardContent}
    </Link>
  );
}

export type { ConceptCardData };
