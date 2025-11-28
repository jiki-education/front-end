import { getServerAuth } from "@/lib/auth/server";
import Header from "@/components/header/internal";
import Footer from "@/components/footer";
import BlogPage from "@/components/blog/BlogPage";

export default async function AppBlogPage() {
  const auth = await getServerAuth();

  // Fallback for unauthenticated access (shouldn't normally happen due to middleware)
  if (!auth.isAuthenticated) {
    return <BlogPage authenticated={false} />;
  }

  // Authenticated UI with header/footer
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 mt-[70px]">
        <BlogPage authenticated />
      </main>
      <Footer />
    </div>
  );
}
