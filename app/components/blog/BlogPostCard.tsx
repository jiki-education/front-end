import Link from "next/link";
import { useTranslations } from "next-intl";
import type { BlogPostMeta } from "@/lib/content/types";
import { formatBlogDate } from "@/lib/utils";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import AuthorAvatar from "@/components/ui/AuthorAvatar";

interface BlogPostCardProps {
  post: BlogPostMeta;
  /**
   * Scoped CSS module from the consuming section, so each surface keeps its own
   * look (e.g. blog page vs landing page) while sharing this markup. Must expose
   * the `blogPostCard`/`postImage`/`postMeta`/`postDate`/`postBadge`/`postTitle`/
   * `postExcerpt`/`postAuthor` classes.
   */
  styles: Record<string, string>;
  /** Semantic heading level for the card title (context-dependent). */
  headingLevel?: "h2" | "h3";
}

export default function BlogPostCard({ post, styles, headingLevel = "h2" }: BlogPostCardProps) {
  const t = useTranslations("landing.latestNews");
  const routes = useLocaleRoutes();
  const Heading = headingLevel;
  const firstTag = post.tags[0];

  return (
    <Link href={routes.blogPost(post.slug)} className={styles.blogPostCard}>
      <div
        className={styles.postImage}
        style={post.coverImage ? { backgroundImage: `url(${post.coverImage})` } : undefined}
      />
      <div className={styles.postMeta}>
        <span className={styles.postDate}>{formatBlogDate(post.date)}</span>
        {firstTag && <span className={styles.postBadge}>{firstTag}</span>}
      </div>
      <Heading className={styles.postTitle}>{post.title}</Heading>
      <p className={styles.postExcerpt}>{post.excerpt}</p>
      <div className={styles.postAuthor}>
        <AuthorAvatar author={post.author} />
        <span>{t("byAuthor", { name: post.author.name })}</span>
      </div>
    </Link>
  );
}
