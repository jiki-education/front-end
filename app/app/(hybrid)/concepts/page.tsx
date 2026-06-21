import ConceptsBetaTag from "@/components/concepts/ConceptsBetaTag";
import ConceptsListPage from "@/components/concepts/ConceptsListPage";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { getTopLevelConceptsServer } from "@/lib/concepts/server-concepts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Concepts - Jiki",
  description:
    "Browse programming concepts and fundamentals to strengthen your understanding of computer science and software development."
};

export default async function AppConceptsPage() {
  // Server-render the concept list so logged-out visitors get content (and SEO)
  // in the initial HTML. Logged-in users re-fetch client-side to layer on their
  // personalised unlock state.
  const initialConcepts = await getTopLevelConceptsServer();

  return (
    <SidebarLayout activeItem="concepts">
      <ConceptsBetaTag />
      <ConceptsListPage initialConcepts={initialConcepts} />
    </SidebarLayout>
  );
}
