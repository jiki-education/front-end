"use client";

import dynamic from "next/dynamic";
import LessonLoadingModal from "@/components/common/LessonLoadingModal/LessonLoadingModal";
import { fetchUserCourse } from "@/lib/api/courses";
import { fetchProject, type ProjectData } from "@/lib/api/projects";
import type { UserCourse } from "@/types/course";
import type { ExerciseSlug } from "@jiki/curriculum";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const CodingExercise = dynamic(() => import("@/components/coding-exercise/CodingExercise"), { ssr: false });

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProjectPage({ params }: PageProps) {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [userCourse, setUserCourse] = useState<UserCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

    async function loadProject() {
      try {
        setLoading(true);
        const resolvedParams = await params;

        if (cancelled) {
          return;
        }

        const [projectData, userCourseData] = await Promise.all([fetchProject(resolvedParams.slug), fetchUserCourse()]);

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!cancelled) {
          setProject(projectData);
          setUserCourse(userCourseData);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch project:", err);
          setError(err instanceof Error ? err.message : "Failed to load project");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProject();

    return () => {
      cancelled = true;
    };
  }, [params]);

  if (error) {
    return <ProjectError error={error} />;
  }

  if (project?.status === "locked") {
    return <ProjectLocked />;
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
          isCompleted={project.status === "completed"}
          onReady={handleReady}
        />
      )}
      {showModal && <LessonLoadingModal />}
    </>
  );
}

function ProjectError({ error }: { error: string }) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <button
          onClick={() => router.push("/projects")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Projects
        </button>
      </div>
    </div>
  );
}

function ProjectLocked() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Locked</h2>
        <p className="text-gray-600 mb-6">This project is currently locked. Complete previous lessons to unlock it.</p>
        <button
          onClick={() => router.push("/projects")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Projects
        </button>
      </div>
    </div>
  );
}
