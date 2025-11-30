import ConceptsListPage from "@/components/concepts/ConceptsListPage";
import AuthenticatedSidebarLayout from "@/components/layout/AuthenticatedSidebarLayout";

export default function AppConceptsPage() {
  return (
    <AuthenticatedSidebarLayout activeItem="concepts">
      <ConceptsListPage authenticated />
    </AuthenticatedSidebarLayout>
  );
}
