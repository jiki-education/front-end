import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getConcept,
  getAncestors,
  getConceptContent,
  getRelatedConcepts,
  getExercisesForConcept,
  fetchConceptVideoData
} from "@/lib/api/concepts";
import { fetchUnlockedConceptSlugs } from "@/lib/api/concept-unlocks";
import { fetchLessonStatusesBySlugs, type LessonStatus } from "@/lib/api/lesson-progress";
import { useAuthStore } from "@/lib/auth/authStore";
import type { ConceptMeta, ConceptAncestor, ExerciseInfo } from "@/types/concepts";
import type { VideoSource } from "@/types/lesson";

interface ConceptDetailData {
  concept: ConceptMeta | null;
  ancestors: ConceptAncestor[];
  content: string | null;
  isContentLoading: boolean;
  relatedConcepts: ConceptMeta[];
  relatedExercises: ExerciseInfo[];
  videoData: VideoSource[] | null;
  isLoading: boolean;
  error: string | null;
  isConceptUnlocked: (slug: string) => boolean;
  getExerciseStatus: (slug: string) => LessonStatus | "locked";
}

export function useConceptDetailData(slug: string): ConceptDetailData {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [concept, setConcept] = useState<ConceptMeta | null>(null);
  const [ancestors, setAncestors] = useState<ConceptAncestor[]>([]);
  const [content, setContent] = useState<string | null>(null);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [relatedConcepts, setRelatedConcepts] = useState<ConceptMeta[]>([]);
  const [relatedExercises, setRelatedExercises] = useState<ExerciseInfo[]>([]);
  const [videoData, setVideoData] = useState<VideoSource[] | null>(null);
  const [unlockedConceptSlugs, setUnlockedConceptSlugs] = useState<Set<string>>(new Set());
  const [exerciseStatuses, setExerciseStatuses] = useState<Record<string, LessonStatus>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        setContent(null);
        setVideoData(null);
        setIsContentLoading(false);

        // Phase 1: resolve concept + ancestors (fast — served from in-memory cache).
        // This gives us the real title and breadcrumb immediately so the correct
        // skeleton renders without any intermediate wrong-layout flash.
        const [conceptData, ancestorData] = await Promise.all([getConcept(slug), getAncestors(slug)]);

        if (!conceptData) {
          setError("Concept not found.");
          setIsLoading(false);
          return;
        }

        setConcept(conceptData);
        setAncestors(ancestorData);
        // Signal content is about to load (only relevant for leaf concepts)
        if (conceptData.childrenCount === 0) {
          setIsContentLoading(true);
        }
        // Phase 1 done — correct layout renders with real title/breadcrumb
        setIsLoading(false);

        // Phase 2: fetch the slower secondary data in the background.
        const [related, exercises] = await Promise.all([getRelatedConcepts(slug), getExercisesForConcept(slug)]);

        setRelatedConcepts(related);
        setRelatedExercises(exercises);

        if (isAuthenticated) {
          const [unlockedSlugs, statuses, video] = await Promise.all([
            fetchUnlockedConceptSlugs(),
            exercises.length > 0 ? fetchLessonStatusesBySlugs(exercises.map((e) => e.slug)) : Promise.resolve({}),
            fetchConceptVideoData(slug)
          ]);
          setUnlockedConceptSlugs(new Set(unlockedSlugs));
          setExerciseStatuses(statuses);
          setVideoData(video);

          if (!unlockedSlugs.includes(slug)) {
            router.push("/concepts");
            return;
          }
        }

        if (conceptData.childrenCount === 0) {
          const contentHtml = await getConceptContent(slug);
          setContent(contentHtml);
          setIsContentLoading(false);
        }
      } catch {
        setError("Failed to load concept. Please try again later.");
        setIsLoading(false);
        setIsContentLoading(false);
      }
    };

    void load();
  }, [slug, isAuthenticated, router]);

  const isConceptUnlocked = (conceptSlug: string) => !isAuthenticated || unlockedConceptSlugs.has(conceptSlug);

  const getExerciseStatus = (exerciseSlug: string): LessonStatus | "locked" => {
    if (!isAuthenticated) {
      return "locked";
    }
    return exerciseStatuses[exerciseSlug] ?? "not_started";
  };

  return {
    concept,
    ancestors,
    content,
    isContentLoading,
    relatedConcepts,
    relatedExercises,
    videoData,
    isLoading,
    error,
    isConceptUnlocked,
    getExerciseStatus
  };
}
