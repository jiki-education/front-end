import ConceptDetailPage, { getConceptMetadata } from "@/components/concepts/ConceptDetailPage";
import SidebarLayout from "@/components/layout/SidebarLayout";

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
    <SidebarLayout activeItem="concepts">
      <ConceptDetailPage slug={slug} authenticated />
    </SidebarLayout>
  );
}
