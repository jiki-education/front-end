import { getAllBlogPosts, getBlogPost } from "@/lib/content/loader";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogPostContent from "./BlogPostContent";
import CTABlock from "./CTABlock";
import RecentBlogPosts from "./RecentBlogPosts";

interface BlogPostPageProps {
  slug: string;
  authenticated: boolean;
  locale: string;
}

// Helper for generateStaticParams
export async function getBlogPostStaticParams(locale: string = "en") {
  const blogPosts = await getAllBlogPosts(locale);
  return blogPosts.map((post) => ({ slug: post.slug }));
}

// Helper for generateMetadata
export async function getBlogPostMetadata(slug: string, locale: string = "en"): Promise<Metadata> {
  try {
    const post = await getBlogPost(slug, locale);
    return {
      title: post.title,
      description: post.seo.description,
      keywords: post.seo.keywords.join(", ")
    };
  } catch {
    return { title: "Post Not Found" };
  }
}

export default async function BlogPostPage({ slug, authenticated, locale }: BlogPostPageProps) {
  let post;
  try {
    post = await getBlogPost(slug, locale);
  } catch {
    notFound();
  }

  // Get recent blog posts, excluding the current one
  const allPosts = await getAllBlogPosts(locale);
  const recentPosts = allPosts
    .filter((p) => p.slug !== slug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  if (authenticated) {
    return <BlogPostContent post={post} variant="authenticated" />;
  }

  return (
    <>
      <BlogPostContent post={post} variant="unauthenticated" />

      {/* Minimal CTA */}
      <CTABlock
        variant="minimal"
        title="Try Jiki for free"
        subtitle="10,000+ learners use Jiki to master programming through hands-on practice and expert mentorship every month."
        buttonText="Get started now"
        buttonHref="/signup"
      />

      {/* Recent Posts */}
      <RecentBlogPosts posts={recentPosts} />

      {/* Gradient CTA */}
      <CTABlock
        variant="gradient"
        title="Ready to Start Your Coding Journey?"
        subtitle="Join thousands of learners on Jiki. Practice coding exercises, get feedback from mentors, and level up your skills — it's free!"
        buttonText="Sign Up to Jiki"
        buttonHref="/signup"
      />
    </>
  );
}
