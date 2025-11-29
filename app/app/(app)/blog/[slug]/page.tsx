import type { Metadata } from "next";
import BlogPostPage, { getBlogPostStaticParams, getBlogPostMetadata } from "@/components/blog/BlogPostPage";
import AuthenticatedLayout from "@/components/layout/authenticated";

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
    <AuthenticatedLayout>
      <BlogPostPage slug={slug} authenticated={true} locale="en" />
    </AuthenticatedLayout>
  );
}
