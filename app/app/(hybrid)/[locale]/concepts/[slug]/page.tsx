import ConceptsBetaTag from "@/components/concepts/ConceptsBetaTag";
import ConceptDetailPage from "@/components/concepts/ConceptDetailPage";
import SidebarLayout from "@/components/layout/SidebarLayout";
import JsonLd from "@/components/seo/JsonLd";
import { getConceptMetadata } from "@/lib/concepts/metadata";
import { breadcrumbSchema, conceptLearningResourceSchema } from "@/lib/seo/schemas";
import {
  getConceptServer,
  getAncestorsServer,
  getChildrenServer,
  getRelatedConceptsServer,
  getConceptContentServer,
  getExercisesForConceptServer,
  getConceptVideoDataServer
} from "@/lib/concepts/server-concepts";
import type { ConceptDetailSeed } from "@/components/concepts/lib/useConceptDetailData";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params;
  return getConceptMetadata(slug, locale);
}

export default async function AppConceptPage({ params }: Props) {
  const { slug, locale } = await params;

  // Server-render the concept so logged-out visitors get content (and SEO) in the
  // initial HTML. Category pages also seed their subconcept grid. Logged-in users
  // re-resolve client-side to layer on their personalised unlock state.
  const concept = await getConceptServer(slug, locale);
  const ancestors = concept ? await getAncestorsServer(slug, locale) : [];
  const isCategory = concept?.category ?? false;
  const initialSubconcepts = isCategory ? await getChildrenServer(slug, locale) : undefined;

  // Leaf pages seed the full detail view (body, sidebar, video) so logged-out
  // visitors render entirely on the server.
  let initialLeafData: ConceptDetailSeed | undefined;
  if (concept && !isCategory) {
    const [content, relatedConcepts, relatedExercises, videoData] = await Promise.all([
      getConceptContentServer(slug, locale),
      getRelatedConceptsServer(slug, locale),
      getExercisesForConceptServer(slug, locale),
      getConceptVideoDataServer(slug)
    ]);
    initialLeafData = { concept, ancestors, content, relatedConcepts, relatedExercises, videoData };
  }

  // Structured data: describe the concept as a LearningResource and place it in
  // the concept hierarchy with a breadcrumb trail (Concepts > ...ancestors > this).
  const jsonLd = concept
    ? [
        conceptLearningResourceSchema(concept, locale),
        breadcrumbSchema(
          [
            { name: "Concepts", path: "/concepts" },
            ...ancestors.map((a) => ({ name: a.title, path: `/concepts/${a.slug}` })),
            { name: concept.title, path: `/concepts/${concept.slug}` }
          ],
          locale
        )
      ]
    : null;

  return (
    <SidebarLayout activeItem="concepts">
      {jsonLd && <JsonLd data={jsonLd} />}
      <ConceptsBetaTag />
      {/* key={slug} remounts the detail view on client-side navigation between
          concepts, so the server-seeded hook state (concept, body, subconcepts)
          re-initialises from the new props instead of showing the previous page. */}
      <ConceptDetailPage
        key={slug}
        slug={slug}
        initialConcept={concept}
        initialAncestors={ancestors}
        initialSubconcepts={initialSubconcepts}
        initialLeafData={initialLeafData}
      />
    </SidebarLayout>
  );
}
