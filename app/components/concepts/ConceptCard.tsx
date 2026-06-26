import Link from "next/link";
import SubConceptIcon from "@/icons/subconcept.svg";
import LockedIcon from "@/icons/locked.svg";
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
  const hasSubConcepts = (concept.subConceptCount ?? 0) > 0;
  const nodeClass = hasSubConcepts ? styles.parentNode : styles.leafNode;

  const cardContent = (
    <>
      {isLocked && (
        <div className={styles.lockBadge}>
          <LockedIcon />
          Locked
        </div>
      )}
      <div className={styles.conceptIcon}>
        <ConceptIcon slug={concept.slug} width={100} height={100} />
      </div>
      <div className={styles.conceptContent}>
        <div className={styles.conceptTitle}>{renderInlineCode(concept.title)}</div>
        <div className={styles.conceptDescription}>{renderInlineCode(concept.description)}</div>
        {!isLocked && hasSubConcepts && (
          <div className={styles.subConceptCount}>
            <SubConceptIcon />
            <span>{concept.subConceptCount} sub-concepts</span>
          </div>
        )}
      </div>
    </>
  );

  if (isLocked) {
    return (
      <div className={assembleClassNames(styles.conceptCard, nodeClass, styles.locked, smallVersion && styles.small)}>
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      className={assembleClassNames(styles.conceptCard, nodeClass, smallVersion && styles.small)}
      href={`/concepts/${concept.slug || ""}`}
    >
      {cardContent}
    </Link>
  );
}

// Renders text with `backtick`-wrapped segments as inline monospace code.
function renderInlineCode(text: string) {
  return text.split(/(`[^`]+`)/g).map((segment, index) => {
    if (segment.startsWith("`") && segment.endsWith("`") && segment.length > 1) {
      return (
        <code key={index} className={styles.inlineCode}>
          {segment.slice(1, -1)}
        </code>
      );
    }
    return segment;
  });
}

export type { ConceptCardData };
