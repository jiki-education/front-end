"use client";

import { getConcept, getAncestors, getConceptContent } from "@/lib/concepts/actions";
import type { ConceptMeta, ConceptAncestor } from "@/types/concepts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MarkdownContent from "@/components/content/MarkdownContent";
import { ConceptsLayout } from "@/components/concepts";
import { Breadcrumb } from "@/components/concepts";
import ConceptHero from "@/components/concepts/ConceptHero";
import ConceptLayout from "@/components/concepts/ConceptLayout";
import SubconceptsGrid from "@/components/concepts/SubconceptsGrid";
import styles from "@/app/styles/modules/concepts.module.css";

interface ConceptDetailPageProps {
  slug: string;
}

export default function ConceptDetailPage({ slug }: ConceptDetailPageProps) {
  const router = useRouter();
  const [concept, setConcept] = useState<ConceptMeta | null>(null);
  const [ancestors, setAncestors] = useState<ConceptAncestor[]>([]);
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConcept = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [conceptData, ancestorData] = await Promise.all([getConcept(slug), getAncestors(slug)]);

        if (!conceptData) {
          setError("Concept not found.");
          return;
        }

        setConcept(conceptData);
        setAncestors(ancestorData);

        // Only load content for leaf concepts
        if (conceptData.childrenCount === 0) {
          const contentHtml = await getConceptContent(slug);
          setContent(contentHtml);
        }
      } catch {
        setError("Failed to load concept. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadConcept();
  }, [slug]);

  if (isLoading) {
    return (
      <ConceptsLayout>
        <div className="animate-pulse">
          <div className="mb-12">
            <div className="mb-6 h-12 w-3/4 bg-gray-200 rounded"></div>
            <div className="mb-4 h-4 w-1/4 bg-gray-200 rounded"></div>
            <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
          </div>
        </div>
      </ConceptsLayout>
    );
  }

  if (error || !concept) {
    return (
      <ConceptsLayout>
        <div className="text-center">
          <div className="mb-4 text-red-600 text-lg">{error || "Concept not found."}</div>
          <button
            onClick={() => router.push("/concepts")}
            className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            Back to Concepts
          </button>
        </div>
      </ConceptsLayout>
    );
  }

  if (concept.childrenCount > 0) {
    return (
      <ConceptsLayout>
        <Breadcrumb conceptTitle={concept.title} ancestors={ancestors} />

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
            {concept.title}
          </h1>
        </header>

        <SubconceptsGrid parentSlug={concept.slug} />
      </ConceptsLayout>
    );
  }

  const parentTitle = ancestors.length > 0 ? ancestors[ancestors.length - 1].title : undefined;

  return (
    <ConceptsLayout>
      <Breadcrumb conceptTitle={concept.title} ancestors={ancestors} />

      <ConceptLayout>
        <ConceptHero category={parentTitle} title={concept.title} intro={concept.description} />

        {content && <MarkdownContent content={content} variant="base" />}
      </ConceptLayout>
    </ConceptsLayout>
  );
}
