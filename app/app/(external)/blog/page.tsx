import { getAllBlogPosts } from "@jiki/content";
import { getServerAuth } from "@/lib/auth/server";
import Sidebar from "@/components/index-page/sidebar/Sidebar";
import BlogContent from "./BlogContent";

export default async function BlogPage() {
  const blogPosts = getAllBlogPosts("en");
  const auth = await getServerAuth();

  if (auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-secondary theme-transition">
        <Sidebar activeItem="blog" />
        <div className="ml-[260px]">
          <main className="p-6">
            <header className="mb-12">
              <h1 className="mb-4 text-5xl font-bold text-text-primary">Blog - Authenticated User</h1>
              <p className="text-lg text-text-secondary">Thoughts, tutorials, and insights about coding</p>
            </header>
            <BlogContent blogPosts={blogPosts} variant="authenticated" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <header className="mb-12">
        <h1 className="mb-4 text-5xl font-bold text-gray-900">Blog - Guest User</h1>
        <p className="text-lg text-gray-600">Thoughts, tutorials, and insights about coding</p>
      </header>
      <BlogContent blogPosts={blogPosts} variant="unauthenticated" />
    </div>
  );
}
