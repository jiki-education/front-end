import ArticleDetailPage, { getArticleStaticParams, getArticleMetadata } from "@/components/articles/ArticleDetailPage";
import AuthenticatedHeaderLayout from "@/components/layout/AuthenticatedHeaderLayout";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getArticleStaticParams("en");
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return getArticleMetadata(slug, "en");
}

export default async function AppArticlePage({ params }: Props) {
  const { slug } = await params;

  return (
    <AuthenticatedHeaderLayout>
      <ArticleDetailPage slug={slug} authenticated locale="en" />
    </AuthenticatedHeaderLayout>
  );
}
