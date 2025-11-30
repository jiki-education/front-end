import ArticleDetailPage, { getArticleStaticParams, getArticleMetadata } from "@/components/articles/ArticleDetailPage";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-static";

export function generateStaticParams() {
  return getArticleStaticParams("en");
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return getArticleMetadata(slug, "en");
}

export default async function ExternalArticlePage({ params }: Props) {
  const { slug } = await params;

  return <ArticleDetailPage slug={slug} authenticated={false} locale="en" />;
}
