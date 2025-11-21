"use client";

import { useRequireAuth } from "@/lib/auth/hooks";
import Sidebar from "@/components/index-page/sidebar/Sidebar";
import { ProjectsContent } from "./ProjectsContent";

export default function ProjectsPage() {
  const { isAuthenticated, isLoading: authLoading, isReady } = useRequireAuth();

  if (!isAuthenticated && !authLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-secondary theme-transition">
      <Sidebar activeItem="projects" />
      <div className="ml-[260px] p-40">
        {authLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        ) : (
          <ProjectsContent isAuthenticated={isAuthenticated} isReady={isReady} />
        )}
      </div>
    </div>
  );
}
