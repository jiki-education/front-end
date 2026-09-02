import { getAllBlogPosts, getBlogPost, getRelatedBlogPosts } from "@/lib/content";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import BlogPostContent from "./BlogPostContent";
import { SignupCta } from "@/components/ui/SignupCta/SignupCta";

interface BlogPostPageProps {
  slug: string;
  authenticated: boolean;
  locale: string;
}

// Helper for generateMetadata
export async function getBlogPostMetadata(slug: string, locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "seo.blog" });
  try {
    const allPosts = await getAllBlogPosts(locale);
    const post = allPosts.find((p) => p.slug === slug);
    if (!post) {
      return { title: t("notFound") };
    }

    return {
      title: post.title,
      description: post.seo.description,
      keywords: post.seo.keywords.join(", "),
      ...(post.coverImage ? { openGraph: { images: [{ url: post.coverImage }] } } : {})
    };
  } catch {
    return { title: t("notFound") };
  }
}

export default async function BlogPostPage({ slug, authenticated, locale }: BlogPostPageProps) {
  let post;
  try {
    post = await getBlogPost(slug, locale);
  } catch {
    notFound();
  }

  // Get related blog posts (tag overlap first, topped up to a minimum of 5)
  const allPosts = await getAllBlogPosts(locale);
  const relatedPosts = getRelatedBlogPosts(slug, allPosts, 5);

  return (
    <>
      <BlogPostContent post={post} relatedPosts={relatedPosts} locale={locale} />

      {!authenticated && <SignupCta />}
    </>
  );
}
