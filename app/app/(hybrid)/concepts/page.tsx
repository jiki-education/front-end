import ConceptsListPage from "@/components/concepts/ConceptsListPage";
import SidebarLayout from "@/components/layout/SidebarLayout";

export default function AppConceptsPage() {
  return (
    <SidebarLayout activeItem="concepts">
      <ConceptsListPage authenticated />
    </SidebarLayout>
  );
}
