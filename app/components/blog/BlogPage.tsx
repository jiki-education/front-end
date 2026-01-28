import { getBlogPosts } from "@/lib/content";
import BlogPagination from "./BlogPagination";
import BlogPostsGrid from "./BlogPostsGrid";
import FeaturedLatestPost from "./FeaturedLatestPost";
import PageHeader from "./PageHeader";
import styles from "./BlogPage.module.css";

interface BlogPageProps {
  authenticated: boolean;
  locale: string;
  page?: string | null;
}

export default async function BlogPage({ authenticated: _, locale, page }: BlogPageProps) {
  const pageNum = page ? Math.max(1, parseInt(page, 10) || 1) : 1;
  const { posts, totalPages, currentPage } = await getBlogPosts({ locale, page: pageNum });

  const [latestPost, ...remainingPosts] = posts;

  return (
    <div className={styles.pageWrapper}>
      <div className="p-40">
        <PageHeader />
        {latestPost && <FeaturedLatestPost post={latestPost} locale={locale} />}
        {remainingPosts.length > 0 && <BlogPostsGrid posts={remainingPosts} locale={locale} />}
        <BlogPagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}
