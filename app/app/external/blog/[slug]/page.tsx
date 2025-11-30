import type { Metadata } from "next";
import BlogPostPage, { getBlogPostStaticParams, getBlogPostMetadata } from "@/components/blog/BlogPostPage";

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

export default async function ExternalBlogPostPage({ params }: Props) {
  const { slug } = await params;
  return <BlogPostPage slug={slug} authenticated={false} locale="en" />;
}
