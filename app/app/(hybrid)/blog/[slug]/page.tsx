import BlogPostPage, { getBlogPostMetadata, getBlogPostStaticParams } from "@/components/blog/BlogPostPage";
import AuthenticatedHeaderLayout from "@/components/layout/HeaderLayout";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getBlogPostStaticParams("en");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return getBlogPostMetadata(slug, "en");
}

export default async function AuthenticatedBlogPostPage({ params }: Props) {
  const { slug } = await params;
  return (
    <AuthenticatedHeaderLayout>
      <BlogPostPage slug={slug} authenticated={true} locale="en" />
    </AuthenticatedHeaderLayout>
  );
}
