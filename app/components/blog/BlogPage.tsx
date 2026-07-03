import { getBlogPosts } from "@/lib/content";
import { localePath } from "@/lib/i18n/routes";
import Pagination from "@/components/ui/Pagination";
import BlogPostsGrid from "./BlogPostsGrid";
import FeaturedLatestPost from "./FeaturedLatestPost";
import PageHeader from "./PageHeader";
import styles from "./BlogPage.module.css";

interface BlogPageProps {
  authenticated: boolean;
  locale: string;
  page?: string | null;
}

export default function BlogPage({ authenticated: _, locale, page }: BlogPageProps) {
  const pageNum = page ? Math.max(1, parseInt(page, 10) || 1) : 1;
  const { posts, totalPages, currentPage } = getBlogPosts({ locale, page: pageNum });

  const [latestPost, ...remainingPosts] = posts;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageContent}>
        <PageHeader
          label="Blog"
          title="News, insights and witterings"
          subtitle="Deep dives into programming languages, coding challenges, and the art of learning to code."
        />
        <FeaturedLatestPost post={latestPost} locale={locale} />
        {remainingPosts.length > 0 && <BlogPostsGrid posts={remainingPosts} locale={locale} />}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          hrefForPage={(p) => (p === 1 ? localePath("/blog", locale) : localePath(`/blog?page=${p}`, locale))}
          className="mt-12"
        />
      </div>
    </div>
  );
}
