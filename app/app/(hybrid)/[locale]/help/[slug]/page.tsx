import ArticleDetailPage, { getArticleMetadata } from "@/components/articles/ArticleDetailPage";
import AuthenticatedHeaderLayout from "@/components/layout/HeaderLayout";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  return getArticleMetadata(slug, locale);
}

export default async function AuthenticatedLocaleArticlePage({ params }: Props) {
  const { locale, slug } = await params;

  return (
    <AuthenticatedHeaderLayout>
      <ArticleDetailPage slug={slug} authenticated={true} locale={locale} />
    </AuthenticatedHeaderLayout>
  );
}
