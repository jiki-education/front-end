import SidebarLayout from "../../../components/layout/SidebarLayout";
import { ProjectsContent } from "./ProjectsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects - Jiki",
  description: "Build real-world coding projects to practice your programming skills and create portfolio pieces."
};

export default function ProjectsPage() {
  return (
    <SidebarLayout activeItem="projects">
      <ProjectsContent />
    </SidebarLayout>
  );
}
