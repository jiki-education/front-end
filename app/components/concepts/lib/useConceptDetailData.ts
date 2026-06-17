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
import { fetchProjects, type ProjectData, type ProjectStatus } from "@/lib/api/projects";
import { useAuthStore } from "@/lib/auth/authStore";
import type { ConceptMeta, ConceptAncestor, ExerciseInfo, ProjectInfo } from "@/types/concepts";
import type { VideoSource } from "@/types/lesson";

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
  getExerciseStatus: (slug: string) => LessonStatus | "locked";
  getProjectStatus: (slug: string) => ProjectStatus | "locked";
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
  const [relatedProjects, setRelatedProjects] = useState<ProjectInfo[]>([]);
  const [videoData, setVideoData] = useState<VideoSource[] | null>(null);
  const [unlockedConceptSlugs, setUnlockedConceptSlugs] = useState<Set<string>>(new Set());
  const [exerciseStatuses, setExerciseStatuses] = useState<Record<string, LessonStatus>>({});
  const [projectStatuses, setProjectStatuses] = useState<Record<string, ProjectStatus>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

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
          const [unlockedSlugs, projectsResponse, video] = await Promise.all([
            fetchUnlockedConceptSlugs(),
            fetchProjects({ per: 100 }).catch(() => ({ results: [] as ProjectData[] })),
            fetchConceptVideoData(slug)
          ]);
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (cancelled) {
            return;
          }

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
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (cancelled) {
            return;
          }

          const projStatuses: Record<string, ProjectStatus> = {};
          for (const project of projectsResponse.results) {
            if (project.status) {
              projStatuses[project.slug] = project.status;
            }
          }

          setRelatedExercises(exerciseOnly);
          setRelatedProjects(projectsForConcept);
          setUnlockedConceptSlugs(new Set(unlockedSlugs));
          setExerciseStatuses(lessonStatuses);
          setProjectStatuses(projStatuses);
          setVideoData(video);

          if (!unlockedSlugs.includes(slug)) {
            router.push("/concepts");
            return;
          }
        } else {
          setRelatedExercises(exercises);
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
  }, [slug, isAuthenticated, router]);

  const isConceptUnlocked = (conceptSlug: string) => !isAuthenticated || unlockedConceptSlugs.has(conceptSlug);

  const getExerciseStatus = (exerciseSlug: string): LessonStatus | "locked" => {
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
