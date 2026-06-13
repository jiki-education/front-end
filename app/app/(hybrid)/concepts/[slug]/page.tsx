import BetaTag from "@/components/common/BetaTag";
import ConceptDetailPage from "@/components/concepts/ConceptDetailPage";
import SidebarLayout from "@/components/layout/SidebarLayout";
import JsonLd from "@/components/seo/JsonLd";
import { getConceptEntry, getConceptMetadata } from "@/lib/concepts/metadata";
import { conceptLearningResourceSchema } from "@/lib/seo/schemas";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return getConceptMetadata(slug);
}

export default async function AppConceptPage({ params }: Props) {
  const { slug } = await params;
  const concept = getConceptEntry(slug);

  return (
    <SidebarLayout activeItem="concepts">
      {concept && <JsonLd data={conceptLearningResourceSchema(concept)} />}
      <BetaTag />
      <ConceptDetailPage slug={slug} />
    </SidebarLayout>
  );
}
