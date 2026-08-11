import { getTranslations } from "next-intl/server";
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

export default async function BlogPage({ authenticated: _, locale, page }: BlogPageProps) {
  // getTranslations, not useTranslations: this is an async server component now,
  // because the post list it renders is fetched rather than bundled.
  const t = await getTranslations("blog.header");
  const pageNum = page ? Math.max(1, parseInt(page, 10) || 1) : 1;
  const { posts, totalPages, currentPage } = await getBlogPosts({ locale, page: pageNum });

  const [latestPost, ...remainingPosts] = posts;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageContent}>
        <PageHeader label={t("label")} title={t("title")} subtitle={t("subtitle")} />
        <FeaturedLatestPost post={latestPost} locale={locale} />
        {remainingPosts.length > 0 && <BlogPostsGrid posts={remainingPosts} />}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          hrefForPage={(p) => (p === 1 ? localePath("/blog", locale) : localePath(`/blog?page=${p}`, locale))}
          className={styles.pagination}
        />
      </div>
    </div>
  );
}
