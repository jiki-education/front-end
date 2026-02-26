import Link from "next/link";
import styles from "./ConceptPill.module.css";

interface ConceptPillProps {
  title: string;
  slug: string;
  isUnlocked: boolean;
}

export function ConceptPill({ title, slug, isUnlocked }: ConceptPillProps) {
  if (isUnlocked) {
    return (
      <Link href={`/concepts/${slug}`} className={`${styles.pill} ${styles.unlocked}`}>
        <span className={styles.dot} />
        {title}
      </Link>
    );
  }

  return (
    <span className={`${styles.pill} ${styles.locked}`} title="This concept is locked">
      <LockIcon />
      {title}
    </span>
  );
}

interface RelatedConceptsPillsProps {
  concepts: Array<{ slug: string; title: string }>;
  isUnlocked: (slug: string) => boolean;
}

export function RelatedConceptsPills({ concepts, isUnlocked }: RelatedConceptsPillsProps) {
  if (concepts.length === 0) {
    return null;
  }

  return (
    <div className={styles.pillsCard}>
      <h3 className={styles.pillsHeader}>Related Concepts</h3>
      <p className={styles.pillsDescription}>Check out these other related concepts</p>
      <div className={styles.pillsList}>
        {concepts.map((concept) => (
          <ConceptPill
            key={concept.slug}
            title={concept.title}
            slug={concept.slug}
            isUnlocked={isUnlocked(concept.slug)}
          />
        ))}
      </div>
    </div>
  );
}

function LockIcon() {
  return (
    <svg
      className={styles.lockIcon}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
