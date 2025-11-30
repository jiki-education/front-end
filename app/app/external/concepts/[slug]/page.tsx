import ConceptDetailPage, { getConceptMetadata } from "@/components/concepts/ConceptDetailPage";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return getConceptMetadata(slug);
}

export default async function ExternalConceptPage({ params }: Props) {
  const { slug } = await params;
  return <ConceptDetailPage slug={slug} authenticated={false} />;
}
