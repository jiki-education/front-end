import BlogPage from "@/components/blog/BlogPage";
import AuthenticatedLayout from "@/components/layout/authenticated";
import { getServerAuth } from "@/lib/auth/server";

export default async function AppBlogPage() {
  const auth = await getServerAuth();

  // Fallback for unauthenticated access (shouldn't normally happen due to middleware)
  if (!auth.isAuthenticated) {
    return <BlogPage authenticated={false} locale="en" />;
  }

  // Authenticated UI with header/footer
  return (
    <AuthenticatedLayout>
      <BlogPage authenticated locale="en" />
    </AuthenticatedLayout>
  );
}
