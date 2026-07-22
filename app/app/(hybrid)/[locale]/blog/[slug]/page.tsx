import BlogPostPage, { getBlogPostMetadata } from "@/components/blog/BlogPostPage";
import AuthenticatedHeaderLayout from "@/components/layout/HeaderLayout";
import JsonLd from "@/components/seo/JsonLd";
import { getAllBlogPosts } from "@/lib/content";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schemas";
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

  const post = getAllBlogPosts(locale).find((p) => p.slug === slug);
  const jsonLd = post
    ? [
        articleSchema({
          type: "BlogPosting",
          path: `/blog/${slug}`,
          locale,
          headline: post.title,
          description: post.seo.description || post.excerpt,
          datePublished: post.date,
          authorName: post.author.name,
          image: post.coverImage,
          keywords: post.seo.keywords.length > 0 ? post.seo.keywords : post.tags
        }),
        breadcrumbSchema(
          [
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${slug}` }
          ],
          locale
        )
      ]
    : null;

  return (
    <AuthenticatedHeaderLayout>
      {jsonLd && <JsonLd data={jsonLd} />}
      <BlogPostPage slug={slug} authenticated={true} locale={locale} />
    </AuthenticatedHeaderLayout>
  );
}
