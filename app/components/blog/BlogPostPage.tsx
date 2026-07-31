import { getAllBlogPosts, getBlogPost, getRelatedBlogPosts } from "@/lib/content";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import BlogPostContent from "./BlogPostContent";
import CTABlock from "./CTABlock";
import RecentBlogPosts from "./RecentBlogPosts";

interface BlogPostPageProps {
  slug: string;
  authenticated: boolean;
  locale: string;
}

// Helper for generateMetadata
export async function getBlogPostMetadata(slug: string, locale: string = "en"): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "seo.blog" });
  try {
    const allPosts = getAllBlogPosts(locale);
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
  const t = await getTranslations({ locale, namespace: "blog.cta" });
  let post;
  try {
    post = await getBlogPost(slug, locale);
  } catch {
    notFound();
  }

  // Get related blog posts (tag overlap first, topped up to a minimum of 5)
  const allPosts = getAllBlogPosts(locale);
  const relatedPosts = getRelatedBlogPosts(slug, allPosts, 5);

  if (authenticated) {
    return <BlogPostContent post={post} variant="authenticated" relatedPosts={relatedPosts} locale={locale} />;
  }

  return (
    <>
      <BlogPostContent post={post} variant="unauthenticated" />

      {/* Minimal CTA */}
      <CTABlock
        variant="minimal"
        title={t("minimalTitle")}
        subtitle={t("minimalSubtitle")}
        buttonText={t("minimalButton")}
        buttonHref="/signup"
      />

      {/* Related Posts */}
      <RecentBlogPosts posts={relatedPosts} />

      {/* Gradient CTA */}
      <CTABlock
        variant="gradient"
        title={t("gradientTitle")}
        subtitle={t("gradientSubtitle")}
        buttonText={t("gradientButton")}
        buttonHref="/signup"
      />
    </>
  );
}
