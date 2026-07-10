import { fetchChallenges, type ChallengeData, type ChallengeStatus } from "@/lib/api/challenges";
import { expandUnlocked, fetchUnlockedConceptSlugs, isUnlocked } from "@/lib/api/concept-unlocks";
import {
  fetchConceptVideoData,
  getAncestors,
  getConcept,
  getConceptContent,
  getConcepts,
  getExercisesForConcept,
  getRelatedConcepts
} from "@/lib/api/concepts";
import { fetchLessonStatusesBySlugs, type LessonStatus } from "@/lib/api/lesson-progress";
import { useAuthStore } from "@/lib/auth/authStore";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import type { ConceptAncestor, ConceptMeta, ExerciseInfo, ChallengeInfo } from "@/types/concepts";
import type { VideoSource } from "@/types/lesson";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/** Server-fetched leaf data used to seed the hook for logged-out SSR. */
export interface ConceptDetailSeed {
  concept: ConceptMeta;
  ancestors: ConceptAncestor[];
  content: string | null;
  relatedConcepts: ConceptMeta[];
  relatedExercises: ExerciseInfo[];
  videoData: VideoSource[] | null;
}

interface ConceptDetailData {
  concept: ConceptMeta | null;
  ancestors: ConceptAncestor[];
  content: string | null;
  isContentLoading: boolean;
  relatedConcepts: ConceptMeta[];
  relatedExercises: ExerciseInfo[];
  relatedChallenges: ChallengeInfo[];
  videoData: VideoSource[] | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isConceptUnlocked: (slug: string) => boolean;
  getExerciseStatus: (slug: string) => LessonStatus;
  getChallengeStatus: (slug: string) => ChallengeStatus | "locked";
}

interface ConceptSetupContext {
  slug: string;
  locale: string;
  router: ReturnType<typeof useRouter>;
  // Localized "/concepts" path (naked or /<locale>-prefixed) to redirect to when the
  // requested concept is locked. Resolved in the hook where the ambient locale is
  // readable; passed as a plain string so it stays stable in the effect deps.
  conceptsPath: string;
  isCancelled: () => boolean;
  setRelatedExercises: (value: ExerciseInfo[]) => void;
  setRelatedChallenges: (value: ChallengeInfo[]) => void;
  setUnlockedConceptSlugs: (value: Set<string>) => void;
  setExerciseStatuses: (value: Record<string, LessonStatus>) => void;
  setChallengeStatuses: (value: Record<string, ChallengeStatus>) => void;
  setVideoData: (value: VideoSource[] | null) => void;
}

async function setupForLoggedInUser(exercises: ExerciseInfo[], ctx: ConceptSetupContext) {
  const [rawUnlockedSlugs, allConcepts, challengesResponse, video] = await Promise.all([
    fetchUnlockedConceptSlugs(),
    getConcepts(ctx.locale),
    fetchChallenges({ per: 100 }).catch(() => ({ results: [] as ChallengeData[] })),
    fetchConceptVideoData(ctx.slug)
  ]);
  if (ctx.isCancelled()) {
    return;
  }

  // Expand with parent categories so visiting a category detail page (which is
  // never returned by the unlock API) is not treated as locked / redirected away.
  const unlockedSlugs = expandUnlocked(allConcepts, rawUnlockedSlugs);

  // Split concept exercises into true exercises vs challenges (matched by exercise_slug or slug).
  const challengeByExerciseSlug = new Map<string, ChallengeData>();
  for (const challenge of challengesResponse.results) {
    if (challenge.exercise_slug) {
      challengeByExerciseSlug.set(challenge.exercise_slug, challenge);
    }
    challengeByExerciseSlug.set(challenge.slug, challenge);
  }

  const exerciseOnly: ExerciseInfo[] = [];
  const challengesForConcept: ChallengeInfo[] = [];
  for (const ex of exercises) {
    const match = challengeByExerciseSlug.get(ex.slug);
    if (match) {
      challengesForConcept.push({ slug: match.slug, title: match.title });
    } else {
      exerciseOnly.push(ex);
    }
  }

  const lessonStatuses =
    exerciseOnly.length > 0
      ? await fetchLessonStatusesBySlugs(exerciseOnly.map((e) => e.slug))
      : ({} as Record<string, LessonStatus>);
  if (ctx.isCancelled()) {
    return;
  }

  const projStatuses: Record<string, ChallengeStatus> = {};
  for (const challenge of challengesResponse.results) {
    if (challenge.status) {
      projStatuses[challenge.slug] = challenge.status;
    }
  }

  ctx.setRelatedExercises(exerciseOnly);
  ctx.setRelatedChallenges(challengesForConcept);
  ctx.setUnlockedConceptSlugs(unlockedSlugs);
  ctx.setExerciseStatuses(lessonStatuses);
  ctx.setChallengeStatuses(projStatuses);
  ctx.setVideoData(video);

  if (!unlockedSlugs.has(ctx.slug)) {
    ctx.router.push(ctx.conceptsPath);
  }
}

