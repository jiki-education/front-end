import BlogPostPage, { getBlogPostMetadata } from "@/components/blog/BlogPostPage";
import AuthenticatedHeaderLayout from "@/components/layout/HeaderLayout";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  return getBlogPostMetadata(slug, locale);
}

export default async function AuthenticatedLocaleBlogPostPage({ params }: Props) {
  const { locale, slug } = await params;

  return (
    <AuthenticatedHeaderLayout>
      <BlogPostPage slug={slug} authenticated={true} locale={locale} />
    </AuthenticatedHeaderLayout>
  );
}
