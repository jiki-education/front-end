"use client";

import CodingExercise from "@/components/coding-exercise/CodingExercise";
import LessonLoadingPage from "@/components/lesson/LessonLoadingPage";
import { fetchProject, type ProjectData } from "@/lib/api/projects";
import type { ExerciseSlug } from "@jiki/curriculum";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProjectPage({ params }: PageProps) {
  const router = useRouter();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

        const projectData = await fetchProject(resolvedParams.slug);

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!cancelled) {
          setProject(projectData);

          // Note: Project tracking will be automatically started when first submission is made
          // No need to explicitly start here until backend endpoints are available
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

  if (loading) {
    return <LessonLoadingPage type="exercise" />;
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error || "Project not found"}</p>
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

  // Check if project is locked
  if (project.status === "locked") {
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
          <p className="text-gray-600 mb-6">
            This project is currently locked. Complete previous lessons to unlock it.
          </p>
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

  // Use exercise_slug from project data, fallback to project slug
  const exerciseSlug = (project.exercise_slug || project.slug) as ExerciseSlug;

  return (
    <CodingExercise language="jikiscript" exerciseSlug={exerciseSlug} projectSlug={project.slug} isProject={true} />
  );
}
