import ConceptsBetaTag from "@/components/concepts/ConceptsBetaTag";
import ConceptsListPage from "@/components/concepts/ConceptsListPage";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { getTopLevelConceptsServer } from "@/lib/concepts/server-concepts";
import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.concepts");
  return { title: t("title"), description: t("description") };
}

export default async function AppConceptsPage() {
  // Server-render the concept list so logged-out visitors get content (and SEO)
  // in the initial HTML. Logged-in users re-fetch client-side to layer on their
  // personalised unlock state.
  const locale = await getLocale();
  const initialConcepts = await getTopLevelConceptsServer(locale);

  return (
    <SidebarLayout activeItem="concepts">
      <ConceptsBetaTag />
      <ConceptsListPage initialConcepts={initialConcepts} />
    </SidebarLayout>
  );
}
