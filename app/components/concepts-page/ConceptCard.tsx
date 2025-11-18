import Link from "next/link";
import Image from "next/image";
import SubConceptIcon from "../../public/icons/subconcept.svg";

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
    <Link className="concept-card" href={`/concepts/${concept.slug || ""}`}>
      <div className="concept-icon">
        <Image src={"/" + concept.iconSrc} alt={concept.title} width={24} height={24} unoptimized />
      </div>
      <div className="concept-content">
        <div className="concept-title">{concept.title}</div>
        <div className="concept-description">{concept.description}</div>
        {concept.subConceptCount && (
          <div className="sub-concept-count">
            <SubConceptIcon />
            <span>
              <span className="count-number">{concept.subConceptCount}</span> sub-concepts
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

export type { ConceptCardData };
