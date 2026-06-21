import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getConcept,
  getConcepts,
  getAncestors,
  getConceptContent,
  getRelatedConcepts,
  getExercisesForConcept,
  fetchConceptVideoData
} from "@/lib/api/concepts";
import { fetchUnlockedConceptSlugs, expandUnlocked, isUnlocked } from "@/lib/api/concept-unlocks";
import { fetchLessonStatusesBySlugs, type LessonStatus } from "@/lib/api/lesson-progress";
import { fetchProjects, type ProjectData, type ProjectStatus } from "@/lib/api/projects";
import { useAuthStore } from "@/lib/auth/authStore";
import type { ConceptMeta, ConceptAncestor, ExerciseInfo, ProjectInfo } from "@/types/concepts";
import type { VideoSource } from "@/types/lesson";

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
  relatedProjects: ProjectInfo[];
  videoData: VideoSource[] | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isConceptUnlocked: (slug: string) => boolean;
  getExerciseStatus: (slug: string) => LessonStatus;
  getProjectStatus: (slug: string) => ProjectStatus | "locked";
}

interface ConceptSetupContext {
  slug: string;
  router: ReturnType<typeof useRouter>;
  isCancelled: () => boolean;
  setRelatedExercises: (value: ExerciseInfo[]) => void;
  setRelatedProjects: (value: ProjectInfo[]) => void;
  setUnlockedConceptSlugs: (value: Set<string>) => void;
  setExerciseStatuses: (value: Record<string, LessonStatus>) => void;
  setProjectStatuses: (value: Record<string, ProjectStatus>) => void;
  setVideoData: (value: VideoSource[] | null) => void;
}

async function setupForLoggedInUser(exercises: ExerciseInfo[], ctx: ConceptSetupContext) {
  const [rawUnlockedSlugs, allConcepts, projectsResponse, video] = await Promise.all([
    fetchUnlockedConceptSlugs(),
    getConcepts(),
    fetchProjects({ per: 100 }).catch(() => ({ results: [] as ProjectData[] })),
    fetchConceptVideoData(ctx.slug)
  ]);
  if (ctx.isCancelled()) {
    return;
  }

  // Expand with parent categories so visiting a category detail page (which is
  // never returned by the unlock API) is not treated as locked / redirected away.
  const unlockedSlugs = expandUnlocked(allConcepts, rawUnlockedSlugs);

  // Split concept exercises into true exercises vs projects (matched by exercise_slug or slug).
  const projectByExerciseSlug = new Map<string, ProjectData>();
  for (const project of projectsResponse.results) {
    if (project.exercise_slug) {
      projectByExerciseSlug.set(project.exercise_slug, project);
    }
    projectByExerciseSlug.set(project.slug, project);
  }

  const exerciseOnly: ExerciseInfo[] = [];
  const projectsForConcept: ProjectInfo[] = [];
  for (const ex of exercises) {
    const match = projectByExerciseSlug.get(ex.slug);
    if (match) {
      projectsForConcept.push({ slug: match.slug, title: match.title });
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

  const projStatuses: Record<string, ProjectStatus> = {};
  for (const project of projectsResponse.results) {
    if (project.status) {
      projStatuses[project.slug] = project.status;
    }
  }

  ctx.setRelatedExercises(exerciseOnly);
  ctx.setRelatedProjects(projectsForConcept);
  ctx.setUnlockedConceptSlugs(unlockedSlugs);
  ctx.setExerciseStatuses(lessonStatuses);
  ctx.setProjectStatuses(projStatuses);
  ctx.setVideoData(video);

  if (!unlockedSlugs.has(ctx.slug)) {
    ctx.router.push("/concepts");
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
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // Logged-out visitors are seeded with the server-rendered leaf (all unlocked).
  // Authenticated users re-fetch to layer on unlock state, statuses, and projects.
  const seeded = initialData !== null && !isAuthenticated;

  const [concept, setConcept] = useState<ConceptMeta | null>(seeded ? initialData.concept : null);
  const [ancestors, setAncestors] = useState<ConceptAncestor[]>(seeded ? initialData.ancestors : []);
  const [content, setContent] = useState<string | null>(seeded ? initialData.content : null);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [relatedConcepts, setRelatedConcepts] = useState<ConceptMeta[]>(seeded ? initialData.relatedConcepts : []);
  const [relatedExercises, setRelatedExercises] = useState<ExerciseInfo[]>(seeded ? initialData.relatedExercises : []);
  const [relatedProjects, setRelatedProjects] = useState<ProjectInfo[]>([]);
  const [videoData, setVideoData] = useState<VideoSource[] | null>(seeded ? initialData.videoData : null);
  const [unlockedConceptSlugs, setUnlockedConceptSlugs] = useState<Set<string>>(new Set());
  const [exerciseStatuses, setExerciseStatuses] = useState<Record<string, LessonStatus>>({});
  const [projectStatuses, setProjectStatuses] = useState<Record<string, ProjectStatus>>({});
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
      router,
      isCancelled: () => cancelled,
      setRelatedExercises,
      setRelatedProjects,
      setUnlockedConceptSlugs,
      setExerciseStatuses,
      setProjectStatuses,
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
        const [conceptData, ancestorData] = await Promise.all([getConcept(slug), getAncestors(slug)]);
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
          void getConceptContent(slug)
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
        const [related, exercises] = await Promise.all([getRelatedConcepts(slug), getExercisesForConcept(slug)]);
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
  }, [slug, isAuthenticated, router, seeded]);

  const isConceptUnlocked = (conceptSlug: string) => isUnlocked(unlockedConceptSlugs, conceptSlug, isAuthenticated);

  const getExerciseStatus = (exerciseSlug: string): LessonStatus => {
    if (!isAuthenticated) {
      return "locked";
    }
    return exerciseStatuses[exerciseSlug] ?? "locked";
  };

  const getProjectStatus = (projectSlug: string): ProjectStatus | "locked" => {
    if (!isAuthenticated) {
      return "locked";
    }
    return projectStatuses[projectSlug] ?? "locked";
  };

  return {
    concept,
    ancestors,
    content,
    isContentLoading,
    relatedConcepts,
    relatedExercises,
    relatedProjects,
    videoData,
    isLoading,
    error,
    isAuthenticated,
    isConceptUnlocked,
    getExerciseStatus,
    getProjectStatus
  };
}
