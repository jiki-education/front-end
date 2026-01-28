import Link from "next/link";
import type { ProcessedBlogPost } from "@/lib/content/generated/types";
import { formatBlogDate } from "@/lib/utils";
import AuthorIcon from "@/icons/author.svg";
import styles from "./BlogPostCard.module.css";

interface BlogPostsGridProps {
  posts: ProcessedBlogPost[];
  locale: string;
}

export default function BlogPostsGrid({ posts, locale }: BlogPostsGridProps) {
  return (
    <div className={styles.blogPostsGrid}>
      {posts.map((post) => (
        <BlogPostCard key={post.slug} post={post} locale={locale} />
      ))}
    </div>
  );
}

interface BlogPostCardProps {
  post: ProcessedBlogPost;
  locale: string;
}

function BlogPostCard({ post, locale }: BlogPostCardProps) {
  const postUrl = locale === "en" ? `/blog/${post.slug}` : `/${locale}/blog/${post.slug}`;
  const firstTag = post.tags[0];

  return (
    <Link href={postUrl} className={styles.blogPostCard}>
      <div className={styles.postImage} />
      <div className={styles.postMeta}>
        <span className={styles.postDate}>{formatBlogDate(post.date)}</span>
        {firstTag && <span className={styles.postBadge}>{firstTag}</span>}
      </div>
      <h2 className={styles.postTitle}>{post.title}</h2>
      <p className={styles.postExcerpt}>{post.excerpt}</p>
      <div className={styles.postAuthor}>
        <AuthorIcon />
        <span>by {post.author.name}</span>
      </div>
    </Link>
  );
}
