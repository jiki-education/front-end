"use client";

import dynamic from "next/dynamic";
import LessonLoadingModal from "@/components/common/LessonLoadingModal/LessonLoadingModal";
import { ApiError, getApiErrorType, NotFoundError } from "@/lib/api/client";
import { fetchUserCourse } from "@/lib/api/courses";
import { fetchProject, fetchUserProject, startProject, type ProjectData } from "@/lib/api/projects";
import type { UserCourse } from "@/types/course";
import type { LastSubmissionData } from "@/lib/api/types/conversation";
import type { ExerciseSlug } from "@jiki/curriculum";
import { useCallback, useEffect, useState } from "react";
import ProjectError from "./ProjectError";
import ProjectLocked from "./ProjectLocked";
import ProjectPremiumRequired from "./ProjectPremiumRequired";

const CodingExercise = dynamic(() => import("@/components/coding-exercise/CodingExercise"), { ssr: false });

type LockState = "locked" | "premium" | null;

interface ProjectProps {
  slug: string;
}

export default function Project({ slug }: ProjectProps) {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [userCourse, setUserCourse] = useState<UserCourse | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [serverSubmission, setServerSubmission] = useState<LastSubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lockState, setLockState] = useState<LockState>(null);
  const [innerReady, setInnerReady] = useState(false);

  const handleReady = useCallback(() => setInnerReady(true), []);

  // Update document title when project loads
  useEffect(() => {
    if (project) {
      document.title = `${project.title} - Jiki`;
    }
  }, [project]);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);

        // Start tracking first — this is the lock-enforcement gate. It rejects
        // with a 403 (project_locked / premium_required) or 404 when the user
        // may not access this project.
        await startProject(slug);
        if (cancelled) {
          return;
        }

        const [projectData, userCourseData, userProject] = await Promise.all([
          fetchProject(slug),
          fetchUserCourse(),
          fetchUserProject(slug).catch((err: unknown) => {
            // No user_project record yet just means "not started" — that's fine.
            if (err instanceof NotFoundError) {
              return null;
            }
            throw err;
          })
        ]);

        // `cancelled` is mutated by the cleanup function across the awaits above;
        // ESLint's static analysis can't see that and thinks it's always false.
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (cancelled) {
          return;
        }

        setProject(projectData);
        setUserCourse(userCourseData);
        setIsCompleted(userProject?.status === "completed");
        setServerSubmission(userProject?.data?.last_submission ?? null);
      } catch (err) {
        if (cancelled) {
          return;
        }

        // The /start gate rejects locked/premium access with a 403.
        if (err instanceof ApiError && err.status === 403) {
          const type = getApiErrorType(err);
          if (type === "premium_required") {
            setLockState("premium");
            return;
          }
          setLockState("locked");
          return;
        }

        console.error("Failed to load project:", err);
        setError(err instanceof Error ? err.message : "Failed to load project");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (error) {
    return <ProjectError error={error} />;
  }

  if (lockState === "locked") {
    return <ProjectLocked />;
  }

  if (lockState === "premium") {
    return <ProjectPremiumRequired />;
  }

  const showModal = loading || !project || !innerReady;

  // CodingExercise must mount *underneath* the modal (not behind an early return) so its
  // dynamic chunk and exercise loader can run in the background. The child fires onReady
  // when truly ready, which flips innerReady and unmounts the modal in a single render —
  // keeping one modal instance alive across the whole load so its CSS animations don't restart.
  return (
    <>
      {project && (
        <CodingExercise
          language={userCourse?.language || "javascript"}
          exerciseSlug={(project.exercise_slug || project.slug) as ExerciseSlug}
          context={{ type: "project", slug: project.slug }}
          levelId={userCourse?.current_level_slug ?? undefined}
          isCompleted={isCompleted}
          serverSubmission={serverSubmission}
          onReady={handleReady}
        />
      )}
      {showModal && <LessonLoadingModal />}
    </>
  );
}
