import { getServerAuth } from "@/lib/auth/server";
import Sidebar from "@/components/index-page/sidebar/Sidebar";
import BlogPage from "@/components/blog/BlogPage";

export default async function AppBlogPage() {
  const auth = await getServerAuth();

  // Fallback for unauthenticated access (shouldn't normally happen due to middleware)
  if (!auth.isAuthenticated) {
    return <BlogPage authenticated={false} />;
  }

  // Authenticated UI with sidebar
  return (
    <div className="min-h-screen bg-bg-secondary theme-transition">
      <Sidebar activeItem="blog" />
      <div className="ml-[260px]">
        <main className="p-6">
          <BlogPage authenticated />
        </main>
      </div>
    </div>
  );
}
