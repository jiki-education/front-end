"use client";

import "./projects.css";
import { fetchProjects, type ProjectData, type ProjectsResponse } from "@/lib/api/projects";
import { useRequireAuth } from "@/lib/auth/hooks";
import Sidebar from "@/components/index-page/sidebar/Sidebar";
import { PageTabs } from "@/components/ui-kit/PageTabs";
import type { TabItem } from "@/components/ui-kit/PageTabs";
import { useEffect, useState } from "react";
import AllIcon from "../../public/icons/all.svg";
import InProgressIcon from "../../public/icons/in-progress.svg";
import CompleteIcon from "../../public/icons/complete.svg";
import LockedIcon from "../../public/icons/locked.svg";
import ProjectsIcon from "../../public/icons/projects.svg";
import { ProjectCard } from "./ProjectCard";
import { mockProjects } from "./mockProjects";

const tabs: TabItem[] = [
  { id: "all", label: "All", icon: <AllIcon />, color: "blue" },
  { id: "in-progress", label: "In Progress", icon: <InProgressIcon />, color: "purple" },
  { id: "not-started", label: "Not Started", icon: <ProjectsIcon />, color: "blue" },
  { id: "complete", label: "Complete", icon: <CompleteIcon />, color: "green" },
  { id: "locked", label: "Locked", icon: <LockedIcon />, color: "gray" }
];

export default function ProjectsPage() {
  const { isAuthenticated, isLoading: authLoading, isReady } = useRequireAuth();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const getFilteredProjects = () => {
    if (activeTab === "all") {
      return projects;
    }

    const statusMap = {
      "in-progress": "started",
      "not-started": "unlocked",
      complete: "completed",
      locked: "locked"
    };

    const targetStatus = statusMap[activeTab as keyof typeof statusMap];
    return projects.filter((project) => project.status === targetStatus);
  };

  const filteredProjects = getFilteredProjects();

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
      <div className="min-h-screen flex items-center justify-center ">
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
      <div className="min-h-screen flex items-center justify-center ">
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
    <div className="w-full">
      <Sidebar activeItem="projects" />
      <div className="main-content">
        <div className="container">
          <header className="ui-page-header">
            <h1>
              <ProjectsIcon />
              Projects
            </h1>
            <p>Build real applications and games to practice your coding skills.</p>
          </header>

          <PageTabs tabs={tabs} activeTabId={activeTab} onTabChange={setActiveTab} />

          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {projects.length === 0
                  ? "No projects available yet."
                  : `No projects found for "${tabs.find((tab) => tab.id === activeTab)?.label}".`}
              </p>
            </div>
          ) : (
            <div className="cards-grid">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
              {mockProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
