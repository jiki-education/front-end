import MarkdownContent from "@/components/content/MarkdownContent";
import type { ProcessedBlogPost, BlogPostMeta } from "@/lib/content/types";
import BlogPostHeader from "./BlogPostHeader";
import RelatedPosts from "./RelatedPosts";
import styles from "@/components/ui/ContentWithSidebar.module.css";

interface BlogPostContentProps {
  post: ProcessedBlogPost;
  variant?: "authenticated" | "unauthenticated";
  relatedPosts?: BlogPostMeta[];
  locale?: string;
}

export default function BlogPostContent({ post, relatedPosts, locale = "en" }: BlogPostContentProps) {
  const hasRelatedPosts = relatedPosts && relatedPosts.length > 0;

  return (
    <div className={styles.mainContent}>
      <BlogPostHeader post={post} />
      <div className={hasRelatedPosts ? styles.contentWrapper : styles.contentWrapperFull}>
        <article className={styles.articleContent}>
          <MarkdownContent content={post.content} />
        </article>
        {hasRelatedPosts && (
          <aside className={styles.rightPanel}>
            <RelatedPosts posts={relatedPosts} locale={locale} />
          </aside>
        )}
      </div>
    </div>
  );
}
