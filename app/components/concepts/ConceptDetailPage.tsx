"use client";

import { fetchConcept } from "@/lib/api/concepts";
import type { ConceptDetail } from "@/types/concepts";
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
  const [concept, setConcept] = useState<ConceptDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConcept = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await fetchConcept(slug);
        setConcept(data);
      } catch (err: any) {
        if (err.status === 404) {
          setError("Concept not found.");
        } else if (err.status === 403) {
          setError("This concept is locked. Sign up to unlock it!");
        } else {
          setError("Failed to load concept. Please try again later.");
        }
        console.error("Error fetching concept:", err);
      } finally {
        setIsLoading(false);
      }
    };

    void loadConcept();
  }, [slug]);

  // Check if this concept has subconcepts
  const hasSubconcepts = concept && concept.children_count > 0;

  // Show loading state
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

  if (error) {
    return (
      <ConceptsLayout>
        <div className="text-center">
          <div className="mb-4 text-red-600 text-lg">{error}</div>
          <div className="space-x-4">
            <button
              onClick={() => router.push("/concepts")}
              className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
            >
              Back to Concepts
            </button>
            {error.includes("locked") && (
              <button
                onClick={() => router.push("/auth/signup")}
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Sign Up
              </button>
            )}
          </div>
        </div>
      </ConceptsLayout>
    );
  }

  // Show subconcepts view when subconcepts exist
  if (hasSubconcepts) {
    return (
      <ConceptsLayout>
        <Breadcrumb conceptTitle={concept.title} ancestors={concept.ancestors} />

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

  // Fallback to original detail view for concepts without subconcepts
  if (!concept) {
    return (
      <ConceptsLayout>
        <div className="text-center">
          <p className="text-gray-600 text-lg">Concept not found.</p>
          <button
            onClick={() => router.push("/concepts")}
            className="mt-4 rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            Back to Concepts
          </button>
        </div>
      </ConceptsLayout>
    );
  }

  return (
    <ConceptsLayout>
      <Breadcrumb conceptTitle={concept.title} ancestors={concept.ancestors} />

      <ConceptLayout>
        <ConceptHero category="Flow Control" title={concept.title} intro={concept.description} />

        <MarkdownContent content={concept.content_html} variant="base" />
      </ConceptLayout>
    </ConceptsLayout>
  );
}
