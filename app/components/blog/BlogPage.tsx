import { getBlogPosts } from "@/lib/content";
import BlogContent from "./BlogContent";

interface BlogPageProps {
  authenticated: boolean;
  locale: string;
  page?: string | null;
}

export default async function BlogPage({ authenticated: _, locale, page }: BlogPageProps) {
  const pageNum = page ? Math.max(1, parseInt(page, 10) || 1) : 1;
  const { posts, totalPages, currentPage } = await getBlogPosts({ locale, page: pageNum });

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <header className="mb-12">
        <h1 className="mb-4 text-5xl font-bold text-text-primary">Blog</h1>
        <p className="text-lg text-text-secondary">Thoughts, tutorials, and insights about coding</p>
      </header>
      <BlogContent blogPosts={posts} locale={locale} currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
