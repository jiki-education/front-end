import SidebarLayout from "../../../components/layout/SidebarLayout";
import { ProjectsContent } from "./ProjectsContent";

export default function ProjectsPage() {
  return (
    <SidebarLayout activeItem="projects">
      <ProjectsContent />
    </SidebarLayout>
  );
}
