import ConceptsListPage from "@/components/concepts/ConceptsListPage";
import SidebarLayout from "@/components/layout/SidebarLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Concepts - Jiki",
  description:
    "Browse programming concepts and fundamentals to strengthen your understanding of computer science and software development."
};

export default function AppConceptsPage() {
  return (
    <SidebarLayout activeItem="concepts">
      <ConceptsListPage authenticated />
    </SidebarLayout>
  );
}
