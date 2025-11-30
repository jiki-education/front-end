"use client";

import { ProjectsContent } from "./ProjectsContent";
import AuthenticatedSidebarLayout from "../../components/layout/AuthenticatedSidebarLayout";

export default function ProjectsPage() {
  return (
    <AuthenticatedSidebarLayout activeItem="projects">
      <ProjectsContent />
    </AuthenticatedSidebarLayout>
  );
}
