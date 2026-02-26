"use client";

import {
  getConcept,
  getAncestors,
  getConceptContent,
  getRelatedConcepts,
  getExercisesForConcept
} from "@/lib/api/concepts";
import { fetchUnlockedConceptSlugs } from "@/lib/api/concept-unlocks";
import { fetchLessonStatusesBySlugs, type LessonStatus } from "@/lib/api/lesson-progress";
import { useAuthStore } from "@/lib/auth/authStore";
import type { ConceptMeta, ConceptAncestor, ExerciseInfo } from "@/types/concepts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import MarkdownContent from "@/components/content/MarkdownContent";
import { ConceptsLayout } from "@/components/concepts";
import { Breadcrumb } from "@/components/concepts";
import { ConceptGroupPageSkeleton } from "@/components/concepts/LoadingStates";
import ConceptHero from "@/components/concepts/ConceptHero";
import ConceptLayout from "@/components/concepts/ConceptLayout";
import SubconceptsGrid from "@/components/concepts/SubconceptsGrid";
import styles from "@/app/styles/modules/concepts.module.css";

interface ConceptDetailPageProps {
  slug: string;
}

export default function ConceptDetailPage({ slug }: ConceptDetailPageProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [concept, setConcept] = useState<ConceptMeta | null>(null);
  const [ancestors, setAncestors] = useState<ConceptAncestor[]>([]);
  const [content, setContent] = useState<string | null>(null);
  const [relatedConcepts, setRelatedConcepts] = useState<ConceptMeta[]>([]);
  const [relatedExercises, setRelatedExercises] = useState<ExerciseInfo[]>([]);
  const [unlockedConceptSlugs, setUnlockedConceptSlugs] = useState<Set<string>>(new Set());
  const [exerciseStatuses, setExerciseStatuses] = useState<Record<string, LessonStatus>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConcept = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [conceptData, ancestorData, related, exercises] = await Promise.all([
          getConcept(slug),
          getAncestors(slug),
          getRelatedConcepts(slug),
          getExercisesForConcept(slug)
        ]);

        if (!conceptData) {
          setError("Concept not found.");
          return;
        }

        setConcept(conceptData);
        setAncestors(ancestorData);
        setRelatedConcepts(related);
        setRelatedExercises(exercises);

        // Load auth-dependent data and check access
        if (isAuthenticated) {
          const [unlockedSlugs, statuses] = await Promise.all([
            fetchUnlockedConceptSlugs(),
            exercises.length > 0 ? fetchLessonStatusesBySlugs(exercises.map((e) => e.slug)) : Promise.resolve({})
          ]);
          setUnlockedConceptSlugs(new Set(unlockedSlugs));
          setExerciseStatuses(statuses);

          // Redirect if concept is locked for this user
          if (!unlockedSlugs.includes(slug)) {
            router.push("/concepts");
            return;
          }
        }

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
  }, [slug, isAuthenticated, router]);

  if (isLoading) {
    return (
      <ConceptsLayout>
        <ConceptGroupPageSkeleton />
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

  const isConceptUnlocked = (conceptSlug: string) => !isAuthenticated || unlockedConceptSlugs.has(conceptSlug);

  const isExerciseAccessible = (exerciseSlug: string) => {
    if (!isAuthenticated) {
      return false;
    }
    const status = exerciseStatuses[exerciseSlug];
    return status === "started" || status === "completed";
  };

  const rightPanel = (
    <div>
      {relatedConcepts.length > 0 && (
        <div className="mb-32">
          <h3 className="text-18 font-semibold mb-12">Related Concepts</h3>
          <ul>
            {relatedConcepts.map((rc) => (
              <li key={rc.slug} className="mb-8">
                {isConceptUnlocked(rc.slug) ? (
                  <Link href={`/concepts/${rc.slug}`}>{rc.title}</Link>
                ) : (
                  <span>{rc.title} (locked)</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {relatedExercises.length > 0 && (
        <div>
          <h3 className="text-18 font-semibold mb-12">Related Exercises</h3>
          <ul>
            {relatedExercises.map((ex) => (
              <li key={ex.slug} className="mb-8">
                {isExerciseAccessible(ex.slug) ? (
                  <Link href={`/lesson/${ex.slug}`}>{ex.title}</Link>
                ) : (
                  <span>{ex.title} (locked)</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <ConceptsLayout>
      <Breadcrumb conceptTitle={concept.title} ancestors={ancestors} />

      <ConceptLayout rightPanel={rightPanel}>
        <ConceptHero category={parentTitle} title={concept.title} intro={concept.description} />

        {content && <MarkdownContent content={content} variant="base" />}
      </ConceptLayout>
    </ConceptsLayout>
  );
}
