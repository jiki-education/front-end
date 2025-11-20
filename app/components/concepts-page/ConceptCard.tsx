import Link from "next/link";
import Image from "next/image";
import SubConceptIcon from "../../public/icons/subconcept.svg";
import styles from "@/app/(external)/concepts/concepts.module.css";

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
}

export default function ConceptCard({ concept }: ConceptCardProps) {
  return (
    <Link className={styles.conceptCard} href={`/concepts/${concept.slug || ""}`}>
      <div className={styles.conceptIcon}>
        <Image src={"/" + concept.iconSrc} alt={concept.title} width={24} height={24} unoptimized />
      </div>
      <div className={styles.conceptContent}>
        <div className={styles.conceptTitle}>{concept.title}</div>
        <div className={styles.conceptDescription}>{concept.description}</div>
        {concept.subConceptCount && (
          <div className={styles.subConceptCount}>
            <SubConceptIcon />
            <span>
              <span className={styles.countNumber}>{concept.subConceptCount}</span> sub-concepts
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

export type { ConceptCardData };
