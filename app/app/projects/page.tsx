"use client";

import { fetchProjects, type ProjectData, type ProjectsResponse } from "@/lib/api/projects";
import { useRequireAuth } from "@/lib/auth/hooks";
import Sidebar from "@/components/index-page/sidebar/Sidebar";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ProjectCardProps {
  project: ProjectData;
}

function ProjectCard({ project }: ProjectCardProps) {
  const isClickable = project.status !== "locked";
  const statusColors = {
    locked: "bg-gray-300 text-gray-500",
    unlocked: "bg-blue-100 text-blue-800",
    started: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800"
  };

  const cardContent = (
    <div
      className={`p-6 border rounded-lg transition-colors ${
        isClickable ? "hover:shadow-md cursor-pointer border-gray-200" : "cursor-not-allowed border-gray-300 opacity-60"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
        {project.status && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[project.status]}`}>
            {project.status}
          </span>
        )}
      </div>
      <p className="text-gray-600 text-sm">{project.description}</p>
    </div>
  );

  if (!isClickable) {
    return cardContent;
  }

  return <Link href={`/projects/${project.slug}`}>{cardContent}</Link>;
}

export default function ProjectsPage() {
  const { isAuthenticated, isLoading: authLoading, isReady } = useRequireAuth();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      if (!isReady || !isAuthenticated) {
        setProjectsLoading(false);
        return;
      }

      try {
        setProjectsLoading(true);
        const response: ProjectsResponse = await fetchProjects();
        setProjects(response.results);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setProjectsError(error instanceof Error ? error.message : "Failed to load projects");
      } finally {
        setProjectsLoading(false);
      }
    }

    void loadProjects();
  }, [isAuthenticated, isReady]);

  if (authLoading || projectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (projectsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {projectsError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeItem="projects" />
      <div className="ml-[260px]">
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
            <p className="text-gray-600">
              Practice your coding skills with these hands-on projects. Complete exercises to unlock new challenges.
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No projects available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
