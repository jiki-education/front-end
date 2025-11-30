import ConceptDetailPage, { getConceptMetadata } from "@/components/concepts/ConceptDetailPage";
import AuthenticatedSidebarLayout from "@/components/layout/AuthenticatedSidebarLayout";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return getConceptMetadata(slug);
}

export default async function AppConceptPage({ params }: Props) {
  const { slug } = await params;

  return (
    <AuthenticatedSidebarLayout activeItem="concepts">
      <ConceptDetailPage slug={slug} authenticated />
    </AuthenticatedSidebarLayout>
  );
}
