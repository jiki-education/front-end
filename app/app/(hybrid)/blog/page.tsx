import BlogPage from "@/components/blog/BlogPage";
import HeaderLayout from "@/components/layout/HeaderLayout";

export default function AppBlogPage() {
  // Always render authenticated view since ClientAuthGuard ensures user is authenticated
  return (
    <HeaderLayout>
      <BlogPage authenticated locale="en" />
    </HeaderLayout>
  );
}
