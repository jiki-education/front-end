import { useTranslations } from "next-intl";
import Link from "next/link";
import { localePath } from "@/lib/i18n/routes";
import { SidebarSection } from "@/components/ui/SidebarSection/SidebarSection";
import type { BlogPostMeta } from "@/lib/content/types";
import { formatBlogDate } from "@/lib/utils";
import styles from "./RelatedPosts.module.css";

interface RelatedPostsProps {
  posts: BlogPostMeta[];
  locale: string;
}

export default function RelatedPosts({ posts, locale }: RelatedPostsProps) {
  const t = useTranslations("blog.relatedPosts");
  if (posts.length === 0) {
    return null;
  }

  return (
    <SidebarSection heading={t("heading")}>
      <div className={styles.relatedPostsSection}>
        {posts.map((post) => (
          <RelatedPostCard key={post.slug} post={post} locale={locale} />
        ))}
      </div>
    </SidebarSection>
  );
}

interface RelatedPostCardProps {
  post: BlogPostMeta;
  locale: string;
}

function RelatedPostCard({ post, locale }: RelatedPostCardProps) {
  const postUrl = localePath(`/blog/${post.slug}`, locale);
  const firstTag = post.tags[0];

  return (
    <Link href={postUrl} className={styles.blogCard}>
      <div
        className={styles.blogCardImage}
        style={post.coverImage ? { backgroundImage: `url(${post.coverImage})` } : undefined}
      />
      <div className={styles.blogCardMeta}>
        <span className={styles.blogCardDate}>{formatBlogDate(post.date)}</span>
        {firstTag && <span className={styles.blogCardBadge}>{firstTag}</span>}
      </div>
      <h4 className={styles.blogCardTitle}>{post.title}</h4>
      <p className={styles.blogCardExcerpt}>{post.excerpt}</p>
    </Link>
  );
}
