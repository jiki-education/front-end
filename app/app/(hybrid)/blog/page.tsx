import BlogPage from "@/components/blog/BlogPage";
import AuthenticatedHeaderLayout from "@/components/layout/HeaderLayout";

export default function AppBlogPage() {
  // Always render authenticated view since ClientAuthGuard ensures user is authenticated
  return (
    <AuthenticatedHeaderLayout>
      <BlogPage authenticated locale="en" />
    </AuthenticatedHeaderLayout>
  );
}