async function setupForExternalUser(exercises: ExerciseInfo[], ctx: ConceptSetupContext) {
  ctx.setRelatedExercises(exercises);

  const video = await fetchConceptVideoData(ctx.slug);
  if (ctx.isCancelled()) {
    return;
  }
  ctx.setVideoData(video);
}

export function useConceptDetailData(slug: string, initialData: ConceptDetailSeed | null = null): ConceptDetailData {
  const router = useRouter();
  const locale = useLocale();
  const conceptsPath = useLocaleRoutes().concepts();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // Logged-out visitors are seeded with the server-rendered leaf (all unlocked).
  // Authenticated users re-fetch to layer on unlock state, statuses, and challenges.
  const seeded = initialData !== null && !isAuthenticated;

  const [concept, setConcept] = useState<ConceptMeta | null>(seeded ? initialData.concept : null);
  const [ancestors, setAncestors] = useState<ConceptAncestor[]>(seeded ? initialData.ancestors : []);
  const [content, setContent] = useState<string | null>(seeded ? initialData.content : null);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [relatedConcepts, setRelatedConcepts] = useState<ConceptMeta[]>(seeded ? initialData.relatedConcepts : []);
  const [relatedExercises, setRelatedExercises] = useState<ExerciseInfo[]>(seeded ? initialData.relatedExercises : []);
  const [relatedChallenges, setRelatedChallenges] = useState<ChallengeInfo[]>([]);
  const [videoData, setVideoData] = useState<VideoSource[] | null>(seeded ? initialData.videoData : null);
  const [unlockedConceptSlugs, setUnlockedConceptSlugs] = useState<Set<string>>(new Set());
  const [exerciseStatuses, setExerciseStatuses] = useState<Record<string, LessonStatus>>({});
  const [challengeStatuses, setChallengeStatuses] = useState<Record<string, ChallengeStatus>>({});
  const [isLoading, setIsLoading] = useState(!seeded);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Logged-out visitors already have the full leaf from the server.
    if (seeded) {
      return;
    }

    let cancelled = false;

    const ctx: ConceptSetupContext = {
      slug,
      locale,
      router,
      conceptsPath,
      isCancelled: () => cancelled,
      setRelatedExercises,
      setRelatedChallenges,
      setUnlockedConceptSlugs,
      setExerciseStatuses,
      setChallengeStatuses,
      setVideoData
    };

    const load = async () => {
      try {
        setError(null);
        setContent(null);
        setVideoData(null);
        setIsContentLoading(false);

        // Phase 1: resolve concept + ancestors (fast — served from in-memory cache).
        // This gives us the real title and breadcrumb immediately so the correct
        // skeleton renders without any intermediate wrong-layout flash.
        const [conceptData, ancestorData] = await Promise.all([getConcept(slug, locale), getAncestors(slug, locale)]);
        if (cancelled) {
          return;
        }

        if (!conceptData) {
          setError("Concept not found.");
          setIsLoading(false);
          return;
        }

        setConcept(conceptData);
        setAncestors(ancestorData);
        // Phase 1 done — correct layout renders with real title/breadcrumb
        setIsLoading(false);

        // Kick off the leaf-concept content fetch in parallel with Phase 2 — it only
        // depends on the slug + category flag from Phase 1, not on related/exercise data.
        if (!conceptData.category) {
          setIsContentLoading(true);
          void getConceptContent(slug, locale)
            .then((contentHtml) => {
              if (!cancelled) {
                setContent(contentHtml);
              }
            })
            .catch(() => {
              if (!cancelled) {
                setError("Failed to load concept. Please try again later.");
              }
            })
            .finally(() => {
              if (!cancelled) {
                setIsContentLoading(false);
              }
            });
        }

        // Phase 2: fetch the slower secondary data in the background.
        const [related, exercises] = await Promise.all([
          getRelatedConcepts(slug, locale),
          getExercisesForConcept(slug, locale)
        ]);
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (cancelled) {
          return;
        }

        setRelatedConcepts(related);

        if (isAuthenticated) {
          await setupForLoggedInUser(exercises, ctx);
        } else {
          await setupForExternalUser(exercises, ctx);
        }
      } catch {
        if (cancelled) {
          return;
        }
        setError("Failed to load concept. Please try again later.");
        setIsLoading(false);
        setIsContentLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [slug, isAuthenticated, router, seeded, conceptsPath, locale]);

  const isConceptUnlocked = (conceptSlug: string) => isUnlocked(unlockedConceptSlugs, conceptSlug, isAuthenticated);

  const getExerciseStatus = (exerciseSlug: string): LessonStatus => {
    if (!isAuthenticated) {
      return "locked";
    }
    return exerciseStatuses[exerciseSlug] ?? "locked";
  };

  const getChallengeStatus = (challengeSlug: string): ChallengeStatus | "locked" => {
    if (!isAuthenticated) {
      return "locked";
    }
    return challengeStatuses[challengeSlug] ?? "locked";
  };

  return {
    concept,
    ancestors,
    content,
    isContentLoading,
    relatedConcepts,
    relatedExercises,
    relatedChallenges,
    videoData,
    isLoading,
    error,
    isAuthenticated,
    isConceptUnlocked,
    getExerciseStatus,
    getChallengeStatus
  };
}
