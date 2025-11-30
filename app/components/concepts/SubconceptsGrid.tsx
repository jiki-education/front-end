import { ConceptCard } from "@/components/concepts-page";
import { Breadcrumb, ConceptCardsLoadingSkeleton } from "@/components/concepts-page";
import { mockConcepts } from "@/lib/data/mockConcepts";
import { mockSubconcepts } from "@/lib/data/mockSubconcepts";
import styles from "@/styles/modules/concepts.module.css";

interface SubconceptsGridProps {
  slug: string;
  isLoading?: boolean;
}

export default function SubconceptsGrid({ slug, isLoading = false }: SubconceptsGridProps) {
  const currentConcept = mockConcepts.find((c) => c.slug === slug);
  const subconcepts = slug in mockSubconcepts ? mockSubconcepts[slug] : undefined;

  if (!currentConcept || !subconcepts) {
    return null;
  }

  return (
    <>
      <Breadcrumb conceptSlug={slug} conceptTitle={currentConcept.title} />

      <header>
        <h1 className={styles.pageHeading}>
          <svg
            className={`${styles.headingIcon} w-8 h-8`}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7h18M8 12h8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {currentConcept.title}
        </h1>
      </header>

      {isLoading ? (
        <ConceptCardsLoadingSkeleton />
      ) : (
        <div className={styles.conceptsGrid}>
          {subconcepts.map((subconcept) => (
            <ConceptCard key={subconcept.slug} concept={subconcept} isAuthenticated={true} />
          ))}
        </div>
      )}
    </>
  );
}
