import { getAllBlogPosts } from "@jiki/content";
import BlogContent from "./BlogContent";

interface BlogPageProps {
  authenticated: boolean;
}

export default function BlogPage({ authenticated }: BlogPageProps) {
  const blogPosts = getAllBlogPosts("en");
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <header className="mb-12">
        <h1 className="mb-4 text-5xl font-bold text-gray-900">Blog</h1>
        <p className="text-lg text-gray-600">Thoughts, tutorials, and insights about coding</p>
      </header>
      <BlogContent blogPosts={blogPosts} authenticated={authenticated} />
    </div>
  );
}
