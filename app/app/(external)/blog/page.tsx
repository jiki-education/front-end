import { getAllBlogPosts } from "@jiki/content";
import BlogContent from "./BlogContent";

export default function BlogPage() {
  const blogPosts = getAllBlogPosts("en");

  return <BlogContent blogPosts={blogPosts} />;
}
