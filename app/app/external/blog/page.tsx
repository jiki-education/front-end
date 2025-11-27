import BlogPage from "@/components/blog/BlogPage";

export const dynamic = "force-static";

export default function ExternalBlogPage() {
  return <BlogPage authenticated={false} />;
}
