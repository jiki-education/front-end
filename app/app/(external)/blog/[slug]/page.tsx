import { getAllBlogPosts, getBlogPost } from "@jiki/content";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerAuth } from "@/lib/auth/server";
import Sidebar from "@/components/index-page/sidebar/Sidebar";
import BlogPostContent from "./BlogPostContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const blogPosts = getAllBlogPosts("en");
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = getBlogPost(slug, "en");
    return {
      title: post.title,
      description: post.seo.description,
      keywords: post.seo.keywords.join(", ")
    };
  } catch {
    return { title: "Post Not Found" };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  let post;
  try {
    post = getBlogPost(slug, "en");
  } catch {
    notFound();
  }

  const auth = await getServerAuth();

  if (auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-secondary theme-transition">
        <Sidebar activeItem="blog" />
        <div className="ml-[260px]">
          <main className="p-6">
            <div className="mx-auto max-w-4xl">
              <header className="mb-8">
                <h1 className="text-4xl font-bold text-text-primary">Blog Post - Authenticated User</h1>
              </header>
              <BlogPostContent post={post} variant="authenticated" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Blog Post - Guest User</h1>
      </header>
      <BlogPostContent post={post} variant="unauthenticated" />
    </div>
  );
}
