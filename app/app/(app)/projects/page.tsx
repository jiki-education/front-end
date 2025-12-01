import AuthenticatedSidebarLayout from "../../../components/layout/AuthenticatedSidebarLayout";
import { ProjectsContent } from "./ProjectsContent";

export default function ProjectsPage() {
  return (
    <AuthenticatedSidebarLayout activeItem="projects">
      <ProjectsContent />
    </AuthenticatedSidebarLayout>
  );
}
